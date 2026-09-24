"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, HelpCircle, ArrowRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Formulations & Purity",
    question: "What distinguishes Ayutrika Herbals from standard commercial brands?",
    answer:
      "Ayutrika Herbals honors authentic classical procedures. Rather than industrial flash extraction using chemical solvents, we employ whole botanical herbs, sun-curing (Surya-Tapi), and low-temperature stone milling to preserve complete phytochemical synergy. Our products contain zero artificial colors, synthetic binders, or filler starch.",
  },
  {
    category: "Formulations & Purity",
    question: "Are your formulations independently screened for heavy metals?",
    answer:
      "Yes. Every single botanical harvest undergoes stringent third-party microbiological and inductively coupled plasma mass spectrometry (ICP-MS) heavy-metal testing for lead, mercury, arsenic, and cadmium, complying with both classical standards and modern safety thresholds.",
  },
  {
    category: "Daily Rituals",
    question: "How should I integrate botanical adaptogens like Ashwagandha into my day?",
    answer:
      "In Ayurvedic tradition, adaptogenic roots are consumed alongside a 'Yogavahi' (nourishing carrier) such as warm milk, almond mylk, or a dash of ghee. For relaxation and sleep, consuming 1/2 teaspoon 45 minutes prior to sleep allows the withanolides to soothe the nervous system peacefully.",
  },
  {
    category: "Daily Rituals",
    question: "Can I use Kumkumadi Tailam on oily or sensitive skin?",
    answer:
      "Yes. Authentic Kumkumadi Tailam is calibrated with cooling herbs like red sandalwood and vetiver that pacify inflamed Pitta dosha. We recommend starting with 2–3 drops pressed onto slightly damp skin after evening cleansing.",
  },
  {
    category: "Orders & Shipping",
    question: "What are your pan-India delivery timeframes?",
    answer:
      "Standard insured apothecary delivery takes 3 to 5 business days across major metropolitan cities (Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata). Remote zones may require 5 to 7 business days. Express Priority Air courier options are also available at checkout.",
  },
  {
    category: "Orders & Shipping",
    question: "Is complimentary shipping available on all orders?",
    answer:
      "Yes! We provide 100% complimentary delivery on all orders valued above ₹1,000 anywhere in India. For orders below this threshold, a flat delivery fee of ₹99 is applied.",
  },
  {
    category: "Storage & Freshness",
    question: "How should I store stone-milled herbal powders and lipid elixirs?",
    answer:
      "Store all glass jars and apothecary tins in a dry, cool cabinet away from direct sunlight and humidity. Always use a dry wooden or brass spoon rather than damp metal cutlery to maintain purity.",
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            APOTHECARY CONCIERGE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-wide">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-4" />
          <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light leading-relaxed">
            Guidance on our classical Ayurvedic preparations, dosage recommendations, sourcing integrity, and shipping.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-forest-900/40 border border-forest-850 hover:border-gold-500/50 rounded-luxury transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors"
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-gold-400 font-sans block mb-1 font-semibold">
                      {faq.category}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl text-ivory-100">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full border border-forest-750 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-gold-500 text-forest-950 border-gold-500" : "text-ivory-300"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-forest-850/80 text-xs sm:text-sm text-ivory-300 font-sans leading-relaxed font-light">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need more guidance block */}
        <div className="mt-16 p-8 bg-forest-900/60 border border-gold-500/40 rounded-luxury text-center max-w-xl mx-auto shadow-luxury">
          <HelpCircle className="w-8 h-8 text-gold-400 mx-auto mb-3 stroke-1" />
          <h3 className="font-serif text-2xl text-ivory-100 mb-2">Have a Specific Inquiry?</h3>
          <p className="text-xs text-ivory-300 font-sans mb-6">
            Our Ayurvedic advisors are happy to guide your personal routine.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gold-500 text-forest-950 font-bold text-xs uppercase tracking-widest rounded-luxury font-sans"
          >
            <span>Speak with Concierge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
