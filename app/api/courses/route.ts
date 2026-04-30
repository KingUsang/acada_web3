import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/courses?org_id=...
 * Returns all courses, optionally filtered by organization.
 *
 * POST /api/courses
 * Creates a new course. Only ORG_ADMIN members of the org may create.
 * Body: { organization_id, title, description, price_usdc }
 */

export async function GET(req: NextRequest) {
  try {
    await verifyWeb3AuthToken(req)
    const { searchParams } = new URL(req.url)
    const orgId = searchParams.get("org_id")

    const supabase = createAdminClient()
    let query = supabase
      .from("courses")
      .select("*, lessons(id, title, type, order_index), course_tutors(tutor_id)")
      .order("created_at", { ascending: false })

    if (orgId) query = query.eq("organization_id", orgId)

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
    const { organization_id, title, description, price_usdc, category, duration, price_ngn, status, thumbnail_url } = await req.json()

    if (!organization_id || !title) {
      return Response.json({ error: "organization_id and title are required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Verify caller is an ORG_ADMIN of this organization
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organization_id)
      .eq("user_id", web3User.sub)
      .single()

    if (!member || member.role !== "ORG_ADMIN") {
      return Response.json({ error: "Forbidden: ORG_ADMIN only" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("courses")
      .insert({ 
        organization_id, 
        title, 
        description: description || null, 
        price_usdc: price_usdc ?? 0,
        category: category ?? "TUTORIAL",
        duration: duration || null,
        price_ngn: price_ngn ?? 0,
        status: status ?? "DRAFT",
        thumbnail_url: thumbnail_url || null
      })
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })

    const { data: existingTutorLink } = await supabase
      .from("course_tutors")
      .select("id")
      .eq("course_id", data.id)
      .eq("tutor_id", web3User.sub)
      .maybeSingle()

    if (!existingTutorLink) {
      await supabase.from("course_tutors").insert({
        course_id: data.id,
        tutor_id: web3User.sub,
      })
    }

    return Response.json({ data }, { status: 201 })
  } catch {
    return unauthorized()
  }
}
