import { NextRequest, NextResponse } from "next/server";
import { getIngredients, createIngredient } from "@/lib/data/store";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ingredients = await getIngredients();
    return NextResponse.json(ingredients);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.botanicalName) {
      return NextResponse.json({ error: "Name and botanical name required" }, { status: 400 });
    }

    const newIng = await createIngredient({
      name: body.name,
      botanicalName: body.botanicalName,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
      image: body.image || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
      description: body.description || "",
      traditionalUse: body.traditionalUse || "",
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
    });

    return NextResponse.json(newIng, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ingredient" }, { status: 500 });
  }
}
