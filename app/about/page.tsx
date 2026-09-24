import { getBrandSettings } from "@/lib/data/store";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Shield, Award, Leaf, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | Ayutrika Herbals",
  description: "Learn about Ayutrika Herbals, our ethical wildcrafting practices, traditional stone-milling, and authentic Ayurvedic heritage.",
};

export default async function AboutPage() {
  const settings = await getBrandSettings();

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-[10px] tracking-[0.35em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            BOTANICAL HERITAGE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory-100 uppercase tracking-wide leading-tight">
            Our Story & Heritage
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-6" />
          <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light leading-relaxed">
            {settings.brandDescription}
          </p>
        </div>

        {/* Hero Visual Presentation */}
        <div className="relative aspect-[16/9] w-full rounded-luxury overflow-hidden border border-forest-800 shadow-2xl bg-forest-900">
          <Image
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=85"
            alt="Ayutrika Botanical Preparation"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-6 bg-forest-950/80 backdrop-blur-md border border-forest-800 rounded-luxury max-w-lg">
            <span className="text-[9px] uppercase tracking-widest text-gold-400 font-sans block mb-1 font-semibold">
              OUR MOTTO
            </span>
            <p className="font-serif text-base sm:text-lg text-ivory-100 italic">
              &ldquo;Rooted in Nature. Crafted with Care.&rdquo;
            </p>
          </div>
        </div>

        {/* The Brand Story Narrative */}
        <div className="max-w-3xl mx-auto space-y-6 text-ivory-200 font-sans text-sm sm:text-base leading-relaxed font-light whitespace-pre-line border-l-2 border-gold-500/40 pl-6 sm:pl-8">
          {settings.brandStory}
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-forest-850">
          <div className="p-8 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-3">
            <Leaf className="w-6 h-6 text-gold-400 stroke-1" />
            <h3 className="font-serif text-xl text-ivory-100">Ethical Wildcrafting</h3>
            <p className="text-xs text-ivory-300/80 font-sans leading-relaxed">
              We collaborate with tribal foragers in the Western Ghats and Himalayan foothills, ensuring sustainable harvesting cycles that protect biodiversity.
            </p>
          </div>

          <div className="p-8 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-3">
            <Award className="w-6 h-6 text-gold-400 stroke-1" />
            <h3 className="font-serif text-xl text-ivory-100">Low-Heat Processing</h3>
            <p className="text-xs text-ivory-300/80 font-sans leading-relaxed">
              Industrial high-speed grinding destroys volatile essential oils. We employ traditional slow stone milling to keep active herbal synergy intact.
            </p>
          </div>

          <div className="p-8 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-3">
            <Shield className="w-6 h-6 text-gold-400 stroke-1" />
            <h3 className="font-serif text-xl text-ivory-100">Uncompromising Purity</h3>
            <p className="text-xs text-ivory-300/80 font-sans leading-relaxed">
              Every single batch is independently screened for heavy metals, pesticides, and microbial purity before receiving our official apothecary seal.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 px-10 py-4 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-[0.25em] rounded-luxury font-sans transition-all shadow-luxury"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
