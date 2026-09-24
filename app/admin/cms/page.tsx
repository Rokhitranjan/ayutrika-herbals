import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CmsClient from "./CmsClient";
import { getBrandSettings, getProducts, getTestimonials } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  const settings = await getBrandSettings();
  const products = await getProducts();
  const testimonials = await getTestimonials();

  return (
    <AdminLayout>
      <CmsClient
        initialSettings={settings}
        products={products}
        testimonials={testimonials}
      />
    </AdminLayout>
  );
}
