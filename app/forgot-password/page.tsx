"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        if (data.resetToken) {
          setDevToken(data.resetToken);
        }
        toast.info("Password reset instructions dispatched.");
      } else {
        setErrorMessage(data.error || "Unable to process password reset.");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-forest-900/50 border border-forest-800 p-8 sm:p-10 rounded-luxury shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            ACCOUNT RECOVERY
          </span>
          <h1 className="font-serif text-3xl text-ivory-100 uppercase tracking-wide">
            Reset Password
          </h1>
          <p className="text-xs text-ivory-300 font-sans mt-2 font-light leading-relaxed">
            Enter the email address associated with your Ayutrika Herbals account. We will dispatch a secure link to reset your credentials.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/50 rounded-luxury text-xs text-red-200 flex items-center space-x-2.5 font-sans animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-ivory-100 mb-2">
                Recovery Instructions Dispatched
              </h3>
              <p className="text-xs text-ivory-300 font-sans leading-relaxed">
                If an account exists for <span className="text-gold-400 font-medium">{email}</span>, a secure one-time reset link has been dispatched. Please review your inbox.
              </p>
            </div>

            {/* Development token assistance for smooth local testing */}
            {devToken && (
              <div className="p-4 bg-forest-950/80 border border-gold-500/30 rounded-luxury text-left space-y-2">
                <div className="flex items-center space-x-2 text-gold-400 text-[10px] uppercase tracking-wider font-semibold font-sans">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Local Development Reset Link</span>
                </div>
                <p className="text-[11px] text-ivory-300 font-sans">
                  Email server simulated in development. Click below to test password reset:
                </p>
                <Link
                  href={`/reset-password/${devToken}`}
                  className="inline-block text-xs text-gold-400 hover:text-gold-300 underline font-sans break-all"
                >
                  Proceed to Reset Password &rarr;
                </Link>
              </div>
            )}

            <div className="pt-4 border-t border-forest-800">
              <Link
                href="/login"
                className="w-full py-3 bg-forest-850 hover:bg-forest-800 text-ivory-200 font-sans font-semibold text-xs uppercase tracking-widest rounded-luxury transition-all flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3.5 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-forest-950 font-sans font-bold text-xs uppercase tracking-[0.25em] rounded-luxury transition-all flex items-center justify-center space-x-2 shadow-luxury"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Dispatch Reset Link</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="mt-6 pt-5 border-t border-forest-800 text-center">
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 text-xs text-ivory-400 hover:text-gold-400 transition-colors font-sans"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
