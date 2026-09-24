import React, { Suspense } from "react";
import { Metadata } from "next";
import AccountClient from "@/components/account/AccountClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Address Book | Ayutrika Herbals",
  description: "Manage your delivery addresses and shipping destinations for Ayutrika Herbals orders.",
};

export default function AccountAddressesPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-forest-950 text-ivory-100 min-h-screen py-24 px-4 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-ivory-300 font-sans">
              Loading address sanctuary...
            </p>
          </div>
        </div>
      }
    >
      <AccountClient initialTab="addresses" />
    </Suspense>
  );
}
