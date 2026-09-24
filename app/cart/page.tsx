import CartPageClient from "@/components/cart/CartPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart | Ayutrika Herbals",
  description: "Review your selected botanical formulations, enter promo codes, and proceed to secure checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}
