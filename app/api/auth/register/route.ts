import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/data/store";
import { signToken, validatePasswordStrength, checkRateLimit } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    if (!checkRateLimit(`register-${ip}`, 10, 60000)) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please pause for a moment." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, password, confirmPassword } = body;

    if (!firstName || !firstName.trim()) {
      return NextResponse.json({ error: "First name is required." }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      return NextResponse.json({ error: strength.message }, { status: 400 });
    }

    const newUser = await createUser({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: "customer",
    });

    const response = NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
        },
        message: "Patron account created successfully.",
      },
      { status: 201 }
    );

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
      { error: error?.message || "Registration could not be completed." },
      { status: 400 }
    );
  }
}
