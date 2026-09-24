import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductEditor from "@/components/admin/ProductEditor";
import { getCategories, getIngredients, getBenefits } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();
  const ingredients = await getIngredients();
  const benefits = await getBenefits();

  return (
    <AdminLayout>
      <ProductEditor
        categories={categories}
        availableIngredients={ingredients}
        availableBenefits={benefits}
      />
    </AdminLayout>
  );
}
