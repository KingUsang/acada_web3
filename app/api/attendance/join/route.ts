import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * POST /api/attendance/join
 * Log when a student joins a session.
 * Body: { session_id }
 */
export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { session_id } = await req.json()

    if (!session_id) return Response.json({ error: "session_id is required" }, { status: 400 })

    const supabase = createAdminClient()

    const { data: session } = await supabase
      .from("sessions")
      .select("started_at, ended_at")
      .eq("id", session_id)
      .single()

    const isLive = session && session.started_at !== null && session.ended_at === null

    if (!isLive) {
      return Response.json({ error: "Cannot log attendance: Session is not currently live" }, { status: 409 })
    }

    const { data, error } = await supabase
      .from("attendance_logs")
      .insert({
        user_id: web3User.sub,
        session_id,
        join_time: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data }, { status: 201 })
  } catch {
    return unauthorized()
  }
}
