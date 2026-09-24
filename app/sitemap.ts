import { MetadataRoute } from "next";
import { getProducts, getCategories, getBlogPosts } from "@/lib/data/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ayutrika-herbals.vercel.app";

  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/ingredients",
    "/philosophy",
    "/about",
    "/journal",
    "/contact",
    "/faq",
    "/shipping-policy",
    "/returns-policy",
    "/privacy-policy",
    "/terms-conditions",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch only published products
  const allProducts = await getProducts({ inStockOnly: false });
  const publishedProducts = allProducts.filter((p) => p.isActive && p.status === "PUBLISHED");
  const productRoutes = publishedProducts.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Categories
  const categories = await getCategories();
  const categoryRoutes = categories.map((c) => ({
    url: `${siteUrl}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Published Journal / Blog articles
  const blogPosts = await getBlogPosts();
  const publishedBlogPosts = blogPosts.filter((b) => b.isPublished !== false);
  const blogRoutes = publishedBlogPosts.map((b) => ({
    url: `${siteUrl}/journal/${b.slug}`,
    lastModified: new Date(b.updatedAt || b.createdAt || Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}
