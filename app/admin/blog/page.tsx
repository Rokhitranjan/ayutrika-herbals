import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import BlogAdminClient from "./BlogAdminClient";
import { getAllAdminBlogPosts } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAllAdminBlogPosts();

  return (
    <AdminLayout>
      <BlogAdminClient initialPosts={posts} />
    </AdminLayout>
  );
}
