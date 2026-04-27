import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/certificates?user_id=...
 * List all minted certificates for a user.
 *
 * GET /api/certificates/[id] → handled in /api/certificates/[id]/route.ts
 */
export async function GET(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("user_id") || web3User.sub

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("certificates")
      .select("*, course:courses(id, title), milestone:milestones(id, status, metadata)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}
