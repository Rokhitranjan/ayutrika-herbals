import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createPasswordResetToken } from "@/lib/data/store";
import { checkRateLimit } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    if (!checkRateLimit(`forgot-pass-${ip}`, 5, 60000)) {
      return NextResponse.json(
        { error: "Too many reset attempts. Please pause for a moment." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await getUserByEmail(normalizedEmail);

    let resetTokenString: string | undefined;

    if (user) {
      const resetRecord = await createPasswordResetToken(normalizedEmail);
      resetTokenString = resetRecord.token;
    }

    return NextResponse.json({
      message: "If an account is registered with this email, a sacred reset link has been dispatched.",
      // Include token in non-production local environment for seamless verification without live SMTP
      resetToken: process.env.NODE_ENV !== "production" ? resetTokenString : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not process password reset at this time." },
      { status: 500 }
    );
  }
}
