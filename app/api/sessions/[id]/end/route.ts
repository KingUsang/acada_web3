import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"
import { RoomServiceClient } from "livekit-server-sdk"

/**
 * POST /api/sessions/[id]/end
 * Close a live session, forcibly end the LiveKit room, and compute student attendance metrics 
 * (verifies if the student was present for at least 70% of the actual session duration).
 * Gated to TUTOR and ORG_ADMIN.
 */

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params
    const supabase = createAdminClient()

    // Verify caller is a tutor or org admin
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", web3User.sub)
      .single()

    if (!user || (user.role !== "TUTOR" && user.role !== "ORG_ADMIN")) {
      return Response.json({ error: "Forbidden: TUTOR or ORG_ADMIN only" }, { status: 403 })
    }

    const { data: session, error: fetchError } = await supabase
      .from("sessions")
      .select("started_at, ended_at, livekit_room_name")
      .eq("id", id)
      .single()

    if (fetchError || !session) return Response.json({ error: "Session not found" }, { status: 404 })

    const isLive = session.started_at !== null && session.ended_at === null

    if (!isLive) {
      return Response.json({ error: "Only live sessions can be ended." }, { status: 409 })
    }

    const endedAt = new Date().toISOString()
    const startedAtTime = new Date(session.started_at!).getTime()
    const endedAtTime = new Date(endedAt).getTime()
    const sessionDurationMs = endedAtTime - startedAtTime

    // 1. Mark session as ended
    const { data: updatedSession, error: updateError } = await supabase
      .from("sessions")
      .update({
        ended_at: endedAt,
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) return Response.json({ error: updateError.message }, { status: 500 })

    // 2. Close all open attendance logs
    await supabase
      .from("attendance_logs")
      .update({ leave_time: endedAt })
      .eq("session_id", id)
      .is("leave_time", null)

    // 3. Process logs to determine who "attended" based on 70% duration threshold
    if (sessionDurationMs > 0) {
      const { data: logs } = await supabase
        .from("attendance_logs")
        .select("id, user_id, join_time, leave_time")
        .eq("session_id", id)

      if (logs && logs.length > 0) {
        const userDurations: Record<string, number> = {}
        const userLogs: Record<string, string[]> = {}

        logs.forEach(log => {
          if (!log.user_id || !log.join_time) return
          if (!userDurations[log.user_id]) {
            userDurations[log.user_id] = 0
            userLogs[log.user_id] = []
          }
          const joinT = new Date(log.join_time).getTime()
          const leaveT = log.leave_time ? new Date(log.leave_time).getTime() : endedAtTime
          userDurations[log.user_id] += Math.max(0, leaveT - joinT)
          userLogs[log.user_id].push(log.id)
        })

        // Anyone with >= 70% attendance gets marking
        const thresholdMs = sessionDurationMs * 0.70
        const bulkUpdates = Object.entries(userDurations)
          .filter(([_, duration]) => duration >= thresholdMs)
          .flatMap(([userId, _]) => userLogs[userId]) 

        if (bulkUpdates.length > 0) {
          await supabase
            .from("attendance_logs")
            .update({ attended: true })
            .in("id", bulkUpdates)
        }
      }
    }

    // 4. Force disconnect LiveKit room
    const apiKey = process.env.LIVEKIT_API_KEY!
    const apiSecret = process.env.LIVEKIT_API_SECRET!
    const livekitUrl = process.env.LIVEKIT_URL!

    if (apiKey && apiSecret && livekitUrl) {
      const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret)
      try {
        if (session.livekit_room_name) {
          await roomService.deleteRoom(session.livekit_room_name)
        }
      } catch (e) {
        console.error("Failed to delete LiveKit room", e)
      }
    }

    return Response.json({ data: updatedSession })
  } catch {
    return unauthorized()
  }
}
