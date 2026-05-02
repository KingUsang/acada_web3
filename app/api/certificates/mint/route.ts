import { NextRequest } from "next/server";
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization") ?? "";
    await verifyWeb3AuthToken(req);
    const body = await req.json();

    const issueRes = await fetch(new URL("/api/web3/certificates/issue", req.url), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ milestone_id: body.milestone_id }),
    });

    const result = await issueRes.json();
    return Response.json(result, { status: issueRes.status });
  } catch {
    return unauthorized();
  }
}
