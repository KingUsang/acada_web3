import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/courses/[id]
 * Returns a single course with its full details:
 * lessons, tutors, and enrollment count.
 *
 * PATCH /api/courses/[id]
 * Update course metadata (ORG_ADMIN only).
 */

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyWeb3AuthToken(req)
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("courses")
      .select(`
        *,
        organization:organizations(id, name, slug, logo_url),
        lessons(id, title, type, order_index),
        course_tutors(tutor_id, tutor:users(id, full_name, email))
      `)
      .eq("id", id)
      .single()

    if (error) return Response.json({ error: "Course not found" }, { status: 404 })

    // Count enrolled students
    const { count } = await supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("course_id", id)

    return Response.json({ data: { ...data, enrollment_count: count ?? 0 } })
  } catch {
    return unauthorized()
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params
    const supabase = createAdminClient()

    // Get the course to find its org
    const { data: course } = await supabase
      .from("courses")
      .select("organization_id")
      .eq("id", id)
      .single()

    if (!course) return Response.json({ error: "Course not found" }, { status: 404 })

    // Check caller is ORG_ADMIN
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", course.organization_id ?? "")
      .eq("user_id", web3User.sub)
      .single()

    if (!member || member.role !== "ORG_ADMIN") {
      return Response.json({ error: "Forbidden: ORG_ADMIN only" }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, price_usdc } = body

    const { data, error } = await supabase
      .from("courses")
      .update({ title, description, price_usdc })
      .eq("id", id)
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}
