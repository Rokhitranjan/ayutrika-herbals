"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Check, ShieldCheck, Package, MapPin, CreditCard, ArrowRight, ShoppingBag } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  order: Order;
}

export default function OrderSuccessClient({ order }: Props) {
  useEffect(() => {
    // Subtle, restrained luxury gold shimmer burst (not excessive confetti)
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.5 },
        colors: ["#C9A96A", "#1D4635", "#E8DFD0", "#F7F3EA"],
        disableForReducedMotion: true,
      });
    } catch {}
  }, []);

  const displayTotal = order.totalAmount !== undefined ? order.totalAmount : order.total;
  const address = order.shippingAddressSnapshot || order.shippingAddress;
  const paymentStatus = order.paymentStatus || "PENDING";

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Animated Premium Status Card */}
        <div className="bg-forest-900/40 border border-gold-500/40 rounded-luxury p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden mb-10">
          {/* Subtle Ambient Gold Glow Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Premium Animated Check Circle */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="w-20 h-20 rounded-full bg-forest-950 border-2 border-gold-500 flex items-center justify-center text-gold-400 shadow-gold-glow animate-pulse">
              <Check className="w-10 h-10 stroke-[2.5]" />
            </div>
          </div>

          <span className="text-[11px] tracking-[0.35em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            ✓ ORDER CONFIRMED
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-wide mb-3">
            Thank you for your order
          </h1>
          <p className="text-xs sm:text-sm text-ivory-300 font-sans max-w-lg mx-auto leading-relaxed mb-8">
            Your sacred botanical formulations have been reserved and entered into preparation. A detailed confirmation receipt has been dispatched to{" "}
            <span className="text-gold-400 font-medium">{order.customerEmail}</span>.
          </p>

          {/* Key Reference Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-forest-950/80 border border-forest-800 rounded-luxury p-5 text-left text-xs font-sans mb-8">
            <div>
              <span className="text-[10px] text-ivory-400 uppercase tracking-wider block mb-1">
                Order Number
              </span>
              <span className="font-mono text-gold-400 font-bold text-sm tracking-wider">
                {order.orderNumber}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ivory-400 uppercase tracking-wider block mb-1">
                Payment Status
              </span>
              <span
                className={`font-bold uppercase tracking-wider ${
                  paymentStatus.toUpperCase() === "PAID"
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {paymentStatus}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-ivory-400 uppercase tracking-wider block mb-1">
                Total Amount Paid
              </span>
              <span className="font-bold text-ivory-100 text-sm">
                {formatPrice(displayTotal)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/account/orders/${order.orderNumber || order.id}`}
              className="px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-widest font-sans rounded-luxury transition-all shadow-gold-glow flex items-center justify-center space-x-2"
            >
              <span>View Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-forest-950 hover:bg-forest-850 border border-forest-750 text-ivory-200 text-xs uppercase tracking-widest font-sans rounded-luxury transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4 text-gold-400" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Formulations & Shipping Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Purchased Formulations (7 Cols) */}
          <div className="md:col-span-7 bg-forest-900/40 border border-forest-850 rounded-luxury p-6">
            <h2 className="font-serif text-lg uppercase tracking-wider text-ivory-100 mb-4 pb-2 border-b border-forest-850 flex items-center justify-between">
              <span>Formulations Purchased</span>
              <span className="text-xs text-ivory-400 font-sans font-normal">
                {order.items?.length || 0} items
              </span>
            </h2>

            <div className="divide-y divide-forest-850">
              {order.items?.map((it, idx) => (
                <div key={it.id || idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-forest-950 border border-forest-800 rounded relative overflow-hidden flex-shrink-0">
                      {it.productImage ? (
                        <Image
                          src={it.productImage}
                          alt={it.productNameSnapshot || it.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-gold-400 absolute inset-0 m-auto stroke-1" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-xs text-ivory-100 line-clamp-1">
                        {it.productNameSnapshot || it.productName}
                      </h3>
                      <p className="text-[11px] text-ivory-400 font-sans">
                        Qty: {it.quantity} × {formatPrice(it.priceSnapshot || it.price)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-sans text-ivory-100">
                    {formatPrice(it.subtotal || it.total || it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Protection Details (5 Cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-forest-900/40 border border-forest-850 rounded-luxury p-6">
              <h3 className="font-serif text-base uppercase tracking-wider text-ivory-100 mb-3 flex items-center space-x-2 pb-2 border-b border-forest-850">
                <MapPin className="w-4 h-4 text-gold-400" />
                <span>Shipping Destination</span>
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
                  <p className="text-ivory-400 pt-1">Phone: {address.phone}</p>
                </div>
              ) : (
                <p className="text-xs text-ivory-400 font-sans">Address recorded on order file.</p>
              )}
            </div>

            <div className="bg-forest-900/40 border border-forest-850 rounded-luxury p-4 flex items-center space-x-3 text-xs font-sans text-ivory-300">
              <ShieldCheck className="w-8 h-8 text-gold-400 flex-shrink-0 stroke-1" />
              <div>
                <p className="text-ivory-100 font-medium">Ayutrika Authenticity Guarantee</p>
                <p className="text-[11px] text-ivory-400">
                  Every jar and tincture is batch-tested for heavy metals and purity in our GMP apothecary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
