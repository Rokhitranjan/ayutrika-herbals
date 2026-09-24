import React from "react";

export default function ProductLoading() {
  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Skeleton */}
        <div className="flex space-x-3 items-center">
          <div className="h-3 w-12 bg-forest-850 rounded" />
          <div className="h-3 w-3 bg-forest-850 rounded" />
          <div className="h-3 w-16 bg-forest-850 rounded" />
          <div className="h-3 w-3 bg-forest-850 rounded" />
          <div className="h-3 w-32 bg-forest-800 rounded" />
        </div>

        {/* Main Product Showcase Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-16 border-b border-forest-850">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 bg-forest-900 border border-forest-850 rounded-luxury" />
              ))}
            </div>
            <div className="relative aspect-square w-full rounded-luxury bg-forest-900 border border-forest-850" />
          </div>

          {/* Details Skeleton */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="h-3 w-36 bg-forest-800 rounded" />
              <div className="h-10 w-3/4 bg-forest-800 rounded" />
              <div className="h-4 w-48 bg-forest-850 rounded" />
            </div>

            <div className="h-8 w-32 bg-forest-800 rounded" />

            <div className="space-y-2 py-4">
              <div className="h-3 w-full bg-forest-850 rounded" />
              <div className="h-3 w-5/6 bg-forest-850 rounded" />
              <div className="h-3 w-4/6 bg-forest-850 rounded" />
            </div>

            <div className="h-20 bg-forest-900/60 border border-forest-850 rounded-luxury" />

            <div className="flex gap-4 pt-4">
              <div className="h-14 w-28 bg-forest-900 rounded-luxury border border-forest-850" />
              <div className="h-14 flex-1 bg-forest-800 rounded-luxury" />
              <div className="h-14 w-14 bg-forest-900 rounded-luxury border border-forest-850" />
            </div>

            <div className="h-12 w-full bg-forest-900/40 rounded-luxury border border-forest-850" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <div className="flex space-x-6 border-b border-forest-850 pb-4">
            <div className="h-4 w-24 bg-forest-800 rounded" />
            <div className="h-4 w-24 bg-forest-850 rounded" />
            <div className="h-4 w-24 bg-forest-850 rounded" />
          </div>
          <div className="h-32 bg-forest-900/30 rounded-luxury border border-forest-850" />
        </div>
      </div>
    </div>
  );
}
