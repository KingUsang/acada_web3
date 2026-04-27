import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/quizzes/[id]
 * Returns the quiz with questions but HIDES the correct answers.
 *
 * POST /api/quizzes/[id]/submit
 * → Handled in /api/quizzes/[id]/submit/route.ts
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyWeb3AuthToken(req)
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("quizzes")
      .select("id, title, passing_score, course_id, lesson_id, quiz_data")
      .eq("id", id)
      .single()

    if (error) return Response.json({ error: "Quiz not found" }, { status: 404 })

    // Strip correct_answer from each question so client can't cheat
    const safeQuizData = stripAnswers(data.quiz_data)

    return Response.json({ data: { ...data, quiz_data: safeQuizData } })
  } catch {
    return unauthorized()
  }
}

/**
 * POST /api/quizzes
 * Create a new quiz (TUTOR or ORG_ADMIN).
 * Body: { title, course_id, lesson_id?, passing_score, quiz_data }
 *
 * quiz_data format:
 * {
 *   questions: [
 *     { id: string, question: string, options: string[], correct_answer: number }
 *   ]
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { title, course_id, lesson_id, passing_score = 70, quiz_data } = await req.json()

    if (!title || !course_id || !quiz_data) {
      return Response.json({ error: "title, course_id, and quiz_data are required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Verify caller is TUTOR or ORG_ADMIN
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("user_id", web3User.sub)
      .single()

    if (!member) {
      return Response.json({ error: "Forbidden: TUTOR or ORG_ADMIN only" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("quizzes")
      .insert({ title, course_id, lesson_id: lesson_id || null, passing_score, quiz_data })
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data }, { status: 201 })
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
