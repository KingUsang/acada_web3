import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * POST /api/auth/register
 *
 * Called by the frontend after a successful Web3Auth login.
 * Creates or upserts the user in the Supabase `users` table via admin client.
 *
 * Body: { email?: string, full_name?: string, solana_wallet_address?: string, role?: "STUDENT" | "TUTOR" | "ORG_ADMIN" }
 * Headers: Authorization: Bearer <web3auth_id_token>
 */
export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const body = await req.json()
    const { email, full_name, solana_wallet_address, role = "STUDENT" } = body

    const supabase = createAdminClient()

    // Upsert user — if already registered, update their wallet/info
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          id: web3User.sub,
          email: email || web3User.email || "",
          full_name: full_name || web3User.name || null,
          solana_wallet_address: solana_wallet_address || null,
          role,
        },
        { onConflict: "id" }
      )
      .select()
      .single()

    if (error) {
      console.error("Register error:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ data }, { status: 201 })
  } catch (err: any) {
    if (err.message?.includes("Authorization")) return unauthorized()
    return Response.json({ error: err.message }, { status: 500 })
  }
}
