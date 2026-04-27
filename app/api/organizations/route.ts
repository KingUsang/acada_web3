import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/organizations
 * Returns all organizations. Requires auth.
 *
 * POST /api/organizations
 * Creates a new organization and makes the calling user an ORG_ADMIN member.
 * Body: { name: string, slug: string, logo_url?: string }
 */

export async function GET(req: NextRequest) {
  try {
    await verifyWeb3AuthToken(req)
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("organizations")
      .select("*")
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
    const { name, slug, logo_url } = await req.json()

    if (!name || !slug) {
      return Response.json({ error: "name and slug are required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({ name, slug, logo_url: logo_url || null })
      .select()
      .single()

    if (orgError) return Response.json({ error: orgError.message }, { status: 500 })

    // Auto-assign the creator as ORG_ADMIN
    const { error: memberError } = await supabase
      .from("organization_members")
      .insert({ organization_id: org.id, user_id: web3User.sub, role: "ORG_ADMIN" })

    if (memberError) {
      // Roll back the org creation if member insert fails
      await supabase.from("organizations").delete().eq("id", org.id)
      return Response.json({ error: memberError.message }, { status: 500 })
    }

    return Response.json({ data: org }, { status: 201 })
  } catch {
    return unauthorized()
  }
}
