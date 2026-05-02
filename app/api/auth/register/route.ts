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
    const { email, full_name, solana_wallet_address, role, is_login_only } = body as {
      email?: string
      full_name?: string
      solana_wallet_address?: string
      role?: "STUDENT" | "TUTOR" | "ORG_ADMIN"
      is_login_only?: boolean
    }

    const supabase = createAdminClient()
    console.info("auth.register.start", {
      web3Sub: web3User.sub,
      web3Email: web3User.email ?? null,
      bodyEmail: email ?? null,
      isLoginOnly: Boolean(is_login_only),
    })

    // 1. Try to find user by email first (important for pre-seeded accounts)
    const targetEmail = email || web3User.email
    let { data: existingUser, error: findError } = targetEmail 
      ? await supabase
          .from("users")
          .select("id, role, email, full_name, solana_wallet_address")
          .eq("email", targetEmail)
          .maybeSingle()
      : { data: null, error: null }

    // 2. If not found by email, try to find by ID (important for users who changed emails or don't have one)
    if (!existingUser) {
      const res = await supabase
        .from("users")
        .select("id, role, email, full_name, solana_wallet_address")
        .eq("id", web3User.sub)
        .maybeSingle()
      existingUser = res.data
      findError = findError || res.error
    }

    if (findError) {
      console.error("Find existing user error:", findError)
    }

    console.info("auth.register.lookup", {
      targetEmail: targetEmail ?? null,
      matchedUserId: existingUser?.id ?? null,
      matchedRole: existingUser?.role ?? null,
    })

    if (is_login_only && !existingUser) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const nextRole = role ?? existingUser?.role ?? "STUDENT"
    // Use existing ID if found (e.g. from seed data), otherwise use Web3Auth sub
    const userId = existingUser?.id || web3User.sub
    console.info("auth.register.resolve", {
      resolvedUserId: userId,
      role: nextRole,
      usedExistingUser: Boolean(existingUser?.id),
    })

    // Upsert user — if already registered, update their wallet/info
    const nextEmail =
      is_login_only
        ? (existingUser?.email ?? email ?? web3User.email ?? "")
        : (email || web3User.email || "")
    const nextFullName =
      is_login_only
        ? (existingUser?.full_name ?? full_name ?? web3User.name ?? null)
        : (full_name || web3User.name || null)
    const nextWallet =
      is_login_only
        ? (solana_wallet_address ?? existingUser?.solana_wallet_address ?? null)
        : (solana_wallet_address ?? existingUser?.solana_wallet_address ?? null)

    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          id: userId,
          email: nextEmail,
          full_name: nextFullName,
          solana_wallet_address: nextWallet,
          role: nextRole,
        },
        { onConflict: "id" }
      )
      .select()
      .single()

    if (error) {
      console.error("Register error:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    console.info("auth.register.success", {
      userId: data.id,
      role: data.role ?? null,
      email: data.email ?? null,
    })

    return Response.json({ data }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    if (message.includes("Authorization")) return unauthorized()
    return Response.json({ error: message }, { status: 500 })
  }
}
