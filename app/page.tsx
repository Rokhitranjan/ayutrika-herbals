import type { Metadata } from "next";
import {
  getProducts,
  getCategories,
  getIngredients,
  getBenefits,
  getBlogPosts,
  getTestimonials,
  getBrandSettings,
} from "@/lib/data/store";
import HomeClient from "@/components/home/HomeClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ayutrika Herbals | Premium Herbal & Botanical Wellness",
  description:
    "Ayutrika Herbals is a premier herbal wellness house crafting authentic classical Ayurvedic preparations, stone-milled botanicals, lipid elixirs, and restorative teas.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ayutrika Herbals | Premium Herbal & Botanical Wellness",
    description:
      "Pure botanical formulations crafted for modern wellness rituals. Rooted in nature. Crafted with care.",
    url: "https://ayutrika-herbals.vercel.app",
    siteName: "Ayutrika Herbals",
    images: [
      {
        url: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "Ayutrika Herbals Luxury Botanical Collection",
      },
    ],
  },
};

export default async function HomePage() {
  const [
    products,
    categories,
    ingredients,
    benefits,
    blogPosts,
    testimonials,
    brandSettings,
  ] = await Promise.all([
    getProducts({ inStockOnly: false }),
    getCategories(),
    getIngredients(),
    getBenefits(),
    getBlogPosts(),
    getTestimonials(),
    getBrandSettings(),
  ]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ayutrika Herbals",
    url: "https://ayutrika-herbals.vercel.app",
    logo: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=85",
    description:
      "Premium herbal wellness brand offering authentic Ayurvedic preparations, adaptogens, and botanical oils.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HomeClient
        products={products}
        categories={categories}
        ingredients={ingredients}
        benefits={benefits}
        blogPosts={blogPosts}
        testimonials={testimonials}
        brandSettings={brandSettings}
      />
    </>
  );
}
