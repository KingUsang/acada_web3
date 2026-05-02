export type Web3Feature =
  | "invisible_wallet_auth"
  | "milestone_reward_claiming"
  | "discounted_course_purchase"
  | "gasless_relay"
  | "certificate_issuance";

export type Cluster = "devnet" | "testnet" | "mainnet" | "localnet";

export interface AcadaWeb3Config {
  cluster: Cluster;
  rewardTokenMint: string;
  usdcMint: string;
  treasuryWallet: string;
  oraclePublicKey: string;
  anchorProgramId: string;
  certificateIssuerPublicKey: string;
}

export interface RewardClaimPayload {
  userId: string;
  wallet: string;
  milestoneId: string;
  amount: string;
  nonce: string;
  expiresAt: string;
}

export interface PurchaseQuote {
  courseId: string;
  fullPrice: string;
  discountPerToken: string;
  rewardTokensToBurn: string;
  amountDue: string;
  expiresAt: string;
}

export interface RelayPolicy {
  allowedProgramIds: string[];
  requireUserSignature: boolean;
  enforceRelayerFeePayer: boolean;
}

export interface CertificatePayload {
  studentWallet: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  score: number;
  issuedAt: string;
}
