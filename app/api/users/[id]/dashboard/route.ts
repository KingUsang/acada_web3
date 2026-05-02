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
    console.info("dashboard.request", { requestedId: id, tokenSub: web3User.sub, tokenEmail: web3User.email })
    const supabase = createAdminClient()

    // Web3Auth tokens in some flows may omit `sub`; fall back to verified email linkage.
    let resolvedUserId = web3User.sub
    console.log("DEBUG: Initial resolvedUserId (web3User.sub):", resolvedUserId);

    if (web3User.email) {
      const { data: byEmail } = await supabase
        .from("users")
        .select("id")
        .eq("email", web3User.email)
        .maybeSingle()
      console.log("DEBUG: Searched DB by email:", web3User.email, "Found DB ID:", byEmail?.id);
      if (byEmail) resolvedUserId = byEmail.id
    }
    console.log("DEBUG: Final resolvedUserId:", resolvedUserId, "requestedId:", id);

    if (id !== resolvedUserId && id !== web3User.sub) {
      console.log("DEBUG: Forbidden! id !== resolvedUserId && id !== web3User.sub");
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

    // Enrolled courses with progress
    const [enrollmentsRes] = await Promise.all([
      supabase
        .from("enrollments")
        .select("*, course:courses(id, title, description, lessons(id, title, type))")
        .eq("user_id", resolvedUserId),
    ])
    console.log("DEBUG: Enrollments fetch result:", { count: enrollmentsRes.data?.length, error: enrollmentsRes.error });

    const enrolledCourseIds =
      enrollmentsRes.data?.map((enrollment) => enrollment.course_id).filter(Boolean) ?? []
    console.info("dashboard.enrollments", {
      userId: id,
      count: enrollmentsRes.data?.length ?? 0,
      enrolledCourseIds,
    })

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
          .eq("user_id", resolvedUserId)
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
      .eq("user_id", resolvedUserId)

    console.info("dashboard.summary", {
      userId: id,
      sessionsToday: sessionsRes.data?.length ?? 0,
      pendingQuizzes: pendingQuizzes.length,
      progressCount: progressData?.length ?? 0,
    })

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
