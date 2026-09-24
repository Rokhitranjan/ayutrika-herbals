"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  Sparkles,
  Leaf,
  Droplets,
  MessageSquare,
  Share2,
} from "lucide-react";
import { Product, Review } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "./ProductCard";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  initialReviews: Review[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  initialReviews,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "benefits" | "ingredients" | "howToUse" | "storage" | "reviews">("overview");
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, title: "", comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : [product.thumbnail || ""];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: newReview.name,
          rating: newReview.rating,
          title: newReview.title || "Exceptional formulation",
          comment: newReview.comment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews([data, ...reviews]);
        setNewReview({ name: "", rating: 5, title: "", comment: "" });
        setReviewMsg("Thank you. Your patron review has been published.");
      }
    } catch {
      setReviewMsg("Could not submit review at this time.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-sans text-ivory-400 mb-8 sm:mb-12 uppercase tracking-wider">
          <Link href="/" className="hover:text-gold-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold-400 transition-colors">
            Collection
          </Link>
          <span>/</span>
          <span className="text-gold-400 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Showcase Section (Left Gallery / Right Information) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-20 border-b border-forest-850">
          {/* Left: Gallery (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnail Column */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[550px] no-scrollbar flex-shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-luxury overflow-hidden border transition-all flex-shrink-0 ${
                      selectedImage === idx
                        ? "border-gold-500 scale-105 shadow-gold-glow"
                        : "border-forest-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-luxury overflow-hidden bg-forest-900 border border-forest-800 shadow-2xl">
              <Image
                src={images[selectedImage] || images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.discount && product.discount > 0 && (
                  <span className="bg-gold-500 text-forest-950 text-[10px] font-sans font-bold tracking-widest uppercase px-2.5 py-1 rounded-luxury shadow-md">
                    {product.discount}% OFF
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-forest-950/80 border border-gold-500/60 text-gold-400 text-[10px] font-sans font-semibold tracking-widest uppercase px-2.5 py-1 rounded-luxury backdrop-blur-sm">
                    BESTSELLER
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Formulation Details (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Subcategory & Herbs */}
              <div className="flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold mb-2">
                <span>{product.subcategory || "Botanical Formulation"}</span>
                <span>•</span>
                <span>{product.ingredients[0] || "Ayurvedic"}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory-100 tracking-wide uppercase leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating & Stock Summary */}
              <div className="flex items-center space-x-4 mb-6 text-xs text-ivory-300 font-sans">
                <div className="flex items-center text-gold-400">
                  <Star className="w-4 h-4 fill-gold-400 mr-1.5" />
                  <span className="font-bold text-sm">{product.rating.toFixed(2)}</span>
                </div>
                <span>•</span>
                <span className="text-ivory-400">{reviews.length || product.reviewCount} Verified Patron Reviews</span>
                <span>•</span>
                {(() => {
                  const avail = product.availableStock !== undefined ? product.availableStock : (product.stock - (product.reservedQuantity || 0));
                  const threshold = product.lowStockThreshold || 10;
                  if (avail <= 0) {
                    return <span className="text-red-400 font-semibold tracking-wider text-[11px] uppercase">OUT OF STOCK</span>;
                  }
                  if (avail <= threshold) {
                    return (
                      <span className="text-gold-400 font-semibold tracking-wider text-[11px]">
                        LOW STOCK — Only {avail} units remaining
                      </span>
                    );
                  }
                  return <span className="text-emerald-400 font-semibold tracking-wider text-[11px]">IN STOCK — Ready for Dispatch</span>;
                })()}
              </div>

              {/* Price Row */}
              <div className="flex items-baseline space-x-4 mb-6 pb-6 border-b border-forest-850">
                <span className="text-3xl sm:text-4xl font-sans font-bold text-gold-400">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-ivory-400/60 line-through font-sans">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-ivory-400 font-sans uppercase tracking-widest">
                  (Inclusive of all taxes)
                </span>
              </div>

              {/* Short Editorial Description */}
              <p className="text-sm text-ivory-300 font-sans font-light leading-relaxed mb-6">
                {product.shortDesc}
              </p>

              {/* Primary Botanical Herbs and Benefits Tags */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-forest-900/40 border border-forest-800 rounded-luxury">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-gold-400 font-sans block mb-1.5 font-semibold">
                    Primary Herbs
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {product.ingredients.map((ing) => (
                      <span key={ing} className="text-xs text-ivory-200 font-sans bg-forest-950 px-2 py-0.5 rounded border border-forest-800">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-gold-400 font-sans block mb-1.5 font-semibold">
                    Wellness Goals
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {product.benefits.map((b) => (
                      <span key={b} className="text-xs text-gold-400 font-sans bg-forest-950 px-2 py-0.5 rounded border border-forest-800">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Controller & Primary Action Buttons */}
            {(() => {
              const availableStock = product.availableStock !== undefined 
                ? product.availableStock 
                : Math.max(0, product.stock - (product.reservedQuantity || 0));
              const isOutOfStock = availableStock <= 0;

              return (
                <div className="space-y-4 pt-4 border-t border-forest-850">
                  <div className="flex items-center gap-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-forest-700 bg-forest-900 rounded-luxury">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1 || isOutOfStock}
                        className="px-3.5 py-3 text-ivory-300 hover:text-gold-400 disabled:opacity-30 disabled:hover:text-ivory-300 transition-colors font-bold"
                        aria-label="Decrease quantity"
                      >
                        [-]
                      </button>
                      <span className="px-4 py-3 text-xs font-sans font-semibold text-ivory-100 min-w-[2.5rem] text-center">
                        {isOutOfStock ? 0 : quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (quantity < availableStock) {
                            setQuantity((q) => q + 1);
                          }
                        }}
                        disabled={quantity >= availableStock || isOutOfStock}
                        className="px-3.5 py-3 text-ivory-300 hover:text-gold-400 disabled:opacity-30 disabled:hover:text-ivory-300 transition-colors font-bold"
                        aria-label="Increase quantity"
                      >
                        [+]
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`flex-1 py-4 px-6 text-xs font-sans font-bold tracking-[0.25em] uppercase rounded-luxury transition-all flex items-center justify-center space-x-2 shadow-luxury ${
                        isOutOfStock
                          ? "bg-forest-900 text-ivory-400/50 border border-forest-800 cursor-not-allowed"
                          : added
                          ? "bg-emerald-600 text-white"
                          : "bg-gold-500 hover:bg-gold-400 text-forest-950"
                      }`}
                    >
                      {isOutOfStock ? (
                        <span>OUT OF STOCK</span>
                      ) : added ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Collection</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart • {formatPrice(product.price * quantity)}</span>
                        </>
                      )}
                    </button>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className={`p-4 rounded-luxury border transition-all ${
                        isFavorited
                          ? "bg-gold-500 border-gold-500 text-forest-950 shadow-gold-glow"
                          : "border-forest-700 text-ivory-200 hover:text-gold-400 bg-forest-900"
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Buy Now Button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="w-full py-3.5 bg-forest-900 hover:bg-forest-850 disabled:opacity-40 disabled:hover:bg-forest-900 border border-gold-500/60 text-gold-300 text-xs font-sans font-semibold tracking-[0.25em] uppercase rounded-luxury transition-all text-center"
                  >
                    Instant Buy Now with Express Checkout
                  </button>

                  {/* Guarantees Strip */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-forest-850/80 text-[10px] font-sans text-ivory-400">
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
                      <span>100% Pure Botanical</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Truck className="w-4 h-4 text-gold-400 flex-shrink-0" />
                      <span>Free Shipping &gt; ₹1,000</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <RotateCcw className="w-4 h-4 text-gold-400 flex-shrink-0" />
                      <span>Apothecary Guarantee</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Detailed Formulation Tabs (Description, Benefits, Ingredients, Rituals, Storage, Reviews) */}
        <div className="py-16">
          {/* Tab Headers */}
          <div className="flex space-x-6 sm:space-x-8 border-b border-forest-850 overflow-x-auto no-scrollbar mb-8 text-xs font-sans tracking-[0.2em] uppercase">
            {[
              { id: "overview", label: "Overview & Science" },
              { id: "benefits", label: "Key Benefits" },
              { id: "ingredients", label: "Ingredients" },
              { id: "howToUse", label: "How to Use & Rituals" },
              { id: "storage", label: "Information & Storage" },
              { id: "reviews", label: `Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-gold-400 font-bold"
                    : "text-ivory-400 hover:text-ivory-200"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="max-w-4xl space-y-6 text-ivory-300 font-sans text-sm leading-relaxed font-light">
              <h3 className="font-serif text-2xl text-ivory-100 mb-4">
                The Heritage of {product.name}
              </h3>
              <p className="whitespace-pre-line">{product.fullDesc}</p>
              <div className="p-6 bg-forest-900/30 border border-forest-800 rounded-luxury mt-6">
                <span className="text-[10px] tracking-widest uppercase text-gold-400 block mb-1 font-semibold">
                  CLASSICAL AYURVEDIC DOSHA BALANCING
                </span>
                <p className="text-xs text-ivory-200 leading-relaxed font-sans">
                  In classical Ayurvedic philosophy, formulations are curated to align with the elemental doshas. This botanical formulation is traditionally considered harmonizing for daily balance, cooling internal heat, and grounding mental equilibrium.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Benefits */}
          {activeTab === "benefits" && (
            <div className="max-w-4xl">
              <h3 className="font-serif text-2xl text-ivory-100 mb-6">
                Verified Botanical Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.benefits.map((ben) => (
                  <div key={ben} className="p-5 bg-forest-900/40 border border-forest-800 rounded-luxury flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-serif text-lg text-ivory-100">{ben}</h4>
                      <p className="text-xs text-ivory-400 mt-1 font-sans">
                        Carefully crafted active botanical ratios traditionally known to support {ben.toLowerCase()} and natural holistic resilience.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Ingredients */}
          {activeTab === "ingredients" && (
            <div className="max-w-4xl space-y-6">
              <h3 className="font-serif text-2xl text-ivory-100 mb-4">
                Active Botanical Spectrum
              </h3>
              <p className="text-xs text-ivory-400 font-sans">
                Every batch is independently authenticated. Below are the verified active herbs present in this formulation:
              </p>
              <div className="space-y-3">
                {product.ingredients.map((ing) => (
                  <div key={ing} className="p-4 bg-forest-900/40 border border-forest-800 rounded-luxury flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg text-ivory-100">{ing}</h4>
                      <span className="text-[11px] text-gold-400 font-serif italic">100% Pure Certified Harvest</span>
                    </div>
                    <Link
                      href={`/ingredients`}
                      className="text-[11px] uppercase tracking-wider text-gold-400 hover:text-gold-300 font-sans"
                    >
                      View Monograph
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: How to Use */}
          {activeTab === "howToUse" && (
            <div className="max-w-4xl space-y-6">
              <h3 className="font-serif text-2xl text-ivory-100 mb-4">
                The Daily Apothecary Ritual
              </h3>
              <div className="p-6 bg-forest-900/50 border border-forest-800 rounded-luxury space-y-4">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-gold-400 block mb-1 font-semibold">
                    RECOMMENDED USAGE & DOSAGE
                  </span>
                  <p className="text-sm text-ivory-100 font-sans">{product.dosage || "As recommended by your wellness practitioner."}</p>
                </div>
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-gold-400 block mb-1 font-semibold">
                    RITUAL INSTRUCTIONS
                  </span>
                  <p className="text-sm text-ivory-300 leading-relaxed font-sans">{product.howToUse}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Storage & Product Information */}
          {activeTab === "storage" && (
            <div className="max-w-4xl">
              <h3 className="font-serif text-2xl text-ivory-100 mb-6">
                Technical Specifications & Storage
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 bg-forest-900/40 border border-forest-800 rounded-luxury">
                  <span className="text-gold-400 uppercase tracking-widest text-[10px] block mb-1">SKU Number</span>
                  <span className="text-ivory-100 font-semibold">{product.sku}</span>
                </div>
                <div className="p-4 bg-forest-900/40 border border-forest-800 rounded-luxury">
                  <span className="text-gold-400 uppercase tracking-widest text-[10px] block mb-1">Net Weight</span>
                  <span className="text-ivory-100 font-semibold">{product.weight}</span>
                </div>
                <div className="p-4 bg-forest-900/40 border border-forest-800 rounded-luxury">
                  <span className="text-gold-400 uppercase tracking-widest text-[10px] block mb-1">Product Type</span>
                  <span className="text-ivory-100 font-semibold">{product.productType}</span>
                </div>
                <div className="p-4 bg-forest-900/40 border border-forest-800 rounded-luxury">
                  <span className="text-gold-400 uppercase tracking-widest text-[10px] block mb-1">Storage Instructions</span>
                  <span className="text-ivory-100 font-semibold">{product.storage}</span>
                </div>
                {product.importantInfo && (
                  <div className="col-span-1 sm:col-span-2 p-4 bg-forest-900/60 border border-gold-500/30 rounded-luxury">
                    <span className="text-gold-400 uppercase tracking-widest text-[10px] block mb-1 font-semibold">Important Information & Advisory</span>
                    <span className="text-ivory-200 font-sans leading-relaxed">{product.importantInfo}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 6: Customer Reviews */}
          {activeTab === "reviews" && (
            <div className="max-w-4xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-forest-850 gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-ivory-100">
                    Patron Experiences
                  </h3>
                  <div className="flex items-center space-x-2 text-gold-400 mt-1">
                    <Star className="w-4 h-4 fill-gold-400" />
                    <span className="text-sm font-bold font-sans">{product.rating.toFixed(2)} out of 5</span>
                    <span className="text-ivory-400 text-xs font-sans">({reviews.length} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="p-6 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-4">
                <h4 className="font-serif text-lg text-ivory-100">
                  Share Your Experience
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="e.g. Dr. Priyamvada Joshi"
                      className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs p-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                      Rating
                    </label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs p-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans cursor-pointer"
                    >
                      <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                      <option value="4">★★★★☆ (4 Stars - Highly Pleased)</option>
                      <option value="3">★★★☆☆ (3 Stars - Satisfied)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    placeholder="e.g. Transformative botanical quality"
                    className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs p-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Your Thoughts
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Describe the aroma, texture, and how this formulation complements your daily ritual..."
                    className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs p-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-bold text-xs uppercase tracking-widest rounded-luxury transition-all disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Patron Review"}
                </button>
                {reviewMsg && <p className="text-xs text-gold-400 font-sans mt-2">{reviewMsg}</p>}
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-forest-900/30 border border-forest-850 rounded-luxury space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-gold-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-gold-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-ivory-400 font-sans">
                        {rev.verified && <span className="text-emerald-400 mr-1">✓ Verified Patron</span>}
                      </span>
                    </div>
                    <h5 className="font-serif text-base text-ivory-100">{rev.title}</h5>
                    <p className="text-xs text-ivory-300 font-sans leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-gold-400/80 font-sans block pt-1">— {rev.customerName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-forest-850">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-1">
                  COMPLEMENTARY FORMULATIONS
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
                  You May Also Cherish
                </h3>
              </div>
              <Link href="/shop" className="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-sans">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
