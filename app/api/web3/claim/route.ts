import { NextRequest } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth";
import { buildEd25519Instruction, buildRewardMessage, encodeEd25519Instruction, getProgramId } from "@/app/lib/web3/acada";
import { getOracleKeypair } from "@/app/lib/web3/server-env";

function deriveClaimId(studentAddress: string, milestoneSeed: string) {
  const tail = `${studentAddress.slice(-6)}${milestoneSeed.slice(0, 6)}`;
  const parsed = Number.parseInt(tail, 36);
  return Number.isFinite(parsed) ? parsed >>> 0 : Date.now() >>> 0;
}

export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req);
    const { course_id, milestone_id, user_id } = await req.json();
    if (!course_id) return Response.json({ error: "course_id is required" }, { status: 400 });

    const supabase = createAdminClient();
    let resolvedUserId: string | undefined = web3User.sub;
    if (!resolvedUserId && web3User.email) {
      const { data: byEmail } = await supabase.from("users").select("id").eq("email", web3User.email).maybeSingle();
      resolvedUserId = byEmail?.id;
    }
    if (!resolvedUserId && user_id) {
      resolvedUserId = String(user_id);
    }
    if (!resolvedUserId) {
      console.error("reward.claim.identity_failed", {
        hasSub: Boolean(web3User.sub),
        hasEmail: Boolean(web3User.email),
        hasBodyUserId: Boolean(user_id),
      });
      return Response.json({ error: "Unable to resolve user identity" }, { status: 401 });
    }

    const { data: user } = await supabase.from("users").select("solana_wallet_address").eq("id", resolvedUserId).single();
    console.info("reward.claim.user_lookup", {
      resolvedUserId,
      wallet: user?.solana_wallet_address ?? null,
    });
    if (!user?.solana_wallet_address) return Response.json({ error: "User wallet missing" }, { status: 400 });

    const { data: progress } = await supabase
      .from("course_progress")
      .select("progress_percent, completed")
      .eq("user_id", resolvedUserId)
      .eq("course_id", course_id)
      .maybeSingle();
    const isEligible = Boolean(progress?.completed || (progress?.progress_percent ?? 0) >= 80);
    if (!isEligible) return Response.json({ error: "Not eligible for reward claim" }, { status: 403 });

    let student: PublicKey;
    try {
      student = new PublicKey(user.solana_wallet_address);
    } catch {
      return Response.json(
        {
          error: "Invalid solana_wallet_address on user profile",
          details: { resolvedUserId, wallet: user.solana_wallet_address },
        },
        { status: 400 }
      );
    }
    const rewardAmount = 10;
    const milestoneKey = milestone_id ?? String(course_id);
    const claimId = deriveClaimId(user.solana_wallet_address, milestoneKey);
    const expiresAt = Math.floor(Date.now() / 1000) + 10 * 60;

    const message = buildRewardMessage(student, 1, rewardAmount, claimId, expiresAt, getProgramId());
    const oracle = getOracleKeypair();
    const ed25519Instruction = buildEd25519Instruction(oracle.secretKey, message);

    console.info("reward.claim.prepare", { userId: resolvedUserId, course_id, claimId });

    return Response.json({
      claim: {
        milestoneId: 1,
        amount: rewardAmount,
        claimId,
        expiresAt,
        ed25519InstructionData: encodeEd25519Instruction(ed25519Instruction),
      },
    });
  } catch (err: any) {
    console.error("reward.claim.error", { message: err?.message ?? "unknown" });
    const message = err?.message ?? "Unauthorized";
    if (message.includes("Authorization")) return unauthorized(message);
    return Response.json({ error: message }, { status: 500 });
  }
}
