import { NextRequest } from "next/server";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MEMO_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getProgramId,
} from "@/app/lib/web3/acada";
import { getRelayerKeypair, rpcUrl } from "@/app/lib/web3/server-env";
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth";
import { Connection, Ed25519Program, SystemProgram, Transaction, type PublicKeyInitData } from "@solana/web3.js";

const MAX_SERIALIZED_TRANSACTION_SIZE = 4096;
const allowedPrograms = new Set<string>([
  getProgramId().toBase58(),
  Ed25519Program.programId.toBase58(),
  MEMO_PROGRAM_ID.toBase58(),
  TOKEN_PROGRAM_ID.toBase58(),
  ASSOCIATED_TOKEN_PROGRAM_ID.toBase58(),
  SystemProgram.programId.toBase58(),
]);

function isAllowedProgram(programId: PublicKeyInitData) {
  return allowedPrograms.has(programId.toString());
}

function validateTransaction(transaction: Transaction, relayerFeePayer: string) {
  if (transaction.instructions.length === 0) throw new Error("Transactions must contain at least one instruction.");
  for (const instruction of transaction.instructions) {
    if (!isAllowedProgram(instruction.programId)) throw new Error(`Unsupported program ${instruction.programId.toBase58()}`);
  }
  const feePayer = transaction.feePayer?.toBase58();
  if (feePayer && feePayer !== relayerFeePayer) throw new Error("Transaction must use relayer as fee payer.");
  const sigCount = transaction.signatures.filter((entry) => entry.signature !== null).length;
  if (sigCount === 0) throw new Error("Relayed tx must already include user signature.");
}

export async function GET(req: NextRequest) {
  try {
    await verifyWeb3AuthToken(req);
    const connection = new Connection(rpcUrl, "confirmed");
    const relayer = getRelayerKeypair();
    const latestBlockhash = await connection.getLatestBlockhash("confirmed");
    return Response.json({
      feePayer: relayer.publicKey.toBase58(),
      recentBlockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      allowedPrograms: Array.from(allowedPrograms),
    });
  } catch {
    return unauthorized();
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyWeb3AuthToken(req);
    const body = (await req.json()) as { transaction?: string; blockhash?: string; lastValidBlockHeight?: number };
    if (!body.transaction) return Response.json({ error: "Missing serialized transaction" }, { status: 400 });

    const txBytes = Buffer.from(body.transaction, "base64");
    if (txBytes.byteLength > MAX_SERIALIZED_TRANSACTION_SIZE) {
      return Response.json({ error: "Transaction payload too large" }, { status: 400 });
    }

    const connection = new Connection(rpcUrl, "confirmed");
    const relayer = getRelayerKeypair();
    const tx = Transaction.from(txBytes);

    validateTransaction(tx, relayer.publicKey.toBase58());
    tx.feePayer = relayer.publicKey;
    if (body.blockhash) tx.recentBlockhash = body.blockhash;
    tx.partialSign(relayer);

    if (!tx.verifySignatures()) return Response.json({ error: "Invalid signatures" }, { status: 400 });

    console.info("relay.submit", { instructionPrograms: tx.instructions.map((ix) => ix.programId.toBase58()) });

    const signature = await connection.sendRawTransaction(
      tx.serialize({ requireAllSignatures: false, verifySignatures: false }),
      { skipPreflight: false, preflightCommitment: "confirmed" },
    );

    if (body.blockhash && typeof body.lastValidBlockHeight === "number") {
      await connection.confirmTransaction(
        { signature, blockhash: body.blockhash, lastValidBlockHeight: body.lastValidBlockHeight },
        "confirmed",
      );
    } else {
      await connection.confirmTransaction(signature, "confirmed");
    }

    return Response.json({ signature });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Relay failed" }, { status: 500 });
  }
}
