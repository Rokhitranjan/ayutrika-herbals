import { getProducts, getCategories, getIngredients, getBenefits } from "@/lib/data/store";
import ShopClient from "@/components/shop/ShopClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Collection — Curated Ayurvedic Herbal Formulations",
  description:
    "Explore our complete range of certified organic herbal powders, Ayurvedic whole leaf teas, botanical facial nectars, and classical Rasayana preparations.",
};

export default async function ShopPage() {
  const [products, categories, ingredients, benefits] = await Promise.all([
    getProducts({ inStockOnly: false }),
    getCategories(),
    getIngredients(),
    getBenefits(),
  ]);

  return (
    <ShopClient
      initialProducts={products}
      categories={categories}
      ingredients={ingredients}
      benefits={benefits}
    />
  );
}
