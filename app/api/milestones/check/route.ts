import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * POST /api/milestones/check
 *
 * Checks if a student qualifies for a COURSE_COMPLETE milestone.
 *
 * Eligibility:
 *   - Attendance across all live sessions  ≥ 75%
 *   - Final quiz score                     ≥ 80%  (or passing_score if higher)
 *
 * If eligible, upserts a milestone with type = "COURSE_COMPLETE".
 * The COURSE_COMPLETE milestone is the gate for certificate minting.
 *
 * Body: { course_id }
 */
export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { course_id } = await req.json()

    if (!course_id) return Response.json({ error: "course_id is required" }, { status: 400 })

    const supabase = createAdminClient()
    let resolvedUserId = web3User.sub
    if (!resolvedUserId && web3User.email) {
      const { data: byEmail } = await supabase
        .from("users")
        .select("id")
        .eq("email", web3User.email)
        .maybeSingle()
      resolvedUserId = byEmail?.id
    }
    if (!resolvedUserId) return Response.json({ error: "Unable to resolve user identity" }, { status: 401 })

    // ── 1. ATTENDANCE CHECK ──────────────────────────────────────────────────
    const { data: liveLessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", course_id)
      .eq("type", "LIVE")

    const lessonIds = liveLessons?.map((l) => l.id) ?? []
    let attendancePct = 100 // default when there are no live classes

    if (lessonIds.length > 0) {
      const { data: sessions } = await supabase
        .from("sessions")
        .select("id")
        .in("lesson_id", lessonIds)

      const sessionIds = sessions?.map((s) => s.id) ?? []

      if (sessionIds.length > 0) {
        const { data: attended } = await supabase
          .from("attendance_logs")
          .select("session_id")
          .eq("user_id", resolvedUserId)
          .in("session_id", sessionIds)
          .not("leave_time", "is", null)

        const uniqueAttended = new Set(attended?.map((a) => a.session_id)).size
        attendancePct = Math.round((uniqueAttended / sessionIds.length) * 100)
      }
    }

    const ATTENDANCE_THRESHOLD = 75
    const attendancePassed = attendancePct >= ATTENDANCE_THRESHOLD

    // ── 2. QUIZ CHECK ─────────────────────────────────────────────────────────
    // Only the course-level quiz (lesson_id IS NULL) counts for COURSE_COMPLETE
    const { data: finalQuizzes } = await supabase
      .from("quizzes")
      .select("id, passing_score")
      .eq("course_id", course_id)
      .is("lesson_id", null)

    let quizPassed = false
    let quizScore: number | null = null
    const QUIZ_THRESHOLD = 80 // minimum for course-complete regardless of quiz passing_score

    if (!finalQuizzes || finalQuizzes.length === 0) {
      // No final quiz — quiz requirement auto-satisfied
      quizPassed = true
    } else {
      const quizIds = finalQuizzes.map((q) => q.id)
      const { data: bestAttempt } = await supabase
        .from("quiz_attempts")
        .select("score, is_passed")
        .eq("user_id", resolvedUserId)
        .in("quiz_id", quizIds)
        .order("score", { ascending: false })
        .limit(1)
        .single()

      if (bestAttempt) {
        quizScore = bestAttempt.score
        quizPassed = bestAttempt.score >= QUIZ_THRESHOLD
      }
    }

    const eligible = attendancePassed && quizPassed

    // ── 3. UPSERT COURSE_COMPLETE MILESTONE ──────────────────────────────────
    let milestoneId: string | null = null
    if (eligible) {
      const { data: milestone } = await supabase
        .from("milestones")
        .upsert(
          {
            user_id: resolvedUserId,
            course_id,
            type: "COURSE_COMPLETE",
            status: "PENDING",
            metadata: {
              attendance_pct: attendancePct,
              attendance_threshold: ATTENDANCE_THRESHOLD,
              quiz_score: quizScore,
              quiz_threshold: QUIZ_THRESHOLD,
              checked_at: new Date().toISOString(),
            },
          },
          { onConflict: "user_id,course_id" } as any
        )
        .select("id")
        .single()

      milestoneId = milestone?.id ?? null
    }

    return Response.json({
      data: {
        eligible,
        attendance_pct: attendancePct,
        attendance_passed: attendancePassed,
        quiz_score: quizScore,
        quiz_passed: quizPassed,
        milestone_id: milestoneId,
      },
    })
  } catch {
    return unauthorized()
  }
}
