"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/types";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  BarChart3,
  Calendar,
  ArrowUpRight,
  PieChart,
} from "lucide-react";

interface AnalyticsClientProps {
  analytics: {
    totalSales: number;
    totalOrders: number;
    customersCount: number;
    avgOrderValue: number;
    bestSelling: {
      product: Product;
      unitsSold: number;
      totalRevenue: number;
    }[];
    lowStock: Product[];
  };
}

const MONTHLY_REVENUE = [
  { month: "Oct", revenue: 84200, orders: 42 },
  { month: "Nov", revenue: 112500, orders: 58 },
  { month: "Dec", revenue: 168000, orders: 84 },
  { month: "Jan", revenue: 145000, orders: 72 },
  { month: "Feb", revenue: 189000, orders: 96 },
  { month: "Mar", revenue: 234500, orders: 118 },
];

export default function AnalyticsClient({ analytics }: AnalyticsClientProps) {
  const [period, setPeriod] = useState<"30d" | "90d" | "1y">("30d");

  const maxRev = Math.max(...MONTHLY_REVENUE.map((m) => m.revenue));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            FINANCIAL INTELLIGENCE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Apothecary Commercial Analytics
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Holistic commercial performance, revenue trends, and formulation velocity metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {(["30d", "90d", "1y"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-luxury text-xs font-mono uppercase tracking-wider transition-all ${
                period === p
                  ? "bg-gold-500 text-forest-950 font-bold"
                  : "bg-forest-900 text-ivory-300 border border-forest-800"
              }`}
            >
              {p === "30d" ? "Last 30 Days" : p === "90d" ? "Quarterly" : "Annual"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-forest-950 border border-forest-850 p-5 rounded-luxury">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-ivory-400 font-sans">
              Cumulative Gross Sales
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-gold-400 font-medium">
            {formatPrice(analytics.totalSales)}
          </p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            +22.8% YoY Expansion
          </span>
        </div>

        <div className="bg-forest-950 border border-forest-850 p-5 rounded-luxury">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-ivory-400 font-sans">
              Completed Ritual Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-gold-400" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-ivory-100 font-medium">
            {analytics.totalOrders}
          </p>
          <span className="text-[10px] text-ivory-400 font-mono mt-1 block">
            99.2% Fulfillment Success
          </span>
        </div>

        <div className="bg-forest-950 border border-forest-850 p-5 rounded-luxury">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-ivory-400 font-sans">
              Average Order Value
            </span>
            <ArrowUpRight className="w-4 h-4 text-gold-400" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-gold-400 font-medium">
            {formatPrice(analytics.avgOrderValue)}
          </p>
          <span className="text-[10px] text-ivory-400 font-mono mt-1 block">
            2.4 Formulations / Basket
          </span>
        </div>

        <div className="bg-forest-950 border border-forest-850 p-5 rounded-luxury">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-ivory-400 font-sans">
              Patron Retention
            </span>
            <Users className="w-4 h-4 text-ivory-300" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-ivory-100 font-medium">
            {analytics.customersCount} Patrons
          </p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            38% Repeat Order Rate
          </span>
        </div>
      </div>

      {/* Revenue Visual Chart (Interactive CSS Bar Chart) */}
      <div className="bg-forest-950 border border-forest-850 p-6 rounded-luxury space-y-6">
        <div className="flex items-center justify-between border-b border-forest-850 pb-3">
          <div>
            <h2 className="font-serif text-lg text-ivory-100">Monthly Revenue Influx</h2>
            <p className="text-xs text-ivory-400 font-sans">
              Gross transaction values generated by botanical formulation sales
            </p>
          </div>
          <span className="text-xs text-gold-400 font-mono">INR (₹)</span>
        </div>

        <div className="h-64 flex items-end justify-between gap-4 pt-8 px-2">
          {MONTHLY_REVENUE.map((item, idx) => {
            const heightPct = Math.round((item.revenue / maxRev) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gold-400 font-mono font-bold bg-forest-900 px-2 py-0.5 rounded border border-forest-800">
                  {formatPrice(item.revenue)}
                </div>
                <div className="w-full bg-forest-900/60 rounded-t overflow-hidden relative h-48 flex items-end">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-gradient-to-t from-emerald-800 to-gold-500 rounded-t group-hover:from-emerald-700 group-hover:to-gold-400 transition-all duration-500 shadow-luxury"
                  />
                </div>
                <span className="text-xs font-mono text-ivory-300">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Best Sellers + Payment Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top formulations */}
        <div className="lg:col-span-8 bg-forest-950 border border-forest-850 p-6 rounded-luxury">
          <div className="flex items-center justify-between mb-4 border-b border-forest-850 pb-3">
            <h2 className="font-serif text-lg text-ivory-100">Top Revenue Formulations</h2>
            <span className="text-[10px] text-ivory-400 font-mono">Ranked by Volume</span>
          </div>

          <div className="space-y-3">
            {analytics.bestSelling.map(({ product, unitsSold, totalRevenue }, i) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-luxury bg-forest-900/30 border border-forest-850 hover:border-gold-500/30 transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="font-serif text-gold-400 text-sm font-bold w-4">
                    0{i + 1}
                  </span>
                  <div className="w-10 h-10 rounded overflow-hidden relative bg-forest-900 flex-shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-xs text-ivory-100 truncate max-w-[200px] sm:max-w-xs">
                      {product.name}
                    </p>
                    <span className="text-[10px] text-ivory-400 font-mono">
                      {product.sku}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-serif text-sm text-gold-400 font-medium block">
                    {formatPrice(totalRevenue)}
                  </span>
                  <span className="text-[10px] text-ivory-400 font-mono">
                    {unitsSold} units dispensed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Channels */}
        <div className="lg:col-span-4 bg-forest-950 border border-forest-850 p-6 rounded-luxury space-y-4">
          <div className="flex items-center justify-between border-b border-forest-850 pb-3">
            <h2 className="font-serif text-lg text-ivory-100">Payment Gateways</h2>
            <PieChart className="w-4 h-4 text-gold-400" />
          </div>

          <div className="space-y-3 pt-2 text-xs font-sans">
            <div className="p-3 bg-forest-900/40 rounded border border-forest-850 flex justify-between items-center">
              <div>
                <p className="font-medium text-ivory-100">UPI (PhonePe, GPay, Paytm)</p>
                <p className="text-[10px] text-ivory-400">Zero surcharge</p>
              </div>
              <span className="font-mono text-gold-400 font-bold">58%</span>
            </div>

            <div className="p-3 bg-forest-900/40 rounded border border-forest-850 flex justify-between items-center">
              <div>
                <p className="font-medium text-ivory-100">Credit / Debit Cards (Razorpay)</p>
                <p className="text-[10px] text-ivory-400">Visa, Mastercard, RuPay</p>
              </div>
              <span className="font-mono text-gold-400 font-bold">26%</span>
            </div>

            <div className="p-3 bg-forest-900/40 rounded border border-forest-850 flex justify-between items-center">
              <div>
                <p className="font-medium text-ivory-100">Net Banking &amp; Wallets</p>
                <p className="text-[10px] text-ivory-400">Top Indian banks</p>
              </div>
              <span className="font-mono text-gold-400 font-bold">11%</span>
            </div>

            <div className="p-3 bg-forest-900/40 rounded border border-forest-850 flex justify-between items-center">
              <div>
                <p className="font-medium text-ivory-100">Cash on Delivery (COD)</p>
                <p className="text-[10px] text-ivory-400">Verified addresses only</p>
              </div>
              <span className="font-mono text-gold-400 font-bold">5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
