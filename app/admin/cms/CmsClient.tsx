"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandSettings, Product, Testimonial } from "@/lib/types";
import { Save, Check, ExternalLink, Image as ImageIcon, Sparkles, MessageSquare } from "lucide-react";

interface CmsClientProps {
  initialSettings: BrandSettings;
  products: Product[];
  testimonials: Testimonial[];
}

export default function CmsClient({
  initialSettings,
  products,
  testimonials,
}: CmsClientProps) {
  const [settings, setSettings] = useState<BrandSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        alert("Failed to update homepage CMS settings.");
      }
    } catch {
      alert("Error saving homepage settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            EDITORIAL STOREFRONT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Homepage CMS Studio
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Customize hero headlines, promotional hero photography, call-to-actions, and editorial narratives.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 bg-forest-900 hover:bg-forest-850 border border-forest-800 text-ivory-300 text-xs font-semibold rounded-luxury flex items-center space-x-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
            <span>View Live Storefront</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-semibold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-2 shadow-luxury disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Publishing Changes..." : "Save Homepage CMS"}</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-luxury text-emerald-300 text-xs font-sans flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Homepage CMS studio published successfully to the live sanctuary!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Full-Screen Luxury Hero */}
        <div className="bg-forest-950 border border-forest-850 p-6 rounded-luxury space-y-4">
          <div className="flex items-center justify-between border-b border-forest-850 pb-2">
            <h2 className="font-serif text-base text-gold-400 uppercase tracking-wider">
              1. Hero Presentation &amp; Photography
            </h2>
            <span className="text-[10px] text-ivory-400 font-mono">Full Viewport First Fold</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Hero Title (Editorial Heading)
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-sm px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-serif"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Hero Subtitle / Tagline
                </label>
                <textarea
                  rows={2}
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-200 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={settings.heroCtaText}
                    onChange={(e) => setSettings({ ...settings, heroCtaText: e.target.value })}
                    className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Primary CTA Link
                  </label>
                  <input
                    type="text"
                    value={settings.heroCtaLink}
                    onChange={(e) => setSettings({ ...settings, heroCtaLink: e.target.value })}
                    className="w-full bg-forest-900/60 border border-forest-800 text-ivory-300 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Hero Atmospheric Background Image URL
                </label>
                <input
                  type="url"
                  value={settings.heroImage}
                  onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>
            </div>

            {/* Live Hero Image Preview */}
            <div className="lg:col-span-4">
              <span className="text-[10px] uppercase tracking-wider text-ivory-400 block mb-1.5 font-sans">
                Hero Image Preview:
              </span>
              <div className="relative aspect-[4/3] rounded-luxury overflow-hidden bg-forest-900 border border-forest-800">
                <Image
                  src={settings.heroImage || "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"}
                  alt="Hero Preview"
                  fill
                  className="object-cover"
                  sizes="260px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Editorial Narrative & Brand Statement */}
        <div className="bg-forest-950 border border-forest-850 p-6 rounded-luxury space-y-4">
          <div className="flex items-center justify-between border-b border-forest-850 pb-2">
            <h2 className="font-serif text-base text-gold-400 uppercase tracking-wider">
              2. Editorial Introduction Statement
            </h2>
            <span className="text-[10px] text-ivory-400 font-mono">The Art of Natural Wellness</span>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
              Editorial Description
            </label>
            <textarea
              rows={3}
              value={settings.brandDescription}
              onChange={(e) => setSettings({ ...settings, brandDescription: e.target.value })}
              className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
            />
          </div>
        </div>

        {/* Card 3: Footer Editorial Statement */}
        <div className="bg-forest-950 border border-forest-850 p-6 rounded-luxury space-y-4">
          <div className="flex items-center justify-between border-b border-forest-850 pb-2">
            <h2 className="font-serif text-base text-gold-400 uppercase tracking-wider">
              3. Footer Editorial &amp; Legal
            </h2>
            <span className="text-[10px] text-ivory-400 font-mono">Bottom Anchor</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Footer Brand Summary
              </label>
              <textarea
                rows={3}
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-200 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Copyright Notice
              </label>
              <textarea
                rows={3}
                value={settings.copyrightText}
                onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-200 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-bold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-2 shadow-luxury disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Publishing..." : "Save All Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
