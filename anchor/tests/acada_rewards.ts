import { expect } from "chai";
import { createHash } from "crypto";
import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey("2mdcYsv1sUeVByuiUQMqcEuBu8qdpmgVzAntppXo8MWG");
const PREFIX = "ACADA_REWARD_V1";

function discriminator(name: string) {
  return createHash("sha256").update(`global:${name}`).digest().subarray(0, 8);
}

function u64(value: bigint) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(value);
  return buffer;
}

function i64(value: bigint) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64LE(value);
  return buffer;
}

function buildRewardMessage(student: PublicKey, milestoneId: bigint, amount: bigint, claimId: bigint, expiresAt: bigint) {
  return Buffer.concat([
    Buffer.from(PREFIX, "utf8"),
    student.toBuffer(),
    u64(milestoneId),
    u64(amount),
    u64(claimId),
    i64(expiresAt),
    PROGRAM_ID.toBuffer(),
  ]);
}

describe("acada_rewards helpers", () => {
  it("produces a stable reward message layout", () => {
    const student = new PublicKey("11111111111111111111111111111111");
    const message = buildRewardMessage(student, 1001n, 50n, 909n, 1_900_000_000n);

    expect(message.subarray(0, PREFIX.length).toString("utf8")).to.equal(PREFIX);
    expect(message.length).to.equal(PREFIX.length + 32 + 8 + 8 + 8 + 8 + 32);
  });

  it("keeps instruction discriminators stable for client builders", () => {
    expect(discriminator("reward_student").length).to.equal(8);
    expect(discriminator("purchase_course").length).to.equal(8);
    expect(discriminator("initialize").length).to.equal(8);
  });
});
