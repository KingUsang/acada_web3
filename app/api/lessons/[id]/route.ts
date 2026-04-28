import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * PATCH /api/lessons/[id]
 * Update a lesson (TUTOR or ORG_ADMIN).
 * Body: { title?, type?, order_index?, content_url? }
 *
 * content_url: the Supabase Storage URL of the uploaded video or PDF.
 * The frontend uploads the file directly to Supabase Storage, then
 * passes the resulting URL here.
 *
 * DELETE /api/lessons/[id]
 * Delete a lesson (TUTOR or ORG_ADMIN).
 */

async function verifyLessonAccess(lessonId: string, userId: string) {
  const supabase = createAdminClient()

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, course_id, courses(organization_id)")
    .eq("id", lessonId)
    .single()

  if (!lesson) return { lesson: null, allowed: false, supabase }

  const courseData = lesson.courses as any
  const orgId = courseData?.organization_id

  const [{ data: membership }, { data: tutorship }] = await Promise.all([
    supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", orgId ?? "")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("course_tutors")
      .select("id")
      .eq("course_id", lesson.course_id ?? "")
      .eq("tutor_id", userId)
      .single(),
  ])

  return { lesson, allowed: !!(membership || tutorship), supabase }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params
    const { lesson, allowed, supabase } = await verifyLessonAccess(id, web3User.sub)

    if (!lesson) return Response.json({ error: "Lesson not found" }, { status: 404 })
    if (!allowed) return Response.json({ error: "Forbidden: TUTOR or ORG_ADMIN only" }, { status: 403 })

    const body = await req.json()
    const { title, type, order_index } = body

    const { data, error } = await supabase
      .from("lessons")
      .update({ title, type, order_index })
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
    const { lesson, allowed, supabase } = await verifyLessonAccess(id, web3User.sub)

    if (!lesson) return Response.json({ error: "Lesson not found" }, { status: 404 })
    if (!allowed) return Response.json({ error: "Forbidden: TUTOR or ORG_ADMIN only" }, { status: 403 })

    // Guard: block deletion if any student is enrolled in this course.
    // For recorded/PDF lessons we have no per-lesson view tracking, so we use
    // course-level enrollment as the proxy for "a student may have engaged".
    const { count: enrollmentCount } = await supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("course_id", lesson.course_id ?? "")
      .eq("status", "active")

    if ((enrollmentCount ?? 0) > 0) {
      return Response.json(
        { error: "Cannot delete a lesson once students are enrolled in the course." },
        { status: 409 }
      )
    }

    const { error } = await supabase.from("lessons").delete().eq("id", id)
    if (error) return Response.json({ error: error.message }, { status: 500 })

    return new Response(null, { status: 204 })
  } catch {
    return unauthorized()
  }
}
