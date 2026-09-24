"use client";

import React, { useState } from "react";
import { Review, Product } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Star, CheckCircle, Trash2, Search, ThumbsUp, ShieldCheck } from "lucide-react";

interface ReviewsClientProps {
  initialReviews: Review[];
  products: Product[];
}

export default function ReviewsClient({ initialReviews, products }: ReviewsClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [search, setSearch] = useState("");

  const getProductName = (id: string) => {
    return products.find((p) => p.id === id)?.name || "Herbal Formulation";
  };

  const filtered = reviews.filter((r) =>
    r.customerName.toLowerCase().includes(search.toLowerCase()) ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.comment.toLowerCase().includes(search.toLowerCase())
  );

  const toggleApproval = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r))
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this review?")) return;
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            PATRON TESTIMONIALS &amp; REVIEWS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Product Reviews ({reviews.length})
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Moderate authentic client feedback, ratings, and botanical healing experiences.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-forest-950 border border-forest-850 p-4 rounded-luxury">
        <div className="relative">
          <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by customer name, rating, or testimonial keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs pl-9 pr-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
          />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-forest-950 border border-forest-850 rounded-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-forest-900/60 border-b border-forest-850 text-ivory-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Formulation</th>
                <th className="py-3 px-4 font-semibold">Patron</th>
                <th className="py-3 px-4 font-semibold">Rating</th>
                <th className="py-3 px-4 font-semibold">Testimonial</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-850/60">
              {filtered.map((rev) => (
                <tr key={rev.id} className="hover:bg-forest-900/30 transition-colors">
                  <td className="py-3.5 px-4 font-serif text-ivory-100 max-w-[160px] truncate">
                    {getProductName(rev.productId)}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-ivory-100">{rev.customerName}</p>
                    {rev.verified && (
                      <span className="text-[9px] text-emerald-400 flex items-center space-x-1 font-mono">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Patron</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating
                              ? "text-gold-400 fill-gold-400"
                              : "text-forest-800"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-[300px]">
                    <p className="font-medium text-ivory-100 text-xs truncate">{rev.title}</p>
                    <p className="text-ivory-400 text-[11px] line-clamp-2 leading-relaxed">
                      {rev.comment}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-ivory-400">
                    {formatDate(rev.createdAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleApproval(rev.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                        rev.approved
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-amber-950 text-amber-400 border border-amber-800"
                      }`}
                    >
                      {rev.approved ? "Approved" : "Pending"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 text-ivory-400 hover:text-red-400 rounded transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
