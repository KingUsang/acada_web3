/**
 * initialize_rewards.mjs
 * Calls the acada_rewards `initialize` instruction once to create:
 *   - config PDA  (seeds: ["config"])
 *   - mint PDA    (seeds: ["acada_mint"])
 *
 * Run with: node scripts/initialize_rewards.mjs
 */

import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
// TOKEN_PROGRAM_ID is a well-known constant — no import needed
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
import { createHash } from "crypto";

// ── Config ────────────────────────────────────────────────────────────────────
const RPC_URL       = "https://api.devnet.solana.com";
const PROGRAM_ID    = new PublicKey("Bge9kSTAw3n4G7nh6Pg1SY3STK8SaoA8PnVqY3HoSB3i");
const USDC_MINT     = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
const TREASURY_AUTH = new PublicKey("DAGDEsRhXYvNc4SZRQVb91xCpXSX5wn5f4UquUE8r4u7"); // relayer

// Price: 25 USDC (6 decimals) = 25_000_000 ; discount: 0.1 USDC per token = 100_000
const COURSE_PRICE_LAMPORTS    = BigInt(25_000_000); // 25 USDC
const DISCOUNT_PER_TOKEN       = BigInt(100_000);    // 0.1 USDC per ACADA token

// Payer = relayer keypair (has SOL)
const RELAYER_SECRET = [127,88,70,4,165,95,1,169,245,31,221,171,57,190,150,143,2,96,179,140,166,128,245,153,125,134,233,157,34,91,22,158,180,171,171,103,201,153,67,16,90,43,145,195,90,157,235,247,1,188,127,103,210,144,162,136,58,85,88,14,145,243,254,50];

// Oracle = backend_pubkey (signs rewards off-chain)
const ORACLE_SECRET  = [172,208,55,152,178,105,135,208,39,122,114,60,219,144,215,43,140,205,218,53,118,16,31,98,33,14,50,228,113,97,242,84,54,218,91,108,249,185,104,52,118,195,98,28,48,174,213,7,78,78,8,96,15,144,90,151,40,119,20,228,65,247,51,131];

// ── Helpers ───────────────────────────────────────────────────────────────────
function anchorDiscriminator(name) {
  return createHash("sha256")
    .update(`global:${name}`)
    .digest()
    .subarray(0, 8);
}

function toU64LE(value) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(value);
  return buf;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const connection = new Connection(RPC_URL, "confirmed");
const payer      = Keypair.fromSecretKey(new Uint8Array(RELAYER_SECRET));
const oracle     = Keypair.fromSecretKey(new Uint8Array(ORACLE_SECRET));

console.log("Payer  (relayer):", payer.publicKey.toBase58());
console.log("Oracle (backend):", oracle.publicKey.toBase58());

// Derive PDAs
const [configPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("config")],
  PROGRAM_ID
);
const [mintPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("acada_mint")],
  PROGRAM_ID
);

console.log("\nConfig PDA:", configPda.toBase58());
console.log("Mint PDA:  ", mintPda.toBase58());

// Check if already initialized
const existing = await connection.getAccountInfo(configPda);
if (existing) {
  console.log("\n✅ Program already initialized! Config PDA exists.");
  console.log("   Mint PDA is ready to use.");
  process.exit(0);
}

// Build the initialize instruction data
// fn initialize(backend_pubkey: Pubkey, treasury_authority: Pubkey, usdc_mint: Pubkey, course_price: u64, discount_per_token: u64)
const discriminator = anchorDiscriminator("initialize");
const data = Buffer.concat([
  discriminator,
  oracle.publicKey.toBuffer(),         // backend_pubkey
  TREASURY_AUTH.toBuffer(),            // treasury_authority
  USDC_MINT.toBuffer(),                // usdc_mint
  toU64LE(COURSE_PRICE_LAMPORTS),      // course_price
  toU64LE(DISCOUNT_PER_TOKEN),         // discount_per_token
]);

const ix = new TransactionInstruction({
  programId: PROGRAM_ID,
  keys: [
    { pubkey: configPda,            isSigner: false, isWritable: true  }, // config
    { pubkey: mintPda,              isSigner: false, isWritable: true  }, // mint
    { pubkey: payer.publicKey,      isSigner: true,  isWritable: true  }, // payer
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID,     isSigner: false, isWritable: false },
  ],
  data,
});

const tx = new Transaction().add(ix);
tx.feePayer = payer.publicKey;

console.log("\n🚀 Sending initialize transaction...");
try {
  const sig = await sendAndConfirmTransaction(connection, tx, [payer], {
    commitment: "confirmed",
  });
  console.log("✅ Success! Tx:", sig);
  console.log("   Explorer: https://explorer.solana.com/tx/" + sig + "?cluster=devnet");
  console.log("\n   Mint PDA is now live:", mintPda.toBase58());
} catch (err) {
  console.error("❌ Failed:", err.message);
  if (err.logs) console.error("Logs:\n", err.logs.join("\n"));
}
