import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/courses/[id]/students
 * List all enrolled students for a course with their progress.
 * Only accessible by TUTOR or ORG_ADMIN.
 *
 * Returns: enrolled students with name, email, progress_percent, quiz attempts.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id: courseId } = await params
    const supabase = createAdminClient()

    // Only tutors/org admins can see student lists
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", web3User.sub)
      .single()

    if (!user || (user.role !== "TUTOR" && user.role !== "ORG_ADMIN")) {
      return Response.json({ error: "Forbidden: TUTOR or ORG_ADMIN only" }, { status: 403 })
    }

    // Enrolled students with progress and quiz performance
    const { data: enrollments, error } = await supabase
      .from("enrollments")
      .select(`
        id,
        status,
        created_at,
        user:users(id, full_name, email, solana_wallet_address)
      `)
      .eq("course_id", courseId)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) return Response.json({ error: error.message }, { status: 500 })

    const userIds = (enrollments ?? [])
      .map((e) => (e.user as any)?.id)
      .filter(Boolean) as string[]

    // Batch-fetch progress and quiz attempts for all enrolled students
    const [{ data: progressRows }, { data: attemptRows }] = await Promise.all([
      supabase
        .from("course_progress")
        .select("user_id, progress_percent, completed")
        .eq("course_id", courseId)
        .in("user_id", userIds),

      supabase
        .from("quiz_attempts")
        .select("user_id, quiz_id, score, is_passed, completed_at")
        .in("user_id", userIds),
    ])

    const progressMap = Object.fromEntries(
      (progressRows ?? []).map((p) => [p.user_id, p])
    )
    const attemptMap: Record<string, typeof attemptRows> = {}
    for (const attempt of attemptRows ?? []) {
      const uid = attempt.user_id
      if (!uid) continue
      if (!attemptMap[uid]) attemptMap[uid] = []
      attemptMap[uid]!.push(attempt)
    }

    const students = (enrollments ?? []).map((e) => {
      const userId = (e.user as any)?.id as string | undefined
      return {
        enrollment_id: e.id,
        enrolled_at: e.created_at,
        user: e.user,
        progress: userId ? (progressMap[userId] ?? { progress_percent: 0, completed: false }) : { progress_percent: 0, completed: false },
        quiz_attempts: userId ? (attemptMap[userId] ?? []) : [],
      }
    })

    return Response.json({ data: students })
  } catch {
    return unauthorized()
  }
}
