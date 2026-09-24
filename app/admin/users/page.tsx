import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UsersClient />
    </AdminLayout>
  );
}
