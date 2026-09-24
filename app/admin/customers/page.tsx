import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CustomersClient from "./CustomersClient";
import { getCustomers } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <AdminLayout>
      <CustomersClient initialCustomers={customers} />
    </AdminLayout>
  );
}
