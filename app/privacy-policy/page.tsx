import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Ayutrika Herbals",
  description: "Ayutrika Herbals Patron Privacy and Personal Data Governance Policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            DATA GOVERNANCE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-wide">
            Privacy Policy
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 my-4" />
          <p className="text-xs text-ivory-400 font-sans">
            Effective Date: March 2026 • Ayutrika Herbals
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm font-sans text-ivory-300 leading-relaxed font-light divide-y divide-forest-850">
          <div>
            <h3 className="font-serif text-xl text-ivory-100 mb-2">1. Information We Collect</h3>
            <p>
              When you purchase our botanical products, register for a patron account, or subscribe to The Botanical Letter, we collect necessary transaction identifiers including your full name, delivery address, email, phone number, and order items. Payment card details are processed directly via PCI-DSS compliant gateways (Razorpay) and are never stored on our servers.
            </p>
          </div>

          <div className="pt-6">
            <h3 className="font-serif text-xl text-ivory-100 mb-2">2. How We Utilize Your Data</h3>
            <p>
              Your personal information is used exclusively to dispatch orders, calculate delivery logistics, provide tracking updates, and deliver optional herbal monographs if you opt into our newsletter. We do not sell or lease patron data to third-party marketing brokers.
            </p>
          </div>

          <div className="pt-6">
            <h3 className="font-serif text-xl text-ivory-100 mb-2">3. Security Standards</h3>
            <p>
              We implement industry-standard 256-bit TLS cryptographic transmission across all checkout and account surfaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
