import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/enrollments?user_id=...
 * Returns all course enrollments for a user.
 *
 * POST /api/enrollments
 * Enroll a student in a course.
 * Body: { course_id: string }
 */

/** Resolves all possible user IDs for the current token (DB UUID + raw JWT sub) */
async function resolveUserIds(web3User: { sub: string; email?: string }, supabase: ReturnType<typeof createAdminClient>) {
  let dbUuid = web3User.sub
  if (web3User.email) {
    const { data: byEmail } = await supabase
      .from("users")
      .select("id")
      .eq("email", web3User.email)
      .maybeSingle()
    if (byEmail) dbUuid = byEmail.id
  }
  // Return unique IDs — sub may equal dbUuid if sub IS the DB UUID
  const ids = [...new Set([dbUuid, web3User.sub])]
  return { dbUuid, ids }
}

export async function GET(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { searchParams } = new URL(req.url)
    const supabase = createAdminClient()

    const { dbUuid, ids } = await resolveUserIds(web3User, supabase)
    // If a specific user_id was requested (e.g. from dashboard), honour it but also
    // include the resolved IDs so orphaned rows are still visible.
    const requestedId = searchParams.get("user_id")
    const queryIds = requestedId ? [...new Set([requestedId, ...ids])] : ids

    const { data, error } = await supabase
      .from("enrollments")
      .select("*, course:courses(id, title, description, price_usdc, lessons(id, title, type))")
      .in("user_id", queryIds)
      .order("created_at", { ascending: false })

    if (error) return Response.json({ error: error.message }, { status: 500 })

    // Auto-heal: re-associate any orphaned rows to the canonical DB UUID
    const orphans = (data ?? []).filter((e) => e.user_id !== dbUuid)
    if (orphans.length > 0) {
      await supabase
        .from("enrollments")
        .update({ user_id: dbUuid })
        .in("id", orphans.map((e) => e.id))
      // Also heal course_progress
      await supabase
        .from("course_progress")
        .update({ user_id: dbUuid })
        .in("user_id", orphans.map((e) => e.user_id).filter((id) => id !== dbUuid))
    }

    // Return with canonical user_id so the UI sees consistent data
    const healed = (data ?? []).map((e) => ({ ...e, user_id: dbUuid }))
    return Response.json({ data: healed })
  } catch {
    return unauthorized()
  }
}

export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { course_id } = await req.json()

    if (!course_id) {
      return Response.json({ error: "course_id is required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { dbUuid, ids } = await resolveUserIds(web3User, supabase)

    // Check across ALL possible user IDs — catches orphans stored under old sub
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id, user_id, status")
      .in("user_id", ids)
      .eq("course_id", course_id)
      .maybeSingle()

    if (existing) {
      // Auto-heal: move orphaned enrollment to canonical DB UUID
      if (existing.user_id !== dbUuid) {
        await supabase
          .from("enrollments")
          .update({ user_id: dbUuid })
          .eq("id", existing.id)
        await supabase
          .from("course_progress")
          .update({ user_id: dbUuid })
          .eq("user_id", existing.user_id)
          .eq("course_id", course_id)
        return Response.json({ data: { ...existing, user_id: dbUuid }, healed: true }, { status: 200 })
      }
      return Response.json({ error: "Already enrolled in this course" }, { status: 409 })
    }

    const { data, error } = await supabase
      .from("enrollments")
      .insert({ user_id: dbUuid, course_id, status: "active" })
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })

    // Initialize course progress under the canonical DB UUID
    await supabase
      .from("course_progress")
      .upsert({ user_id: dbUuid, course_id, progress_percent: 0, completed: false })

    return Response.json({ data }, { status: 201 })
  } catch {
    return unauthorized()
  }
}
