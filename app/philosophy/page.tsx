import { getBrandSettings } from "@/lib/data/store";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Leaf, ArrowRight, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Philosophy | Ayutrika Herbals",
  description: "Rooted in nature, refined for modern wellness. Discover our Ayurvedic sourcing principles, quality standards, and craftsmanship.",
};

export default async function PhilosophyPage() {
  const settings = await getBrandSettings();

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-[10px] tracking-[0.35em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            PHILOSOPHY & PRINCIPLES
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory-100 uppercase tracking-wide leading-tight">
            Rooted in Nature.
            <br />
            <span className="text-gold-gradient font-light">Refined for Modern Wellness.</span>
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-6" />
        </div>

        <div className="relative aspect-[21/9] w-full rounded-luxury overflow-hidden border border-forest-800 shadow-2xl bg-forest-900">
          <Image
            src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1600&q=85"
            alt="Ayutrika Botanical Sanctuary"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
        </div>

        <div className="max-w-3xl mx-auto space-y-8 text-ivory-200 font-sans text-sm sm:text-base leading-relaxed font-light whitespace-pre-line border-l-2 border-gold-500/40 pl-6 sm:pl-8">
          {settings.brandPhilosophy}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-forest-850">
          <div className="p-8 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-sans block font-semibold">
              PILLAR I
            </span>
            <h3 className="font-serif text-2xl text-ivory-100">Classical Formulation Rigor</h3>
            <p className="text-xs text-ivory-300 font-sans leading-relaxed">
              We follow the classical procedures outlined in revered Ayurvedic treatises (Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya) without cutting corners with synthetic excipients.
            </p>
          </div>

          <div className="p-8 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-sans block font-semibold">
              PILLAR II
            </span>
            <h3 className="font-serif text-2xl text-ivory-100">Whole Plant Synergy</h3>
            <p className="text-xs text-ivory-300 font-sans leading-relaxed">
              Ayurveda teaches that the whole plant contains balancing co-factors that prevent unwanted side effects. We honor the complete botanical matrix rather than isolated artificial chemical extracts.
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 px-10 py-4 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-[0.25em] rounded-luxury font-sans transition-all shadow-luxury"
          >
            <span>Experience Our Formulations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
