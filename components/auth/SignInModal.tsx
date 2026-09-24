"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, X, ArrowRight, ShieldCheck } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function SignInModal({ isOpen, onClose, message }: SignInModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative bg-forest-950 border border-forest-800 w-full max-w-md rounded-luxury p-8 sm:p-10 text-center shadow-2xl z-10 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-ivory-400 hover:text-ivory-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-forest-900 border border-gold-500/50 flex items-center justify-center mx-auto text-gold-400 shadow-gold-glow">
          <Sparkles className="w-7 h-7 stroke-1" />
        </div>

        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            APOTHECARY PATRON PRIVILEGES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase tracking-wide">
            Sign In to Continue
          </h2>
          <p className="text-xs sm:text-sm text-ivory-300 font-sans mt-3 font-light leading-relaxed">
            {message || "Save your wishlist, manage your orders, and access your personal Ayutrika Herbals account."}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/login"
            onClick={onClose}
            className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-bold text-xs uppercase tracking-[0.25em] rounded-luxury transition-all flex items-center justify-center space-x-2 shadow-luxury"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/register"
            onClick={onClose}
            className="w-full py-3 bg-forest-900 hover:bg-forest-850 border border-forest-750 text-gold-300 font-sans font-semibold text-xs uppercase tracking-[0.2em] rounded-luxury transition-all flex items-center justify-center space-x-2"
          >
            <span>Create Account</span>
          </Link>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-ivory-400 hover:text-ivory-200 tracking-wider uppercase font-sans transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <div className="pt-4 border-t border-forest-850/80 flex items-center justify-center space-x-2 text-[10px] text-ivory-400 font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span>Your cart and browsing selections are securely preserved.</span>
        </div>
      </div>
    </div>
  );
}
