import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/progress?user_id=...&course_id=...
 * Returns course progress for a student.
 */
export async function GET(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { searchParams } = new URL(req.url)
    const requestedId = searchParams.get("user_id")
    const courseId = searchParams.get("course_id")

    const supabase = createAdminClient()
    
    // Resolve identity: collect all possible IDs
    let dbUuid = web3User.sub
    if (web3User.email) {
      const { data: byEmail } = await supabase
        .from("users")
        .select("id")
        .eq("email", web3User.email)
        .maybeSingle()
      if (byEmail) dbUuid = byEmail.id
    }
    const queryIds = [...new Set([dbUuid, web3User.sub, requestedId].filter(Boolean))]

    let query = supabase.from("course_progress").select("*").in("user_id", queryIds as string[])
    if (courseId) query = query.eq("course_id", courseId)

    const { data, error } = await query
    if (error) return Response.json({ error: error.message }, { status: 500 })

    // Auto-heal orphaned progress
    const orphans = (data ?? []).filter(p => p.user_id !== dbUuid)
    if (orphans.length > 0) {
      for (const p of orphans) {
        await supabase
          .from("course_progress")
          .update({ user_id: dbUuid })
          .eq("user_id", p.user_id)
          .eq("course_id", p.course_id)
      }
    }

    const healed = (data ?? []).map(p => ({ ...p, user_id: dbUuid }))
    return Response.json({ data: healed })
  } catch {
    return unauthorized()
  }
}

/**
 * PATCH /api/progress
 * Update progress (e.g., after a lesson is completed).
 */
export async function PATCH(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { user_id, course_id, progress_percent, completed } = await req.json()
    
    const supabase = createAdminClient()
    
    // Resolve identity
    let dbUuid = web3User.sub
    if (web3User.email) {
      const { data: byEmail } = await supabase
        .from("users")
        .select("id")
        .eq("email", web3User.email)
        .maybeSingle()
      if (byEmail) dbUuid = byEmail.id
    }
    
    const resolvedUserId = user_id || dbUuid

    if (!resolvedUserId || !course_id) {
      return Response.json({ error: "user_id and course_id are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("course_progress")
      .upsert({
        user_id: resolvedUserId,
        course_id,
        progress_percent,
        completed: completed ?? false,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,course_id" })
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}
