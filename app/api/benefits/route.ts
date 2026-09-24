import { NextRequest, NextResponse } from "next/server";
import { getBenefits, createBenefit } from "@/lib/data/store";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const benefits = await getBenefits();
    return NextResponse.json(benefits);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch benefits" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Name and slug required" }, { status: 400 });
    }

    const newBen = await createBenefit({
      name: body.name,
      slug: body.slug,
      description: body.description || "",
      tag: body.tag || "",
      icon: body.icon || "",
    });

    return NextResponse.json(newBen, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create benefit" }, { status: 500 });
  }
}
