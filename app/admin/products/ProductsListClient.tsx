"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, Category, ProductStatus } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Archive,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Star,
  Flame,
  Check,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

interface ProductsListClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsListClient({
  initialProducts,
  categories,
}: ProductsListClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [bestSellerOnly, setBestSellerOnly] = useState(false);
  const [newArrivalOnly, setNewArrivalOnly] = useState(false);

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  // Category lookup map
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const catName = categoryMap.get(p.categoryId) || "";
      const q = searchTerm.toLowerCase().trim();

      // Search by product name, SKU, or category
      if (q) {
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesCategory = catName.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesCategory) return false;
      }

      // Status Filter (Draft, Published, Archived)
      const currentStatus: ProductStatus = p.status || (p.isActive ? "PUBLISHED" : "ARCHIVED");
      if (statusFilter !== "all" && currentStatus !== statusFilter) {
        return false;
      }

      // Category Filter
      if (categoryFilter !== "all" && p.categoryId !== categoryFilter) {
        return false;
      }

      // Stock Filter (In Stock, Low Stock <= threshold, Out of Stock <= 0)
      const available = p.availableStock ?? (p.stock - (p.reservedQuantity || 0));
      const threshold = p.lowStockThreshold || 10;
      if (stockFilter === "in" && available <= threshold) return false;
      if (stockFilter === "low" && (available <= 0 || available > threshold)) return false;
      if (stockFilter === "out" && available > 0) return false;

      // Highlight Flags
      if (featuredOnly && !p.isFeatured) return false;
      if (bestSellerOnly && !p.isBestSeller) return false;
      if (newArrivalOnly && !p.isNewArrival) return false;

      return true;
    });
  }, [
    products,
    searchTerm,
    statusFilter,
    stockFilter,
    categoryFilter,
    featuredOnly,
    bestSellerOnly,
    newArrivalOnly,
    categoryMap,
  ]);

  const showNotification = (text: string, error = false) => {
    setActionMessage({ text, error });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Actions
  const handleDuplicate = async (product: Product) => {
    setActionLoadingId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.product) {
        setProducts([data.product, ...products]);
        showNotification(`Duplicated "${product.name}" as Draft formulation.`);
      } else {
        showNotification(data.error || "Failed to duplicate product", true);
      }
    } catch {
      showNotification("Error communicating with catalog server", true);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleArchive = async (product: Product) => {
    const isCurrentlyArchived = product.status === "ARCHIVED";
    const nextAction = isCurrentlyArchived ? "publish" : "archive";
    setActionLoadingId(product.id);

    try {
      const res = await fetch(`/api/products/${product.id}/archive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextAction }),
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setProducts(products.map((p) => (p.id === product.id ? data.product : p)));
        showNotification(
          isCurrentlyArchived
            ? `Published "${product.name}" to live public store.`
            : `Archived "${product.name}". Hidden from public browsing.`
        );
      } else {
        showNotification(data.error || "Failed to change archive status", true);
      }
    } catch {
      showNotification("Network error updating status", true);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmProduct) return;
    const { id, name } = deleteConfirmProduct;
    setActionLoadingId(id);

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        showNotification(`Permanently removed "${name}" from database.`);
        setDeleteConfirmProduct(null);
      } else {
        const data = await res.json();
        showNotification(data.error || "Failed to delete formulation", true);
      }
    } catch {
      showNotification("Network error deleting formulation", true);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Quick stats
  const totalCount = products.length;
  const publishedCount = products.filter(
    (p) => (p.status || (p.isActive ? "PUBLISHED" : "ARCHIVED")) === "PUBLISHED"
  ).length;
  const draftCount = products.filter((p) => p.status === "DRAFT").length;
  const lowStockCount = products.filter((p) => {
    const avail = p.availableStock ?? (p.stock - (p.reservedQuantity || 0));
    return avail > 0 && avail <= (p.lowStockThreshold || 10);
  }).length;

  return (
    <div className="space-y-6 font-sans">
      {/* Action Notification Toast */}
      {actionMessage && (
        <div
          className={`p-3 rounded-luxury text-xs font-sans flex items-center justify-between shadow-luxury transition-all ${
            actionMessage.error
              ? "bg-red-950/90 border border-red-750 text-red-200"
              : "bg-forest-900 border border-gold-500/60 text-gold-300"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-ivory-400 hover:text-ivory-100 p-1">
            ✕
          </button>
        </div>
      )}

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            CATALOG ARCHITECTURE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase tracking-wide">
            Product Formulations ({filteredProducts.length})
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Add, edit, duplicate, publish, and manage live herbal catalog items.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-bold uppercase tracking-[0.2em] rounded-luxury transition-all flex items-center space-x-2 shadow-luxury w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ ADD PRODUCT</span>
        </Link>
      </div>

      {/* Status Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
        <div
          onClick={() => setStatusFilter("all")}
          className={`p-3.5 rounded-luxury border cursor-pointer transition-all ${
            statusFilter === "all"
              ? "bg-forest-900/90 border-gold-500 text-ivory-100 shadow-luxury"
              : "bg-forest-950 border-forest-850 text-ivory-400 hover:border-forest-750"
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider block text-ivory-400">Total Catalog</span>
          <span className="text-xl font-serif text-ivory-100 font-normal">{totalCount}</span>
        </div>

        <div
          onClick={() => setStatusFilter("PUBLISHED")}
          className={`p-3.5 rounded-luxury border cursor-pointer transition-all ${
            statusFilter === "PUBLISHED"
              ? "bg-forest-900/90 border-emerald-500 text-emerald-300 shadow-luxury"
              : "bg-forest-950 border-forest-850 text-ivory-400 hover:border-forest-750"
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider block text-emerald-400">Published (Live)</span>
          <span className="text-xl font-serif text-emerald-300 font-normal">{publishedCount}</span>
        </div>

        <div
          onClick={() => setStatusFilter("DRAFT")}
          className={`p-3.5 rounded-luxury border cursor-pointer transition-all ${
            statusFilter === "DRAFT"
              ? "bg-forest-900/90 border-gold-500 text-gold-300 shadow-luxury"
              : "bg-forest-950 border-forest-850 text-ivory-400 hover:border-forest-750"
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider block text-gold-400">Draft Formulations</span>
          <span className="text-xl font-serif text-gold-300 font-normal">{draftCount}</span>
        </div>

        <div
          onClick={() => setStockFilter("low")}
          className={`p-3.5 rounded-luxury border cursor-pointer transition-all ${
            stockFilter === "low"
              ? "bg-forest-900/90 border-amber-500 text-amber-300 shadow-luxury"
              : "bg-forest-950 border-forest-850 text-ivory-400 hover:border-forest-750"
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider block text-amber-400">Low Stock Alert</span>
          <span className="text-xl font-serif text-amber-300 font-normal">{lowStockCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-forest-950 border border-forest-850 p-4 rounded-luxury space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs pl-9 pr-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-forest-900 border border-forest-800 text-ivory-200 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-forest-900 border border-forest-800 text-ivory-200 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock (≤10)</option>
            <option value="out">Out of Stock (0)</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-forest-900 border border-forest-800 text-ivory-200 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Highlights Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-forest-900 text-xs">
          <span className="text-[10px] uppercase tracking-wider text-ivory-400 font-semibold mr-1">
            Quick Flags:
          </span>
          <button
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={`px-3 py-1 rounded-luxury text-xs flex items-center space-x-1.5 transition-all ${
              featuredOnly
                ? "bg-gold-500 text-forest-950 font-bold"
                : "bg-forest-900/60 border border-forest-800 text-ivory-300 hover:text-gold-400"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Featured ({products.filter((p) => p.isFeatured).length})</span>
          </button>

          <button
            onClick={() => setBestSellerOnly(!bestSellerOnly)}
            className={`px-3 py-1 rounded-luxury text-xs flex items-center space-x-1.5 transition-all ${
              bestSellerOnly
                ? "bg-gold-500 text-forest-950 font-bold"
                : "bg-forest-900/60 border border-forest-800 text-ivory-300 hover:text-gold-400"
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Best Seller ({products.filter((p) => p.isBestSeller).length})</span>
          </button>

          <button
            onClick={() => setNewArrivalOnly(!newArrivalOnly)}
            className={`px-3 py-1 rounded-luxury text-xs flex items-center space-x-1.5 transition-all ${
              newArrivalOnly
                ? "bg-emerald-600 text-white font-bold"
                : "bg-forest-900/60 border border-forest-800 text-ivory-300 hover:text-emerald-400"
            }`}
          >
            <Star className="w-3 h-3" />
            <span>New Arrival ({products.filter((p) => p.isNewArrival).length})</span>
          </button>

          {(searchTerm || statusFilter !== "all" || stockFilter !== "all" || categoryFilter !== "all" || featuredOnly || bestSellerOnly || newArrivalOnly) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setStockFilter("all");
                setCategoryFilter("all");
                setFeaturedOnly(false);
                setBestSellerOnly(false);
                setNewArrivalOnly(false);
              }}
              className="text-[11px] text-gold-400 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-forest-950 border border-forest-850 rounded-luxury overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-forest-900/70 border-b border-forest-850 text-ivory-400 text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">SKU</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Highlights</th>
                <th className="py-3.5 px-4 font-semibold">Updated</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-850/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-ivory-400">
                    <p className="font-serif text-lg text-ivory-200 mb-1">No herbal formulations match the criteria.</p>
                    <p className="text-xs text-ivory-400">Try modifying your search or clearing active filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const status: ProductStatus = product.status || (product.isActive ? "PUBLISHED" : "ARCHIVED");
                  const available = product.availableStock ?? (product.stock - (product.reservedQuantity || 0));
                  const threshold = product.lowStockThreshold || 10;
                  const isLoading = actionLoadingId === product.id;

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-forest-900/30 transition-colors ${
                        status === "ARCHIVED" ? "opacity-60" : ""
                      }`}
                    >
                      {/* Product (Image + Name) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 relative rounded bg-forest-900 overflow-hidden flex-shrink-0 border border-forest-800">
                            <Image
                              src={product.images[0] || product.thumbnail || ""}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="min-w-0 max-w-[200px]">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="font-serif text-sm text-ivory-100 hover:text-gold-400 font-medium block truncate transition-colors"
                              title={product.name}
                            >
                              {product.name}
                            </Link>
                            <span className="text-[10px] text-gold-400/80 font-sans block truncate">
                              {product.productType || "Botanical Formulation"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-ivory-300">
                        {product.sku}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-ivory-300 text-xs">
                        {categoryMap.get(product.categoryId) || "Unassigned"}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-serif text-gold-400 font-medium text-sm">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[10px] text-ivory-400/60 line-through block">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        {available <= 0 ? (
                          <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800 text-[10px] font-mono font-bold uppercase">
                            Out of Stock (0)
                          </span>
                        ) : available <= threshold ? (
                          <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold uppercase">
                            ⚠ Low: {available} left
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-mono uppercase">
                            {available} in stock
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {status === "PUBLISHED" ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-sans font-semibold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>Published</span>
                          </span>
                        ) : status === "DRAFT" ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-sans font-semibold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Draft</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-charcoal-900 text-ivory-400 border border-forest-800 text-[10px] font-sans uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-ivory-500" />
                            <span>Archived</span>
                          </span>
                        )}
                      </td>

                      {/* Highlights */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {product.isFeatured && (
                            <span className="px-1.5 py-0.5 bg-gold-950 text-gold-300 text-[9px] rounded font-mono border border-gold-800">
                              Featured
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="px-1.5 py-0.5 bg-forest-900 text-ivory-200 text-[9px] rounded font-mono border border-forest-750">
                              Best Seller
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 text-[9px] rounded font-mono border border-emerald-800">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Updated Date */}
                      <td className="py-3.5 px-4 text-ivory-400 text-[11px] whitespace-nowrap">
                        {formatDate(product.updatedAt || product.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* View (Preview) */}
                          <Link
                            href={`/product/${product.slug}?preview=true`}
                            target="_blank"
                            title="Preview formulation page"
                            className="p-1.5 text-ivory-300 hover:text-gold-400 rounded hover:bg-forest-900 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            title="Edit formulation"
                            className="p-1.5 text-ivory-300 hover:text-gold-400 rounded hover:bg-forest-900 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicate(product)}
                            disabled={isLoading}
                            title="Duplicate formulation as Draft"
                            className="p-1.5 text-ivory-300 hover:text-gold-400 rounded hover:bg-forest-900 transition-colors disabled:opacity-50"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Archive / Unarchive */}
                          <button
                            onClick={() => handleToggleArchive(product)}
                            disabled={isLoading}
                            title={status === "ARCHIVED" ? "Publish to Live Store" : "Archive Formulation"}
                            className={`p-1.5 rounded transition-colors ${
                              status === "ARCHIVED"
                                ? "text-emerald-400 hover:bg-forest-900"
                                : "text-ivory-400 hover:text-amber-400 hover:bg-forest-900"
                            }`}
                          >
                            <Archive className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmProduct(product)}
                            disabled={isLoading}
                            title="Delete Permanently"
                            className="p-1.5 text-ivory-400 hover:text-red-400 rounded hover:bg-forest-900 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Permanent Delete */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-forest-950 border border-forest-800 p-6 rounded-luxury shadow-2xl text-ivory-100 space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-serif text-xl uppercase tracking-wider">
                Permanent Formulation Removal
              </h3>
            </div>
            <p className="text-xs text-ivory-300 leading-relaxed font-sans font-light">
              Are you sure you want to permanently delete{" "}
              <strong className="text-gold-400 font-semibold">&ldquo;{deleteConfirmProduct.name}&rdquo;</strong> (SKU: {deleteConfirmProduct.sku})?
              <br />
              <span className="text-red-400/90 block mt-2">
                This action cannot be undone. To simply hide it from customers, use <strong>Archive</strong> instead.
              </span>
            </p>
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-forest-850">
              <button
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2 bg-forest-900 hover:bg-forest-850 text-ivory-300 text-xs font-semibold uppercase tracking-wider rounded-luxury"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-luxury shadow-md"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
