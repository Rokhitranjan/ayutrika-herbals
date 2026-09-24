import { NextRequest, NextResponse } from "next/server";
import { duplicateProduct } from "@/lib/data/store";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const duplicated = await duplicateProduct(params.id);
    if (!duplicated) {
      return NextResponse.json({ error: "Product not found to duplicate" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product duplicated successfully as Draft",
      product: duplicated,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to duplicate product" }, { status: 500 });
  }
}
