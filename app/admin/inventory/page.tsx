import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import InventoryClient from "./InventoryClient";
import { getAllAdminProducts } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const products = await getAllAdminProducts();

  return (
    <AdminLayout>
      <InventoryClient initialProducts={products} />
    </AdminLayout>
  );
}
