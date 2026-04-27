import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"
import { AccessToken } from "livekit-server-sdk"

/**
 * GET /api/sessions/[id]/token
 * Generate a LiveKit access token for a session.
 * The token includes the user's role (tutor = PUBLISH, student = SUBSCRIBE).
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params

    const supabase = createAdminClient()

    // Fetch the session + the user profile
    const [{ data: session }, { data: user }] = await Promise.all([
      supabase.from("sessions").select("livekit_room_name, lesson_id").eq("id", id).single(),
      supabase.from("users").select("role, full_name").eq("id", web3User.sub).single(),
    ])

    if (!session) return Response.json({ error: "Session not found" }, { status: 404 })
    if (!user) return Response.json({ error: "User not found" }, { status: 404 })

    const apiKey = process.env.LIVEKIT_API_KEY!
    const apiSecret = process.env.LIVEKIT_API_SECRET!
    const livekitUrl = process.env.LIVEKIT_URL!

    if (!apiKey || !apiSecret) {
      return Response.json({ error: "LiveKit not configured" }, { status: 500 })
    }

    const isPublisher = user.role === "TUTOR" || user.role === "ORG_ADMIN"

    const token = new AccessToken(apiKey, apiSecret, {
      identity: web3User.sub,
      name: user.full_name ?? web3User.sub,
      ttl: "2h",
    })

    token.addGrant({
      room: session.livekit_room_name ?? id,
      roomJoin: true,
      canPublish: isPublisher,
      canSubscribe: true,
    })

    return Response.json({
      data: {
        token: await token.toJwt(),
        room: session.livekit_room_name,
        livekit_url: livekitUrl,
      },
    })
  } catch {
    return unauthorized()
  }
}
