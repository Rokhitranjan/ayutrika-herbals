"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight, Leaf } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import SearchModal from "../search/SearchModal";
import CartDrawer from "../cart/CartDrawer";

const NAV_LINKS = [
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/categories" },
  { name: "Our Story", href: "/about" },
  { name: "Ingredients", href: "/ingredients" },
  { name: "Journal", href: "/journal" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user } = useCustomerAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer upon route transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "bg-forest-950/95 backdrop-blur-md border-b border-gold-500/20 shadow-luxury py-3.5"
            : "bg-forest-950/75 backdrop-blur-sm border-b border-forest-900/60 py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Section: Mobile Menu Trigger & First Tier Desktop Nav */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-ivory-200 hover:text-gold-400 p-1.5 transition-colors focus:outline-none"
                aria-label="Open luxury navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <nav className="hidden lg:flex items-center space-x-7">
                {NAV_LINKS.slice(0, 3).map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-xs uppercase tracking-[0.22em] font-sans transition-all duration-200 relative py-1 ${
                        isActive
                          ? "text-gold-400 font-semibold"
                          : "text-ivory-200 hover:text-gold-400 font-medium"
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Center: Refined Official Brand Mark */}
            <div className="text-center">
              <Link href="/" className="inline-block group">
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60 group-hover:bg-gold-400 transition-colors" />
                  <span className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory-100 tracking-[0.2em] uppercase font-normal transition-colors group-hover:text-gold-300">
                    AYUTRIKA HERBALS
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60 group-hover:bg-gold-400 transition-colors" />
                </div>
                <p className="text-[9px] tracking-[0.35em] uppercase text-gold-400/90 font-sans mt-0.5 font-medium">
                  Botanical Wellness Apothecary
                </p>
              </Link>
            </div>

            {/* Right Section: Second Tier Desktop Nav & Action Triggers */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <nav className="hidden lg:flex items-center space-x-7 mr-2">
                {NAV_LINKS.slice(3).map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-xs uppercase tracking-[0.22em] font-sans transition-all duration-200 relative py-1 ${
                        isActive
                          ? "text-gold-400 font-semibold"
                          : "text-ivory-200 hover:text-gold-400 font-medium"
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-ivory-200 hover:text-gold-400 p-1.5 transition-colors relative"
                aria-label="Search herbal products"
                title="Search formulations"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* Account Link */}
              <Link
                href={user ? "/account" : "/login"}
                className="text-ivory-200 hover:text-gold-400 p-1.5 transition-colors hidden sm:block relative"
                aria-label="Customer Account"
                title={user ? `Signed in as ${user.name}` : "Sign In / Register"}
              >
                <User className="w-5 h-5 stroke-[1.5]" />
                {user && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full" />
                )}
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="text-ivory-200 hover:text-gold-400 p-1.5 transition-colors relative"
                aria-label="Saved products"
                title="Your Saved Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-forest-950 font-sans font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="text-ivory-200 hover:text-gold-400 p-1.5 transition-colors relative"
                aria-label="Open cart drawer"
                title="Your Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-forest-950 font-sans font-bold text-[9px] rounded-full flex items-center justify-center shadow-gold-glow">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-forest-950 border-r border-forest-800 p-6 flex flex-col justify-between text-ivory-100 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-forest-800">
                <div>
                  <h2 className="font-serif text-lg tracking-widest text-ivory-100 uppercase">
                    AYUTRIKA HERBALS
                  </h2>
                  <p className="text-[8px] uppercase tracking-widest text-gold-400 font-sans">
                    Apothecary Menu
                  </p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-ivory-300 hover:text-gold-400 p-1"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="py-6 space-y-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm uppercase tracking-[0.2em] font-sans text-ivory-200 hover:text-gold-400 transition-colors border-b border-forest-900"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-500/60" />
                  </Link>
                ))}
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-sm uppercase tracking-[0.2em] font-sans text-ivory-200 hover:text-gold-400 transition-colors border-b border-forest-900"
                >
                  <span>My Account</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-500/60" />
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-sm uppercase tracking-[0.2em] font-sans text-ivory-200 hover:text-gold-400 transition-colors border-b border-forest-900"
                >
                  <span>FAQ &amp; Concierge</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-500/60" />
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-xs uppercase tracking-[0.2em] font-sans text-gold-400/80 hover:text-gold-300 transition-colors pt-4"
                >
                  <span>Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-500" />
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-forest-800 space-y-2">
              <div className="flex items-center space-x-2 text-[10px] text-ivory-400 uppercase tracking-widest font-sans">
                <Leaf className="w-3 h-3 text-gold-500" />
                <span>Pure • Natural • Herbal</span>
              </div>
              <p className="text-[10px] text-ivory-400/80 font-serif italic">
                &ldquo;Rooted in Nature. Crafted for Wellness.&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Overlays */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
