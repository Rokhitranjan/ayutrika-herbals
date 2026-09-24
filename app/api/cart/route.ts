import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/auth";
import {
  getCartSummary,
  addToCartStore,
  updateCartItemQuantityStore,
  removeFromCartStore,
  clearCartStore,
} from "@/lib/data/store";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function getOrGenerateSessionId(request: NextRequest): { sessionId: string; isNew: boolean } {
  const existing = request.cookies.get("ayutrika_cart_session_id")?.value;
  if (existing) {
    return { sessionId: existing, isNew: false };
  }
  return { sessionId: `guest-${crypto.randomUUID()}`, isNew: true };
}

function attachSessionCookie(response: NextResponse, sessionId: string, isNew: boolean) {
  if (isNew) {
    response.cookies.set("ayutrika_cart_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    const { sessionId, isNew } = getOrGenerateSessionId(request);
    const { searchParams } = new URL(request.url);
    const coupon = searchParams.get("coupon") || null;

    const summary = await getCartSummary(session?.userId, sessionId, coupon);
    const response = NextResponse.json(summary);
    attachSessionCookie(response, sessionId, isNew);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    const { sessionId, isNew } = getOrGenerateSessionId(request);

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const result = await addToCartStore({
      userId: session?.userId,
      sessionId,
      productId,
      quantity: Number(quantity),
    });

    const response = NextResponse.json(result, { status: result.success ? 200 : 400 });
    attachSessionCookie(response, sessionId, isNew);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to add product to cart" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    const { sessionId, isNew } = getOrGenerateSessionId(request);

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 });
    }

    const result = await updateCartItemQuantityStore({
      userId: session?.userId,
      sessionId,
      productId,
      quantity: Number(quantity),
    });

    const response = NextResponse.json(result, { status: result.success ? 200 : 400 });
    attachSessionCookie(response, sessionId, isNew);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    const { sessionId, isNew } = getOrGenerateSessionId(request);

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const clearAll = searchParams.get("clear") === "true";

    if (clearAll) {
      await clearCartStore(session?.userId, sessionId);
      const summary = await getCartSummary(session?.userId, sessionId);
      const response = NextResponse.json({ success: true, cartSummary: summary });
      attachSessionCookie(response, sessionId, isNew);
      return response;
    }

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const result = await removeFromCartStore({
      userId: session?.userId,
      sessionId,
      productId,
    });

    const response = NextResponse.json(result);
    attachSessionCookie(response, sessionId, isNew);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 });
  }
}
