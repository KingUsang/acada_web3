import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/users/[id]/dashboard
 * Returns a student's summary for the home screen:
 * - Enrolled courses with progress
 * - Today's upcoming sessions
 * - Pending quiz attempts (not yet taken)
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params
    if (web3User.sub !== id) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }
    const supabase = createAdminClient()

    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

    // Enrolled courses with progress
    const [enrollmentsRes] = await Promise.all([
      supabase
        .from("enrollments")
        .select("*, course:courses(id, title, description, lessons(id, title, type))")
        .eq("user_id", id)
        .eq("status", "active"),
    ])

    const enrolledCourseIds =
      enrollmentsRes.data?.map((enrollment) => enrollment.course_id).filter(Boolean) ?? []

    const [sessionsRes, attemptsRes] = await Promise.all([
      enrolledCourseIds.length
        ? supabase
            .from("sessions")
            .select("*, lesson:lessons(id, title, course_id)")
            .in("lesson.course_id", enrolledCourseIds as string[])
            .gte("scheduled_at", startOfDay)
            .lte("scheduled_at", endOfDay)
            .order("scheduled_at", { ascending: true })
        : Promise.resolve({ data: [] }),

      enrolledCourseIds.length
        ? supabase
            .from("quizzes")
            .select("id, title, passing_score, course_id, lesson_id")
            .in("course_id", enrolledCourseIds as string[])
        : Promise.resolve({ data: [] }),
    ])

    const attemptedQuizIds =
      (
        await supabase
          .from("quiz_attempts")
          .select("quiz_id")
          .eq("user_id", id)
      ).data
        ?.map((attempt) => attempt.quiz_id)
        .filter(Boolean) ?? []

    const pendingQuizzes = (attemptsRes.data ?? []).filter(
      (quiz) => !attemptedQuizIds.includes(quiz.id)
    )

    // Also fetch course progress
    const { data: progressData } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", id)

    return Response.json({
      data: {
        enrollments: enrollmentsRes.data ?? [],
        todaySessions: sessionsRes.data ?? [],
        pendingQuizzes,
        progress: progressData ?? [],
      },
    })
  } catch {
    return unauthorized()
  }
}
