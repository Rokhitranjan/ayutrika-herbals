import Link from "next/link";
import { Truck, ShieldCheck, Clock, MapPin } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Ayutrika Herbals",
  description: "Learn about our temperature-conscious packaging, dispatch timelines, and complimentary pan-India delivery.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            APOTHECARY LOGISTICS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-wide">
            Shipping & Delivery Policy
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 my-4" />
          <p className="text-xs text-ivory-400 font-sans">
            Last Updated: March 2026 • Ayutrika Herbals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-2">
            <Truck className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-lg text-ivory-100">Complimentary Shipping</h3>
            <p className="text-xs text-ivory-300 font-sans">All orders exceeding ₹1,000 receive complimentary insured delivery across India.</p>
          </div>
          <div className="p-6 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-2">
            <Clock className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-lg text-ivory-100">24-Hour Dispatch</h3>
            <p className="text-xs text-ivory-300 font-sans">Freshly prepared formulations are inspected and dispatched within 24–48 business hours.</p>
          </div>
          <div className="p-6 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-2">
            <ShieldCheck className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-lg text-ivory-100">Insulated Protection</h3>
            <p className="text-xs text-ivory-300 font-sans">Packaged in UV-protective amber glass and eco-friendly protective cushioning.</p>
          </div>
        </div>

        <div className="space-y-8 text-xs sm:text-sm font-sans text-ivory-300 leading-relaxed font-light divide-y divide-forest-850">
          <div className="pt-6">
            <h3 className="font-serif text-xl text-ivory-100 mb-2">1. Delivery Turnaround</h3>
            <p>
              Deliveries to metropolitan cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) are delivered within 3 to 5 business days. Deliveries to regional hubs and tier-2/3 cities take 5 to 7 business days.
            </p>
          </div>

          <div className="pt-6">
            <h3 className="font-serif text-xl text-ivory-100 mb-2">2. Packaging Integrity</h3>
            <p>
              To maintain the integrity of active botanical constituents, all liquid elixirs and cold-pressed churnas are sealed in pharmaceutical-grade amber glass and food-safe barrier foils. If you receive an unsealed or cracked vessel, kindly notify our concierge within 48 hours for immediate replacement.
            </p>
          </div>

          <div className="pt-6">
            <h3 className="font-serif text-xl text-ivory-100 mb-2">3. Courier Tracking</h3>
            <p>
              Upon dispatch from our apothecary fulfillment facility, an automated notification containing your Delhivery/BlueDart AWB tracking number is transmitted via SMS and email. You may also track progress directly under <Link href="/account/orders" className="text-gold-400 underline">My Orders</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
