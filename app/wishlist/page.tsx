import WishlistClient from "@/components/wishlist/WishlistClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Saved Formulations | Ayutrika Herbals",
  description: "View and manage your saved Ayurvedic herbal products and personal wellness wishlist.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
