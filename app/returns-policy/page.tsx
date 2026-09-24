import Link from "next/link";
import { RotateCcw, ShieldCheck, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy | Ayutrika Herbals",
  description: "Our policy regarding apothecary returns, damaged product claims, and prompt refunds.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            PATRON ASSURANCE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-wide">
            Returns & Refunds
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 my-4" />
          <p className="text-xs text-ivory-400 font-sans">
            Ayutrika Herbals Patron Guarantee
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm font-sans text-ivory-300 leading-relaxed font-light divide-y divide-forest-850">
          <div>
            <h3 className="font-serif text-xl text-ivory-100 mb-2">1. Herbal Product Hygiene Standards</h3>
            <p>
              Due to the perishable, consumable nature of our natural herbal powders, teas, and facial oils, opened or unsealed formulations cannot be returned to our apothecary shelves. This policy ensures that every patron receives exclusively virgin, untampered botanical preparations.
            </p>
          </div>

          <div className="pt-6">
            <h3 className="font-serif text-xl text-ivory-100 mb-2">2. Damaged or Defective Deliveries</h3>
            <p>
              If your formulation arrives with transit damage, broken glass, or incorrect items, please take a photograph and notify our concierge team within 48 hours of delivery at <span className="text-gold-400">[OFFICIAL EMAIL]</span>. We will arrange a complimentary courier replacement immediately.
            </p>
          </div>

          <div className="pt-6">
            <h3 className="font-serif text-xl text-ivory-100 mb-2">3. Refund Processing</h3>
            <p>
              Approved refunds are credited back to the original source method (Razorpay / UPI / Credit Card) within 5 to 7 business days following claim verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
