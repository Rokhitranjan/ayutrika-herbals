"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = typeof params?.token === "string" ? params.token : "";
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!token) {
      setErrorMessage("Missing reset authorization token. Please request a new link.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setCompleted(true);
        toast.success("Your password has been successfully updated.");
      } else {
        setErrorMessage(data.error || "Failed to reset password.");
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
            SECURITY CREDENTIALS
          </span>
          <h1 className="font-serif text-3xl text-ivory-100 uppercase tracking-wide">
            New Password
          </h1>
          <p className="text-xs text-ivory-300 font-sans mt-2 font-light">
            Create a robust, private password to safeguard your Ayutrika Herbals patron sanctuary.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/50 rounded-luxury text-xs text-red-200 flex items-center space-x-2.5 font-sans animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {completed ? (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-ivory-100 mb-2">
                Credentials Updated
              </h3>
              <p className="text-xs text-ivory-300 font-sans leading-relaxed">
                Your new password has been established and hashed securely. You may now sign in to your patron account.
              </p>
            </div>
            <div className="pt-4 border-t border-forest-800">
              <Link
                href="/login"
                className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-bold text-xs uppercase tracking-[0.25em] rounded-luxury transition-all flex items-center justify-center space-x-2 shadow-luxury"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1.5 font-sans">
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full bg-forest-950 border border-forest-750 text-ivory-100 text-xs pl-10 pr-3.5 py-3 rounded-luxury focus:outline-none focus:border-gold-500 transition-colors font-sans"
                />
              </div>
              <p className="text-[10px] text-ivory-400 font-sans mt-1">
                Must be at least 8 characters with letters and numbers.
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1.5 font-sans">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
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
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
