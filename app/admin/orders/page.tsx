import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import OrdersClient from "./OrdersClient";
import { getOrders } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <AdminLayout>
      <OrdersClient initialOrders={orders} />
    </AdminLayout>
  );
}
