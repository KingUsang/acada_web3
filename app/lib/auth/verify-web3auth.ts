import { NextRequest } from "next/server"
import * as jose from "jose"

const WEB3AUTH_JWKS_URL = "https://api-auth.web3auth.io/jwks"

export interface Web3AuthUser {
  sub: string       // Unique user ID from Web3Auth
  email?: string
  name?: string
  profileImage?: string
  wallets?: Array<{ type: string; public_key: string }>
}

/**
 * Verifies the Web3Auth ID token from the Authorization header.
 * Returns the decoded payload or throws on failure.
 */
export async function verifyWeb3AuthToken(req: NextRequest): Promise<Web3AuthUser> {
  const authHeader = req.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header")
  }

  const token = authHeader.split(" ")[1]

  const JWKS = jose.createRemoteJWKSet(new URL(WEB3AUTH_JWKS_URL))

  const { payload } = await jose.jwtVerify(token, JWKS, {
    algorithms: ["ES256"],
  })

  return payload as unknown as Web3AuthUser
}

/**
 * Helper to return a 401 Unauthorized response.
 */
export function unauthorized(message = "Unauthorized") {
  return Response.json({ error: message }, { status: 401 })
}
