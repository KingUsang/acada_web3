import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * POST /api/quizzes
 * Create a new quiz (TUTOR or ORG_ADMIN).
 *
 * Called at the end of the two-screen quiz creation flow:
 *   Screen 4.1 (Quiz Builder)  — collects title, time_limit, max_attempts, passing_score
 *   Screen 4.2 (Question Builder) — collects questions one by one
 * The frontend accumulates everything locally then fires ONE call here on "Save & Finish Quiz".
 *
 * Body:
 * {
 *   title: string                   // "JAMB Practice Test — Biology Week 2"
 *   course_id: string               // which course this quiz belongs to
 *   lesson_id?: string              // optional — tie to a specific lesson
 *   passing_score?: number          // 0–100, default 60
 *   quiz_data: {
 *     time_limit_minutes: number    // e.g. 45
 *     max_attempts: number          // e.g. 3  (0 = unlimited)
 *     questions: [
 *       {
 *         id: string                // client-generated UUID or index
 *         type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER"
 *         question: string          // question text
 *         options?: string[]        // required for MULTIPLE_CHOICE and TRUE_FALSE
 *         correct_answer?: number   // index into options (null for SHORT_ANSWER)
 *         marks: number             // points for this question
 *         explanation?: string      // optional — shown after student answers
 *       }
 *     ]
 *   }
 * }
 *
 * GET /api/quizzes?course_id=...
 * List quizzes for a course (used to populate the Quizzes tab in course_content_manager).
 */

export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { title, course_id, lesson_id, passing_score = 60, time_limit_minutes = 45, max_attempts = 3, quiz_data } = await req.json()

    if (!title || !course_id || !quiz_data) {
      return Response.json(
        { error: "title, course_id, and quiz_data are required" },
        { status: 400 }
      )
    }

    if (!Array.isArray(quiz_data.questions) || quiz_data.questions.length === 0) {
      return Response.json(
        { error: "quiz_data.questions must be a non-empty array" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Only TUTOR or ORG_ADMIN can create quizzes
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", web3User.sub)
      .single()

    if (!user || (user.role !== "TUTOR" && user.role !== "ORG_ADMIN")) {
      return Response.json({ error: "Forbidden: TUTOR or ORG_ADMIN only" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("quizzes")
      .insert({
        title,
        course_id,
        lesson_id: lesson_id ?? null,
        passing_score,
        time_limit_minutes,
        max_attempts,
        quiz_data,
      })
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data }, { status: 201 })
  } catch {
    return unauthorized()
  }
}

export async function GET(req: NextRequest) {
  try {
    await verifyWeb3AuthToken(req)
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("course_id")

    const supabase = createAdminClient()
    let query = supabase
      .from("quizzes")
      .select("id, title, passing_score, time_limit_minutes, max_attempts, course_id, lesson_id, created_at")
      .order("created_at", { ascending: false })

    if (courseId) query = query.eq("course_id", courseId)

    const { data, error } = await query
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}
