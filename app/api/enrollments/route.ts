import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * GET /api/enrollments?user_id=...
 * Returns all course enrollments for a user.
 */
async function resolveUserIds(web3User: { sub: string; email?: string }, supabase: ReturnType<typeof createAdminClient>) {
  // Defensive: ensure sub is not the string "undefined"
  let dbUuid = web3User.sub === "undefined" ? null : web3User.sub
  
  if (web3User.email) {
    const { data: byEmail } = await supabase
      .from("users")
      .select("id")
      .eq("email", web3User.email)
      .maybeSingle()
    if (byEmail) dbUuid = byEmail.id
  }
  
  const ids = [...new Set([dbUuid, web3User.sub].filter(id => id && id !== "undefined"))] as string[]
  return { dbUuid: dbUuid as string, ids }
}

export async function GET(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { searchParams } = new URL(req.url)
    const supabase = createAdminClient()

    const { dbUuid, ids } = await resolveUserIds(web3User, supabase)
    const requestedId = searchParams.get("user_id")
    
    // Defensive: filter out "undefined" or null from queryIds
    const queryIds = [
      ...new Set(
        [requestedId, ...ids].filter(id => id && id !== "undefined" && id !== "null")
      )
    ] as string[]

    if (queryIds.length === 0) {
      return Response.json({ data: [] })
    }

    const { data, error } = await supabase
      .from("enrollments")
      .select("*, course:courses(id, title, description, price_usdc, lessons(id, title, type))")
      .in("user_id", queryIds)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[Enrollments GET] Database error:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    // Auto-heal logic
    const orphans = (data ?? []).filter((e) => e.user_id !== dbUuid)
    if (orphans.length > 0 && dbUuid) {
      try {
        for (const orphan of orphans) {
          if (!orphan.course_id || !orphan.user_id) continue;
          
          await supabase.from("enrollments").update({ user_id: dbUuid }).eq("id", orphan.id)
          
          const { data: existingProgress } = await supabase
            .from("course_progress")
            .select("id")
            .eq("user_id", dbUuid)
            .eq("course_id", orphan.course_id)
            .maybeSingle()
          
          if (!existingProgress) {
            await supabase
              .from("course_progress")
              .update({ user_id: dbUuid })
              .eq("user_id", orphan.user_id)
              .eq("course_id", orphan.course_id)
          } else {
            await supabase
              .from("course_progress")
              .delete()
              .eq("user_id", orphan.user_id)
              .eq("course_id", orphan.course_id)
          }
        }
      } catch (healError) {
        console.warn("[Enrollments GET] Auto-heal warning:", healError)
      }
    }

    const healed = (data ?? []).map((e) => ({ ...e, user_id: dbUuid }))
    return Response.json({ data: healed })
  } catch (err: any) {
    console.error("[Enrollments GET] Runtime error:", err)
    return Response.json({ error: err.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { course_id } = await req.json()

    if (!course_id) {
      return Response.json({ error: "course_id is required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { dbUuid, ids } = await resolveUserIds(web3User, supabase)

    const { data: existing } = await supabase
      .from("enrollments")
      .select("id, user_id, status")
      .in("user_id", ids)
      .eq("course_id", course_id)
      .maybeSingle()

    if (existing) {
      if (existing.user_id !== dbUuid && dbUuid) {
        await supabase.from("enrollments").update({ user_id: dbUuid }).eq("id", existing.id)
        return Response.json({ data: { ...existing, user_id: dbUuid }, healed: true }, { status: 200 })
      }
      return Response.json({ error: "Already enrolled in this course" }, { status: 409 })
    }

    const { data, error } = await supabase
      .from("enrollments")
      .insert({ user_id: dbUuid, course_id, status: "active" })
      .select()
      .single()

    if (error) {
      console.error("[Enrollments POST] Insert error:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    await supabase
      .from("course_progress")
      .upsert({ user_id: dbUuid, course_id, progress_percent: 0, completed: false }, { onConflict: "user_id,course_id" })

    return Response.json({ data }, { status: 201 })
  } catch (err: any) {
    console.error("[Enrollments POST] Runtime error:", err)
    return Response.json({ error: err.message || "Internal Server Error" }, { status: 500 })
  }
}
