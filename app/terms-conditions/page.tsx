import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Ayutrika Herbals",
  description: "Terms and conditions governing the use of Ayutrika Herbals e-commerce platform.",
};

export default function TermsConditionsPage() {
  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            LEGAL FRAMEWORK
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-wide">
            Terms & Conditions
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 my-4" />
          <p className="text-xs text-ivory-400 font-sans">
            Effective Date: March 2026 • Ayutrika Herbals
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm font-sans text-ivory-300 leading-relaxed font-light divide-y divide-forest-850">
          <div>
            <h3 className="font-serif text-xl text-ivory-100 mb-2">1. Agreement to Terms</h3>
            <p>
              By accessing or purchasing formulations from Ayutrika Herbals, you agree to abide by these Terms and Conditions and our associated delivery policies.
            </p>
          </div>

          <div className="pt-6">
            <h3 className="font-serif text-xl text-ivory-100 mb-2">2. Herbal Wellness Notice</h3>
            <p>
              Formulations offered by Ayutrika Herbals are traditional dietary supplements and herbal preparations intended for daily constitutional balance. Information provided on this platform is for educational purposes and does not constitute medical advice or substitute professional diagnosis.
            </p>
          </div>

          <div className="pt-6">
            <h3 className="font-serif text-xl text-ivory-100 mb-2">3. Product Pricing & Accuracy</h3>
            <p>
              We strive to ensure all prices, botanical ingredient descriptions, and availability are accurate. We reserve the right to correct inadvertent typographical errors and cancel orders if inventory discrepancies arise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
