import { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth";

export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req);
    const { course_id } = await req.json();
    if (!course_id) return Response.json({ error: "course_id is required" }, { status: 400 });

    const supabase = createAdminClient();

    const { data: milestone, error: milestoneErr } = await supabase
      .from("milestones")
      .select("id, status, metadata")
      .eq("user_id", web3User.sub)
      .eq("course_id", course_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (milestoneErr) return Response.json({ error: milestoneErr.message }, { status: 500 });

    const { data: progress, error: progressErr } = await supabase
      .from("course_progress")
      .select("progress_percent, completed")
      .eq("user_id", web3User.sub)
      .eq("course_id", course_id)
      .maybeSingle();
    if (progressErr) return Response.json({ error: progressErr.message }, { status: 500 });

    const progressPercent = progress?.progress_percent ?? 0;
    const eligible = Boolean(progress?.completed || progressPercent >= 80 || milestone?.status === "PENDING");

    return Response.json({
      course_id,
      eligible,
      rewardAmount: eligible ? 10 : 0,
      progressPercent,
      milestoneId: milestone?.id ?? null,
      milestoneStatus: milestone?.status ?? null,
      metadata: milestone?.metadata ?? null,
    });
  } catch {
    return unauthorized();
  }
}
