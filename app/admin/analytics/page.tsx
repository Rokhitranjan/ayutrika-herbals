import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AnalyticsClient from "./AnalyticsClient";
import { getAnalytics } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics();

  return (
    <AdminLayout>
      <AnalyticsClient analytics={analytics} />
    </AdminLayout>
  );
}
