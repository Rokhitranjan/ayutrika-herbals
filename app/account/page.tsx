import React, { Suspense } from "react";
import AccountClient from "@/components/account/AccountClient";
import { Metadata } from "next";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Patron Account | Ayutrika Herbals",
  description: "View your personal profile, active formulation orders, and saved apothecary items.",
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-forest-950 text-ivory-100 min-h-screen py-24 px-4 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-ivory-300 font-sans">
              Loading patron sanctuary...
            </p>
          </div>
        </div>
      }
    >
      <AccountClient />
    </Suspense>
  );
}
