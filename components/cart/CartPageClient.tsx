"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPageClient() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [applying, setApplying] = useState(false);

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
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            BOTANICAL SELECTIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-wide">
            Your Cart
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-4" />
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto bg-forest-900/30 border border-forest-850 rounded-luxury p-8">
            <ShoppingBag className="w-12 h-12 text-gold-500/60 stroke-1 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-ivory-100 mb-2">YOUR COLLECTION AWAITS</h3>
            <p className="text-xs text-ivory-400 mb-6 font-sans">
              Your cart is currently empty. Discover our botanical collection and classical formulations.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs uppercase tracking-widest font-sans font-bold rounded-luxury transition-all shadow-luxury"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Cart Items Table (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Complimentary Delivery Bar */}
              <div className="p-4 bg-forest-900/60 border border-forest-800 rounded-luxury text-xs">
                <div className="flex items-center justify-between text-ivory-300 mb-2 font-sans">
                  {amountNeeded > 0 ? (
                    <span>
                      Add <strong className="text-gold-400 font-semibold">{formatPrice(amountNeeded)}</strong> for complimentary delivery
                    </span>
                  ) : (
                    <span className="text-gold-400 font-medium flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> You have qualified for complimentary pan-India shipping
                    </span>
                  )}
                  <span className="font-semibold">{progressToFreeShipping}%</span>
                </div>
                <div className="w-full bg-forest-950 h-2 rounded-full overflow-hidden border border-forest-800">
                  <div
                    className="bg-gold-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-forest-900/40 border border-forest-850 rounded-luxury divide-y divide-forest-850">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <div className="relative w-20 h-20 bg-forest-900 rounded-luxury overflow-hidden flex-shrink-0 border border-forest-800">
                        <Image
                          src={item.product.images[0] || item.product.thumbnail || ""}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] tracking-widest uppercase text-gold-400 font-sans block mb-1">
                          {item.product.ingredients[0] || "Botanical"}
                        </span>
                        <Link href={`/product/${item.product.slug}`} className="font-serif text-lg text-ivory-100 hover:text-gold-300 transition-colors line-clamp-1">
                          {item.product.name}
                        </Link>
                        <span className="text-xs text-ivory-400 font-sans block mt-0.5">
                          {formatPrice(item.product.price)} each • {item.product.weight || "Pure Formulation"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                      {/* Quantity */}
                      <div className="flex items-center border border-forest-700 bg-forest-950 rounded-luxury">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-ivory-300 hover:text-gold-400 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1.5 text-xs font-sans font-semibold text-ivory-100 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-ivory-300 hover:text-gold-400 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <span className="font-sans font-bold text-base text-gold-400 min-w-[5rem] text-right">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-ivory-400 hover:text-red-400 p-2 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/shop"
                  className="text-xs font-sans uppercase tracking-widest text-gold-400 hover:text-gold-300 flex items-center space-x-1"
                >
                  <span>← Continue Shopping</span>
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs font-sans uppercase tracking-wider text-ivory-400 hover:text-red-400 underline"
                >
                  Clear Collection
                </button>
              </div>
            </div>

            {/* Right: Order Summary (4 Cols) */}
            <div className="lg:col-span-4">
              <div className="p-6 sm:p-8 bg-forest-900/60 border border-forest-850 rounded-luxury space-y-6 shadow-luxury">
                <h3 className="font-serif text-xl uppercase tracking-wider text-ivory-100 pb-3 border-b border-forest-800">
                  Order Summary
                </h3>

                {/* Promo Code Form */}
                <div>
                  {appliedCoupon ? (
                    <div className="p-3 bg-forest-950 border border-gold-500/40 rounded-luxury flex items-center justify-between text-xs">
                      <div className="text-gold-400 flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-semibold">{appliedCoupon.code} applied</span>
                      </div>
                      <button onClick={removeCoupon} className="text-red-400 underline text-[11px]">
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
                        className="flex-1 bg-forest-950 border border-forest-700 text-ivory-100 text-xs p-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans uppercase tracking-wider"
                      />
                      <button
                        type="submit"
                        disabled={applying}
                        className="px-4 py-2 bg-forest-800 hover:bg-forest-750 text-gold-400 text-xs font-sans uppercase tracking-wider rounded-luxury font-semibold disabled:opacity-50"
                      >
                        {applying ? "..." : "Apply"}
                      </button>
                    </form>
                  )}
                  {couponMsg && (
                    <p className={`text-[11px] mt-1.5 font-sans ${couponMsg.error ? "text-red-400" : "text-gold-400"}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Cost Calculations */}
                <div className="space-y-2.5 text-xs font-sans text-ivory-300 border-t border-forest-850 pt-4">
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
                    <span>Estimated Shipping</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-gold-400 font-medium">COMPLIMENTARY</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-serif text-ivory-100 pt-3 border-t border-forest-800 font-bold">
                    <span>Grand Total</span>
                    <span className="text-gold-400 text-xl">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-bold text-xs tracking-[0.25em] uppercase rounded-luxury transition-all flex items-center justify-center space-x-2 shadow-luxury"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-2 flex items-center justify-center space-x-2 text-[10px] text-ivory-400 font-sans">
                  <ShieldCheck className="w-4 h-4 text-gold-500" />
                  <span>256-Bit SSL Encrypted • Pure Formulation Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
