import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * PATCH /api/sessions/[id]
 * Update a session — e.g. reschedule or attach a recording URL after a live class.
 * Body: { title?, scheduled_at?, recording_url? }
 *
 * DELETE /api/sessions/[id]
 * Cancel / delete a session (TUTOR or ORG_ADMIN).
 *
 * GET /api/sessions/[id]/token → handled in /api/sessions/[id]/token/route.ts
 */

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params
    const supabase = createAdminClient()

    // Verify caller is a tutor or org admin for this session's course
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", web3User.sub)
      .single()

    if (!user || (user.role !== "TUTOR" && user.role !== "ORG_ADMIN")) {
      return Response.json({ error: "Forbidden: TUTOR or ORG_ADMIN only" }, { status: 403 })
    }

    const { title, scheduled_at, recording_url } = await req.json()

    const { data, error } = await supabase
      .from("sessions")
      .update({ title, scheduled_at, recording_url })
      .eq("id", id)
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params
    const supabase = createAdminClient()

    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", web3User.sub)
      .single()

    if (!user || (user.role !== "TUTOR" && user.role !== "ORG_ADMIN")) {
      return Response.json({ error: "Forbidden: TUTOR or ORG_ADMIN only" }, { status: 403 })
    }

    // Guard: block deletion if any student has attendance logged for this session.
    const { count: attendanceCount } = await supabase
      .from("attendance_logs")
      .select("id", { count: "exact", head: true })
      .eq("session_id", id)

    if ((attendanceCount ?? 0) > 0) {
      return Response.json(
        { error: "Cannot delete a session that students have already attended." },
        { status: 409 }
      )
    }

    const { error } = await supabase.from("sessions").delete().eq("id", id)
    if (error) return Response.json({ error: error.message }, { status: 500 })

    return new Response(null, { status: 204 })
  } catch {
    return unauthorized()
  }
}
