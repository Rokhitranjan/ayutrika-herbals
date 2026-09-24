"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    total,
    isCartOpen,
    closeCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [applying, setApplying] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1000;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponCode);
    setApplying(false);
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponCode("");
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-[90] overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-forest-950 text-ivory-100 border-l border-forest-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-forest-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-gold-400 stroke-1" />
              <h2 className="font-serif text-xl tracking-wider text-ivory-100 uppercase">
                Your Collection
              </h2>
              <span className="text-xs bg-forest-850 border border-forest-700 text-gold-400 px-2 py-0.5 rounded-full font-sans">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="text-ivory-300 hover:text-gold-400 p-1.5 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Bar */}
          <div className="px-6 py-3 bg-forest-900/60 border-b border-forest-800/80 text-xs">
            <div className="flex items-center justify-between text-ivory-300 mb-1.5 font-sans">
              {amountNeeded > 0 ? (
                <span>
                  Add <strong className="text-gold-400 font-semibold">{formatPrice(amountNeeded)}</strong> for complimentary delivery
                </span>
              ) : (
                <span className="text-gold-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Congratulations! You qualify for complimentary delivery
                </span>
              )}
              <span className="font-semibold">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-forest-950 h-1.5 rounded-full overflow-hidden border border-forest-800">
              <div
                className="bg-gold-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List or Empty State */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-forest-900 border border-forest-800 flex items-center justify-center mb-4 text-gold-400">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif text-2xl text-ivory-100 mb-2">
                  Your Collection Awaits
                </h3>
                <p className="text-ivory-400 text-sm max-w-xs font-sans mb-6">
                  Your botanical cart is currently empty. Explore our handcrafted herbal elixirs, powders, and teas.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-semibold text-xs tracking-[0.2em] uppercase rounded-luxury transition-all"
                >
                  <Link href="/shop">Explore Products</Link>
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex space-x-4 pb-4 border-b border-forest-850/80 items-start group"
                >
                  <div className="relative w-20 h-20 bg-forest-900 rounded-luxury overflow-hidden flex-shrink-0 border border-forest-800">
                    <Image
                      src={item.product.images[0] || item.product.thumbnail || ""}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="font-serif text-base text-ivory-100 hover:text-gold-400 transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-ivory-400 hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-gold-400/90 font-sans mb-2">
                      {item.product.productType || "Botanical Ritual"}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-forest-700 bg-forest-900/60 rounded-luxury">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-ivory-300 hover:text-gold-400 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-sans font-medium text-ivory-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-ivory-300 hover:text-gold-400 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-sans font-semibold text-sm text-ivory-100">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-forest-800 bg-forest-950/95 space-y-4">
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-forest-900/80 border border-gold-500/40 rounded-luxury text-xs">
                    <div className="flex items-center space-x-2 text-gold-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="font-semibold tracking-wider">{appliedCoupon.code} applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-ivory-400 hover:text-red-400 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo code (e.g. BOTANICAL15)"
                      className="flex-1 bg-forest-900 border border-forest-700 text-ivory-100 text-xs px-3 py-2 rounded-luxury focus:outline-none focus:border-gold-500 uppercase tracking-wider font-sans placeholder-ivory-400/50"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-4 py-2 bg-forest-850 hover:bg-forest-800 border border-forest-700 text-gold-400 text-xs font-sans tracking-widest uppercase rounded-luxury transition-all disabled:opacity-50"
                    >
                      {applying ? "..." : "Apply"}
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1 font-sans ${
                      couponMsg.error ? "text-red-400" : "text-gold-400"
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs text-ivory-300 font-sans border-t border-forest-850/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-ivory-100">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-gold-400">
                    <span>Botanical Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-gold-400 font-medium">COMPLIMENTARY</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-ivory-100 pt-2 border-t border-forest-850 font-bold">
                  <span>Total</span>
                  <span className="text-gold-400">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-bold text-xs tracking-[0.25em] uppercase rounded-luxury transition-all shadow-luxury"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full block text-center py-2.5 text-xs text-ivory-300 hover:text-gold-400 tracking-[0.2em] uppercase font-sans transition-colors"
                >
                  View Full Cart & Details
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-ivory-400 font-sans pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                <span>256-Bit Encrypted Secure Checkout • Pure Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
