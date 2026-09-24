import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ReviewsClient from "./ReviewsClient";
import { getAllAdminReviews, getAllAdminProducts } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await getAllAdminReviews();
  const products = await getAllAdminProducts();

  return (
    <AdminLayout>
      <ReviewsClient initialReviews={reviews} products={products} />
    </AdminLayout>
  );
}
