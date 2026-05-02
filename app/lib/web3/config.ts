import type { AcadaWeb3Config, RelayPolicy } from "./acada-stack";

export const acadaWeb3Config: AcadaWeb3Config = {
  cluster: "devnet",
  rewardTokenMint: process.env.REWARD_TOKEN_MINT ?? "",
  usdcMint: process.env.USDC_MINT ?? "",
  treasuryWallet: process.env.TREASURY_WALLET ?? "",
  oraclePublicKey: process.env.ORACLE_PUBLIC_KEY ?? "",
  anchorProgramId: process.env.ANCHOR_PROGRAM_ID ?? "",
  certificateIssuerPublicKey: process.env.CERTIFICATE_ISSUER_PUBLIC_KEY ?? "",
};

export const relayPolicy: RelayPolicy = {
  allowedProgramIds: [
    process.env.ANCHOR_PROGRAM_ID ?? "",
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
    "Ed25519SigVerify111111111111111111111111111",
  ].filter(Boolean),
  requireUserSignature: true,
  enforceRelayerFeePayer: true,
};
