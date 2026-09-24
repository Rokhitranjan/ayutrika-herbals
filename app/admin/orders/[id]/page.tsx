import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getOrderById, getOrderByNumber } from "@/lib/data/store";
import { notFound } from "next/navigation";
import AdminOrderDetailClient from "./AdminOrderDetailClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Order #${params.id} Control | Ayutrika Admin`,
  };
}

export default async function AdminOrderDetailPage({ params }: Props) {
  let order = await getOrderById(params.id);
  if (!order) {
    order = await getOrderByNumber(params.id);
  }
  if (!order) {
    notFound();
  }

  return (
    <AdminLayout>
      <AdminOrderDetailClient initialOrder={order} />
    </AdminLayout>
  );
}
