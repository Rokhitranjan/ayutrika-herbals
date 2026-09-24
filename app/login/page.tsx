"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useToast } from "@/context/ToastContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/account";

  const { login, isAuthenticated, loading } = useCustomerAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectPath);
    }
  }, [loading, isAuthenticated, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);

    if (result.success) {
      toast.success("Welcome back to Ayutrika Herbals.");
      router.push(redirectPath);
    } else {
      setErrorMessage(result.message || "Invalid email or password.");
    }
  };

  const handleDemoLogin = async () => {
    setEmail("radhika.mehra@example.com");
    setPassword("Ayutrika@2026!");
    setErrorMessage("");
    setSubmitting(true);
    const result = await login("radhika.mehra@example.com", "Ayutrika@2026!");
    setSubmitting(false);

    if (result.success) {
      toast.success("Welcome back, Radhika.");
      router.push(redirectPath);
    } else {
      setErrorMessage(result.message || "Demo login temporarily unavailable.");
    }
  };

  return (
    <div className="w-full max-w-md bg-forest-900/50 border border-forest-800 p-8 sm:p-10 rounded-luxury shadow-2xl backdrop-blur-sm">
      <div className="text-center mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
          PATRON ACCESS
        </span>
        <h1 className="font-serif text-3xl text-ivory-100 uppercase tracking-wide">
          Welcome Back
        </h1>
        <p className="text-xs text-ivory-300 font-sans mt-2 font-light">
          Sign in to access your formulation orders, saved rituals, and member benefits.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/50 rounded-luxury text-xs text-red-200 flex items-center space-x-2.5 font-sans animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1.5 font-sans">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patron@example.com"
              autoComplete="email"
              className="w-full bg-forest-950 border border-forest-750 text-ivory-100 text-xs pl-10 pr-3.5 py-3 rounded-luxury focus:outline-none focus:border-gold-500 transition-colors font-sans"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans">
              Password *
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] uppercase tracking-wider text-gold-400 hover:text-gold-300 transition-colors font-sans font-medium"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-forest-950 border border-forest-750 text-ivory-100 text-xs pl-10 pr-3.5 py-3 rounded-luxury focus:outline-none focus:border-gold-500 transition-colors font-sans"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 py-3.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-forest-950 font-sans font-bold text-xs uppercase tracking-[0.25em] rounded-luxury transition-all flex items-center justify-center space-x-2 shadow-luxury"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-forest-800">
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={submitting}
          className="w-full py-2.5 bg-forest-950/70 hover:bg-forest-800/80 border border-forest-700/80 text-gold-400 text-xs font-sans uppercase tracking-widest rounded-luxury transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Demo Login (Radhika Mehra)</span>
        </button>
      </div>

      <div className="mt-6 pt-5 border-t border-forest-800 text-center text-xs font-sans text-ivory-300">
        <span>New to Ayutrika Herbals? </span>
        <Link
          href="/register"
          className="text-gold-400 hover:text-gold-300 font-medium uppercase tracking-wider text-[11px] ml-1 underline decoration-gold-400/50 underline-offset-4"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-forest-900/50 border border-forest-800 p-10 rounded-luxury text-center space-y-4">
            <Loader2 className="w-6 h-6 text-gold-400 animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-ivory-300 font-sans">
              Preparing patron portal...
            </p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
