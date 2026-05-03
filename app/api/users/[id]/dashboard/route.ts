import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/users/[id]/dashboard
 * Returns a student's summary for the home screen.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id: requestedId } = await params
    const supabase = createAdminClient()

    // Resolve identity: collect all possible IDs
    let resolvedUserId = web3User.sub
    if (web3User.email) {
      const { data: byEmail } = await supabase
        .from("users")
        .select("id")
        .eq("email", web3User.email)
        .maybeSingle()
      if (byEmail) resolvedUserId = byEmail.id
    }
    
    // Defensive: filter out "undefined" or null from queryIds
    const queryIds = [
      ...new Set(
        [resolvedUserId, web3User.sub, requestedId]
          .filter(id => id && id !== "undefined" && id !== "null")
      )
    ] as string[]

    if (queryIds.length === 0) {
      return Response.json({ data: { enrollments: [], todaySessions: [], pendingQuizzes: [], progress: [] } })
    }

    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

    // 1. Fetch Enrollments
    const { data: enrollmentsData, error: enrollError } = await supabase
      .from("enrollments")
      .select("*, course:courses(id, title, description, lessons(id, title, type))")
      .in("user_id", queryIds)

    if (enrollError) {
      console.error("[Dashboard] Enrollment fetch error:", enrollError)
      return Response.json({ error: enrollError.message }, { status: 500 })
    }

    // Defensive Auto-Heal for enrollments
    const orphans = (enrollmentsData ?? []).filter(e => e.user_id !== resolvedUserId)
    if (orphans.length > 0 && resolvedUserId && resolvedUserId !== "undefined") {
      for (const orphan of orphans) {
        try {
          await supabase.from("enrollments").update({ user_id: resolvedUserId }).eq("id", orphan.id)
        } catch (e) {
          console.warn("[Dashboard] Enrollment heal failed:", e)
        }
      }
    }

    const enrolledCourseIds = enrollmentsData?.map((e) => e.course_id).filter(Boolean) as string[] ?? []

    // 2. Fetch Sessions & Quizzes
    const [sessionsRes, attemptsRes] = await Promise.all([
      enrolledCourseIds.length
        ? supabase
            .from("sessions")
            .select("*, lesson:lessons(id, title, course_id)")
            .in("lesson.course_id", enrolledCourseIds)
            .gte("scheduled_at", startOfDay)
            .lte("scheduled_at", endOfDay)
            .order("scheduled_at", { ascending: true })
        : Promise.resolve({ data: [], error: null }),

      enrolledCourseIds.length
        ? supabase
            .from("quizzes")
            .select("id, title, passing_score, course_id, lesson_id")
            .in("course_id", enrolledCourseIds)
        : Promise.resolve({ data: [], error: null }),
    ])

    // 3. Fetch Attempts
    const { data: attemptedData } = await supabase
      .from("quiz_attempts")
      .select("quiz_id")
      .in("user_id", queryIds)

    const attemptedQuizIds = attemptedData?.map((a) => a.quiz_id).filter(Boolean) ?? []
    const pendingQuizzes = (attemptsRes.data ?? []).filter(q => !attemptedQuizIds.includes(q.id))

    // 4. Fetch Progress
    const { data: progressData } = await supabase
      .from("course_progress")
      .select("*")
      .in("user_id", queryIds)

    // Defensive Auto-Heal for progress
    const orphanProgress = (progressData ?? []).filter(p => p.user_id !== resolvedUserId)
    if (orphanProgress.length > 0 && resolvedUserId && resolvedUserId !== "undefined") {
      for (const p of orphanProgress) {
        if (!p.course_id) continue;
        try {
          const { data: existing } = await supabase
            .from("course_progress")
            .select("id")
            .eq("user_id", resolvedUserId)
            .eq("course_id", p.course_id)
            .maybeSingle()
          
          if (!existing) {
            await supabase.from("course_progress").update({ user_id: resolvedUserId }).eq("id", p.id)
          } else {
            await supabase.from("course_progress").delete().eq("id", p.id)
          }
        } catch (e) {
          console.warn("[Dashboard] Progress heal failed:", e)
        }
      }
    }

    return Response.json({
      data: {
        enrollments: (enrollmentsData ?? []).map(e => ({ ...e, user_id: resolvedUserId })),
        todaySessions: sessionsRes.data ?? [],
        pendingQuizzes,
        progress: (progressData ?? []).map(p => ({ ...p, user_id: resolvedUserId })),
      },
    })
  } catch (err: any) {
    console.error("[Dashboard] Global error:", err)
    return Response.json({ error: err.message || "Internal Server Error" }, { status: 500 })
  }
}
