import { NextRequest, NextResponse } from "next/server";
import { getOrders, getUserOrders, createOrder, validateCoupon } from "@/lib/data/store";
import { generateOrderNumber } from "@/lib/utils";
import { getAdminSession, getCustomerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Check if Admin
    const adminSession = await getAdminSession();
    if (adminSession) {
      const orders = await getOrders();
      return NextResponse.json(orders);
    }

    // 2. Check if Customer
    const customerSession = await getCustomerSession();
    if (customerSession) {
      const orders = await getUserOrders(customerSession.userId, customerSession.email);
      return NextResponse.json(orders);
    }

    // 3. Unauthorized if no valid session
    return NextResponse.json(
      { error: "Authentication required to view orders." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      couponCode,
      paymentMethod,
      notes,
    } = body;

    if (!customerName || !customerEmail || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required order information" }, { status: 400 });
    }

    const subtotal = items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0);

    // Validate coupon discount if supplied
    let discount = 0;
    if (couponCode) {
      const validation = await validateCoupon(couponCode, subtotal);
      if (validation.valid) {
        discount = validation.discount;
      }
    }

    const shippingFee = subtotal >= 1000 ? 0 : 99;
    const tax = Math.round((subtotal - discount) * 0.05); // 5% GST on botanical preparations
    const total = Math.max(0, subtotal - discount + shippingFee + tax);
    const orderNumber = generateOrderNumber();

    const order = await createOrder({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone: customerPhone || shippingAddress.phone || "",
      shippingAddress,
      items: items.map((it: any, idx: number) => ({
        id: `item-${Date.now()}-${idx}`,
        productId: it.productId || it.product?.id,
        productName: it.productName || it.product?.name,
        productImage: it.productImage || it.product?.images?.[0] || it.product?.thumbnail,
        price: Number(it.price || it.product?.price),
        quantity: Number(it.quantity),
        total: Number((it.price || it.product?.price) * it.quantity),
      })),
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      couponCode: couponCode || undefined,
      paymentMethod: paymentMethod || "Razorpay (Online Payment)",
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      paymentId: `pay_mock_${Date.now()}`,
      orderStatus: "Confirmed",
      trackingNumber: `DEL-AYU-${Math.floor(100000 + Math.random() * 900000)}`,
      trackingUrl: "https://track.delhivery.com",
      notes: notes || "",
      timeline: [
        {
          status: "Confirmed",
          timestamp: new Date().toISOString(),
          note: "Order confirmed and verified by Ayutrika Apothecary",
        },
      ],
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
