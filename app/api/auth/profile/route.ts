import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession, signToken } from "@/lib/auth";
import { updateUserProfile } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, email } = body;

    if (!firstName || !firstName.trim()) {
      return NextResponse.json({ error: "First name is required." }, { status: 400 });
    }

    const updatedUser = await updateUserProfile(session.userId, {
      firstName,
      lastName,
      phone,
      email,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Refresh JWT session cookie
    const token = signToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    });

    const response = NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
      message: "Patron profile updated successfully.",
    });

    response.cookies.set("ayutrika_customer_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update profile." },
      { status: 400 }
    );
  }
}
