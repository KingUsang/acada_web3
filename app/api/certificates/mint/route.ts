import { NextRequest } from "next/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth"

/**
 * POST /api/certificates/mint
 *
 * Mints a Soulbound NFT certificate on Solana for a student who has met
 * all eligibility requirements (checked via /api/milestones/check).
 *
 * Flow:
 * 1. Verify student is eligible (milestone status = PENDING)
 * 2. Validate user has a solana_wallet_address
 * 3. Call the Anchor program CPI (or direct Metaplex minting) — stub here
 * 4. Update milestone to MINTED and save certificate record
 *
 * Body: { milestone_id }
 */
export async function POST(req: NextRequest) {
  try {
    const web3User = await verifyWeb3AuthToken(req)
    const { milestone_id } = await req.json()

    if (!milestone_id) return Response.json({ error: "milestone_id is required" }, { status: 400 })

    const supabase = createAdminClient()

    // 1. Fetch milestone and verify it belongs to the user and is PENDING
    const { data: milestone } = await supabase
      .from("milestones")
      .select("id, course_id, status, type, user_id")
      .eq("id", milestone_id)
      .eq("user_id", web3User.sub)
      .single()

    if (!milestone) return Response.json({ error: "Milestone not found" }, { status: 404 })
    if (milestone.type !== "COURSE_COMPLETE") {
      return Response.json(
        { error: "Only COURSE_COMPLETE milestones can be minted as certificates" },
        { status: 400 }
      )
    }
    if (milestone.status === "MINTED") {
      return Response.json({ error: "Certificate already minted" }, { status: 409 })
    }
    if (milestone.status !== "PENDING") {
      return Response.json({ error: "Not eligible for minting" }, { status: 403 })
    }

    // 2. Verify user has a Solana wallet
    const { data: user } = await supabase
      .from("users")
      .select("solana_wallet_address")
      .eq("id", web3User.sub)
      .single()

    if (!user?.solana_wallet_address) {
      return Response.json(
        { error: "No Solana wallet connected. Update your profile first." },
        { status: 400 }
      )
    }

    // 3. Fetch course info for NFT metadata
    const { data: course } = milestone.course_id
      ? await supabase
          .from("courses")
          .select("title, organization:organizations(name)")
          .eq("id", milestone.course_id)
          .single()
      : { data: null }

    // 4. PLACEHOLDER: Call Anchor/Metaplex mint logic
    //    This will be replaced with the actual Solana program call
    //    using the anchor IDL generated in /anchor + @solana/web3.js
    //
    //    const mintAddress = await mintSoulboundNFT({
    //      walletAddress: user.solana_wallet_address,
    //      courseName: course?.title,
    //      organizationName: course?.organization?.name,
    //      recipientId: web3User.sub,
    //    })
    //
    const mintAddress = `PLACEHOLDER_MINT_${Date.now()}` // Replace with real mint
    const ipfsUrl = `https://ipfs.io/ipfs/PLACEHOLDER_${Date.now()}` // Replace with real IPFS

    // 5. Save certificate record
    const { data: certificate, error: certError } = await supabase
      .from("certificates")
      .insert({
        user_id: web3User.sub,
        course_id: milestone.course_id ?? undefined,
        milestone_id,
        mint_address: mintAddress,
        ipfs_url: ipfsUrl,
      })
      .select()
      .single()

    if (certError) return Response.json({ error: certError.message }, { status: 500 })

    // 6. Update milestone status to MINTED
    await supabase
      .from("milestones")
      .update({ status: "MINTED", transaction_hash: mintAddress })
      .eq("id", milestone_id)

    return Response.json({ data: certificate }, { status: 201 })
  } catch {
    return unauthorized()
  }
}
