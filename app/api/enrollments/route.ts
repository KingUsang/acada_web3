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

export async function GET(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("user_id") || web3User.sub

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, course:courses(id, title, description, price_usdc, lessons(id, title, type))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
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

    // Check for existing enrollment
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id, status")
      .eq("user_id", web3User.sub)
      .eq("course_id", course_id)
      .single()

    if (existing) {
      return Response.json({ error: "Already enrolled in this course" }, { status: 409 })
    }

    const { data, error } = await supabase
      .from("enrollments")
      .insert({ user_id: web3User.sub, course_id, status: "active" })
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })

    // Initialize course progress record
    await supabase
      .from("course_progress")
      .upsert({ user_id: web3User.sub, course_id, progress_percent: 0, completed: false })

    return Response.json({ data }, { status: 201 })
  } catch {
    return unauthorized()
  }
}
