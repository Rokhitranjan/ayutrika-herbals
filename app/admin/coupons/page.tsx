import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CouponsClient from "./CouponsClient";
import { getCoupons } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  return (
    <AdminLayout>
      <CouponsClient initialCoupons={coupons} />
    </AdminLayout>
  );
}
