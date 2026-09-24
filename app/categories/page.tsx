import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/data/store";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Apothecary Categories | Ayutrika Herbals",
  description: "Browse our curated herbal collections: Herbal Powders, Ayurvedic Teas, Botanical Oils, Classical Churnas, and Natural Skincare.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            BOTANICAL FORMS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory-100 tracking-wide uppercase">
            Apothecary Categories
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-4" />
          <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light leading-relaxed">
            Every botanical formulation is presented in traditional forms—from single-origin stone-milled powders to cold-pressed restorative lipids.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative aspect-[4/3] rounded-luxury overflow-hidden border border-forest-850 hover:border-gold-500/60 shadow-luxury transition-all duration-500 flex flex-col justify-end p-8"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.55] group-hover:brightness-[0.65]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
              <div className="relative z-10">
                <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold mb-1 block">
                  {cat.productCount || 0} Curated Formulations
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ivory-100 group-hover:text-gold-300 transition-colors">
                  {cat.name}
                </h2>
                <p className="text-xs text-ivory-300/80 font-sans mt-2 line-clamp-2 font-light">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center space-x-1.5 text-gold-400 text-xs font-sans tracking-widest uppercase font-semibold">
                  <span>Explore Formulations</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
