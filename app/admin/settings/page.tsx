import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import SettingsClient from "./SettingsClient";
import { getBrandSettings } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getBrandSettings();

  return (
    <AdminLayout>
      <SettingsClient initialSettings={settings} />
    </AdminLayout>
  );
}
