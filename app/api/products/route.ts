import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct, getAllAdminProducts } from "@/lib/data/store";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const benefit = searchParams.get("benefit") || undefined;
    const ingredient = searchParams.get("ingredient") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured") === "true";
    const bestSeller = searchParams.get("bestSeller") === "true";
    const newArrival = searchParams.get("newArrival") === "true";
    const inStockOnly = searchParams.get("inStock") === "true";
    const sortBy = searchParams.get("sortBy") || undefined;
    const priceMin = searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined;
    const priceMax = searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined;
    const all = searchParams.get("all") === "true";

    if (all) {
      const allProducts = await getAllAdminProducts();
      return NextResponse.json(allProducts);
    }

    const products = await getProducts({
      categorySlug,
      categoryId,
      benefit,
      ingredient,
      search,
      featured: featured || undefined,
      bestSeller: bestSeller || undefined,
      newArrival: newArrival || undefined,
      inStockOnly: inStockOnly || undefined,
      sortBy,
      priceMin,
      priceMax,
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const required = ["name", "slug", "sku", "categoryId", "price", "shortDesc", "fullDesc"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const product = await createProduct({
      name: body.name,
      slug: body.slug,
      sku: body.sku,
      categoryId: body.categoryId,
      subcategory: body.subcategory || "General",
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      discount: body.discount ? Number(body.discount) : 0,
      stock: body.stock !== undefined ? Number(body.stock) : 0,
      shortDesc: body.shortDesc,
      fullDesc: body.fullDesc,
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=85"
      ],
      thumbnail: body.thumbnail || (body.images?.[0] || ""),
      ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      howToUse: body.howToUse || "",
      dosage: body.dosage || "",
      storage: body.storage || "Store in cool dry place.",
      weight: body.weight || "100g",
      dimensions: body.dimensions || "",
      productType: body.productType || "Botanical Formulation",
      tags: Array.isArray(body.tags) ? body.tags : [],
      seoTitle: body.seoTitle || `${body.name} | Ayutrika Herbals`,
      seoDescription: body.seoDescription || body.shortDesc,
      seoKeywords: Array.isArray(body.seoKeywords) ? body.seoKeywords : [],
      isFeatured: Boolean(body.isFeatured),
      isBestSeller: Boolean(body.isBestSeller),
      isNewArrival: Boolean(body.isNewArrival),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      rating: 4.9,
      reviewCount: 0,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
