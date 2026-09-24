"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Shield, CheckCircle2, Instagram, Facebook, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-forest-950 text-ivory-100 border-t border-forest-850 pt-16 sm:pt-20 pb-24 lg:pb-12 relative overflow-hidden">
      {/* Decorative Gold & Botanical Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-emerald-900/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter Section: "THE BOTANICAL LETTER" */}
        <div className="bg-forest-900/50 border border-forest-800/80 p-8 sm:p-12 rounded-luxury mb-16 shadow-luxury">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-gold-400 font-sans text-[10px] tracking-[0.3em] uppercase mb-2 inline-flex items-center gap-1.5 font-semibold">
              <Leaf className="w-3 h-3 text-gold-400" />
              THE BOTANICAL LETTER
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory-100 mt-1 mb-3">
              Join Our Private Botanical Circle
            </h3>
            <p className="text-ivory-300/80 font-sans text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed">
              Receive curated seasonal herbal monographs, Ayurvedic wellness rituals, private previews of limited batch harvests, and exclusive patron privileges.
            </p>

            {subscribed ? (
              <div className="p-4 bg-forest-950/80 border border-gold-500/60 rounded-luxury text-gold-400 text-xs font-sans flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                <span className="tracking-wider uppercase">Welcome to the Ayutrika Botanical Circle. Check your inbox shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-forest-950 border border-forest-700 text-ivory-100 text-xs px-4 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans placeholder-ivory-400/50"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-bold text-[11px] tracking-[0.2em] uppercase rounded-luxury transition-all flex items-center justify-center space-x-2 shadow-luxury"
                >
                  <span>JOIN THE CIRCLE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-forest-850">
          {/* Column 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-8">
            <Link href="/" className="inline-block">
              <h2 className="font-serif text-2xl tracking-[0.16em] uppercase text-ivory-100">
                AYUTRIKA HERBALS
              </h2>
              <p className="text-[9px] uppercase tracking-[0.3em] text-gold-400 font-sans mt-0.5">
                Premium Herbal & Natural Wellness
              </p>
            </Link>
            <p className="text-ivory-400 text-xs leading-relaxed font-sans max-w-md">
              Ayutrika Herbals is a premium herbal wellness brand offering thoughtfully presented botanical and natural products inspired by the richness of nature.
            </p>
            <p className="text-gold-400/90 font-serif italic text-sm">
              &ldquo;Rooted in Nature. Crafted for Wellness.&rdquo;
            </p>

            <div className="pt-2 space-y-2 text-xs text-ivory-400 font-sans">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>[OFFICIAL BUSINESS ADDRESS]</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>[OFFICIAL EMAIL]</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>[OFFICIAL PHONE NUMBER]</span>
              </div>
            </div>
          </div>

          {/* Column 2: The Collection */}
          <div className="space-y-3">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-400">
              The Collection
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-ivory-300">
              <li>
                <Link href="/shop" className="hover:text-gold-400 transition-colors">
                  All Formulations
                </Link>
              </li>
              <li>
                <Link href="/categories/herbal-powders" className="hover:text-gold-400 transition-colors">
                  Herbal Powders
                </Link>
              </li>
              <li>
                <Link href="/categories/herbal-teas" className="hover:text-gold-400 transition-colors">
                  Ayurvedic Teas
                </Link>
              </li>
              <li>
                <Link href="/categories/herbal-oils" className="hover:text-gold-400 transition-colors">
                  Botanical Oils & Elixirs
                </Link>
              </li>
              <li>
                <Link href="/categories/ayurvedic-formulations" className="hover:text-gold-400 transition-colors">
                  Classical Churnas
                </Link>
              </li>
              <li>
                <Link href="/categories/natural-skincare" className="hover:text-gold-400 transition-colors">
                  Natural Skincare
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Botanical Wisdom */}
          <div className="space-y-3">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-400">
              Botanical Wisdom
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-ivory-300">
              <li>
                <Link href="/ingredients" className="hover:text-gold-400 transition-colors">
                  Herbal Ingredient Library
                </Link>
              </li>
              <li>
                <Link href="/philosophy" className="hover:text-gold-400 transition-colors">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-gold-400 transition-colors">
                  The Botanical Journal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  About Ayutrika
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-400 transition-colors">
                  Apothecary Concierge
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-400">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-ivory-300">
              <li>
                <Link href="/account/orders" className="hover:text-gold-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-gold-400 transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-gold-400 transition-colors">
                  Returns & Replacements
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gold-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-gold-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gold-400/80 hover:text-gold-300 transition-colors">
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Socials, & Herbal Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-ivory-400">
          <p>© 2026 AYUTRIKA HERBALS. All rights reserved.</p>

          <div className="flex items-center space-x-5 text-ivory-400">
            <a
              href="[OFFICIAL INSTAGRAM]"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="[OFFICIAL FACEBOOK]"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-400 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="[OFFICIAL YOUTUBE]"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-400 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="[OFFICIAL LINKEDIN]"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          <div className="text-[10px] text-ivory-400/60 max-w-sm text-center sm:text-right">
            Ayutrika Herbals formulations are crafted for daily wellness support and rooted in classical herbal traditions. Not intended to diagnose, treat, cure, or prevent any medical condition.
          </div>
        </div>
      </div>
    </footer>
  );
}
