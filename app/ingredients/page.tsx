import { getIngredients, getProducts } from "@/lib/data/store";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Herbal Ingredient Library & Monographs | Ayutrika Herbals",
  description: "Explore our authoritative Ayurvedic herbal library featuring Ashwagandha, Turmeric, Amla, Neem, Tulsi, Brahmi, Shatavari and more.",
};

export default async function IngredientsPage() {
  const [ingredients, products] = await Promise.all([
    getIngredients(),
    getProducts({ inStockOnly: false }),
  ]);

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            BOTANICAL PHARMACOPOEIA
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory-100 uppercase tracking-wide">
            Herbal Ingredient Library
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-6" />
          <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light leading-relaxed">
            Every plant in our formulations is chosen for its specific classical Ayurvedic dosha action, traditional therapeutic prestige, and pure energetic synergy.
          </p>
        </div>

        {/* 2-Column Herb Monographs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {ingredients.map((ing) => {
            const containingProducts = products.filter((p) =>
              p.ingredients.some((i) => i.toLowerCase().includes(ing.name.toLowerCase()))
            );

            return (
              <div
                key={ing.id}
                className="bg-forest-900/40 border border-forest-850 hover:border-gold-500/50 rounded-luxury overflow-hidden transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group shadow-luxury"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full rounded-luxury overflow-hidden bg-forest-950 border border-forest-800 mb-6">
                    <Image
                      src={ing.image}
                      alt={ing.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-serif text-2xl sm:text-3xl text-ivory-100 group-hover:text-gold-300 transition-colors">
                      {ing.name}
                    </h2>
                    <span className="text-xs italic font-serif text-gold-400">
                      {ing.botanicalName}
                    </span>
                  </div>

                  <p className="text-xs text-ivory-300 font-sans leading-relaxed mb-4 font-light">
                    {ing.description}
                  </p>

                  <div className="p-4 bg-forest-950/80 border border-forest-800 rounded-luxury space-y-2 mb-6">
                    <span className="text-[10px] tracking-widest uppercase text-gold-400 font-sans block font-semibold">
                      TRADITIONAL AYURVEDIC USAGE
                    </span>
                    <p className="text-xs text-ivory-200 font-sans leading-relaxed">
                      {ing.traditionalUse}
                    </p>
                  </div>

                  {/* Wellness Benefits Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {ing.benefits.map((b) => (
                      <span
                        key={b}
                        className="text-[10px] font-sans uppercase tracking-wider px-2.5 py-0.5 bg-forest-900 border border-forest-750 text-gold-400 rounded"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Formulations featuring this herb */}
                <div className="pt-4 border-t border-forest-850 flex items-center justify-between">
                  <span className="text-xs font-sans text-ivory-400">
                    Featured in {containingProducts.length} Formulations
                  </span>
                  <Link
                    href={`/shop?ingredient=${encodeURIComponent(ing.name)}`}
                    className="text-xs uppercase tracking-widest font-sans font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1.5"
                  >
                    <span>View Formulations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
