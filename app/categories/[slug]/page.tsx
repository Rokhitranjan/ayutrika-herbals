import { getCategoryBySlug, getProducts, getCategories } from "@/lib/data/store";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategoryBySlug(params.slug);
  if (!cat) return { title: "Category Not Found | Ayutrika Herbals" };
  return {
    title: `${cat.name} — Curated Formulations | Ayutrika Herbals`,
    description: cat.description,
    alternates: {
      canonical: `/categories/${cat.slug}`,
    },
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const cat = await getCategoryBySlug(params.slug);
  if (!cat) notFound();

  const products = await getProducts({ categoryId: cat.id, inStockOnly: false });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Sanctuary",
        item: "https://ayutrika-herbals.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: "https://ayutrika-herbals.vercel.app/categories",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cat.name,
        item: `https://ayutrika-herbals.vercel.app/categories/${cat.slug}`,
      },
    ],
  };

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-7xl mx-auto">
        <Link
          href="/categories"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-sans mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </Link>

        {/* Category Header Banner */}
        <div className="relative rounded-luxury overflow-hidden border border-forest-800 p-8 sm:p-14 mb-12 bg-forest-900/60 shadow-luxury">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
              CURATED COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-wide mb-3">
              {cat.name}
            </h1>
            <p className="text-xs sm:text-sm text-ivory-300 font-sans leading-relaxed font-light mb-4">
              {cat.description}
            </p>
            <span className="text-xs text-gold-400 font-sans">
              {products.length} formulations available
            </span>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ivory-400 font-sans text-sm">
              New formulations are currently being cured for this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
