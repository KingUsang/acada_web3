import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * POST /api/attendance/leave
 * Log when a student leaves a session.
 * Finds the most recent un-closed attendance log and sets leave_time.
 * Body: { session_id }
 *
 * GET /api/attendance?session_id=...
 * Get all attendance logs for a session (tutor view).
 */
export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { session_id } = await req.json()

    if (!session_id) return Response.json({ error: "session_id is required" }, { status: 400 })

    const supabase = createAdminClient()

    // Find the most recent open log (leave_time is null) for this user+session
    const { data: openLog } = await supabase
      .from("attendance_logs")
      .select("id, join_time")
      .eq("user_id", web3User.sub)
      .eq("session_id", session_id)
      .is("leave_time", null)
      .order("join_time", { ascending: false })
      .limit(1)
      .single()

    if (!openLog) {
      return Response.json({ error: "No active attendance log found" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("attendance_logs")
      .update({ leave_time: new Date().toISOString() })
      .eq("id", openLog.id)
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}

export async function GET(req: NextRequest) {
  try {
    await verifyWeb3AuthToken(req)
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) return Response.json({ error: "session_id query param required" }, { status: 400 })

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("attendance_logs")
      .select("*, user:users(id, full_name, email)")
      .eq("session_id", sessionId)
      .order("join_time", { ascending: true })

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}
