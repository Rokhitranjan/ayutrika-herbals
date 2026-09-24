import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession, validateIndianPostalCode, checkRateLimit } from "@/lib/auth";
import { getProductById, validateCoupon, createOrder } from "@/lib/data/store";
import { calculateAuthoritativeTotals } from "@/lib/pricing";
import { PaymentRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Customer
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required to place an order. Please sign in." },
        { status: 401 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(`checkout-place-${session.userId}-${ip}`, 20, 60000)) {
      return NextResponse.json(
        { error: "Too many order requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      shippingAddress,
      shippingMethod = "standard",
      couponCode,
      items,
      paymentMethod = "Cash on Delivery",
      customerNotes,
      sessionId,
    } = body;

    // 2. Validate Shipping Address
    if (
      !shippingAddress ||
      !shippingAddress.fullName?.trim() ||
      !shippingAddress.phone?.trim() ||
      !shippingAddress.addressLine1?.trim() ||
      !shippingAddress.city?.trim() ||
      !shippingAddress.state?.trim() ||
      !shippingAddress.postalCode?.trim()
    ) {
      return NextResponse.json(
        { error: "Please complete all required shipping address fields." },
        { status: 400 }
      );
    }

    const postalCode = String(shippingAddress.postalCode).trim();
    if (!validateIndianPostalCode(postalCode)) {
      return NextResponse.json(
        { error: "Please enter a valid 6-digit Indian PIN code." },
        { status: 400 }
      );
    }

    // 3. Validate Cart & Inventory
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your shopping bag is empty." },
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

    // 4. Validate Coupon Authoritatively
    let appliedCoupon: any = null;
    const subtotal = verifiedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      const couponValidation = await validateCoupon(couponCode.trim(), subtotal);
      if (couponValidation.valid) {
        appliedCoupon = {
          code: couponCode.trim().toUpperCase(),
          discountAmount: couponValidation.discount,
        };
      } else {
        return NextResponse.json(
          { error: couponValidation.message || "Invalid coupon code." },
          { status: 400 }
        );
      }
    }

    // 5. Authoritative Pricing Calculation
    const totals = calculateAuthoritativeTotals({
      items: verifiedItems,
      shippingMethod: shippingMethod === "express" ? "express" : "standard",
      coupon: appliedCoupon,
    });

    const isCod = paymentMethod.toLowerCase().includes("cod") || paymentMethod.toLowerCase().includes("cash");
    const paymentStatus = isCod ? "PENDING" : "PENDING";
    const paymentId = `pay_offline_${Date.now()}`;

    const paymentRecord: PaymentRecord = {
      id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: "",
      provider: isCod ? "cod" : "manual",
      providerOrderId: `order_offline_${Date.now()}`,
      providerPaymentId: paymentId,
      amount: totals.totalAmount,
      currency: "INR",
      status: paymentStatus,
      signatureVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 6. Create Order with Snapshots & Safe Inventory Decrement
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
      paymentMethod: isCod ? "Cash on Delivery" : paymentMethod,
      paymentStatus,
      status: "CONFIRMED",
      orderStatus: "CONFIRMED",
      paymentId,
      payment: paymentRecord,
      payments: [paymentRecord],
      notes: customerNotes || "",
      sessionId: sessionId || undefined,
      timeline: [
        {
          status: "CONFIRMED",
          timestamp: new Date().toISOString(),
          note: `Order registered via ${isCod ? "Cash on Delivery" : paymentMethod}. Payment due upon delivery.`,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
      order,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Order placement failure:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to finalize order." },
      { status: 500 }
    );
  }
}
