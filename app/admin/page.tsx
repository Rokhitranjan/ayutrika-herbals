import React from "react";
import Link from "next/link";
import { getAnalytics, getOrders, getProducts } from "@/lib/data/store";
import { formatPrice, formatDate } from "@/lib/utils";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Package,
  PlusCircle,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const analytics = await getAnalytics();
  const recentOrders = (await getOrders()).slice(0, 6);
  const products = await getProducts();

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-forest-850">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold">
              EXECUTIVE OVERVIEW
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase tracking-wide">
              Ayutrika Command Center
            </h1>
            <p className="text-xs text-ivory-400 font-sans mt-1">
              Real-time apothecary performance, fulfillment status, and botanical inventory metrics.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/products/new"
              className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-semibold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-2 shadow-luxury"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
            <Link
              href="/admin/orders"
              className="px-4 py-2.5 bg-forest-900 hover:bg-forest-850 border border-forest-800 text-ivory-200 text-xs font-semibold uppercase tracking-wider rounded-luxury transition-all"
            >
              Manage Orders
            </Link>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-forest-950 border border-forest-850 p-5 rounded-luxury">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider text-ivory-400 font-sans">
                Gross Revenue
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif text-2xl sm:text-3xl text-gold-400 font-medium">
              {formatPrice(analytics.totalSales)}
            </p>
            <p className="text-[11px] text-emerald-400 font-sans mt-2 flex items-center space-x-1">
              <span>+18.4%</span>
              <span className="text-ivory-400">vs previous lunar cycle</span>
            </p>
          </div>

          <div className="bg-forest-950 border border-forest-850 p-5 rounded-luxury">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider text-ivory-400 font-sans">
                Total Orders
              </span>
              <div className="w-8 h-8 rounded-full bg-forest-900 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif text-2xl sm:text-3xl text-ivory-100 font-medium">
              {analytics.totalOrders}
            </p>
            <p className="text-[11px] text-ivory-400 font-sans mt-2">
              All transactions fulfilled & processing
            </p>
          </div>

          <div className="bg-forest-950 border border-forest-850 p-5 rounded-luxury">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider text-ivory-400 font-sans">
                Patron Community
              </span>
              <div className="w-8 h-8 rounded-full bg-forest-900 border border-forest-700 flex items-center justify-center text-ivory-300">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif text-2xl sm:text-3xl text-ivory-100 font-medium">
              {analytics.customersCount}
            </p>
            <p className="text-[11px] text-ivory-400 font-sans mt-2">
              Verified Ayurvedic wellness customers
            </p>
          </div>

          <div className="bg-forest-950 border border-forest-850 p-5 rounded-luxury">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider text-ivory-400 font-sans">
                Average Basket (AOV)
              </span>
              <div className="w-8 h-8 rounded-full bg-forest-900 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif text-2xl sm:text-3xl text-gold-400 font-medium">
              {formatPrice(analytics.avgOrderValue)}
            </p>
            <p className="text-[11px] text-ivory-400 font-sans mt-2">
              Premium multi-product rituals
            </p>
          </div>
        </div>

        {/* Low Stock Warning Alert if any */}
        {analytics.lowStock.length > 0 && (
          <div className="p-4 sm:p-5 bg-amber-950/40 border border-amber-800/80 rounded-luxury">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-amber-900/60 border border-amber-600/80 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base text-amber-200 font-medium">
                    Critical Apothecary Inventory Attention Required
                  </h3>
                  <p className="text-xs text-amber-300/80 font-sans mt-0.5">
                    {analytics.lowStock.length} formulation(s) are running below safety threshold (less than 20 units remaining).
                  </p>
                </div>
              </div>
              <Link
                href="/admin/inventory"
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium font-sans flex items-center space-x-1"
              >
                <span>Manage Stock</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analytics.lowStock.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-forest-950/90 border border-amber-900/60 p-3 rounded-luxury flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs text-ivory-100 font-serif truncate">{item.name}</p>
                    <p className="text-[10px] text-ivory-400 font-mono">SKU: {item.sku}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-900/80 text-amber-200 text-[10px] font-bold rounded-luxury uppercase tracking-wider font-mono">
                    ⚠ {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-Column: Recent Orders + Best Sellers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders - 2 Columns wide */}
          <div className="lg:col-span-2 bg-forest-950 border border-forest-850 p-6 rounded-luxury">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-lg text-ivory-100">Recent Customer Orders</h2>
                <p className="text-xs text-ivory-400 font-sans">
                  Real-time incoming herbal shipments across India
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs text-gold-400 hover:text-gold-300 font-sans tracking-wider uppercase font-semibold flex items-center space-x-1"
              >
                <span>All Orders</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-forest-850 text-ivory-400 text-[10px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Order</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Payment</th>
                    <th className="pb-3 font-semibold">Fulfillment</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-850/60">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-forest-900/40 transition-colors">
                      <td className="py-3.5 font-mono text-gold-400 font-medium">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5">
                        <p className="font-medium text-ivory-100">{order.customerName}</p>
                        <p className="text-[10px] text-ivory-400">{order.shippingAddress.city}</p>
                      </td>
                      <td className="py-3.5 font-serif text-sm text-ivory-100">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                            order.paymentStatus === "Paid"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-forest-900 text-ivory-300 text-[10px] uppercase font-mono border border-forest-800">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/admin/orders?search=${order.orderNumber}`}
                          className="text-[11px] text-gold-400 hover:text-gold-300 underline font-medium"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature Best Sellers - 1 Column */}
          <div className="bg-forest-950 border border-forest-850 p-6 rounded-luxury">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-lg text-ivory-100">Signature Best Sellers</h2>
                <p className="text-xs text-ivory-400 font-sans">Top volume herbal remedies</p>
              </div>
              <Link
                href="/admin/products"
                className="text-xs text-gold-400 hover:text-gold-300 font-sans tracking-wider uppercase font-semibold"
              >
                Catalog
              </Link>
            </div>

            <div className="space-y-4">
              {analytics.bestSelling.map(({ product, unitsSold, totalRevenue }, idx) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-3 p-2.5 rounded-luxury hover:bg-forest-900/40 transition-colors"
                >
                  <span className="w-5 font-serif text-gold-400/80 text-sm font-bold">
                    0{idx + 1}
                  </span>
                  <div className="w-12 h-12 relative rounded bg-forest-900 overflow-hidden flex-shrink-0 border border-forest-800">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-xs text-ivory-100 truncate">{product.name}</p>
                    <p className="text-[10px] text-ivory-400 font-mono mt-0.5">
                      {unitsSold} units • {formatPrice(totalRevenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Administration Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-forest-850">
          <Link
            href="/admin/products"
            className="p-4 bg-forest-950/70 border border-forest-850 hover:border-gold-500/50 rounded-luxury transition-all text-center group"
          >
            <Package className="w-5 h-5 text-gold-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-serif text-ivory-100 block">Catalog Management</span>
            <span className="text-[10px] text-ivory-400">{products.length} Products</span>
          </Link>
          <Link
            href="/admin/cms"
            className="p-4 bg-forest-950/70 border border-forest-850 hover:border-gold-500/50 rounded-luxury transition-all text-center group"
          >
            <ExternalLink className="w-5 h-5 text-gold-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-serif text-ivory-100 block">Homepage CMS</span>
            <span className="text-[10px] text-ivory-400">Hero & Spotlight</span>
          </Link>
          <Link
            href="/admin/inventory"
            className="p-4 bg-forest-950/70 border border-forest-850 hover:border-gold-500/50 rounded-luxury transition-all text-center group"
          >
            <AlertTriangle className="w-5 h-5 text-gold-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-serif text-ivory-100 block">Inventory Radar</span>
            <span className="text-[10px] text-ivory-400">{analytics.lowStock.length} Low alerts</span>
          </Link>
          <Link
            href="/admin/settings"
            className="p-4 bg-forest-950/70 border border-forest-850 hover:border-gold-500/50 rounded-luxury transition-all text-center group"
          >
            <Clock className="w-5 h-5 text-gold-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-serif text-ivory-100 block">Brand Identity</span>
            <span className="text-[10px] text-ivory-400">AYUTRIKA HERBALS</span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
