import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

function loadKeypair(filePath) {
  try {
    const raw = JSON.parse(readFileSync(filePath, "utf8"));
    return Keypair.fromSecretKey(new Uint8Array(raw));
  } catch {
    return null;
  }
}

async function getBalance(address) {
  try {
    const lamports = await connection.getBalance(new PublicKey(address));
    return (lamports / 1e9).toFixed(4);
  } catch {
    return "error";
  }
}

const wallets = [
  { label: "Certificate Issuer", file: join(__dirname, "certificate.json") },
  { label: "Oracle",             file: join(__dirname, "oracle.json") },
  { label: "Relayer",            file: join(__dirname, "relayer.json") },
];

// Also check program accounts
const programs = [
  { label: "acada_rewards program",      address: "Bge9kSTAw3n4G7nh6Pg1SY3STK8SaoA8PnVqY3HoSB3i" },
  { label: "acada_certificates program", address: "GQMhDEE5rNfbLdHSP9hJzVm9pbQN7o4QkAP6tGrsVXYi" },
];

console.log("\n🔍 Checking Solana devnet balances...\n");
console.log("=".repeat(60));

for (const w of wallets) {
  const kp = loadKeypair(w.file);
  if (!kp) {
    console.log(`❌ ${w.label.padEnd(25)} | Could not load keypair`);
    continue;
  }
  const address = kp.publicKey.toBase58();
  const balance = await getBalance(address);
  const flag = parseFloat(balance) > 0 ? "✅" : "⚠️ ";
  console.log(`${flag} ${w.label.padEnd(25)} | ${balance} SOL | ${address}`);
}

console.log("-".repeat(60));

for (const p of programs) {
  const info = await connection.getAccountInfo(new PublicKey(p.address)).catch(() => null);
  const deployed = info ? "✅ deployed" : "❌ not found";
  console.log(`   ${p.label.padEnd(25)} | ${deployed} | ${p.address}`);
}

console.log("=".repeat(60));
console.log("\nNeed SOL? Run: solana airdrop 2 <ADDRESS> --url devnet\n");
