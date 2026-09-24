import { getProductBySlug, getRelatedProducts, getReviewsByProduct } from "@/lib/data/store";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
  searchParams?: { preview?: string };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const isPreview = searchParams?.preview === "true";
  const product = await getProductBySlug(params.slug, isPreview);
  if (!product) {
    return { title: "Formulation Not Found | Ayutrika Herbals" };
  }

  const title = product.seoTitle || `${product.name} | Ayutrika Herbals`;
  const description = product.seoDescription || product.shortDesc;
  const image = product.images[0] || product.thumbnail || "";

  return {
    title,
    description,
    keywords: product.seoKeywords.length > 0 ? product.seoKeywords : [product.name, "Ayurvedic formulation"],
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params, searchParams }: Props) {
  const isPreview = searchParams?.preview === "true";
  const product = await getProductBySlug(params.slug, isPreview);
  if (!product) {
    notFound();
  }

  const [relatedProducts, reviews] = await Promise.all([
    getRelatedProducts(product.id, 4),
    getReviewsByProduct(product.id),
  ]);

  // Structured Data (JSON-LD Product Schema)
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.shortDesc,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Ayutrika Herbals",
    },
    offers: {
      "@type": "Offer",
      url: `https://ayutrika-herbals.vercel.app/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        initialReviews={reviews}
      />
    </>
  );
}
