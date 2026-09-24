"use client";

import React, { useState } from "react";
import { BrandSettings } from "@/lib/types";
import { Save, Check, ShieldAlert, Sparkles, Building, Mail, Phone, Palette, Globe } from "lucide-react";

interface SettingsClientProps {
  initialSettings: BrandSettings;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
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
        alert("Failed to save brand settings");
      }
    } catch {
      alert("Error saving settings");
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
            BRAND CONFIGURATION
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Ayutrika Brand Identity &amp; Business Settings
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Manage official brand naming, contact details, editorial philosophies, and luxury color tokens.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-semibold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-2 shadow-luxury disabled:opacity-50 w-fit"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Preserving Changes..." : "Save Brand Settings"}</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-luxury text-emerald-300 text-xs font-sans flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Brand Identity settings updated and synced across all pages!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Official Identity & Placeholders */}
        <div className="bg-forest-950 border border-forest-850 p-6 rounded-luxury space-y-4">
          <div className="flex items-center justify-between border-b border-forest-850 pb-2">
            <h2 className="font-serif text-base text-gold-400 uppercase tracking-wider">
              1. Official Brand Identity &amp; Naming
            </h2>
            <span className="text-[10px] text-ivory-400 font-mono">Strict Consistency</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Official Brand Name *
              </label>
              <input
                type="text"
                required
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-gold-400 text-sm px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-serif font-bold uppercase tracking-wider"
              />
              <p className="text-[10px] text-ivory-500 font-mono mt-1">
                Must remain strictly &quot;AYUTRIKA HERBALS&quot;
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Official Tagline / Placeholder
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
              Brand Description (CMS Placeholder)
            </label>
            <textarea
              rows={2}
              value={settings.brandDescription}
              onChange={(e) => setSettings({ ...settings, brandDescription: e.target.value })}
              className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Brand Story (Placeholder)
              </label>
              <textarea
                rows={3}
                value={settings.brandStory}
                onChange={(e) => setSettings({ ...settings, brandStory: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Brand Philosophy (Placeholder)
              </label>
              <textarea
                rows={3}
                value={settings.brandPhilosophy}
                onChange={(e) => setSettings({ ...settings, brandPhilosophy: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Contact Information Placeholders */}
        <div className="bg-forest-950 border border-forest-850 p-6 rounded-luxury space-y-4">
          <div className="flex items-center justify-between border-b border-forest-850 pb-2">
            <h2 className="font-serif text-base text-gold-400 uppercase tracking-wider">
              2. Official Business &amp; Contact Coordinates
            </h2>
            <span className="text-[10px] text-ivory-400 font-mono">Editable Placeholders</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Official Email
              </label>
              <input
                type="text"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Official Phone Number
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Official WhatsApp
              </label>
              <input
                type="text"
                value={settings.contactWhatsApp}
                onChange={(e) => setSettings({ ...settings, contactWhatsApp: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
              Official Business Address
            </label>
            <input
              type="text"
              value={settings.businessAddress}
              onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
              className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Official GST Information
              </label>
              <input
                type="text"
                value={settings.gstNumber}
                onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Official Certification Information
              </label>
              <input
                type="text"
                value={settings.certifications}
                onChange={(e) => setSettings({ ...settings, certifications: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Social Media Channels */}
        <div className="bg-forest-950 border border-forest-850 p-6 rounded-luxury space-y-4">
          <div className="flex items-center justify-between border-b border-forest-850 pb-2">
            <h2 className="font-serif text-base text-gold-400 uppercase tracking-wider">
              3. Social Media Presence
            </h2>
            <span className="text-[10px] text-ivory-400 font-mono">Digital Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Instagram URL
              </label>
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Facebook URL
              </label>
              <input
                type="text"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                YouTube URL
              </label>
              <input
                type="text"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                LinkedIn URL
              </label>
              <input
                type="text"
                value={settings.linkedinUrl}
                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Luxury Color Palette Tokens */}
        <div className="bg-forest-950 border border-forest-850 p-6 rounded-luxury space-y-4">
          <div className="flex items-center justify-between border-b border-forest-850 pb-2">
            <h2 className="font-serif text-base text-gold-400 uppercase tracking-wider">
              4. Luxury Color System
            </h2>
            <span className="text-[10px] text-ivory-400 font-mono">Hexadecimal Theme Tokens</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Deep Forest (Primary)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-8 h-8 rounded border border-forest-800 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-2.5 py-1.5 rounded font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Emerald (Secondary)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  className="w-8 h-8 rounded border border-forest-800 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-2.5 py-1.5 rounded font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Champagne Gold (Accent)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                  className="w-8 h-8 rounded border border-forest-800 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-2.5 py-1.5 rounded font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                Warm Ivory (Background)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded border border-forest-800 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-2.5 py-1.5 rounded font-mono uppercase"
                />
              </div>
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
            <span>{saving ? "Saving Changes..." : "Save Brand Identity"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
