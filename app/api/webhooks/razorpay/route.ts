import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { getOrders, updateOrderPaymentStatus, updateOrderStatus } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header." },
        { status: 400 }
      );
    }

    // 1. Verify Webhook Signature Authenticity
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("Security Alert: Invalid Razorpay webhook signature received.");
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const paymentEntity = event.payload?.payment?.entity;
    const orderEntity = event.payload?.order?.entity;

    const providerPaymentId = paymentEntity?.id;
    const providerOrderId = paymentEntity?.order_id || orderEntity?.id;

    // 2. Process Events Idempotently
    if (eventType === "payment.captured" || eventType === "order.paid") {
      if (providerPaymentId || providerOrderId) {
        const orders = await getOrders();
        const existingOrder = orders.find(
          (o) =>
            (providerPaymentId && (o.paymentId === providerPaymentId || o.payments?.some((p) => p.providerPaymentId === providerPaymentId))) ||
            (providerOrderId && (o.payments?.some((p) => p.providerOrderId === providerOrderId)))
        );

        if (existingOrder) {
          // Idempotency: If already paid, do not re-process or re-decrement
          if (existingOrder.paymentStatus === "PAID") {
            return NextResponse.json({
              received: true,
              message: "Payment event already processed idempotently.",
            });
          }

          await updateOrderPaymentStatus(existingOrder.id, "PAID", {
            providerPaymentId,
            status: "PAID",
            signatureVerified: true,
          });

          await updateOrderStatus(
            existingOrder.id,
            "CONFIRMED",
            existingOrder.trackingNumber,
            `Payment marked as captured by Razorpay webhook (${providerPaymentId})`
          );
        }
      }
    } else if (eventType === "payment.failed") {
      if (providerPaymentId || providerOrderId) {
        const orders = await getOrders();
        const existingOrder = orders.find(
          (o) =>
            (providerPaymentId && o.paymentId === providerPaymentId) ||
            (providerOrderId && o.payments?.some((p) => p.providerOrderId === providerOrderId))
        );

        if (existingOrder && existingOrder.paymentStatus !== "PAID") {
          await updateOrderPaymentStatus(existingOrder.id, "FAILED", {
            providerPaymentId,
            status: "FAILED",
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Razorpay webhook processing error:", error);
    return NextResponse.json(
      { error: error?.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
