import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductsListClient from "./ProductsListClient";
import { getAllAdminProducts, getCategories } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllAdminProducts();
  const categories = await getCategories();

  return (
    <AdminLayout>
      <ProductsListClient initialProducts={products} categories={categories} />
    </AdminLayout>
  );
}
