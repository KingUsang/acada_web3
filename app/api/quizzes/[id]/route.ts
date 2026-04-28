import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/quizzes/[id]
 * Returns the quiz with questions but HIDES the correct answers.
 *
 * PATCH /api/quizzes/[id]
 * Edit a quiz (TUTOR or ORG_ADMIN).
 * Body: { title?, passing_score?, quiz_data? }
 *
 * DELETE /api/quizzes/[id]
 * Delete a quiz (TUTOR or ORG_ADMIN).
 *
 * POST /api/quizzes/[id]/submit → /api/quizzes/[id]/submit/route.ts
 */

async function verifyQuizAccess(userId: string) {
  const supabase = createAdminClient()
  const { data: user } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single()
  const allowed = user?.role === "TUTOR" || user?.role === "ORG_ADMIN"
  return { allowed, supabase }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyWeb3AuthToken(req)
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("quizzes")
      .select("id, title, passing_score, time_limit_minutes, max_attempts, course_id, lesson_id, quiz_data")
      .eq("id", id)
      .single()

    if (error) return Response.json({ error: "Quiz not found" }, { status: 404 })

    const safeQuizData = stripAnswers(data.quiz_data)
    return Response.json({ data: { ...data, quiz_data: safeQuizData } })
  } catch {
    return unauthorized()
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params
    const { allowed, supabase } = await verifyQuizAccess(web3User.sub)
    if (!allowed) return Response.json({ error: "Forbidden: TUTOR or ORG_ADMIN only" }, { status: 403 })

    const { title, passing_score, time_limit_minutes, max_attempts, quiz_data } = await req.json()

    // Guard: block quiz_data edits once any student has attempted the quiz.
    // Title and passing_score are safe metadata — always editable.
    if (quiz_data !== undefined) {
      const { count: attemptCount } = await supabase
        .from("quiz_attempts")
        .select("id", { count: "exact", head: true })
        .eq("quiz_id", id)

      if ((attemptCount ?? 0) > 0) {
        return Response.json(
          { error: "Cannot edit quiz questions after students have already attempted it." },
          { status: 409 }
        )
      }
    }

    const { data, error } = await supabase
      .from("quizzes")
      .update({ title, passing_score, time_limit_minutes, max_attempts, quiz_data })
      .eq("id", id)
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params
    const { allowed, supabase } = await verifyQuizAccess(web3User.sub)
    if (!allowed) return Response.json({ error: "Forbidden: TUTOR or ORG_ADMIN only" }, { status: 403 })

    // Guard: block deletion if any student has attempted this quiz.
    const { count: attemptCount } = await supabase
      .from("quiz_attempts")
      .select("id", { count: "exact", head: true })
      .eq("quiz_id", id)

    if ((attemptCount ?? 0) > 0) {
      return Response.json(
        { error: "Cannot delete a quiz that students have already attempted." },
        { status: 409 }
      )
    }

    const { error } = await supabase.from("quizzes").delete().eq("id", id)
    if (error) return Response.json({ error: error.message }, { status: 500 })

    return new Response(null, { status: 204 })
  } catch {
    return unauthorized()
  }
}

function stripAnswers(quizData: any): any {
  if (!quizData?.questions) return quizData
  return {
    ...quizData,
    questions: quizData.questions.map(({ correct_answer: _, ...rest }: any) => rest),
  }
}
