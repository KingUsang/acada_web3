import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/users/[id]
 * Returns a user's public profile. Requires auth.
 *
 * PATCH /api/users/[id]
 * Updates the user's profile (full_name, solana_wallet_address).
 * Only the authenticated user can update their own profile.
 */

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params
    const supabase = createAdminClient()

    let dbUserId = id
    if (web3User.email) {
      const { data: byEmail } = await supabase.from("users").select("id").eq("email", web3User.email).maybeSingle()
      if (byEmail) dbUserId = byEmail.id
    }

    if (id !== dbUserId && id !== web3User.sub) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data, error } = await supabase
      .from("users")
      .select("id, email, full_name, role, solana_wallet_address, created_at")
      .eq("id", dbUserId)
      .single()

    if (error) return Response.json({ error: "User not found" }, { status: 404 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params

    const supabase = createAdminClient()
    let dbUserId = id
    if (web3User.email) {
      const { data: byEmail } = await supabase.from("users").select("id").eq("email", web3User.email).maybeSingle()
      if (byEmail) dbUserId = byEmail.id
    }

    // Users can only update their own profile
    if (id !== dbUserId && id !== web3User.sub) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { full_name, solana_wallet_address } = body

    const { data, error } = await supabase
      .from("users")
      .update({ full_name, solana_wallet_address })
      .eq("id", dbUserId)
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}
