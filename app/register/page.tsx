"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useCustomerAuth();
  const { refreshCart } = useCart();
  const { refreshWishlist } = useWishlist();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.firstName.trim()) {
      setErrorMsg("First name is required.");
      return;
    }
    if (!form.email.trim()) {
      setErrorMsg("Email address is required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const res = await register(form);
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      await refreshCart();
      await refreshWishlist();
      setTimeout(() => {
        router.push("/account");
      }, 2500);
    } else {
      setErrorMsg(res.message || "Registration could not be completed.");
    }
  };

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-lg bg-forest-900/50 border border-forest-800 p-8 sm:p-12 rounded-luxury shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

        {success ? (
          <div className="text-center py-8 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-forest-900 border border-gold-500/60 flex items-center justify-center mx-auto text-gold-400 shadow-gold-glow animate-float-slow">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block">
              SACRED WELCOME
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-wide">
              Welcome, {form.firstName}
            </h2>

            <div className="w-12 h-[1.5px] bg-gold-500/50 mx-auto" />

            <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light leading-relaxed max-w-sm mx-auto">
              Your patron account in the Ayutrika Botanical Circle has been created.
              Redirecting you to your personal sanctuary dashboard...
            </p>

            <div className="pt-4">
              <Link
                href="/account"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-sans font-semibold underline"
              >
                <span>Proceed to Account Dashboard Immediately</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
                JOIN THE APOTHECARY
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-wide">
                Create Account
              </h1>
              <p className="text-xs text-ivory-300 font-sans mt-2 font-light">
                Enjoy seamless order tracking, private previews, and complimentary apothecary privileges.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 mb-6 bg-red-950/70 border border-red-800/80 rounded-luxury text-xs text-red-300 font-sans flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="e.g. Radhika"
                      className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs pl-10 pr-3 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    placeholder="e.g. Mehra"
                    className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs px-3 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="radhika@example.com"
                    className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs pl-10 pr-3 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98201 44552"
                    className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs pl-10 pr-3 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs pl-10 pr-3 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs pl-10 pr-3 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-ivory-400 font-sans font-light">
                Must contain at least 6 characters, including letters and numbers.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-bold text-xs uppercase tracking-[0.25em] rounded-luxury transition-all flex items-center justify-center space-x-2 shadow-luxury disabled:opacity-50 mt-2"
              >
                <span>{submitting ? "Creating Sanctuary Account..." : "Complete Registration"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 text-center text-xs font-sans text-ivory-400 border-t border-forest-850/80 pt-4">
              <span>Already registered as a patron? </span>
              <Link href="/login" className="text-gold-400 hover:text-gold-300 underline font-medium">
                Sign In Here
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
