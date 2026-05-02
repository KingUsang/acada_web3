import { NextRequest } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { verifyWeb3AuthToken, unauthorized } from "@/app/lib/auth/verify-web3auth";
import { getCoursePriceUsdc, getDiscountPerTokenUsdc } from "@/app/lib/web3/server-env";

export async function POST(req: NextRequest) {
  try {
    await verifyWeb3AuthToken(req);
    const { course_id, rewardTokensToBurn } = await req.json();
    if (!course_id) return Response.json({ error: "course_id is required" }, { status: 400 });

    const supabase = createAdminClient();
    const { data: course } = await supabase.from("courses").select("id, title, price_usdc").eq("id", course_id).maybeSingle();
    if (!course) return Response.json({ error: "Course not found" }, { status: 404 });

    const burn = Math.max(0, Math.floor(Number(rewardTokensToBurn ?? 0)));
    const fullPrice = Number(course.price_usdc ?? getCoursePriceUsdc());
    const discountPerToken = getDiscountPerTokenUsdc();
    const discountValue = Math.min(fullPrice, burn * discountPerToken);
    const amountDue = Number((fullPrice - discountValue).toFixed(6));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    console.info("purchase.quote", { course_id, burn, amountDue });

    return Response.json({
      courseId: course.id,
      courseName: course.title,
      rewardTokensToBurn: burn,
      discountPerToken,
      fullPrice,
      amountDue,
      expiresAt,
    });
  } catch {
    return unauthorized();
  }
}
