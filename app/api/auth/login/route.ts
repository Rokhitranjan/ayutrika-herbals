import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, mergeCarts, mergeWishlists } from "@/lib/data/store";
import { comparePassword, signToken, checkRateLimit } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    if (!checkRateLimit(`login-${ip}`, 15, 60000)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, guestSessionId } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Merge guest cart and wishlist if guest session provided
    const sessionId = guestSessionId || request.cookies.get("ayutrika_cart_session_id")?.value;
    if (sessionId) {
      await mergeCarts(sessionId, user.id);
      await mergeWishlists(sessionId, user.id);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
      message: "Welcome back to Ayutrika Herbals.",
    });

    response.cookies.set("ayutrika_customer_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Account temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
