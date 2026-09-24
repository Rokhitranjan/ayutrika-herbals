"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import {
  AlertTriangle,
  Search,
  Check,
  Save,
  Plus,
  Minus,
  ExternalLink,
  Package,
  Layers,
} from "lucide-react";

interface InventoryClientProps {
  initialProducts: Product[];
}

export default function InventoryClient({ initialProducts }: InventoryClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out" | "normal">("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [stockEdits, setStockEdits] = useState<{ [id: string]: number }>({});

  const handleStockChange = (id: string, delta: number) => {
    const current = stockEdits[id] !== undefined
      ? stockEdits[id]
      : products.find((p) => p.id === id)?.stock || 0;
    const nextVal = Math.max(0, current + delta);
    setStockEdits({ ...stockEdits, [id]: nextVal });
  };

  const handleManualInput = (id: string, val: string) => {
    const num = parseInt(val, 10);
    setStockEdits({ ...stockEdits, [id]: isNaN(num) ? 0 : Math.max(0, num) });
  };

  const saveStock = async (product: Product) => {
    const newStock = stockEdits[product.id];
    if (newStock === undefined || newStock === product.stock) return;

    setSavingId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });

      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
        );
        const copy = { ...stockEdits };
        delete copy[product.id];
        setStockEdits(copy);
      } else {
        alert("Failed to update inventory.");
      }
    } catch {
      alert("Error updating inventory.");
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    const effectiveStock = stockEdits[p.id] !== undefined ? stockEdits[p.id] : p.stock;

    if (filter === "out") return matchesSearch && effectiveStock === 0;
    if (filter === "low") return matchesSearch && effectiveStock > 0 && effectiveStock < 20;
    if (filter === "normal") return matchesSearch && effectiveStock >= 20;
    return matchesSearch;
  });

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 20).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            BOTANICAL SUPPLY RADAR
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Apothecary Inventory Control
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Monitor reserves, batch quantities, and safety replenishment limits.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-luxury bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-mono">
            ⚠ {lowStockCount} Low Stock
          </span>
          <span className="px-3 py-1.5 rounded-luxury bg-red-950/80 border border-red-800 text-red-300 text-xs font-mono">
            {outOfStockCount} Depleted
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-forest-950 border border-forest-850 p-4 rounded-luxury flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search formulation by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs pl-9 pr-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {(["all", "low", "out", "normal"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-2 rounded-luxury text-xs font-sans capitalize tracking-wider transition-all ${
                filter === opt
                  ? "bg-gold-500 text-forest-950 font-bold"
                  : "bg-forest-900 text-ivory-300 hover:text-ivory-100 border border-forest-800"
              }`}
            >
              {opt === "all" ? "All Formulations" : opt === "low" ? "⚠ Low Stock" : opt === "out" ? "Out of Stock" : "Healthy"}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-forest-950 border border-forest-850 rounded-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-forest-900/60 border-b border-forest-850 text-ivory-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Sold Est.</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Current Stock</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-850/60">
              {filteredProducts.map((p) => {
                const currentVal =
                  stockEdits[p.id] !== undefined ? stockEdits[p.id] : p.stock;
                const isDirty = stockEdits[p.id] !== undefined && stockEdits[p.id] !== p.stock;

                return (
                  <tr key={p.id} className="hover:bg-forest-900/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 relative rounded bg-forest-900 overflow-hidden flex-shrink-0 border border-forest-800">
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif text-xs text-ivory-100 truncate max-w-[220px]">
                            {p.name}
                          </p>
                          <span className="text-[10px] text-ivory-400 font-mono">
                            {p.weight || "Standard Jar"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-gold-400">
                      {p.sku}
                    </td>

                    <td className="py-3.5 px-4 font-serif text-sm text-ivory-100">
                      {formatPrice(p.price)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-ivory-300">
                      {p.isBestSeller ? 64 : 18} units
                    </td>

                    <td className="py-3.5 px-4">
                      {currentVal === 0 ? (
                        <span className="px-2.5 py-1 rounded bg-red-950 border border-red-800 text-red-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                          OUT OF STOCK
                        </span>
                      ) : currentVal < 20 ? (
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800 text-amber-300 font-mono text-[10px] uppercase font-bold">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>LOW STOCK ({currentVal} remaining)</span>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-mono text-[10px] uppercase">
                          In Stock ({currentVal})
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, -1)}
                          className="w-7 h-7 rounded bg-forest-900 border border-forest-800 text-ivory-300 hover:text-gold-400 hover:border-gold-500/50 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={currentVal}
                          onChange={(e) => handleManualInput(p.id, e.target.value)}
                          className={`w-16 bg-forest-900 border text-center py-1 rounded text-xs font-mono font-bold focus:outline-none ${
                            isDirty ? "border-gold-500 text-gold-400" : "border-forest-800 text-ivory-100"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, 1)}
                          className="w-7 h-7 rounded bg-forest-900 border border-forest-800 text-ivory-300 hover:text-gold-400 hover:border-gold-500/50 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isDirty ? (
                        <button
                          onClick={() => saveStock(p)}
                          disabled={savingId === p.id}
                          className="px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-bold font-sans uppercase rounded tracking-wider transition-all flex items-center space-x-1 ml-auto shadow-luxury"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingId === p.id ? "Saving..." : "Save"}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-ivory-500 font-mono">Synced</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
