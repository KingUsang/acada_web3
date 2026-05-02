import { NextRequest } from "next/server";
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth";

/**
 * POST /api/payments
 * Backward-compatible endpoint that now returns canonical web3 quote payload.
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization") ?? "";
    await verifyWeb3AuthToken(req);
    const body = await req.json();

    const quoteRes = await fetch(new URL("/api/web3/quote", req.url), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ course_id: body.course_id, rewardTokensToBurn: body.rewardTokensToBurn ?? 0 }),
    });

    const quote = await quoteRes.json();
    if (!quoteRes.ok) return Response.json(quote, { status: quoteRes.status });
    return Response.json({ data: quote }, { status: 201 });
  } catch {
    return unauthorized();
  }
}

export async function GET(req: NextRequest) {
  return Response.json({ message: "Use /api/web3/quote for canonical purchase pricing." }, { status: 200 });
}
