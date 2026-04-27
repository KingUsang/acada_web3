import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * POST /api/quizzes/[id]/submit
 *
 * Submit quiz answers. The server grades them server-side.
 * Body: { answers: number[] }  — array of selected option indices per question
 *
 * Returns: { score, total, is_passed, attempt_id }
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id: quizId } = await params
    const { answers } = await req.json()

    if (!Array.isArray(answers)) {
      return Response.json({ error: "answers must be an array" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Fetch the quiz with correct answers (server only)
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("quiz_data, passing_score, course_id")
      .eq("id", quizId)
      .single()

    if (quizError || !quiz) return Response.json({ error: "Quiz not found" }, { status: 404 })

    const questions: any[] = (quiz.quiz_data as any)?.questions ?? []
    let correct = 0

    const gradedAnswers = questions.map((q: any, index: number) => {
      const userAnswer = answers[index] ?? null
      const isCorrect = userAnswer === q.correct_answer
      if (isCorrect) correct++
      return { question_id: q.id, user_answer: userAnswer, correct_answer: q.correct_answer, is_correct: isCorrect }
    })

    const total = questions.length
    const score = total > 0 ? Math.round((correct / total) * 100) : 0
    const isPassed = score >= (quiz.passing_score ?? 70)

    // Save the attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: web3User.sub,
        quiz_id: quizId,
        score,
        is_passed: isPassed,
        answers: gradedAnswers,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (attemptError) return Response.json({ error: attemptError.message }, { status: 500 })

    // If passed, record a QUIZ_PASS milestone
    if (isPassed) {
      await supabase
        .from("milestones")
        .upsert({
          user_id: web3User.sub,
          course_id: quiz.course_id,
          quiz_id: quizId,
          type: "QUIZ_PASS",
          status: "PENDING",
          metadata: {
            score,
            passing_score: quiz.passing_score,
            passed_at: new Date().toISOString(),
          },
        }, { onConflict: "user_id,course_id,quiz_id" } as any)
    }

    return Response.json({
      data: {
        attempt_id: attempt.id,
        score,
        total,
        correct,
        is_passed: isPassed,
        graded_answers: gradedAnswers,
      },
    })
  } catch {
    return unauthorized()
  }
}
