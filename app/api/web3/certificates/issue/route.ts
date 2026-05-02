import { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth";
import { create, mplCore } from "@metaplex-foundation/mpl-core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, generateSigner, signerIdentity } from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair, fromWeb3JsPublicKey, toWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getCertificateIssuerKeypair, rpcUrl } from "@/app/lib/web3/server-env";

const MIN_ISSUER_BALANCE_SOL = 0.01;
const ENABLE_CERT_FALLBACK_MOCK = process.env.ACADA_ENABLE_CERT_FALLBACK_MOCK === "true";

export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req);
    const { milestone_id } = await req.json();
    if (!milestone_id) return Response.json({ error: "milestone_id is required" }, { status: 400 });

    const supabase = createAdminClient();
    const { data: milestone } = await supabase
      .from("milestones")
      .select("id, course_id, status, type")
      .eq("id", milestone_id)
      .eq("user_id", web3User.sub)
      .single();
    if (!milestone) return Response.json({ error: "Milestone not found" }, { status: 404 });

    const { data: user } = await supabase
      .from("users")
      .select("solana_wallet_address, full_name")
      .eq("id", web3User.sub)
      .single();
    if (!user?.solana_wallet_address) return Response.json({ error: "No Solana wallet on user profile" }, { status: 400 });

    const { data: course } = milestone.course_id
      ? await supabase.from("courses").select("id, title").eq("id", milestone.course_id).single()
      : { data: null };
    if (!course) return Response.json({ error: "Course not found for milestone" }, { status: 404 });

    const issuer = getCertificateIssuerKeypair();
    const connection = new Connection(rpcUrl, "confirmed");
    const issuerBalance = await connection.getBalance(issuer.publicKey);
    const enoughFunds = issuerBalance >= MIN_ISSUER_BALANCE_SOL * LAMPORTS_PER_SOL;

    if (!enoughFunds && !ENABLE_CERT_FALLBACK_MOCK) {
      return Response.json(
        { error: `Certificate issuer wallet underfunded. Need at least ${MIN_ISSUER_BALANCE_SOL} SOL.` },
        { status: 503 },
      );
    }

    let mintAddress = `MOCK_MINT_${Date.now()}`;
    const baseUrl = process.env.ACADA_APP_URL ?? process.env.NEXT_PUBLIC_ACADA_APP_URL ?? new URL(req.url).origin;
    let metadataUrl = new URL(`/api/web3/certificates/metadata/${mintAddress}`, baseUrl).toString();

    if (enoughFunds) {
      const umi = createUmi(rpcUrl).use(mplCore());
      const issuerSigner = createSignerFromKeypair(umi, fromWeb3JsKeypair(issuer));
      umi.use(signerIdentity(issuerSigner, true));
      const assetSigner = generateSigner(umi);
      mintAddress = toWeb3JsPublicKey(assetSigner.publicKey).toBase58();
      metadataUrl = new URL(`/api/web3/certificates/metadata/${mintAddress}`, baseUrl).toString();
      await create(umi, {
        asset: assetSigner,
        name: `${course.title} Certificate`,
        uri: metadataUrl,
        owner: fromWeb3JsPublicKey(new PublicKey(user.solana_wallet_address)),
        plugins: [{ type: "PermanentFreezeDelegate", frozen: true, authority: { type: "None" } }],
      }).sendAndConfirm(umi);
    }

    const { data: cert, error: certError } = await supabase
      .from("certificates")
      .insert({
        user_id: web3User.sub,
        course_id: milestone.course_id,
        milestone_id: milestone.id,
        mint_address: mintAddress,
        ipfs_url: metadataUrl,
      })
      .select()
      .single();
    if (certError) return Response.json({ error: certError.message }, { status: 500 });

    await supabase.from("milestones").update({ status: "MINTED", transaction_hash: mintAddress }).eq("id", milestone.id);

    console.info("certificate.issue", {
      userId: web3User.sub,
      milestone_id: milestone.id,
      mint: mintAddress,
      mode: enoughFunds ? "on-chain" : "mock",
    });
    return Response.json({ ...cert, mode: enoughFunds ? "on-chain" : "mock" }, { status: 201 });
  } catch {
    return unauthorized();
  }
}
