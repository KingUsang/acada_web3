import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/certificates/[id]
 * Returns one certificate for the authenticated owner.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("certificates")
      .select("*, course:courses(id, title, description), milestone:milestones(id, type, status, metadata, created_at)")
      .eq("id", id)
      .single()

    if (error || !data) {
      return Response.json({ error: "Certificate not found" }, { status: 404 })
    }

    if (data.user_id !== web3User.sub) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}
