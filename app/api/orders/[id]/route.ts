import { NextRequest, NextResponse } from "next/server";
import { getOrderById, getOrderByNumber, getCustomerOrder, updateOrderStatus } from "@/lib/data/store";
import { getAdminSession, getCustomerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Check if Admin
    const adminSession = await getAdminSession();
    if (adminSession) {
      let order = await getOrderById(params.id);
      if (!order) {
        order = await getOrderByNumber(params.id);
      }
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    // 2. Check if Customer
    const customerSession = await getCustomerSession();
    if (customerSession) {
      const order = await getCustomerOrder(params.id, customerSession.userId, customerSession.email);
      if (!order) {
        return NextResponse.json({ error: "Order not found or unauthorized" }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    // 3. Unauthorized
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const newStatus = body.status || body.orderStatus;
    const { trackingNumber, note, paymentStatus } = body;

    if (!newStatus && !paymentStatus) {
      return NextResponse.json({ error: "Status or payment status is required" }, { status: 400 });
    }

    let updated: any = null;
    if (newStatus) {
      updated = await updateOrderStatus(params.id, newStatus, trackingNumber, note);
    }

    if (paymentStatus) {
      const { updateOrderPaymentStatus } = await import("@/lib/data/store");
      updated = await updateOrderPaymentStatus(params.id, paymentStatus);
    }

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export const PUT = PATCH;
