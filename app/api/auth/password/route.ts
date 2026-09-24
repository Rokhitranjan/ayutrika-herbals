import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession, comparePassword, hashPassword, validatePasswordStrength } from "@/lib/auth";
import { getUserById, updateUserPassword } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmNewPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All password fields are required." }, { status: 400 });
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
    }

    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      return NextResponse.json({ error: strength.message }, { status: 400 });
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const match = await comparePassword(currentPassword, user.passwordHash);
    if (!match) {
      return NextResponse.json({ error: "Current password does not match." }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    await updateUserPassword(session.userId, newHash);

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update password." },
      { status: 500 }
    );
  }
}
