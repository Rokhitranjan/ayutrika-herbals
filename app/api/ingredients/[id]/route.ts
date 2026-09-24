import { NextRequest, NextResponse } from "next/server";
import { updateIngredient, deleteIngredient } from "@/lib/data/store";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updated = await updateIngredient(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ingredient" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await deleteIngredient(params.id);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Cannot delete ingredient" }, { status: 400 });
    }

    return NextResponse.json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete ingredient" }, { status: 500 });
  }
}
