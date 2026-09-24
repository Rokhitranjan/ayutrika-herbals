"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Eye, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const primaryImg = product.images[0] || product.thumbnail || "";
  const secondaryImg = product.images[1] || primaryImg;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || added) return;
    setAdding(true);
    setTimeout(() => {
      addToCart(product, 1);
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 350);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      data-cursor="view"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-forest-950 border border-forest-850 hover:border-gold-500/50 rounded-luxury overflow-hidden transition-all duration-500 hover:shadow-luxury-lg product-card-hover"
    >
      {/* Product Image Area */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-forest-900">
        {/* Primary Image */}
        <Image
          src={primaryImg}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-all duration-700 ease-out ${
            isHovered && secondaryImg !== primaryImg
              ? "opacity-0 scale-105"
              : "opacity-100 scale-100 group-hover:scale-105"
          }`}
        />

        {/* Secondary Image Flip */}
        {secondaryImg && secondaryImg !== primaryImg && (
          <Image
            src={secondaryImg}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-700 ease-out ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discount && product.discount > 0 ? (
            <span className="bg-gold-500 text-forest-950 text-[9px] font-sans font-bold tracking-widest uppercase px-2 py-0.5 rounded-luxury shadow-md">
              {product.discount}% OFF
            </span>
          ) : null}
          {product.isBestSeller && (
            <span className="bg-forest-900/90 border border-gold-500/60 text-gold-400 text-[9px] font-sans font-semibold tracking-widest uppercase px-2 py-0.5 rounded-luxury">
              BESTSELLER
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="bg-forest-900/90 border border-emerald-500/60 text-emerald-300 text-[9px] font-sans font-semibold tracking-widest uppercase px-2 py-0.5 rounded-luxury">
              NEW ARRIVAL
            </span>
          )}
        </div>

        {/* Top Right Actions (Wishlist & Quick View) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
              isFavorited
                ? "bg-gold-500 text-forest-950 shadow-gold-glow"
                : "bg-forest-950/70 text-ivory-200 hover:text-gold-400 hover:bg-forest-900 border border-forest-800"
            }`}
            aria-label="Add to wishlist"
            title={isFavorited ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
          </button>

          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="w-8 h-8 rounded-full bg-forest-950/70 hover:bg-forest-900 text-ivory-200 hover:text-gold-400 border border-forest-800 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Quick View"
              title="Quick formulation overview"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Subtle Gold Hover Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </Link>

      {/* Product Content Details */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          {/* Key Ingredient Tag */}
          <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase font-sans text-gold-400 mb-1.5 font-medium">
            <span className="truncate">{product.ingredients[0] || "Botanical Formulation"}</span>
            <div className="flex items-center space-x-1 text-ivory-300">
              <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-serif text-base sm:text-lg text-ivory-100 group-hover:text-gold-300 transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Editorial Description */}
          <p className="text-ivory-400/80 text-xs font-sans mt-1 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Price & Action Area */}
        <div className="mt-4 pt-3 border-t border-forest-850/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-sans font-bold text-base sm:text-lg text-ivory-100">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-ivory-400/60 line-through font-sans">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[9px] uppercase tracking-wider text-ivory-400 font-sans block">
              {product.weight || "Pure Formulation"}
            </span>
          </div>

          {/* Micro-interactive Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || adding}
            className={`px-3 sm:px-4 py-2 text-[10px] font-sans font-semibold tracking-[0.2em] uppercase rounded-luxury transition-all duration-300 flex items-center justify-center space-x-1.5 ${
              product.stock <= 0
                ? "bg-forest-900 text-ivory-400/50 cursor-not-allowed border border-forest-800"
                : added
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-forest-900 hover:bg-gold-500 text-ivory-200 hover:text-forest-950 border border-forest-750 hover:border-gold-500"
            }`}
          >
            {product.stock <= 0 ? (
              <span>Out of Stock</span>
            ) : added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : adding ? (
              <span>Adding...</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
