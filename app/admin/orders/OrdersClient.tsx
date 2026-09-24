"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  CheckCircle,
  Truck,
  Package,
  Clock,
  XCircle,
  AlertCircle,
  ChevronDown,
  Eye,
  MapPin,
  X,
  Send,
} from "lucide-react";

interface OrdersClientProps {
  initialOrders: Order[];
}

const ALL_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
  "Refunded",
];

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setProductsOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Status edit state in modal
  const [newStatus, setNewStatus] = useState<OrderStatus>("Processing");
  const [newTracking, setNewTracking] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerEmail.toLowerCase().includes(q) ||
      order.customerPhone.includes(q);

    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setNewTracking(order.trackingNumber || "");
    setStatusNote("");
    setModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: newStatus,
          trackingNumber: newTracking,
          note: statusNote || `Order fulfillment updated to ${newStatus} by apothecary admin`,
        }),
      });

      const updated = await res.json();
      if (res.ok && updated) {
        setProductsOrders(
          orders.map((o) => (o.id === selectedOrder.id ? updated : o))
        );
        setSelectedOrder(updated);
        setModalOpen(false);
      } else {
        alert("Failed to update order status");
      }
    } catch {
      alert("Error updating order");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            FULFILLMENT SANCTUARY
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Customer Orders ({filteredOrders.length})
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Track dispatch, print manifests, and update fulfillment milestones across India.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-forest-950 border border-forest-850 p-4 rounded-luxury flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, email, or contact number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs pl-9 pr-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-forest-900 border border-forest-800 text-ivory-200 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
        >
          <option value="all">All Fulfillment Statuses</option>
          {ALL_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-forest-950 border border-forest-850 rounded-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-forest-900/60 border-b border-forest-850 text-ivory-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Order</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Destination</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold">Total</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Fulfillment Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-850/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-ivory-400">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-forest-900/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-gold-400 font-medium">
                      {order.orderNumber}
                    </td>

                    <td className="py-3.5 px-4 text-ivory-400 font-mono text-[11px]">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-ivory-100">{order.customerName}</p>
                      <p className="text-[10px] text-ivory-400 font-mono">{order.customerEmail}</p>
                    </td>

                    <td className="py-3.5 px-4 text-ivory-300">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-ivory-300">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </td>

                    <td className="py-3.5 px-4 font-serif text-sm text-gold-400 font-medium">
                      {formatPrice(order.total)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded bg-forest-900 text-ivory-200 border border-forest-800 text-[10px] font-mono uppercase">
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="px-2.5 py-1.5 bg-forest-900 hover:bg-forest-850 text-ivory-200 hover:text-gold-300 border border-forest-800 rounded-luxury text-xs font-medium transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => openStatusModal(order)}
                          className="px-2.5 py-1.5 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 hover:text-gold-300 border border-gold-500/30 rounded-luxury text-xs font-medium transition-colors"
                        >
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Management & Status Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forest-950 border border-forest-800 w-full max-w-2xl rounded-luxury p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-gold-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-forest-850 pb-4">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-gold-400 uppercase font-sans font-semibold">
                  DISPATCH MANAGEMENT
                </span>
                <h2 className="font-serif text-xl text-ivory-100">
                  Order #{selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-ivory-400 hover:text-ivory-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-forest-900/40 p-4 rounded-luxury border border-forest-850 text-xs font-sans">
              <div>
                <p className="text-[10px] text-gold-400 uppercase tracking-wider font-semibold mb-1">
                  Patron Information
                </p>
                <p className="font-medium text-ivory-100">{selectedOrder.customerName}</p>
                <p className="text-ivory-400">{selectedOrder.customerEmail}</p>
                <p className="text-ivory-400">{selectedOrder.customerPhone}</p>
              </div>

              <div>
                <p className="text-[10px] text-gold-400 uppercase tracking-wider font-semibold mb-1">
                  Shipping Sanctuary
                </p>
                <p className="text-ivory-200">
                  {selectedOrder.shippingAddress.addressLine1}
                  {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                </p>
                <p className="text-ivory-400">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <p className="text-[10px] text-gold-400 uppercase tracking-wider font-semibold mb-2">
                Order Formulations ({selectedOrder.items.length})
              </p>
              <div className="space-y-2 border border-forest-850 rounded-luxury p-3 bg-forest-900/20">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1 border-b border-forest-850/40 last:border-b-0"
                  >
                    <div>
                      <p className="font-serif text-ivory-100">{item.productName}</p>
                      <p className="text-[10px] text-ivory-400 font-mono">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-serif text-gold-400 font-medium">
                      {formatPrice(item.total)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-forest-850 font-serif text-sm">
                  <span className="text-ivory-300">Total Collected:</span>
                  <span className="text-gold-400 font-bold">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Status Update Form */}
            <div className="space-y-4 pt-2 border-t border-forest-850">
              <h3 className="font-serif text-base text-gold-400">
                Update Fulfillment Milestone
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full bg-forest-900 border border-forest-800 text-ivory-100 text-xs p-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Courier Tracking # (AWB)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AYU-BLUEDART-882910"
                    value={newTracking}
                    onChange={(e) => setNewTracking(e.target.value)}
                    className="w-full bg-forest-900 border border-forest-800 text-ivory-100 text-xs p-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Timeline Milestone Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dispatched via Express Courier from Jaipur Apothecary Hub"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full bg-forest-900 border border-forest-800 text-ivory-100 text-xs p-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              {/* Existing Timeline */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-ivory-400 font-sans mb-1.5">
                  Fulfillment History:
                </p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto text-[11px] font-sans">
                  {selectedOrder.timeline.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-2 text-ivory-300 p-1.5 bg-forest-900/30 rounded"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-gold-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-ivory-100">{item.status}:</span>{" "}
                        <span>{item.note}</span>
                        <span className="text-[9px] text-ivory-500 block font-mono">
                          {formatDate(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-forest-850">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-forest-900 hover:bg-forest-850 text-ivory-300 text-xs rounded-luxury"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-bold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-2 shadow-luxury disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{updating ? "Committing..." : "Save Status"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
