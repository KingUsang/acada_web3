import { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";

export async function GET(_: NextRequest, { params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  const supabase = createAdminClient();
  const { data: cert } = await supabase.from("certificates").select("id, user_id, course_id, mint_address, created_at").eq("mint_address", mint).maybeSingle();

  if (!cert) return Response.json({ error: "Certificate not found" }, { status: 404 });

  return Response.json({
    name: "Acada Course Certificate",
    symbol: "ACADA-CERT",
    description: "Soulbound-style completion certificate",
    image: `${process.env.NEXT_PUBLIC_ACADA_APP_URL ?? "http://localhost:3000"}/og-image.png`,
    attributes: [
      { trait_type: "certificate_id", value: cert.id },
      { trait_type: "user_id", value: cert.user_id },
      { trait_type: "course_id", value: cert.course_id },
      { trait_type: "mint", value: cert.mint_address },
      { trait_type: "issued_at", value: cert.created_at },
    ],
  });
}
