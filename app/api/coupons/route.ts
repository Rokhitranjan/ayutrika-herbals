import { NextRequest, NextResponse } from "next/server";
import { getCoupons, createCoupon, deleteCoupon } from "@/lib/data/store";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const coupons = await getCoupons();
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.code || !body.discountValue) {
      return NextResponse.json({ error: "Code and discountValue are required" }, { status: 400 });
    }

    const coupon = await createCoupon({
      code: body.code.toUpperCase().trim(),
      discountType: body.discountType || "percentage",
      discountValue: Number(body.discountValue),
      minOrderValue: body.minOrderValue ? Number(body.minOrderValue) : 0,
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      expiresAt: body.expiresAt || undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const success = await deleteCoupon(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
