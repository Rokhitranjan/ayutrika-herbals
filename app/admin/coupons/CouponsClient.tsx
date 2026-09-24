"use client";

import React, { useState } from "react";
import { Coupon } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { PlusCircle, Search, Tag, Trash2, Check, X, Percent, IndianRupee } from "lucide-react";

interface CouponsClientProps {
  initialCoupons: Coupon[];
}

export default function CouponsClient({ initialCoupons }: CouponsClientProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrderValue, setMinOrderValue] = useState("999");
  const [maxDiscount, setMaxDiscount] = useState("500");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountType,
          discountValue: parseFloat(discountValue) || 0,
          minOrderValue: parseFloat(minOrderValue) || 0,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
          isActive,
        }),
      });

      const data = await res.json();
      if (res.ok && data) {
        setCoupons([...coupons, data]);
        setIsModalOpen(false);
        setCode("");
      } else {
        alert(data.error || "Failed to create coupon");
      }
    } catch {
      alert("Error saving coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Delete promo code "${couponCode}"?`)) return;

    try {
      const res = await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons(coupons.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete coupon");
      }
    } catch {
      alert("Error deleting coupon");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            PROMOTIONAL PRIVILEGES
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Promo Codes &amp; Ritual Vouchers ({coupons.length})
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Create celebratory wellness discount vouchers for patrons.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-semibold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-2 shadow-luxury w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Promo Code</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-forest-950 border border-forest-850 p-4 rounded-luxury">
        <div className="relative">
          <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search promo codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs pl-9 pr-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-forest-950 border border-forest-850 rounded-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-forest-900/60 border-b border-forest-850 text-ivory-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Code</th>
                <th className="py-3 px-4 font-semibold">Benefit</th>
                <th className="py-3 px-4 font-semibold">Min Order</th>
                <th className="py-3 px-4 font-semibold">Max Cap</th>
                <th className="py-3 px-4 font-semibold">Redemptions</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-850/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-forest-900/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gold-400 text-sm">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 text-ivory-100">
                    {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                  </td>
                  <td className="py-3.5 px-4 text-ivory-300 font-mono">
                    {c.minOrderValue ? formatPrice(c.minOrderValue) : "No minimum"}
                  </td>
                  <td className="py-3.5 px-4 text-ivory-300 font-mono">
                    {c.maxDiscount ? formatPrice(c.maxDiscount) : "Uncapped"}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-ivory-400">
                    {c.usageCount} uses
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        c.isActive
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-forest-900 text-ivory-500 border border-forest-800"
                      }`}
                    >
                      {c.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 text-ivory-400 hover:text-red-400 rounded transition-colors"
                      title="Delete Voucher"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forest-950 border border-forest-800 w-full max-w-md rounded-luxury p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-forest-850 pb-3">
              <h2 className="font-serif text-lg text-ivory-100">Create New Promo Privilege</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-ivory-400 hover:text-ivory-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WELLNESS20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-forest-900/60 border border-forest-800 text-gold-400 font-mono text-sm px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-forest-900 border border-forest-800 text-ivory-100 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-forest-800 bg-forest-900 text-gold-500 focus:ring-gold-500"
                />
                <label htmlFor="activeCheck" className="text-xs text-ivory-200 cursor-pointer">
                  Activate Voucher Immediately
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-forest-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-forest-900 hover:bg-forest-850 text-ivory-300 text-xs rounded-luxury"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-bold uppercase tracking-wider rounded-luxury transition-all disabled:opacity-50"
                >
                  {saving ? "Generating..." : "Save Voucher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
