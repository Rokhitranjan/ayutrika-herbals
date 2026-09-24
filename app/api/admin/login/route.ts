import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, signToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const isValid = await verifyAdminCredentials(email, password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    const token = signToken({
      userId: "admin-master",
      email: email.trim().toLowerCase(),
      name: "Ayutrika Administrator",
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully",
      user: { email, name: "Ayutrika Administrator", role: "admin" },
    });

    // Set secure HTTP-only cookie
    response.cookies.set("ayutrika_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
