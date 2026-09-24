import { NextRequest, NextResponse } from "next/server";
import { archiveProduct, publishProduct, unpublishProduct } from "@/lib/data/store";
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

    const { action } = await request.json().catch(() => ({ action: "archive" }));

    let result;
    if (action === "publish") {
      result = await publishProduct(params.id);
    } else if (action === "unpublish" || action === "draft") {
      result = await unpublishProduct(params.id);
    } else {
      result = await archiveProduct(params.id);
    }

    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Product ${action || "archived"} successfully`,
      product: result,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product status" }, { status: 500 });
  }
}
