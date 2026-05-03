"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../lib/auth/context";
import { toast } from "sonner";
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {
  buildRewardStudentInstruction,
  decodeEd25519Instruction,
  getAssociatedTokenAddress,
  getRewardMintPda,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "../../lib/web3/acada";

/**
 * Builds an idempotent create-ATA instruction.
 * Succeeds even if the account already exists — safe to always include.
 */
function buildCreateAtaInstruction(
  payer: PublicKey,
  ataAddress: PublicKey,
  owner: PublicKey,
  mint: PublicKey
): TransactionInstruction {
  return new TransactionInstruction({
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    keys: [
      { pubkey: payer,                    isSigner: true,  isWritable: true  }, // fee payer
      { pubkey: ataAddress,               isSigner: false, isWritable: true  }, // ATA to create
      { pubkey: owner,                    isSigner: false, isWritable: false }, // token owner
      { pubkey: mint,                     isSigner: false, isWritable: false }, // mint
      { pubkey: SystemProgram.programId,  isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID,         isSigner: false, isWritable: false },
    ],
    data: Buffer.from([1]), // 1 = CreateIdempotent (won't fail if account already exists)
  });
}

export default function QuizResultPage() {
  const { idToken, appUser, userId } = useAuth();
  const searchParams = useSearchParams();
  const score = Number(searchParams.get("score") || 0);
  const total = Number(searchParams.get("total") || 0);
  const correct = Number(searchParams.get("correct") || 0);
  const passed = searchParams.get("passed") === "true";
  const quizId = searchParams.get("quizId");
  const title = searchParams.get("title") || "Quiz";
  const courseId = searchParams.get("courseId");
  const [claimingReward, setClaimingReward] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const handleClaimReward = async () => {
    if (!idToken || !courseId || !passed) return;
    const walletAddress = appUser?.solana_wallet_address;
    if (!walletAddress) {
      toast.error("No Solana wallet found on your profile.");
      return;
    }

    setClaimingReward(true);
    try {
      // Step 1: Get relay context (fee payer + fresh blockhash)
      const relayCtxRes = await fetch("/api/web3/relay", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!relayCtxRes.ok) throw new Error("Could not reach relay service");
      const { feePayer, recentBlockhash, lastValidBlockHeight } = await relayCtxRes.json();

      // Step 2: Get oracle-signed claim payload from server
      const claimRes = await fetch("/api/web3/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ course_id: courseId, user_id: appUser?.id ?? userId ?? null }),
      });
      const claimPayload = await claimRes.json().catch(() => ({}));
      if (!claimRes.ok) throw new Error(claimPayload?.error || "Reward claim failed");

      const { claim } = claimPayload;
      const student = new PublicKey(walletAddress);
      const mint = getRewardMintPda();
      const studentTokenAccount = getAssociatedTokenAddress(student, mint);

      // Step 3: Decode the oracle Ed25519 signature instruction
      const ed25519Ix = decodeEd25519Instruction(claim.ed25519InstructionData);

      // Step 4: Check if student's ATA exists — create it if not
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
        "confirmed"
      );
      const ataInfo = await connection.getAccountInfo(studentTokenAccount);
      const needsAta = !ataInfo;

      // Step 5: Build the reward_student instruction.
      // Ed25519 is always at index 0. If we add a createATA ix, it goes at index 1
      // (between Ed25519 and reward_student), so ed25519InstructionIndex stays 0.
      const rewardIx = await buildRewardStudentInstruction({
        student,
        studentTokenAccount,
        payer: new PublicKey(feePayer),
        milestoneId: claim.milestoneId,
        amount: claim.amount,
        claimId: claim.claimId,
        expiresAt: claim.expiresAt,
        ed25519InstructionIndex: 0, // Ed25519 is always first
      });

      // Step 6: Build transaction
      // Order: [Ed25519 (idx 0), (optional) createATA, reward_student]
      const tx = new Transaction();
      tx.add(ed25519Ix);                                        // index 0 — Ed25519 proof
      if (needsAta) {
        tx.add(buildCreateAtaInstruction(                       // index 1 — create ATA
          new PublicKey(feePayer),
          studentTokenAccount,
          student,
          mint
        ));
      }
      tx.add(rewardIx);                                        // last — mint tokens
      tx.feePayer = new PublicKey(feePayer);
      tx.recentBlockhash = recentBlockhash;

      // Step 6: Serialize (relayer will co-sign & pay gas)
      const serializedTx = tx
        .serialize({ requireAllSignatures: false, verifySignatures: false })
        .toString("base64");

      // Step 7: Submit via relay
      const relayRes = await fetch("/api/web3/relay", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          transaction: serializedTx,
          blockhash: recentBlockhash,
          lastValidBlockHeight,
        }),
      });
      const relayData = await relayRes.json().catch(() => ({}));
      if (!relayRes.ok) throw new Error(relayData?.error || "Transaction relay failed");

      setRewardClaimed(true);
      toast.success(`🎉 ${claim.amount} ACADA tokens rewarded! Tx: ${relayData.signature?.slice(0, 8)}...`);
    } catch (err: any) {
      console.error("reward.claim.frontend", err);
      toast.error(err?.message || "Could not claim reward");
    } finally {
      setClaimingReward(false);
    }
  };

  const strokeOffset = 552.92 - (552.92 * Math.min(score, 100)) / 100;

  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl shadow-[0_16px_32px_-12px_rgba(7,14,29,0.04)] flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <Link href="/student_home" className="material-symbols-outlined text-primary">
            arrow_back
          </Link>
          <h1 className="text-xl font-extrabold tracking-tighter text-primary font-headline">
            Acada
          </h1>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto min-h-screen flex flex-col items-center">
        <div className="w-full flex flex-col items-center text-center mb-10">
          <div className="mb-4 inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full">
            <span
              className="material-symbols-outlined text-primary text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <span className="font-label text-xs font-bold tracking-widest text-primary uppercase">
              Quiz Completed
            </span>
          </div>

          <p className="text-sm text-on-surface-variant uppercase tracking-[0.25em] mb-4">
            {title}
          </p>

          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                className="text-surface-container-high"
                cx="96"
                cy="96"
                fill="transparent"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
              ></circle>
              <circle
                className="text-primary"
                cx="96"
                cy="96"
                fill="transparent"
                r="88"
                stroke="currentColor"
                strokeDasharray="552.92"
                strokeDashoffset={strokeOffset}
                strokeWidth="12"
              ></circle>
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-headline font-extrabold tracking-tighter text-on-surface">
                {score}%
              </span>
              <span className="font-label text-xs text-on-surface-variant tracking-widest uppercase">
                Final Score
              </span>
            </div>
          </div>

          <div className="bg-inverse-surface text-inverse-on-surface px-8 py-2 rounded-full font-label font-bold text-sm tracking-[0.2em] uppercase mb-8">
            {passed ? "Pass" : "Retry"}
          </div>
        </div>

        <div className="w-full grid grid-cols-3 gap-4 mb-10">
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center aspect-square">
            <span className="material-symbols-outlined text-primary mb-2">task_alt</span>
            <span className="text-xl font-headline font-bold text-on-surface">
              {correct}/{total}
            </span>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest text-center">
              Correct
            </span>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center aspect-square">
            <span className="material-symbols-outlined text-primary mb-2">trophy</span>
            <span className="text-xl font-headline font-bold text-on-surface">
              {passed ? "Passed" : "Retry"}
            </span>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest text-center">
              Outcome
            </span>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center aspect-square">
            <span className="material-symbols-outlined text-primary mb-2">monitoring</span>
            <span className="text-xl font-headline font-bold text-on-surface">{score >= 80 ? "High" : score >= 60 ? "Mid" : "Low"}</span>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest text-center">
              Mastery
            </span>
          </div>
        </div>

        <div className="w-full bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_64px_-16px_rgba(7,14,29,0.08)] mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-lg">Performance Analysis</h3>
            <span className="font-label text-xs text-primary font-bold">
              {passed ? "ELIGIBLE TO CONTINUE" : "REVIEW NEEDED"}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
            {passed
              ? "You met the quiz requirement and your result has been saved to your learning record."
              : "Your result has been saved. Review the course material, then retake the quiz when you are ready."}
          </p>
        </div>

        <div className="w-full flex flex-col gap-4 mt-auto">
          {passed && !rewardClaimed ? (
            <button
              onClick={handleClaimReward}
              disabled={claimingReward}
              className="w-full h-14 bg-inverse-surface text-white font-headline font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
            >
              {claimingReward ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting to Solana...
                </>
              ) : (
                "Claim ACADA Reward"
              )}
            </button>
          ) : rewardClaimed ? (
            <div className="w-full h-14 bg-primary/10 border border-primary/20 text-primary font-headline font-bold rounded-xl flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                toll
              </span>
              Tokens Rewarded ✓
            </div>
          ) : null}
          <Link
            href={courseId ? `/course_detail_student?id=${courseId}` : "/student_home"}
            className="w-full h-14 bg-primary text-on-primary font-headline font-bold rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            Continue Learning
          </Link>
          {quizId ? (
            <Link
              href={`/quiz_interface?id=${quizId}`}
              className="w-full h-14 bg-surface-container-high text-on-surface font-headline font-bold rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            >
              Retake Quiz
            </Link>
          ) : null}
        </div>
      </main>
    </div>
  );
}
