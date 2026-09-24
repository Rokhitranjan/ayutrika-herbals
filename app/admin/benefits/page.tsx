import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import BenefitsClient from "./BenefitsClient";
import { getBenefits } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminBenefitsPage() {
  const benefits = await getBenefits();

  return (
    <AdminLayout>
      <BenefitsClient initialBenefits={benefits} />
    </AdminLayout>
  );
}
