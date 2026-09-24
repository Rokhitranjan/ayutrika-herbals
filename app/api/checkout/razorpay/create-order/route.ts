import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession, validateIndianPostalCode, checkRateLimit } from "@/lib/auth";
import { getProductById, validateCoupon } from "@/lib/data/store";
import { calculateAuthoritativeTotals } from "@/lib/pricing";
import { createServerRazorpayOrder } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Customer
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to continue." },
        { status: 401 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(`checkout-order-${session.userId}-${ip}`, 20, 60000)) {
      return NextResponse.json(
        { error: "Too many payment initialization requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      shippingAddress,
      shippingMethod = "standard",
      couponCode,
      items,
      customerNotes,
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
        { error: "All required shipping address fields must be provided." },
        { status: 400 }
      );
    }

    const cleanPostal = String(shippingAddress.postalCode).trim();
    if (!validateIndianPostalCode(cleanPostal)) {
      return NextResponse.json(
        { error: "Please enter a valid 6-digit Indian PIN code." },
        { status: 400 }
      );
    }

    const phoneClean = String(shippingAddress.phone).replace(/\D/g, "");
    if (phoneClean.length < 10 || phoneClean.length > 13) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit contact telephone number." },
        { status: 400 }
      );
    }

    // 3. Validate Cart & Inventory
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your shopping cart is empty." },
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
          { error: `Botanical item not found in our catalog: ${it.productName || prodId}` },
          { status: 400 }
        );
      }

      // Check stock
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

    // 4. Validate Coupon (Authoritative Server-side)
    let appliedCoupon: any = null;
    const preliminarySubtotal = verifiedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      const couponValidation = await validateCoupon(couponCode.trim(), preliminarySubtotal);
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

    // 6. Create Razorpay Server Order
    const amountInPaise = Math.round(totals.totalAmount * 100);
    const receipt = `rcpt_${session.userId.slice(-6)}_${Date.now()}`;

    const rzpOrder = await createServerRazorpayOrder({
      amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        userId: session.userId,
        customerEmail: session.email,
        itemCount: String(verifiedItems.length),
        shippingMethod,
      },
    });

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      "rzp_test_placeholder_key";

    return NextResponse.json({
      success: true,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId,
      authoritativeTotals: totals,
      customer: {
        name: session.name,
        email: session.email,
      },
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initialize secure payment session." },
      { status: 500 }
    );
  }
}
