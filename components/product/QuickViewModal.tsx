"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Star, ShoppingBag, Heart, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : [product.thumbnail || ""];

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-forest-950 text-ivory-100 border border-forest-800 rounded-luxury shadow-2xl overflow-hidden z-10 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-ivory-400 hover:text-gold-400 p-2 transition-colors bg-forest-950/70 rounded-full border border-forest-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-6 bg-forest-900/40 flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-luxury overflow-hidden bg-forest-950 border border-forest-800">
              <Image
                src={images[selectedImage] || images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-14 h-14 rounded-luxury overflow-hidden border flex-shrink-0 transition-all ${
                      selectedImage === idx ? "border-gold-500 scale-105" : "border-forest-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Formulation Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
                {product.subcategory || "Botanical Formulation"}
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl text-ivory-100 mt-1 mb-2">
                {product.name}
              </h2>

              <div className="flex items-center space-x-3 mb-4 text-xs text-ivory-300">
                <div className="flex items-center text-gold-400">
                  <Star className="w-4 h-4 fill-gold-400 mr-1" />
                  <span className="font-semibold">{product.rating.toFixed(2)}</span>
                </div>
                <span>•</span>
                <span className="text-ivory-400">{product.reviewCount} Reviews</span>
                <span>•</span>
                <span className={product.stock > 0 ? "text-emerald-400 font-medium" : "text-red-400"}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-2xl font-sans font-bold text-gold-400">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-ivory-400/60 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount && (
                  <span className="text-[10px] bg-gold-500/20 text-gold-400 border border-gold-500/40 px-2 py-0.5 rounded-luxury font-sans font-bold uppercase">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-ivory-300 font-sans leading-relaxed mb-6">
                {product.shortDesc}
              </p>

              {/* Key Ingredients & Benefits Pills */}
              <div className="space-y-3 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ivory-400 block mb-1 font-sans">
                    Primary Herbs
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="px-2.5 py-0.5 bg-forest-900 border border-forest-800 text-ivory-200 text-xs rounded-luxury font-sans"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ivory-400 block mb-1 font-sans">
                    Wellness Benefits
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.benefits.map((ben) => (
                      <span
                        key={ben}
                        className="px-2.5 py-0.5 bg-forest-900/60 border border-forest-750 text-gold-400 text-xs rounded-luxury font-sans"
                      >
                        {ben}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Quantity + Add to Cart + Full Details Link */}
            <div className="space-y-3 pt-4 border-t border-forest-850">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-forest-700 bg-forest-900 rounded-luxury">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-ivory-300 hover:text-gold-400 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-sans font-semibold text-ivory-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-ivory-300 hover:text-gold-400 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3 px-6 text-xs font-sans font-bold tracking-[0.2em] uppercase rounded-luxury transition-all flex items-center justify-center space-x-2 shadow-luxury ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-gold-500 hover:bg-gold-400 text-forest-950"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Collection</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Collection • {formatPrice(product.price * quantity)}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-luxury border transition-all ${
                    isFavorited
                      ? "bg-gold-500 border-gold-500 text-forest-950"
                      : "border-forest-700 text-ivory-200 hover:text-gold-400 bg-forest-900"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-gold-400 hover:text-gold-300 flex items-center space-x-1.5 font-sans tracking-wider uppercase text-[11px]"
                >
                  <span>View Full Details & Rituals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="flex items-center space-x-1 text-[10px] text-ivory-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                  <span>100% Botanical Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
