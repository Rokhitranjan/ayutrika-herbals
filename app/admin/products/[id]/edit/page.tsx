import React from "react";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductEditor from "@/components/admin/ProductEditor";
import { getProductById, getCategories, getIngredients, getBenefits } from "@/lib/data/store";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProductById(params.id);
  if (!product) {
    notFound();
  }

  const categories = await getCategories();
  const ingredients = await getIngredients();
  const benefits = await getBenefits();

  return (
    <AdminLayout>
      <ProductEditor
        initialProduct={product}
        categories={categories}
        availableIngredients={ingredients}
        availableBenefits={benefits}
        isEdit={true}
      />
    </AdminLayout>
  );
}
