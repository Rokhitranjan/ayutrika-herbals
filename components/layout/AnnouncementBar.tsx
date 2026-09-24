"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Leaf } from "lucide-react";

const announcements = [
  {
    icon: <Sparkles className="w-3 h-3 text-gold-400" />,
    text: "COMPLIMENTARY BOTANICAL DELIVERY ACROSS INDIA ON ORDERS OVER ₹1,000",
  },
  {
    icon: <Leaf className="w-3 h-3 text-gold-400" />,
    text: "USE CODE 'BOTANICAL15' FOR 15% OFF YOUR APOTHECARY ORDER",
  },
  {
    icon: <ShieldCheck className="w-3 h-3 text-gold-400" />,
    text: "AYUTRIKA HERBALS — 100% PURE BOTANICALS & WILD-HARVESTED HERBS",
  },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[index];

  return (
    <div className="bg-forest-950 text-ivory-100 border-b border-forest-850 text-[11px] font-sans tracking-[0.2em] uppercase py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-2 text-ivory-400 text-[10px]">
          <span>AYURVEDIC HERITAGE</span>
          <span className="text-gold-500">•</span>
          <span>MODERN LUXURY</span>
        </div>

        <div className="flex-1 flex items-center justify-center space-x-2.5 text-center transition-all duration-500">
          {current.icon}
          <span className="font-medium text-ivory-200">{current.text}</span>
        </div>

        <div className="hidden md:flex items-center space-x-4 text-[10px] text-ivory-300">
          <Link href="/faq" className="hover:text-gold-400 transition-colors">
            HELP & CONCIERGE
          </Link>
          <span className="text-forest-700">|</span>
          <Link href="/journal" className="hover:text-gold-400 transition-colors">
            JOURNAL
          </Link>
        </div>
      </div>
    </div>
  );
}
