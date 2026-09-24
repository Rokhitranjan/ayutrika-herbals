import Link from "next/link";
import { Leaf, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-forest-950 text-ivory-100 min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-900/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto py-16">
        <div className="w-16 h-16 rounded-full bg-forest-900 border border-gold-500/50 flex items-center justify-center mx-auto mb-6 text-gold-400 shadow-gold-glow animate-float-slow">
          <Leaf className="w-8 h-8 stroke-1" />
        </div>

        <span className="font-serif text-5xl sm:text-6xl text-gold-400 font-bold block mb-3">
          404
        </span>

        <h1 className="font-serif text-2xl sm:text-4xl text-ivory-100 uppercase tracking-widest leading-snug mb-4">
          This Path Has Returned to Nature.
        </h1>

        <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-4" />

        <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light leading-relaxed mb-8">
          The botanical page you are seeking could not be found, or has been gently harvested and archived.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-[0.25em] rounded-luxury font-sans transition-all shadow-luxury"
          >
            Return to Sanctuary (Home)
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-forest-900 hover:bg-forest-850 border border-forest-750 text-gold-300 font-semibold text-xs uppercase tracking-[0.25em] rounded-luxury font-sans transition-all"
          >
            Explore Formulations
          </Link>
        </div>
      </div>
    </div>
  );
}
