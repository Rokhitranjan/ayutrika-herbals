"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Truck,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  MapPin,
  User,
  Calendar,
  ExternalLink,
  Edit,
  Save,
} from "lucide-react";

interface Props {
  initialOrder: Order;
}

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
  "REFUNDED",
];

export default function AdminOrderDetailClient({ initialOrder }: Props) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.orderStatus || order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [statusNote, setStatusNote] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Controlled payment status update
  const [codPaymentConfirm, setCodPaymentConfirm] = useState(false);

  const handleStatusSubmit = async () => {
    setUpdating(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: newStatus,
          trackingNumber,
          note: statusNote || `Status updated to ${newStatus} by Administrator`,
        }),
      });

      const updated = await res.json();
      if (res.ok && updated) {
        setOrder(updated);
        setConfirmModalOpen(false);
        setMessage({ text: `Order status successfully updated to ${newStatus}.`, type: "success" });
      } else {
        setMessage({ text: updated.error || "Failed to update order status.", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error occurred while updating status.", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const handleControlledPaymentUpdate = async () => {
    if (!codPaymentConfirm) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: "PAID",
          note: "COD Cash payment explicitly reconciled and verified by Administrator upon collection.",
        }),
      });
      const updated = await res.json();
      if (res.ok && updated) {
        setOrder(updated);
        setCodPaymentConfirm(false);
        setMessage({ text: "Payment status recorded as PAID with audit log.", type: "success" });
      } else {
        setMessage({ text: updated.error || "Failed to update payment status.", type: "error" });
      }
    } catch {
      setMessage({ text: "Failed to record payment verification.", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order Management</span>
        </Link>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setConfirmModalOpen(true)}
            className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-widest font-sans rounded-luxury transition-all flex items-center space-x-2 shadow-gold-glow"
          >
            <Edit className="w-4 h-4" />
            <span>Update Fulfillment Status</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-luxury text-xs font-sans border ${
            message.type === "success"
              ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
              : "bg-red-950/60 border-red-800 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-forest-900/50 border border-forest-800 rounded-luxury flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-luxury">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold">
              AUTHORITATIVE ORDER RECORD
            </span>
            <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider rounded bg-forest-950 border border-forest-750 text-ivory-300">
              ID: {order.id}
            </span>
          </div>
          <h1 className="font-serif text-3xl text-ivory-100 uppercase tracking-wide">
            {order.orderNumber}
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-1 flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>Placed on {formatDate(order.createdAt)}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-forest-950 border border-forest-800 px-4 py-2 rounded-luxury text-center">
            <span className="text-[10px] uppercase tracking-wider text-ivory-400 block font-sans">
              Fulfillment
            </span>
            <span className="text-xs font-bold font-sans text-gold-400 uppercase tracking-wider">
              {order.orderStatus || order.status}
            </span>
          </div>
          <div className="bg-forest-950 border border-forest-800 px-4 py-2 rounded-luxury text-center">
            <span className="text-[10px] uppercase tracking-wider text-ivory-400 block font-sans">
              Payment Status
            </span>
            <span
              className={`text-xs font-bold font-sans uppercase tracking-wider ${
                order.paymentStatus === "PAID" || order.paymentStatus === "Paid"
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
          <div className="bg-forest-950 border border-forest-800 px-4 py-2 rounded-luxury text-center">
            <span className="text-[10px] uppercase tracking-wider text-ivory-400 block font-sans">
              Grand Total
            </span>
            <span className="text-sm font-bold font-sans text-gold-400">
              {formatPrice(order.totalAmount || order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Products and Timeline */}
        <div className="lg:col-span-8 space-y-8">
          {/* Products Snapshot Table */}
          <div className="p-6 bg-forest-900/40 border border-forest-850 rounded-luxury">
            <h2 className="font-serif text-xl uppercase tracking-wider text-ivory-100 mb-4 pb-3 border-b border-forest-850 flex items-center justify-between">
              <span>Purchased Formulations ({order.items?.length || 0})</span>
              <span className="text-[10px] text-ivory-400 font-sans tracking-widest font-normal uppercase">
                Immutable Snapshot
              </span>
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
                      <h4 className="font-serif text-sm text-ivory-100 font-medium">
                        {it.productNameSnapshot || it.productName}
                      </h4>
                      <p className="text-[11px] text-ivory-400 font-sans mt-0.5">
                        SKU: {it.skuSnapshot || "SKU-AYU"} • Product ID: {it.productId}
                      </p>
                      <p className="text-xs text-gold-400/90 font-sans mt-1">
                        {it.quantity} × {formatPrice(it.priceSnapshot || it.price)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-sans text-ivory-100">
                      {formatPrice(it.subtotal || it.total || (it.price * it.quantity))}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="mt-6 pt-4 border-t border-forest-850 space-y-2 text-xs font-sans">
              <div className="flex justify-between text-ivory-400">
                <span>Items Subtotal:</span>
                <span className="text-ivory-200">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Botanical Discount ({order.couponCode || "PROMO"}):</span>
                  <span>- {formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ivory-400">
                <span>Shipping & Insured Handling:</span>
                <span className="text-ivory-200">
                  {(order.shippingAmount || order.shippingFee || 0) === 0
                    ? "COMPLIMENTARY"
                    : formatPrice(order.shippingAmount || order.shippingFee || 0)}
                </span>
              </div>
              {(order.taxAmount || order.tax || 0) > 0 && (
                <div className="flex justify-between text-ivory-400">
                  <span>Applicable GST / Tax:</span>
                  <span className="text-ivory-200">{formatPrice(order.taxAmount || order.tax || 0)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-forest-800 text-sm font-bold">
                <span className="text-ivory-100">Final Authoritative Total:</span>
                <span className="text-gold-400 text-base">
                  {formatPrice(order.totalAmount || order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Fulfillment Timeline */}
          <div className="p-6 bg-forest-900/40 border border-forest-850 rounded-luxury">
            <h2 className="font-serif text-xl uppercase tracking-wider text-ivory-100 mb-4 pb-3 border-b border-forest-850 flex items-center justify-between">
              <span>Fulfillment Audit Timeline</span>
              <Clock className="w-4 h-4 text-gold-400" />
            </h2>

            <div className="space-y-4">
              {order.timeline && order.timeline.length > 0 ? (
                order.timeline.map((entry, idx) => (
                  <div key={idx} className="flex space-x-3 text-xs font-sans">
                    <div className="w-2.5 h-2.5 rounded-full bg-gold-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-ivory-100 uppercase tracking-wider">
                          {entry.status}
                        </span>
                        <span className="text-ivory-400 text-[11px]">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-ivory-300 mt-0.5">{entry.note}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-ivory-400 font-sans">No timeline milestones logged yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Patron & Payment Info */}
        <div className="lg:col-span-4 space-y-8">
          {/* Customer / Patron Information */}
          <div className="p-6 bg-forest-900/40 border border-forest-850 rounded-luxury">
            <h3 className="font-serif text-base uppercase tracking-wider text-ivory-100 mb-4 pb-2 border-b border-forest-850 flex items-center space-x-2">
              <User className="w-4 h-4 text-gold-400" />
              <span>Patron Information</span>
            </h3>
            <div className="space-y-3 text-xs font-sans">
              <div>
                <span className="text-ivory-400 block text-[10px] uppercase">Name</span>
                <span className="text-ivory-100 font-medium">{order.customerName}</span>
              </div>
              <div>
                <span className="text-ivory-400 block text-[10px] uppercase">Email</span>
                <span className="text-ivory-100">{order.customerEmail}</span>
              </div>
              <div>
                <span className="text-ivory-400 block text-[10px] uppercase">Contact Phone</span>
                <span className="text-ivory-100">{order.customerPhone}</span>
              </div>
              {order.userId && (
                <div>
                  <span className="text-ivory-400 block text-[10px] uppercase">Patron Account ID</span>
                  <span className="text-gold-400 font-mono text-[11px]">{order.userId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address Snapshot */}
          <div className="p-6 bg-forest-900/40 border border-forest-850 rounded-luxury">
            <h3 className="font-serif text-base uppercase tracking-wider text-ivory-100 mb-4 pb-2 border-b border-forest-850 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>Shipping Address Snapshot</span>
            </h3>
            {order.shippingAddressSnapshot || order.shippingAddress ? (
              <div className="text-xs font-sans text-ivory-200 leading-relaxed">
                <p className="font-medium text-ivory-100 mb-1">
                  {(order.shippingAddressSnapshot || order.shippingAddress).fullName}
                </p>
                <p>{(order.shippingAddressSnapshot || order.shippingAddress).addressLine1}</p>
                {(order.shippingAddressSnapshot || order.shippingAddress).addressLine2 && (
                  <p>{(order.shippingAddressSnapshot || order.shippingAddress).addressLine2}</p>
                )}
                <p>
                  {(order.shippingAddressSnapshot || order.shippingAddress).city},{" "}
                  {(order.shippingAddressSnapshot || order.shippingAddress).state} -{" "}
                  {(order.shippingAddressSnapshot || order.shippingAddress).postalCode ||
                    (order.shippingAddressSnapshot || order.shippingAddress).pincode}
                </p>
                <p>{(order.shippingAddressSnapshot || order.shippingAddress).country || "India"}</p>
                <p className="mt-2 text-ivory-400">
                  Phone: {(order.shippingAddressSnapshot || order.shippingAddress).phone}
                </p>
              </div>
            ) : (
              <p className="text-xs text-ivory-400 font-sans">No address recorded.</p>
            )}
          </div>

          {/* Payment & Security Verification */}
          <div className="p-6 bg-forest-900/40 border border-forest-850 rounded-luxury">
            <h3 className="font-serif text-base uppercase tracking-wider text-ivory-100 mb-4 pb-2 border-b border-forest-850 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gold-400" />
              <span>Payment Verification</span>
            </h3>
            <div className="space-y-3 text-xs font-sans">
              <div>
                <span className="text-ivory-400 block text-[10px] uppercase">Payment Method</span>
                <span className="text-ivory-100 font-medium">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-ivory-400 block text-[10px] uppercase">Payment Provider</span>
                <span className="text-gold-400 font-bold uppercase">
                  {order.payment?.provider || (order.paymentMethod?.toLowerCase().includes("razorpay") ? "Razorpay" : "Offline / COD")}
                </span>
              </div>
              {order.payment?.providerOrderId && (
                <div>
                  <span className="text-ivory-400 block text-[10px] uppercase">Provider Order ID</span>
                  <span className="text-ivory-200 font-mono text-[11px] break-all">
                    {order.payment.providerOrderId}
                  </span>
                </div>
              )}
              {order.payment?.providerPaymentId && (
                <div>
                  <span className="text-ivory-400 block text-[10px] uppercase">Provider Payment ID</span>
                  <span className="text-ivory-200 font-mono text-[11px] break-all">
                    {order.payment.providerPaymentId}
                  </span>
                </div>
              )}
              <div>
                <span className="text-ivory-400 block text-[10px] uppercase">Signature Verified</span>
                <span
                  className={`inline-flex items-center space-x-1 font-bold ${
                    order.payment?.signatureVerified ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {order.payment?.signatureVerified ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>HMAC-SHA256 Verified</span>
                    </>
                  ) : (
                    <span>Unverified / Offline</span>
                  )}
                </span>
              </div>

              {/* Controlled mechanism for marking COD payment as PAID */}
              {(order.paymentStatus === "PENDING" || order.paymentStatus === "Pending") && (
                <div className="pt-3 border-t border-forest-800">
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider block mb-2 font-semibold">
                    Controlled Payment Reconciliation
                  </span>
                  <p className="text-[11px] text-ivory-400 mb-3">
                    If this Cash on Delivery or offline payment was received upon delivery, you may explicitly mark it as reconciled.
                  </p>
                  <label className="flex items-center space-x-2 text-[11px] text-ivory-300 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={codPaymentConfirm}
                      onChange={(e) => setCodPaymentConfirm(e.target.checked)}
                      className="rounded border-forest-750 bg-forest-950 text-gold-500 focus:ring-0"
                    />
                    <span>I verify cash/offline payment collection has been completed.</span>
                  </label>
                  <button
                    disabled={!codPaymentConfirm || updating}
                    onClick={handleControlledPaymentUpdate}
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-ivory-100 font-bold text-[11px] uppercase tracking-wider rounded font-sans transition-all"
                  >
                    Reconcile as PAID
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Status Update */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forest-900 border border-gold-500/50 rounded-luxury max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
              Update Fulfillment Status
            </h3>
            <p className="text-xs text-ivory-300 font-sans leading-relaxed">
              Updating fulfillment state alters the patron&apos;s visible tracking milestones and dispatches fulfillment updates.
            </p>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1">
                  New Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full bg-forest-950 border border-forest-750 rounded px-3 py-2 text-ivory-100 focus:border-gold-400 outline-none"
                >
                  {ORDER_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1">
                  Carrier Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DEL-AYU-892102"
                  className="w-full bg-forest-950 border border-forest-750 rounded px-3 py-2 text-ivory-100 focus:border-gold-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1">
                  Timeline Milestone Note
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. Dispatched via Delhivery Express Cold-Chain logistics"
                  className="w-full bg-forest-950 border border-forest-750 rounded px-3 py-2 text-ivory-100 focus:border-gold-400 outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-forest-850 flex justify-end space-x-3 text-xs font-sans">
              <button
                disabled={updating}
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 border border-forest-750 hover:bg-forest-850 text-ivory-300 rounded uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                disabled={updating}
                onClick={handleStatusSubmit}
                className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold rounded uppercase tracking-wider shadow-gold-glow flex items-center space-x-1.5"
              >
                {updating ? <span>Saving...</span> : <span>Confirm & Update</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
