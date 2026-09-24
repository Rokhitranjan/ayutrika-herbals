"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, SlidersHorizontal, X, RotateCcw, Check, Sparkles, ChevronDown } from "lucide-react";
import { Product, Category, Ingredient, Benefit } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
  ingredients: Ingredient[];
  benefits: Benefit[];
}

export default function ShopClient({
  initialProducts,
  categories,
  ingredients,
  benefits,
}: ShopClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Query defaults
  const initialCategory = searchParams.get("category") || "all";
  const initialBenefit = searchParams.get("benefit") || "all";
  const initialIngredient = searchParams.get("ingredient") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBenefit, setSelectedBenefit] = useState<string>(initialBenefit);
  const [selectedIngredient, setSelectedIngredient] = useState<string>(initialIngredient);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== "all") {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && product.categoryId !== cat.id) return false;
      }
      // Benefit filter
      if (selectedBenefit !== "all") {
        if (!product.benefits.some((b) => b.toLowerCase().includes(selectedBenefit.toLowerCase()))) {
          return false;
        }
      }
      // Ingredient filter
      if (selectedIngredient !== "all") {
        if (!product.ingredients.some((i) => i.toLowerCase().includes(selectedIngredient.toLowerCase()))) {
          return false;
        }
      }
      // Stock filter
      if (inStockOnly && product.stock <= 0) return false;

      // Price filter
      if (priceRange === "under-1000" && product.price >= 1000) return false;
      if (priceRange === "1000-2000" && (product.price < 1000 || product.price > 2000)) return false;
      if (priceRange === "above-2000" && product.price <= 2000) return false;

      // Search term from URL
      if (initialSearch) {
        const q = initialSearch.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.shortDesc.toLowerCase().includes(q) ||
          product.ingredients.some((i) => i.toLowerCase().includes(q)) ||
          product.benefits.some((b) => b.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "bestselling") return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    initialProducts,
    selectedCategory,
    selectedBenefit,
    selectedIngredient,
    inStockOnly,
    priceRange,
    sortBy,
    initialSearch,
    categories,
  ]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBenefit("all");
    setSelectedIngredient("all");
    setInStockOnly(false);
    setPriceRange("all");
    setSortBy("featured");
    if (initialSearch) {
      router.push("/shop");
    }
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBenefit !== "all" ||
    selectedIngredient !== "all" ||
    inStockOnly ||
    priceRange !== "all" ||
    Boolean(initialSearch);

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Curated Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold mb-2 block">
            PURE AYURVEDIC APOTHECARY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory-100 tracking-wide uppercase">
            The Collection
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-4" />
          <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light leading-relaxed">
            Explore our curated collection of premium herbal powders, restorative infusions, cold-pressed elixirs, and traditional classical formulations.
          </p>
          {initialSearch && (
            <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1 bg-forest-900 border border-gold-500/40 rounded-full text-xs text-gold-400">
              <span>Showing results for &ldquo;{initialSearch}&rdquo;</span>
              <button onClick={() => router.push("/shop")} className="hover:text-ivory-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Filter & Sorting Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-4 sm:px-6 bg-forest-900/60 border border-forest-850 rounded-luxury mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center space-x-2 text-xs font-sans uppercase tracking-widest text-gold-400 hover:text-gold-300 py-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({hasActiveFilters ? "Active" : "All"})</span>
            </button>

            <span className="text-xs font-sans text-ivory-300 hidden sm:inline">
              Showing <strong className="text-gold-400 font-semibold">{filteredProducts.length}</strong> formulations
            </span>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center space-x-1 text-[11px] text-ivory-400 hover:text-gold-400 font-sans uppercase tracking-wider underline transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-xs font-sans text-ivory-400 uppercase tracking-widest hidden sm:inline">
              Sort By:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-forest-950 border border-forest-750 text-ivory-200 text-xs px-3 py-2 pr-8 rounded-luxury focus:outline-none focus:border-gold-500 font-sans uppercase tracking-wider cursor-pointer appearance-none"
              >
                <option value="featured">Featured First</option>
                <option value="bestselling">Best Selling</option>
                <option value="newest">New Arrivals</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gold-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filter + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-3 space-y-8 pr-4">
            {/* Category Filter */}
            <div className="pb-6 border-b border-forest-850">
              <h3 className="font-serif text-lg text-ivory-100 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Categories</span>
              </h3>
              <div className="space-y-1.5 text-xs font-sans">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-2.5 py-1.5 rounded-luxury transition-all flex items-center justify-between ${
                    selectedCategory === "all"
                      ? "bg-gold-500/20 text-gold-400 font-semibold"
                      : "text-ivory-300 hover:text-gold-400"
                  }`}
                >
                  <span>All Formulations</span>
                  <span className="text-[10px] text-ivory-400">{initialProducts.length}</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-luxury transition-all flex items-center justify-between ${
                      selectedCategory === c.slug
                        ? "bg-gold-500/20 text-gold-400 font-semibold"
                        : "text-ivory-300 hover:text-gold-400"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-ivory-400">{c.productCount || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pb-6 border-b border-forest-850">
              <h3 className="font-serif text-lg text-ivory-100 uppercase tracking-wider mb-4">
                Price Range
              </h3>
              <div className="space-y-1.5 text-xs font-sans text-ivory-300">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under-1000", label: "Under ₹1,000" },
                  { id: "1000-2000", label: "₹1,000 – ₹2,000" },
                  { id: "above-2000", label: "Above ₹2,000" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPriceRange(p.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-luxury transition-all flex items-center justify-between ${
                      priceRange === p.id
                        ? "bg-gold-500/20 text-gold-400 font-semibold"
                        : "hover:text-gold-400"
                    }`}
                  >
                    <span>{p.label}</span>
                    {priceRange === p.id && <Check className="w-3.5 h-3.5 text-gold-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Benefit Filter */}
            <div className="pb-6 border-b border-forest-850">
              <h3 className="font-serif text-lg text-ivory-100 uppercase tracking-wider mb-4">
                Wellness Benefit
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedBenefit("all")}
                  className={`px-2.5 py-1 rounded-luxury text-xs font-sans transition-all ${
                    selectedBenefit === "all"
                      ? "bg-gold-500 text-forest-950 font-bold"
                      : "bg-forest-900 border border-forest-750 text-ivory-300 hover:text-gold-400"
                  }`}
                >
                  All
                </button>
                {benefits.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBenefit(b.name)}
                    className={`px-2.5 py-1 rounded-luxury text-xs font-sans transition-all ${
                      selectedBenefit === b.name
                        ? "bg-gold-500 text-forest-950 font-bold"
                        : "bg-forest-900 border border-forest-750 text-ivory-300 hover:text-gold-400"
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Ingredient Filter */}
            <div className="pb-6 border-b border-forest-850">
              <h3 className="font-serif text-lg text-ivory-100 uppercase tracking-wider mb-4">
                Herbal Ingredient
              </h3>
              <div className="space-y-1 text-xs font-sans text-ivory-300 max-h-48 overflow-y-auto no-scrollbar">
                <button
                  onClick={() => setSelectedIngredient("all")}
                  className={`w-full text-left px-2 py-1 rounded-luxury transition-all ${
                    selectedIngredient === "all" ? "text-gold-400 font-semibold" : "hover:text-gold-400"
                  }`}
                >
                  All Herbs
                </button>
                {ingredients.map((ing) => (
                  <button
                    key={ing.id}
                    onClick={() => setSelectedIngredient(ing.name)}
                    className={`w-full text-left px-2 py-1 rounded-luxury transition-all flex items-center justify-between ${
                      selectedIngredient === ing.name ? "text-gold-400 font-semibold" : "hover:text-gold-400"
                    }`}
                  >
                    <span>{ing.name}</span>
                    <span className="italic text-[10px] text-ivory-400 font-serif">
                      {ing.botanicalName.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="pt-2">
              <label className="flex items-center space-x-2 text-xs font-sans text-ivory-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-forest-700 bg-forest-900 text-gold-500 focus:ring-gold-500"
                />
                <span>In Stock Formulations Only</span>
              </label>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
              <div
                className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-forest-950 border-l border-forest-800 p-6 flex flex-col justify-between text-ivory-100 overflow-y-auto">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-forest-800">
                    <h3 className="font-serif text-xl uppercase tracking-wider text-ivory-100">
                      Filter Formulations
                    </h3>
                    <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-ivory-400 hover:text-gold-400">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="font-serif text-sm uppercase tracking-wider text-gold-400 mb-2">Category</h4>
                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`block w-full text-left py-1 ${selectedCategory === "all" ? "text-gold-400 font-bold" : "text-ivory-300"}`}
                      >
                        All
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCategory(c.slug)}
                          className={`block w-full text-left py-1 ${selectedCategory === c.slug ? "text-gold-400 font-bold" : "text-ivory-300"}`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-serif text-sm uppercase tracking-wider text-gold-400 mb-2">Benefit</h4>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {benefits.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBenefit(selectedBenefit === b.name ? "all" : b.name)}
                          className={`px-2 py-1 rounded-luxury border ${
                            selectedBenefit === b.name ? "bg-gold-500 text-forest-950 font-bold" : "border-forest-800 text-ivory-300"
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* In Stock */}
                  <label className="flex items-center space-x-2 text-xs font-sans text-ivory-200">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded text-gold-500"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>

                <div className="pt-6 border-t border-forest-800 space-y-2">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-3 bg-gold-500 text-forest-950 font-sans font-bold text-xs uppercase tracking-widest rounded-luxury"
                  >
                    View {filteredProducts.length} Products
                  </button>
                  <button
                    onClick={resetFilters}
                    className="w-full py-2 text-xs uppercase tracking-wider text-ivory-400 hover:text-gold-400"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid Area (4 Columns on Desktop, 2-3 on Tablet, 2 on Mobile) */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center bg-forest-900/30 border border-forest-850 rounded-luxury p-8">
                <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-3 stroke-1" />
                <h3 className="font-serif text-2xl text-ivory-100 mb-2">
                  No Matching Formulations
                </h3>
                <p className="text-xs sm:text-sm text-ivory-400 max-w-md mx-auto mb-6 font-sans">
                  We could not find any herbal formulations matching your selected filters. Please adjust or reset your search parameters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-forest-900 hover:bg-gold-500 hover:text-forest-950 border border-gold-500/50 text-gold-400 font-sans text-xs tracking-widest uppercase rounded-luxury transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
