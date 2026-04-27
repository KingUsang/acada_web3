import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * POST /api/payments
 * Record a payment for course enrollment.
 * Body: { course_id, amount, currency, transaction_ref }
 *
 * currency: "USDC" | "SOL" | "FIAT"
 * After payment recorded, enrollment is automatically created.
 *
 * GET /api/payments?user_id=...
 * Payment history for a user.
 */

export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { course_id, amount, currency, transaction_ref } = await req.json()

    if (!course_id || !amount || !currency) {
      return Response.json({ error: "course_id, amount, and currency are required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Record the payment
    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        user_id: web3User.sub,
        course_id,
        amount,
        currency,
        transaction_ref: transaction_ref || null,
        status: "completed",
      })
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })

    // Auto-enroll the student after successful payment
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", web3User.sub)
      .eq("course_id", course_id)
      .single()

    if (!existing) {
      await supabase
        .from("enrollments")
        .insert({ user_id: web3User.sub, course_id, status: "active" })

      await supabase
        .from("course_progress")
        .upsert({ user_id: web3User.sub, course_id, progress_percent: 0, completed: false })
    }

    return Response.json({ data: payment }, { status: 201 })
  } catch {
    return unauthorized()
  }
}

export async function GET(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("user_id") || web3User.sub

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("payments")
      .select("*, course:courses(id, title)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data })
  } catch {
    return unauthorized()
  }
}
