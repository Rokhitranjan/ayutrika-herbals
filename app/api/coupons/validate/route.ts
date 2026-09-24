import { NextRequest, NextResponse } from "next/server";
import { getCoupons, validateCoupon } from "@/lib/data/store";
import { checkRateLimit } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(`coupon-validate-${ip}`, 20, 60000)) {
      return NextResponse.json(
        { valid: false, message: "Too many coupon attempts. Please wait a moment." },
        { status: 429 }
      );
    }

    const { code, subtotal } = await request.json();
    if (!code) {
      return NextResponse.json({ valid: false, message: "Coupon code is required" }, { status: 400 });
    }

    const validation = await validateCoupon(code, Number(subtotal) || 0);
    if (!validation.valid) {
      return NextResponse.json(validation);
    }

    const coupons = await getCoupons();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase().trim());

    return NextResponse.json({
      valid: true,
      discount: validation.discount,
      message: validation.message,
      coupon,
    });
  } catch (error) {
    return NextResponse.json({ valid: false, message: "Validation error" }, { status: 500 });
  }
}
