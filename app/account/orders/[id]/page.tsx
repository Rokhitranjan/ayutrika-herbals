import { getCustomerSession } from "@/lib/auth";
import { getCustomerOrder } from "@/lib/data/store";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  ShieldCheck,
  MapPin,
  CreditCard,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Order #${params.id} Details | Ayutrika Herbals`,
    description: "Track your formulation delivery status, inspect items, and print your order receipt.",
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await getCustomerSession();
  if (!session) {
    redirect(`/account/login?redirect=/account/orders/${params.id}`);
  }

  // Strict ownership verification: Customer A cannot see Customer B's order
  const order = await getCustomerOrder(params.id, session.userId, session.email);
  if (!order) {
    notFound();
  }

  const displayTotal = order.totalAmount !== undefined ? order.totalAmount : order.total;
  const shippingAmount = order.shippingAmount !== undefined ? order.shippingAmount : (order.shippingFee || 0);
  const taxAmount = order.taxAmount !== undefined ? order.taxAmount : (order.tax || 0);
  const address = order.shippingAddressSnapshot || order.shippingAddress;
  const orderStatus = order.orderStatus || order.status || "CONFIRMED";
  const paymentStatus = order.paymentStatus || "PENDING";

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/account/orders"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-sans mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>

        {/* Order Header Summary */}
        <div className="p-6 sm:p-8 bg-forest-900/60 border border-forest-800 rounded-luxury mb-8 shadow-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-1">
              AYURVEDIC APOTHECARY RECEIPT
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-wide">
              {order.orderNumber}
            </h1>
            <p className="text-xs text-ivory-400 font-sans mt-1">
              Ordered on {formatDate(order.createdAt)} • Payment Method: {order.paymentMethod}
            </p>
          </div>
          <div className="sm:text-right">
            <div className="flex sm:flex-col items-center sm:items-end gap-2">
              <span
                className={`inline-block px-3 py-1 text-[11px] uppercase font-bold tracking-wider rounded font-sans ${
                  paymentStatus.toUpperCase() === "PAID"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-amber-950 text-amber-300 border border-amber-800"
                }`}
              >
                Payment: {paymentStatus}
              </span>
              <span
                className={`inline-block px-3 py-1 text-[11px] uppercase font-bold tracking-wider rounded font-sans ${
                  orderStatus.toUpperCase() === "DELIVERED"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : orderStatus.toUpperCase() === "SHIPPED" || orderStatus.toUpperCase() === "OUT_FOR_DELIVERY"
                    ? "bg-gold-950 text-gold-300 border border-gold-800"
                    : "bg-forest-950 text-ivory-300 border border-forest-800"
                }`}
              >
                Status: {orderStatus}
              </span>
            </div>
            <span className="text-2xl font-bold font-sans text-gold-400 block mt-2">
              {formatPrice(displayTotal)}
            </span>
          </div>
        </div>

        {/* Order Timeline (Only show statuses that actually occurred) */}
        <div className="p-6 sm:p-8 bg-forest-900/40 border border-forest-800 rounded-luxury mb-8">
          <h2 className="font-serif text-xl uppercase tracking-wider text-ivory-100 mb-6 flex items-center justify-between">
            <span>Fulfillment Timeline</span>
            <Clock className="w-5 h-5 text-gold-400 stroke-1" />
          </h2>

          {order.timeline && order.timeline.length > 0 ? (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-forest-800">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-gold-500 border-2 border-forest-950 shadow-gold-glow" />
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="font-serif text-sm uppercase tracking-wide text-ivory-100 font-bold">
                      {event.status}
                    </span>
                    <span className="text-[11px] text-ivory-400 font-sans">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                  {event.note && (
                    <p className="text-xs text-ivory-300 font-sans mt-0.5">{event.note}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ivory-400 font-sans">
              Order confirmed and received by the apothecary preparation laboratory.
            </p>
          )}

          {order.trackingNumber && (
            <div className="mt-6 pt-4 border-t border-forest-850 flex items-center justify-between text-xs font-sans">
              <span className="text-ivory-400">Carrier Waybill:</span>
              <span className="font-mono text-gold-400 font-bold tracking-wider">
                {order.trackingNumber}
              </span>
            </div>
          )}
        </div>

        {/* Products Purchased (Snapshots) */}
        <div className="p-6 sm:p-8 bg-forest-900/40 border border-forest-800 rounded-luxury mb-8">
          <h2 className="font-serif text-xl uppercase tracking-wider text-ivory-100 mb-4 pb-3 border-b border-forest-850">
            Formulations in this Order ({order.items?.length || 0})
          </h2>

          <div className="divide-y divide-forest-850">
            {order.items?.map((it, idx) => (
              <div key={it.id || idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-forest-950 border border-forest-800 rounded-luxury relative overflow-hidden flex-shrink-0">
                    {it.productImage ? (
                      <Image
                        src={it.productImage}
                        alt={it.productNameSnapshot || it.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gold-400 absolute inset-0 m-auto stroke-1" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-sm text-ivory-100 font-medium">
                      {it.productNameSnapshot || it.productName}
                    </h3>
                    <p className="text-[11px] text-ivory-400 font-sans mt-0.5">
                      SKU: {it.skuSnapshot || "SKU-AYU"}
                    </p>
                    <p className="text-xs text-gold-400/90 font-sans mt-1">
                      {it.quantity} × {formatPrice(it.priceSnapshot || it.price)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-sans text-ivory-100">
                    {formatPrice(it.subtotal || it.total || it.price * it.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-6 pt-4 border-t border-forest-850 space-y-2 text-xs font-sans">
            <div className="flex justify-between text-ivory-400">
              <span>Subtotal:</span>
              <span className="text-ivory-200">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Botanical Discount ({order.couponCode || "COUPON"}):</span>
                <span>- {formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ivory-400">
              <span>Shipping & Insured Delivery:</span>
              <span className="text-ivory-200">
                {shippingAmount === 0 ? "COMPLIMENTARY" : formatPrice(shippingAmount)}
              </span>
            </div>
            {taxAmount > 0 && (
              <div className="flex justify-between text-ivory-400">
                <span>Estimated Tax:</span>
                <span className="text-ivory-200">{formatPrice(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-forest-800 text-sm font-bold">
              <span className="text-ivory-100">Grand Total:</span>
              <span className="text-gold-400 text-base">{formatPrice(displayTotal)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address & Payment Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Shipping Address Snapshot */}
          <div className="p-6 bg-forest-900/40 border border-forest-800 rounded-luxury">
            <h3 className="font-serif text-base uppercase tracking-wider text-ivory-100 mb-3 flex items-center space-x-2 pb-2 border-b border-forest-850">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>Delivery Address</span>
            </h3>
            {address ? (
              <div className="text-xs font-sans text-ivory-300 leading-relaxed space-y-1">
                <p className="font-bold text-ivory-100">{address.fullName}</p>
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} - {address.postalCode || address.pincode}
                </p>
                <p>{address.country || "India"}</p>
                <p className="pt-2 text-ivory-400">Contact: {address.phone}</p>
              </div>
            ) : (
              <p className="text-xs text-ivory-400 font-sans">Address details not available.</p>
            )}
          </div>

          {/* Payment Information */}
          <div className="p-6 bg-forest-900/40 border border-forest-800 rounded-luxury">
            <h3 className="font-serif text-base uppercase tracking-wider text-ivory-100 mb-3 flex items-center space-x-2 pb-2 border-b border-forest-850">
              <CreditCard className="w-4 h-4 text-gold-400" />
              <span>Payment Details</span>
            </h3>
            <div className="text-xs font-sans text-ivory-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-ivory-400">Method:</span>
                <span className="text-ivory-100 font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory-400">Status:</span>
                <span
                  className={`font-bold ${
                    paymentStatus.toUpperCase() === "PAID"
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {paymentStatus}
                </span>
              </div>
              {order.payment?.providerPaymentId && (
                <div className="flex justify-between">
                  <span className="text-ivory-400">Transaction ID:</span>
                  <span className="font-mono text-ivory-200 text-[11px] truncate max-w-[180px]">
                    {order.payment.providerPaymentId}
                  </span>
                </div>
              )}
              {order.payment?.signatureVerified && (
                <div className="flex items-center space-x-1 text-emerald-400 pt-2 border-t border-forest-850 font-semibold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Secure Razorpay Signature Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
