"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Sparkles, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, log to telemetry if available, without exposing stack traces to user
    console.error("Botanical sanctuary boundary caught an unexpected disturbance:", error?.message);
  }, [error]);

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      <div className="relative z-10 max-w-lg mx-auto py-16">
        <div className="w-16 h-16 rounded-full bg-forest-900 border border-gold-500/50 flex items-center justify-center mx-auto mb-6 text-gold-400 shadow-gold-glow animate-float-slow">
          <Sparkles className="w-8 h-8 stroke-1" />
        </div>

        <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
          BOTANICAL SERENITY MOMENTARILY DISTURBED
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase tracking-wider leading-snug mb-4">
          A Moment of Pause in the Sanctuary
        </h1>

        <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-4" />

        <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light leading-relaxed mb-8">
          Our herbal archive is temporarily realigning. No credentials, data, or personal details were compromised.
          Please try reconnecting to the apothecary or explore our collections.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs uppercase tracking-[0.2em] rounded-luxury font-sans transition-all shadow-luxury flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restore Harmony (Retry)</span>
          </button>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-forest-900 hover:bg-forest-850 border border-forest-750 text-gold-300 font-semibold text-xs uppercase tracking-[0.2em] rounded-luxury font-sans transition-all"
          >
            Browse Formulations
          </Link>
        </div>
      </div>
    </div>
  );
}
