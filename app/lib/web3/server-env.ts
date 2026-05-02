import { Keypair, PublicKey } from "@solana/web3.js";

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} environment variable.`);
  return value;
}

function parseSecretKey(name: string) {
  const parsed = JSON.parse(required(name)) as number[];
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(`${name} must be a JSON array of secret key bytes.`);
  }
  return Uint8Array.from(parsed);
}

export const rpcUrl = process.env.ACADA_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

export function getRelayerKeypair() {
  return Keypair.fromSecretKey(parseSecretKey("ACADA_RELAYER_SECRET_KEY"));
}

export function getOracleKeypair() {
  return Keypair.fromSecretKey(parseSecretKey("ACADA_ORACLE_SECRET_KEY"));
}

export function getCertificateIssuerKeypair() {
  const configured = process.env.ACADA_CERTIFICATE_SECRET_KEY;
  return configured
    ? Keypair.fromSecretKey(parseSecretKey("ACADA_CERTIFICATE_SECRET_KEY"))
    : getRelayerKeypair();
}

export function getTreasuryOwner() {
  const value = process.env.NEXT_PUBLIC_ACADA_TREASURY_OWNER;
  return value ? new PublicKey(value) : getRelayerKeypair().publicKey;
}

export function getCoursePriceUsdc() {
  return Number(process.env.ACADA_COURSE_PRICE_USDC ?? 25);
}

export function getDiscountPerTokenUsdc() {
  return Number(process.env.ACADA_DISCOUNT_PER_TOKEN_USDC ?? 0.1);
}

export function getCertificatesProgramId() {
  return process.env.NEXT_PUBLIC_ACADA_CERTIFICATES_PROGRAM_ID ?? "CeRTQv4uLrRKVNgwWjQjru4u1n8XQ8fQWvJ3U1F9uA11";
}
