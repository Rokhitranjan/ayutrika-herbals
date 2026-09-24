"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Order } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, ArrowRight, ArrowLeft, Filter, Clock, CheckCircle2, Truck } from "lucide-react";

interface Props {
  initialOrders: Order[];
}

type FilterTab = "All" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export default function CustomerOrdersClient({ initialOrders }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const filteredOrders = initialOrders.filter((order) => {
    if (activeFilter === "All") return true;
    const status = (order.orderStatus || order.status || "").toLowerCase();
    if (activeFilter === "Processing") {
      return status === "processing" || status === "confirmed" || status === "packed" || status === "pending";
    }
    if (activeFilter === "Shipped") {
      return status === "shipped" || status === "out for delivery" || status === "out_for_delivery";
    }
    if (activeFilter === "Delivered") {
      return status === "delivered";
    }
    if (activeFilter === "Cancelled") {
      return status === "cancelled" || status === "returned" || status === "refunded";
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb */}
      <Link
        href="/account"
        className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-sans"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Patron Sanctuary</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-forest-850 gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-1">
            PATRON ACQUISITION ARCHIVE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-wide">
            My Orders ({initialOrders.length})
          </h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-forest-850 text-xs font-sans">
        {(["All", "Processing", "Shipped", "Delivered", "Cancelled"] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-luxury uppercase tracking-wider transition-all whitespace-nowrap ${
              activeFilter === tab
                ? "bg-gold-500 text-forest-950 font-bold shadow-gold-glow"
                : "bg-forest-900/40 text-ivory-300 hover:text-ivory-100 border border-forest-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-forest-900/30 border border-forest-850 rounded-luxury p-8">
          <Package className="w-12 h-12 text-gold-400 mx-auto mb-4 stroke-1" />
          <h3 className="font-serif text-2xl mb-2 text-ivory-100">
            {activeFilter === "All" ? "No Orders Found" : `No ${activeFilter} Orders`}
          </h3>
          <p className="text-xs text-ivory-400 font-sans mb-6 max-w-md mx-auto">
            {activeFilter === "All"
              ? "You have not placed any formulation orders yet. Explore our Ayurvedic preparations crafted with pure Himalayan herbs."
              : `You do not have any orders currently categorized as ${activeFilter.toLowerCase()}.`}
          </p>
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-widest rounded-luxury font-sans inline-block transition-all shadow-gold-glow"
          >
            Explore Apothecary
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const displayTotal = order.totalAmount !== undefined ? order.totalAmount : order.total;
            const status = order.orderStatus || order.status || "CONFIRMED";
            const paymentStatus = order.paymentStatus || "PENDING";

            return (
              <div
                key={order.id}
                className="p-6 bg-forest-900/40 border border-forest-850 hover:border-gold-500/50 rounded-luxury transition-all shadow-luxury"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-forest-850 gap-3 text-xs font-sans">
                  <div>
                    <span className="font-bold text-sm text-gold-400 tracking-wider">
                      {order.orderNumber}
                    </span>
                    <span className="text-ivory-400 ml-3">
                      Ordered {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded font-sans ${
                        paymentStatus.toUpperCase() === "PAID"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}
                    >
                      Payment: {paymentStatus}
                    </span>

                    <span
                      className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded font-sans ${
                        status.toUpperCase() === "DELIVERED"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : status.toUpperCase() === "SHIPPED" || status.toUpperCase() === "OUT_FOR_DELIVERY"
                          ? "bg-gold-950 text-gold-300 border border-gold-800"
                          : "bg-forest-950 text-ivory-300 border border-forest-800"
                      }`}
                    >
                      {status}
                    </span>

                    <span className="font-bold text-ivory-100 text-base">
                      {formatPrice(displayTotal)}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="py-4 space-y-2 text-xs text-ivory-300 font-sans">
                  {order.items?.map((it, idx) => (
                    <div key={it.id || idx} className="flex justify-between items-center">
                      <span className="font-serif text-sm text-ivory-100 line-clamp-1 max-w-md">
                        {it.quantity} × {it.productNameSnapshot || it.productName}
                      </span>
                      <span className="text-ivory-400">
                        {formatPrice(it.subtotal || it.total || it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Action */}
                <div className="pt-3 border-t border-forest-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
                  <span className="text-ivory-400 text-[11px]">
                    Shipping to:{" "}
                    {(order.shippingAddressSnapshot || order.shippingAddress)?.city},{" "}
                    {(order.shippingAddressSnapshot || order.shippingAddress)?.state} (
                    {(order.shippingAddressSnapshot || order.shippingAddress)?.postalCode ||
                      (order.shippingAddressSnapshot || order.shippingAddress)?.pincode}
                    )
                  </span>

                  <Link
                    href={`/account/orders/${order.orderNumber || order.id}`}
                    className="text-gold-400 hover:text-gold-300 uppercase tracking-widest font-bold flex items-center space-x-1.5 self-end sm:self-auto group"
                  >
                    <span>Inspect Order Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
