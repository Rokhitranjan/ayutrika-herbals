"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Ashwagandha",
  "Kumkumadi Tailam",
  "Turmeric",
  "Holy Tulsi",
  "Triphala",
  "Hair Oil",
  "Shilajit",
  "Saffron",
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-charcoal-950/90 backdrop-blur-md transition-all duration-300">
      {/* Top Bar with Input */}
      <div className="border-b border-forest-800 bg-forest-950/90 px-6 py-6 sm:py-8 shadow-luxury-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-gold-400 absolute left-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by botanical name, herb, benefit (e.g. Ashwagandha, Immunity, Sleep)..."
              className="w-full bg-transparent pl-10 pr-4 text-ivory-100 placeholder-ivory-400/60 font-serif text-lg sm:text-2xl focus:outline-none border-b border-forest-700/60 focus:border-gold-500 pb-2 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-ivory-400 hover:text-ivory-100 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 text-xs uppercase tracking-[0.2em] text-ivory-300 hover:text-gold-400 transition-colors p-2"
          >
            <span>ESC</span>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Searches Pills */}
        <div className="max-w-4xl mx-auto mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gold-400 font-sans tracking-widest uppercase text-[10px] mr-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> POPULAR:
          </span>
          {POPULAR_SEARCHES.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 bg-forest-900/60 hover:bg-forest-800 border border-forest-700/50 hover:border-gold-500/60 text-ivory-200 rounded-luxury transition-all text-[11px] tracking-wider"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Viewport */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-4xl mx-auto w-full">
        {loading && (
          <div className="py-20 text-center text-ivory-300 font-sans tracking-widest text-xs uppercase animate-pulse">
            Searching Botanical Archive...
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="py-20 text-center max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 text-gold-500 mx-auto mb-3 stroke-1" />
            <h3 className="font-serif text-2xl text-ivory-100 mb-2">No Formulations Found</h3>
            <p className="text-ivory-400 text-sm mb-6 font-sans">
              We couldn't find any products matching &ldquo;{query}&rdquo;. Try browsing our curated herbal categories or searching by primary herb.
            </p>
            <Link
              href="/shop"
              onClick={onClose}
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-gold-400 hover:text-gold-300 font-semibold border-b border-gold-500/40 pb-1"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-forest-800 text-xs font-sans tracking-widest uppercase text-ivory-400">
              <span>{results.length} Formulations Found</span>
              <Link
                href={`/shop?search=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="text-gold-400 hover:text-gold-300 flex items-center gap-1"
              >
                <span>View all in shop</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="group flex items-center space-x-4 bg-forest-900/40 hover:bg-forest-900/80 border border-forest-800/80 hover:border-gold-500/50 p-3 rounded-luxury transition-all"
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-forest-950 overflow-hidden rounded-luxury">
                    <Image
                      src={product.images[0] || product.thumbnail || ""}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400/90 font-sans mb-1">
                      {product.ingredients.join(" • ")}
                    </p>
                    <h4 className="font-serif text-base sm:text-lg text-ivory-100 group-hover:text-gold-400 transition-colors truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-sans font-semibold text-ivory-200">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-ivory-400/60 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
