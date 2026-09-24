import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/auth";
import { mergeCarts } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const guestSessionId = body.guestSessionId || request.cookies.get("ayutrika_cart_session_id")?.value;

    if (!guestSessionId) {
      return NextResponse.json({ message: "No guest cart to merge." });
    }

    const summary = await mergeCarts(guestSessionId, session.userId);
    return NextResponse.json({ success: true, cartSummary: summary });
  } catch (error) {
    return NextResponse.json({ error: "Failed to merge cart" }, { status: 500 });
  }
}
