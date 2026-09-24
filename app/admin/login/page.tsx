"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ShieldAlert, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@ayutrika.com");
  const [password, setPassword] = useState("Ayutrika@Admin2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Network error connecting to security gateway");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-charcoal-950 text-ivory-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-forest-950 border border-forest-800 p-8 sm:p-10 rounded-luxury shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-forest-900 border border-gold-500/60 flex items-center justify-center mx-auto mb-3 text-gold-400">
            <Lock className="w-5 h-5 stroke-1" />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-1">
            APOTHECARY MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase tracking-wide">
            Admin Portal
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-1">
            Authenticate to manage products, orders, inventory, and CMS.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 rounded-luxury text-red-300 text-xs font-sans mb-6 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-forest-900/60 border border-forest-750 text-ivory-100 text-xs pl-10 pr-3 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-forest-900/60 border border-forest-750 text-ivory-100 text-xs pl-10 pr-3 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-bold text-xs uppercase tracking-[0.25em] rounded-luxury transition-all flex items-center justify-center space-x-2 shadow-luxury disabled:opacity-50 mt-2"
          >
            <span>{loading ? "Authenticating..." : "Enter Admin Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-forest-850/80 text-center">
          <p className="text-[11px] text-ivory-400 font-sans">
            Default credentials configured for immediate access:
            <br />
            <strong className="text-gold-400 font-mono text-[10px]">admin@ayutrika.com</strong> / <strong className="text-gold-400 font-mono text-[10px]">Ayutrika@Admin2026!</strong>
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-xs text-ivory-400 hover:text-gold-400 uppercase tracking-widest font-sans transition-colors"
          >
            ← Return to Public Store
          </Link>
        </div>
      </div>
    </div>
  );
}
