import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/users/[id]/tutor-stats
 * Returns a tutor's dashboard summary:
 * - Total unique students across all their courses
 * - Number of active courses
 * - Upcoming sessions
 * - Total payment earnings
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyWeb3AuthToken(req)
    const { id } = await params
    const supabase = createAdminClient()

    // Courses this tutor teaches
    const { data: tutorCourses } = await supabase
      .from("course_tutors")
      .select("course_id")
      .eq("tutor_id", id)

    const courseIds = tutorCourses?.map((t) => t.course_id).filter(Boolean) ?? []

    const [enrollmentsRes, sessionsRes, paymentsRes] = await Promise.all([
      courseIds.length
        ? supabase
            .from("enrollments")
            .select("user_id, course_id")
            .in("course_id", courseIds as string[])
        : Promise.resolve({ data: [] }),

      // Upcoming sessions for tutor's lessons
      supabase
        .from("sessions")
        .select("*, lesson:lessons!inner(course_id)")
        .in("lesson.course_id", courseIds.length ? (courseIds as string[]) : [""])
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(5),

      courseIds.length
        ? supabase
            .from("payments")
            .select("amount, status")
            .in("course_id", courseIds as string[])
            .eq("status", "completed")
        : Promise.resolve({ data: [] }),
    ])

    const uniqueStudents = new Set(
      (enrollmentsRes.data ?? []).map((e) => e.user_id)
    ).size

    const totalEarnings = (paymentsRes.data ?? []).reduce(
      (sum, p) => sum + (p.amount ?? 0),
      0
    )

    return Response.json({
      data: {
        totalStudents: uniqueStudents,
        activeCourses: courseIds.length,
        upcomingSessions: sessionsRes.data ?? [],
        totalEarnings,
      },
    })
  } catch {
    return unauthorized()
  }
}
