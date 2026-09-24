import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import IngredientsClient from "./IngredientsClient";
import { getIngredients } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminIngredientsPage() {
  const ingredients = await getIngredients();

  return (
    <AdminLayout>
      <IngredientsClient initialIngredients={ingredients} />
    </AdminLayout>
  );
}
