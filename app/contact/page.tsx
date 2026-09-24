"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Formulation Guidance",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            APOTHECARY CONCIERGE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-wide">
            Contact Ayutrika Herbals
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-4" />
          <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light leading-relaxed">
            Our wellness curators and botanical advisors are here to assist with dosage inquiries, tailored Ayurvedic formulations, or order concierge service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-forest-900/40 border border-forest-800 rounded-luxury space-y-6 shadow-luxury">
              <h3 className="font-serif text-2xl text-ivory-100 pb-3 border-b border-forest-850">
                Apothecary Headquarters
              </h3>

              <div className="space-y-4 text-xs font-sans text-ivory-300">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ivory-100 block mb-0.5">Physical Address</span>
                    <p className="text-ivory-300 leading-relaxed">[OFFICIAL BUSINESS ADDRESS]</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Mail className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ivory-100 block mb-0.5">Official Inquiries</span>
                    <p className="text-ivory-300">[OFFICIAL EMAIL]</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Phone className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ivory-100 block mb-0.5">Concierge Phone</span>
                    <p className="text-ivory-300">[OFFICIAL PHONE NUMBER]</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <MessageSquare className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ivory-100 block mb-0.5">WhatsApp Apothecary Desk</span>
                    <p className="text-ivory-300">[OFFICIAL WHATSAPP]</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 pt-2 border-t border-forest-850/80">
                  <Clock className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ivory-100 block mb-0.5">Concierge Hours</span>
                    <p className="text-ivory-400">Monday to Saturday: 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-forest-900/20 border border-forest-800 rounded-luxury text-xs text-ivory-400 font-sans space-y-2">
              <div className="flex items-center space-x-2 text-gold-400 font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Patron Guarantee</span>
              </div>
              <p>
                Inquiries are personally addressed by trained botanical advisors within 24 business hours.
              </p>
            </div>
          </div>

          {/* Right: Interactive Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-forest-900/40 border border-forest-800 rounded-luxury p-8 sm:p-10 shadow-luxury">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-forest-950 border border-gold-500 flex items-center justify-center mx-auto text-gold-400">
                  <CheckCircle2 className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif text-3xl text-ivory-100">Message Received</h3>
                <p className="text-xs sm:text-sm text-ivory-300 font-sans max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Ayutrika Herbals. Our botanical concierge has logged your inquiry and will reply to your registered email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-forest-950 border border-forest-750 text-gold-400 text-xs font-sans uppercase tracking-widest rounded-luxury mt-4"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-2xl text-ivory-100 pb-3 border-b border-forest-850">
                  Inquire with Our Herbalist
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Radhika Mehra"
                      className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="radhika@example.com"
                      className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98201 44552"
                      className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans cursor-pointer"
                    >
                      <option value="Formulation Guidance">Formulation Guidance</option>
                      <option value="Existing Order Inquiry">Existing Order Inquiry</option>
                      <option value="Custom Apothecary Blends">Custom Apothecary Blends</option>
                      <option value="Corporate & Wedding Gifting">Corporate & Wedding Gifting</option>
                      <option value="Wholesale & Practitioner Inquiry">Wholesale & Practitioner Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Message / Wellness Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your health goals, questions regarding active herbs, or order notes..."
                    className="w-full bg-forest-950 border border-forest-700 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-bold text-xs uppercase tracking-[0.25em] rounded-luxury transition-all flex items-center justify-center space-x-2 shadow-luxury disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Transmitting..." : "Send Message to Concierge"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
