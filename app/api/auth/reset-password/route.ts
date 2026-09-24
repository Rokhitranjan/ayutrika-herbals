import { NextRequest, NextResponse } from "next/server";
import {
  verifyPasswordResetToken,
  consumePasswordResetToken,
  getUserByEmail,
  updateUserPassword,
} from "@/lib/data/store";
import { hashPassword, validatePasswordStrength } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, confirmPassword } = body;

    if (!token) {
      return NextResponse.json({ error: "Reset token is required." }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "New password is required." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      return NextResponse.json({ error: strength.message }, { status: 400 });
    }

    const verification = await verifyPasswordResetToken(token);
    if (!verification.valid || !verification.email) {
      return NextResponse.json(
        { error: "Invalid or expired password reset link." },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(verification.email);
    if (!user) {
      return NextResponse.json({ error: "Patron account not found." }, { status: 404 });
    }

    const newHash = await hashPassword(password);
    await updateUserPassword(user.id, newHash);
    await consumePasswordResetToken(token);

    return NextResponse.json({ message: "Password has been successfully updated. You may now sign in." });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reset password. Please request a new link." },
      { status: 500 }
    );
  }
}
