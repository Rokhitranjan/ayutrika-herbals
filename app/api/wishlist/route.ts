import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/auth";
import {
  getWishlistProducts,
  addToWishlistStore,
  removeFromWishlistStore,
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
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    const { sessionId, isNew } = getOrGenerateSessionId(request);

    const wishlist = await getWishlistProducts(session?.userId, sessionId);
    const response = NextResponse.json(wishlist);
    attachSessionCookie(response, sessionId, isNew);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    const { sessionId, isNew } = getOrGenerateSessionId(request);

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updated = await addToWishlistStore(session?.userId, sessionId, productId);
    const response = NextResponse.json(updated);
    attachSessionCookie(response, sessionId, isNew);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    const { sessionId, isNew } = getOrGenerateSessionId(request);

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updated = await removeFromWishlistStore(session?.userId, sessionId, productId);
    const response = NextResponse.json(updated);
    attachSessionCookie(response, sessionId, isNew);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove item from wishlist" }, { status: 500 });
  }
}
