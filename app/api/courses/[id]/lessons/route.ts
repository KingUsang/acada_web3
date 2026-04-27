import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/courses/[id]/lessons
 * List all lessons for a course, ordered by order_index.
 *
 * POST /api/courses/[id]/lessons
 * Add a lesson to a course (TUTOR or ORG_ADMIN).
 * Body: { title, type: "LIVE" | "RECORDED", order_index? }
 */

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyWeb3AuthToken(req)
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("lessons")
      .select("*, sessions(id, title, scheduled_at, livekit_room_name, recording_url), quizzes(id, title, passing_score)")
      .eq("course_id", id)
      .order("order_index", { ascending: true })

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id: courseId } = await params
    const { title, type = "RECORDED", order_index } = await req.json()

    if (!title) return Response.json({ error: "title is required" }, { status: 400 })

    const supabase = createAdminClient()

    // Verify: caller is a tutor on this course OR ORG_ADMIN
    const { data: course } = await supabase
      .from("courses")
      .select("organization_id")
      .eq("id", courseId)
      .single()

    if (!course) return Response.json({ error: "Course not found" }, { status: 404 })

    const [{ data: membership }, { data: tutorship }] = await Promise.all([
      supabase
        .from("organization_members")
        .select("role")
        .eq("organization_id", course.organization_id ?? "")
        .eq("user_id", web3User.sub)
        .single(),
      supabase
        .from("course_tutors")
        .select("id")
        .eq("course_id", courseId)
        .eq("tutor_id", web3User.sub)
        .single(),
    ])

    if (!membership && !tutorship) {
      return Response.json({ error: "Forbidden: TUTOR or ORG_ADMIN only" }, { status: 403 })
    }

    // Auto-assign order_index if not given
    let nextOrder = order_index
    if (!nextOrder) {
      const { count } = await supabase
        .from("lessons")
        .select("id", { count: "exact", head: true })
        .eq("course_id", courseId)
      nextOrder = (count ?? 0) + 1
    }

    const { data, error } = await supabase
      .from("lessons")
      .insert({ course_id: courseId, title, type, order_index: nextOrder })
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data }, { status: 201 })
  } catch {
    return unauthorized()
  }
}
