"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function WishlistClient() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleMoveToCart = async (product: Product) => {
    if (product.stock <= 0) {
      toast.error("This formulation is currently unavailable.");
      return;
    }
    const res = await addToCart(product, 1);
    if (res.success) {
      await removeFromWishlist(product.id);
      toast.success(`✓ Moved ${product.name} to Cart`);
    }
  };

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            SAVED BOTANICALS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-wide">
            Your Wishlist
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-4" />
          <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light">
            Formulations you have earmarked for your upcoming wellness rituals.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto bg-forest-900/30 border border-forest-850 rounded-luxury p-8">
            <Heart className="w-12 h-12 text-gold-500/60 stroke-1 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-ivory-100 mb-2">Your Wishlist is Empty</h3>
            <p className="text-xs text-ivory-400 mb-6 font-sans">
              As you explore our collection, save formulations that resonate with your personal wellness constitution.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs uppercase tracking-widest font-sans font-bold rounded-luxury transition-all shadow-luxury"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const isUnavailable = product.stock <= 0;
              return (
                <div
                  key={product.id}
                  className="bg-forest-950 border border-forest-850 rounded-luxury overflow-hidden flex flex-col justify-between group hover:border-gold-500/50 transition-all shadow-luxury"
                >
                  <div className="relative aspect-square w-full bg-forest-900 overflow-hidden">
                    <Image
                      src={product.images?.[0] || product.thumbnail || ""}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-forest-950/80 text-ivory-300 hover:text-red-400 border border-forest-750 flex items-center justify-center transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {isUnavailable && (
                      <div className="absolute bottom-2 left-2 right-2 bg-charcoal-950/90 border border-red-500/60 text-red-300 text-[10px] uppercase font-bold tracking-wider py-1 px-2 text-center rounded-luxury font-sans">
                        CURRENTLY UNAVAILABLE
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] tracking-widest uppercase text-gold-400 font-sans block mb-1">
                        {product.category || product.subcategory || product.productType || "Botanical Formulation"}
                      </span>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-serif text-lg text-ivory-100 hover:text-gold-300 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="font-sans font-bold text-base text-ivory-100">
                          {formatPrice(product.price)}
                        </span>
                        {(product.compareAtPrice || product.originalPrice) && (
                          <span className="text-xs text-ivory-400/60 line-through font-sans">
                            {formatPrice(product.compareAtPrice || product.originalPrice || 0)}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] uppercase font-sans mt-1.5 block font-medium ${
                          isUnavailable ? "text-red-400" : "text-emerald-400"
                        }`}
                      >
                        {isUnavailable ? "CURRENTLY UNAVAILABLE" : "IN STOCK • READY FOR DISPATCH"}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-forest-850 space-y-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        disabled={isUnavailable}
                        className="w-full py-2.5 px-4 bg-forest-900 hover:bg-gold-500 hover:text-forest-950 border border-forest-750 text-gold-400 text-xs font-sans uppercase tracking-widest font-semibold rounded-luxury transition-all flex items-center justify-center space-x-2 disabled:opacity-40 disabled:hover:bg-forest-900 disabled:hover:text-gold-400"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
