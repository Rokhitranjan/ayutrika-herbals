"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, CartItem, Coupon, CartSummary } from "@/lib/types";
import { useToast } from "./ToastContext";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<{ success: boolean; message?: string }>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  lastAddedProduct: Product | null;
  refreshCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const applySummary = useCallback((summary: CartSummary) => {
    const formattedCart: CartItem[] = summary.items.map((it) => ({
      product: it.product,
      quantity: it.quantity,
    }));
    setCart(formattedCart);
    setSubtotal(summary.subtotal);
    setDiscount(summary.discount);
    setShippingFee(summary.shippingFee);
    setTotal(summary.total);
    setTotalItems(summary.totalQuantity);
    setAppliedCoupon(summary.appliedCoupon || null);
  }, []);

  const refreshCart = useCallback(async (couponCode?: string) => {
    try {
      const url = couponCode ? `/api/cart?coupon=${encodeURIComponent(couponCode)}` : "/api/cart";
      const res = await fetch(url);
      if (res.ok) {
        const summary: CartSummary = await res.json();
        applySummary(summary);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [applySummary]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product: Product, quantity: number = 1): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        applySummary(data.cartSummary);
        setLastAddedProduct(product);
        setIsCartOpen(true);
        toast.success(`✓ Added ${product.name} to your collection`);
        return { success: true, message: data.message };
      } else {
        toast.error(data.message || data.error || "Could not add to collection.");
        return { success: false, message: data.message || data.error };
      }
    } catch {
      toast.error("Network error while adding to cart.");
      return { success: false, message: "Network error" };
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (res.ok && data.cartSummary) {
        applySummary(data.cartSummary);
        toast.info("✓ Cart updated");
      }
    } catch {
      toast.error("Could not update item quantity.");
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const res = await fetch(`/api/cart?productId=${encodeURIComponent(productId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.cartSummary) {
        applySummary(data.cartSummary);
        toast.info("Item removed from collection");
      }
    } catch {
      toast.error("Could not remove item.");
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch("/api/cart?clear=true", { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.cartSummary) {
        applySummary(data.cartSummary);
        toast.info("Cart cleared");
      }
    } catch {
      toast.error("Could not clear cart.");
    }
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/cart?coupon=${encodeURIComponent(code)}`);
      if (res.ok) {
        const summary: CartSummary = await res.json();
        applySummary(summary);
        if (summary.appliedCoupon) {
          toast.success(`✓ Promotion code ${summary.appliedCoupon.code} applied`);
          return { success: true, message: `Coupon ${summary.appliedCoupon.code} applied.` };
        } else {
          toast.error("Invalid coupon code or minimum order value not reached.");
          return { success: false, message: "Invalid or ineligible promotional code." };
        }
      }
      return { success: false, message: "Could not validate coupon." };
    } catch {
      return { success: false, message: "Network error applying coupon." };
    }
  };

  const removeCoupon = async () => {
    setAppliedCoupon(null);
    await refreshCart();
    toast.info("Promotional code removed");
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        shippingFee,
        total,
        isCartOpen,
        openCart,
        closeCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        lastAddedProduct,
        refreshCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
