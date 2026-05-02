import {
  Ed25519Program,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { Buffer } from "buffer";

export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
);
export const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
export const REWARD_MESSAGE_PREFIX = "ACADA_REWARD_V1";

const DEFAULT_PROGRAM_ID = "2mdcYsv1sUeVByuiUQMqcEuBu8qdpmgVzAntppXo8MWG";
const DEFAULT_DEVNET_USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

export function getProgramId() {
  return new PublicKey(process.env.NEXT_PUBLIC_ACADA_PROGRAM_ID ?? DEFAULT_PROGRAM_ID);
}

export function getRewardMintPda(programId = getProgramId()) {
  return PublicKey.findProgramAddressSync([Buffer.from("acada_mint")], programId)[0];
}

export function getConfigPda(programId = getProgramId()) {
  return PublicKey.findProgramAddressSync([Buffer.from("config")], programId)[0];
}

export function getClaimRecordPda(student: PublicKey, milestoneId: number, claimId: number, programId = getProgramId()) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("claim"), student.toBuffer(), toU64Le(milestoneId), toU64Le(claimId)],
    programId,
  )[0];
}

export function getUsdcMint() {
  return new PublicKey(process.env.NEXT_PUBLIC_ACADA_USDC_MINT ?? DEFAULT_DEVNET_USDC_MINT);
}

export function buildRewardMessage(
  student: PublicKey,
  milestoneId: number,
  amount: number,
  claimId: number,
  expiresAt: number,
  programId = getProgramId(),
) {
  return Buffer.concat([
    Buffer.from(REWARD_MESSAGE_PREFIX, "utf8"),
    student.toBuffer(),
    toU64Le(milestoneId),
    toU64Le(amount),
    toU64Le(claimId),
    toI64Le(expiresAt),
    programId.toBuffer(),
  ]);
}

export function buildEd25519Instruction(privateKey: Uint8Array, message: Buffer) {
  return Ed25519Program.createInstructionWithPrivateKey({ privateKey, message });
}

export function encodeEd25519Instruction(ix: TransactionInstruction) {
  return Buffer.from(ix.data).toString("base64");
}

export function decodeEd25519Instruction(base64: string) {
  return new TransactionInstruction({
    programId: Ed25519Program.programId,
    keys: [],
    data: Buffer.from(base64, "base64"),
  });
}

export function getAssociatedTokenAddress(owner: PublicKey, mint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )[0];
}

export async function buildRewardStudentInstruction(args: {
  student: PublicKey;
  studentTokenAccount: PublicKey;
  payer: PublicKey;
  milestoneId: number;
  amount: number;
  claimId: number;
  expiresAt: number;
  ed25519InstructionIndex: number;
}) {
  const programId = getProgramId();
  const config = getConfigPda(programId);
  const mint = getRewardMintPda(programId);
  const claimRecord = getClaimRecordPda(args.student, args.milestoneId, args.claimId, programId);

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: config, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: claimRecord, isSigner: false, isWritable: true },
      { pubkey: args.student, isSigner: false, isWritable: false },
      { pubkey: args.studentTokenAccount, isSigner: false, isWritable: true },
      { pubkey: args.payer, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.concat([
      await anchorDiscriminator("reward_student"),
      toU64Le(args.milestoneId),
      toU64Le(args.amount),
      toU64Le(args.claimId),
      toI64Le(args.expiresAt),
      toU16Le(args.ed25519InstructionIndex),
    ]),
  });
}

export async function buildPurchaseCourseInstruction(args: {
  student: PublicKey;
  studentRewardAccount: PublicKey;
  studentUsdcAccount: PublicKey;
  treasuryOwner: PublicKey;
  treasuryUsdcAccount: PublicKey;
  courseId: number;
  rewardTokensToBurn: number;
}) {
  const programId = getProgramId();
  const config = getConfigPda(programId);
  const mint = getRewardMintPda(programId);
  const usdcMint = getUsdcMint();

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: config, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: true },
      { pubkey: usdcMint, isSigner: false, isWritable: true },
      { pubkey: args.student, isSigner: true, isWritable: true },
      { pubkey: args.studentRewardAccount, isSigner: false, isWritable: true },
      { pubkey: args.studentUsdcAccount, isSigner: false, isWritable: true },
      { pubkey: args.treasuryOwner, isSigner: false, isWritable: false },
      { pubkey: args.treasuryUsdcAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.concat([
      await anchorDiscriminator("purchase_course"),
      toU64Le(args.courseId),
      toU64Le(args.rewardTokensToBurn),
    ]),
  });
}

export async function anchorDiscriminator(name: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`global:${name}`));
  return Buffer.from(digest).subarray(0, 8);
}

function toU64Le(value: number) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(BigInt(value));
  return buffer;
}
function toI64Le(value: number) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64LE(BigInt(value));
  return buffer;
}
function toU16Le(value: number) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value);
  return buffer;
}
