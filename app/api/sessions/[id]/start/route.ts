import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"
import { RoomServiceClient, EgressClient, EncodedFileOutput, EncodedFileType } from "livekit-server-sdk"

/**
 * POST /api/sessions/[id]/start
 * Start a scheduled session, generate the LiveKit room, and mark the session as live.
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

    if (fetchError || !session) {
      return Response.json({ error: "Session not found" }, { status: 404 })
    }

    if (session.started_at) {
      return Response.json({ error: "Cannot start. Session has already been started." }, { status: 409 })
    }

    const apiKey = process.env.LIVEKIT_API_KEY!
    const apiSecret = process.env.LIVEKIT_API_SECRET!
    const livekitUrl = process.env.LIVEKIT_URL!

    if (apiKey && apiSecret && livekitUrl) {
      const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret)
      const egressClient = new EgressClient(livekitUrl, apiKey, apiSecret)
      const roomName = session.livekit_room_name || `room-${id}`
      
      try {
        await roomService.createRoom({
          name: roomName,
          emptyTimeout: 10 * 60, // 10 minutes timeout if empty
          maxParticipants: 1000,
        })
        
        // Automatically start recording
        const fileOutput = new EncodedFileOutput({
          fileType: EncodedFileType.MP4,
          filepath: `recordings/${roomName}-{time}.mp4`,
        })

        await egressClient.startRoomCompositeEgress(roomName, {
          file: fileOutput,
        })
      } catch (e) {
        console.error("Failed to pre-create LiveKit room or start recording", e)
      }
    }

    const { data, error } = await supabase
      .from("sessions")
      .update({
        started_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}
