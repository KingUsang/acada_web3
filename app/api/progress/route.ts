import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/progress?user_id=...&course_id=...
 * Returns course progress for a student.
 *
 * PATCH /api/progress
 * Update progress (e.g., after a lesson is completed).
 * Body: { user_id, course_id, progress_percent, completed? }
 */

export async function GET(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("user_id") || web3User.sub
    const courseId = searchParams.get("course_id")

    const supabase = createAdminClient()
    let query = supabase.from("course_progress").select("*").eq("user_id", userId)
    if (courseId) query = query.eq("course_id", courseId)

    const { data, error } = await query
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await verifyWeb3AuthToken(req)
    const { user_id, course_id, progress_percent, completed } = await req.json()

    if (!user_id || !course_id) {
      return Response.json({ error: "user_id and course_id are required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("course_progress")
      .upsert({
        user_id,
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
