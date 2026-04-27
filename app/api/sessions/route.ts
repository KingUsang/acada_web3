import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/sessions?lesson_id=...
 * List sessions (optionally filtered by lesson).
 *
 * POST /api/sessions
 * Schedule a new live session (TUTOR or ORG_ADMIN).
 * Body: { lesson_id, title, scheduled_at }
 */

export async function GET(req: NextRequest) {
  try {
    await verifyWeb3AuthToken(req)
    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get("lesson_id")

    const supabase = createAdminClient()
    let query = supabase
      .from("sessions")
      .select("*, lesson:lessons(id, title, course_id)")
      .order("scheduled_at", { ascending: true })

    if (lessonId) query = query.eq("lesson_id", lessonId)

    const { data, error } = await query
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}

export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { lesson_id, title, scheduled_at } = await req.json()

    if (!lesson_id || !scheduled_at) {
      return Response.json({ error: "lesson_id and scheduled_at are required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Generate a unique room name
    const roomName = `acada-${lesson_id}-${Date.now()}`

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        lesson_id,
        title: title || "Live Session",
        scheduled_at,
        livekit_room_name: roomName,
      })
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data }, { status: 201 })
  } catch {
    return unauthorized()
  }
}
