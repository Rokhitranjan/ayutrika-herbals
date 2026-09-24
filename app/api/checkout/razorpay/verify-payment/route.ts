import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession, validateIndianPostalCode } from "@/lib/auth";
import {
  getProductById,
  validateCoupon,
  createOrder,
  getStoreOrders,
} from "@/lib/data/store";
import { calculateAuthoritativeTotals } from "@/lib/pricing";
import { verifyServerRazorpaySignature } from "@/lib/razorpay";
import { PaymentRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Customer
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required to finalize order." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
      shippingMethod = "standard",
      couponCode,
      items,
      customerNotes,
      sessionId,
    } = body;

    // 2. Validate Razorpay payment identifiers
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment authorization credentials." },
        { status: 400 }
      );
    }

    // 3. Cryptographic Signature Verification (HMAC SHA-256)
    const isSignatureValid = verifyServerRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isSignatureValid) {
      console.error(
        `Security Alert: Invalid Razorpay signature verification attempt for order ${razorpay_order_id} and payment ${razorpay_payment_id}`
      );
      return NextResponse.json(
        { error: "Invalid payment signature. Payment verification failed." },
        { status: 400 }
      );
    }

    // 4. Idempotency Check: Prevent duplicate order or double stock decrement
    const existingOrders = await getStoreOrders();
    const existingOrder = existingOrders.find(
      (o) =>
        o.paymentId === razorpay_payment_id ||
        o.payments?.some((p) => p.providerPaymentId === razorpay_payment_id)
    );

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        orderNumber: existingOrder.orderNumber,
        orderId: existingOrder.id,
        total: existingOrder.total,
        message: "Order already confirmed previously.",
      });
    }

    // 5. Authoritative validation of address
    if (
      !shippingAddress ||
      !shippingAddress.fullName?.trim() ||
      !shippingAddress.addressLine1?.trim() ||
      !shippingAddress.postalCode?.trim()
    ) {
      return NextResponse.json(
        { error: "Valid shipping address is required to process order." },
        { status: 400 }
      );
    }

    if (!validateIndianPostalCode(String(shippingAddress.postalCode).trim())) {
      return NextResponse.json(
        { error: "Invalid Indian Postal PIN code." },
        { status: 400 }
      );
    }

    // 6. Authoritative Re-check of items and stock
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items present for order processing." },
        { status: 400 }
      );
    }

    const verifiedItems: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      productImage?: string;
      sku?: string;
    }[] = [];

    for (const it of items) {
      const prodId = it.productId || it.product?.id || it.id;
      const requestedQty = Math.max(1, parseInt(it.quantity, 10) || 1);
      const product = await getProductById(prodId);

      if (!product) {
        return NextResponse.json(
          { error: `Botanical formulation ${it.productName || prodId} is not available.` },
          { status: 400 }
        );
      }

      if (product.stock < requestedQty) {
        return NextResponse.json(
          { error: "Some items in your cart are no longer available in the requested quantity." },
          { status: 400 }
        );
      }

      verifiedItems.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: requestedQty,
        productImage: product.images?.[0] || product.thumbnail,
        sku: product.sku,
      });
    }

    // 7. Authoritative Coupon Verification
    let appliedCoupon: any = null;
    const subtotal = verifiedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      const couponValidation = await validateCoupon(couponCode.trim(), subtotal);
      if (couponValidation.valid) {
        appliedCoupon = {
          code: couponCode.trim().toUpperCase(),
          discountAmount: couponValidation.discount,
        };
      }
    }

    // 8. Calculate Final Authoritative Totals
    const totals = calculateAuthoritativeTotals({
      items: verifiedItems,
      shippingMethod: shippingMethod === "express" ? "express" : "standard",
      coupon: appliedCoupon,
    });

    // 9. Payment Record
    const paymentRecord: PaymentRecord = {
      id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: "", // linked in createOrder
      provider: "razorpay",
      providerOrderId: razorpay_order_id,
      providerPaymentId: razorpay_payment_id,
      providerSignature: razorpay_signature,
      amount: totals.totalAmount,
      currency: "INR",
      status: "PAID",
      signatureVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 10. Create Order in Store with Snapshots and Stock Decrement
    const order = await createOrder({
      userId: session.userId,
      customerName: session.name || shippingAddress.fullName,
      customerEmail: session.email,
      customerPhone: session.phone || shippingAddress.phone,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone?.trim() || session.phone || "",
        addressLine1: shippingAddress.addressLine1.trim(),
        addressLine2: shippingAddress.addressLine2?.trim() || "",
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country?.trim() || "India",
      },
      items: verifiedItems.map((it, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        orderId: "",
        productId: it.productId,
        productName: it.productName,
        productNameSnapshot: it.productName,
        skuSnapshot: it.sku || "SKU-AYU",
        priceSnapshot: it.price,
        productImage: it.productImage,
        price: it.price,
        quantity: it.quantity,
        subtotal: it.price * it.quantity,
        total: it.price * it.quantity,
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shippingAmount: totals.shippingAmount,
      shippingFee: totals.shippingAmount,
      taxAmount: totals.taxAmount,
      tax: totals.taxAmount,
      totalAmount: totals.totalAmount,
      total: totals.totalAmount,
      currency: "INR",
      couponCode: appliedCoupon?.code,
      paymentMethod: "Razorpay (Online Payment)",
      paymentStatus: "PAID",
      status: "CONFIRMED",
      orderStatus: "CONFIRMED",
      paymentId: razorpay_payment_id,
      payment: paymentRecord,
      payments: [paymentRecord],
      notes: customerNotes || "",
      sessionId: sessionId || undefined,
      timeline: [
        {
          status: "CONFIRMED",
          timestamp: new Date().toISOString(),
          note: `Payment verified via Razorpay ID: ${razorpay_payment_id}. Order confirmed.`,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
      order,
    });
  } catch (error: any) {
    console.error("Payment verification failure:", error);
    return NextResponse.json(
      { error: error?.message || "Payment verification failed." },
      { status: 500 }
    );
  }
}
