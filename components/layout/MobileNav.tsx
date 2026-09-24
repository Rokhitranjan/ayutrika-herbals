"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function MobileNav() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user } = useCustomerAuth();

  // Hide on admin routes
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-forest-950/95 backdrop-blur-md border-t border-forest-800 text-ivory-300 py-2 px-3 shadow-2xl">
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
            pathname === "/" ? "text-gold-400 font-semibold" : "text-ivory-400 hover:text-ivory-100"
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[9px] uppercase tracking-wider mt-1 font-sans">Home</span>
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
            pathname.startsWith("/shop") ? "text-gold-400 font-semibold" : "text-ivory-400 hover:text-ivory-100"
          }`}
        >
          <Sparkles className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[9px] uppercase tracking-wider mt-1 font-sans">Shop</span>
        </Link>

        <Link
          href="/categories"
          className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
            pathname.startsWith("/categories") ? "text-gold-400 font-semibold" : "text-ivory-400 hover:text-ivory-100"
          }`}
        >
          <LayoutGrid className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[9px] uppercase tracking-wider mt-1 font-sans">Categories</span>
        </Link>

        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center p-1.5 transition-colors relative ${
            pathname === "/wishlist" ? "text-gold-400 font-semibold" : "text-ivory-400 hover:text-ivory-100"
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5 stroke-[1.5]" />
            {totalWishlistItems > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-gold-500 text-forest-950 font-bold text-[8px] rounded-full flex items-center justify-center">
                {totalWishlistItems}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider mt-1 font-sans">Wishlist</span>
        </Link>

        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center p-1.5 text-ivory-400 hover:text-ivory-100 transition-colors relative"
          aria-label="Open Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-gold-500 text-forest-950 font-bold text-[8px] rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider mt-1 font-sans">Cart</span>
        </button>

        <Link
          href={user ? "/account" : "/login"}
          className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
            pathname.startsWith("/account") || pathname === "/login"
              ? "text-gold-400 font-semibold"
              : "text-ivory-400 hover:text-ivory-100"
          }`}
        >
          <User className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[9px] uppercase tracking-wider mt-1 font-sans">
            {user ? "Account" : "Sign In"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
