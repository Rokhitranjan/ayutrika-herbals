import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CategoriesClient from "./CategoriesClient";
import { getCategories } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <AdminLayout>
      <CategoriesClient initialCategories={categories} />
    </AdminLayout>
  );
}
