import React from "react";

export default function ShopLoading() {
  return (
    <div className="bg-forest-950 min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="h-3 w-32 bg-forest-850 rounded-full mx-auto" />
          <div className="h-10 w-72 bg-forest-800 rounded-luxury mx-auto" />
          <div className="h-4 w-96 max-w-full bg-forest-900 rounded mx-auto" />
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="h-12 bg-forest-900/60 rounded-luxury border border-forest-850" />
            <div className="h-32 bg-forest-900/40 rounded-luxury border border-forest-850" />
            <div className="h-40 bg-forest-900/40 rounded-luxury border border-forest-850" />
            <div className="h-32 bg-forest-900/40 rounded-luxury border border-forest-850" />
          </div>

          {/* Product Cards Grid Skeleton */}
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-forest-900/40 border border-forest-850 rounded-luxury p-3 sm:p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="aspect-square w-full bg-forest-850/80 rounded-luxury relative overflow-hidden" />
                <div className="space-y-2 pt-1">
                  <div className="h-2.5 w-16 bg-forest-800 rounded" />
                  <div className="h-4 w-full bg-forest-800 rounded" />
                  <div className="h-3 w-3/4 bg-forest-850 rounded" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-forest-850/60">
                  <div className="h-4 w-16 bg-forest-800 rounded" />
                  <div className="h-7 w-20 bg-forest-800 rounded-luxury" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
