"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Leaf,
  Shield,
  Award,
  Droplets,
  Star,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import {
  Product,
  Category,
  Ingredient,
  Benefit,
  BlogPost,
  Testimonial,
  BrandSettings,
} from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";

interface HomeClientProps {
  products: Product[];
  categories: Category[];
  ingredients: Ingredient[];
  benefits: Benefit[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  brandSettings: BrandSettings;
}

export default function HomeClient({
  products,
  categories,
  ingredients,
  benefits,
  blogPosts,
  testimonials,
  brandSettings,
}: HomeClientProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeBenefit, setActiveBenefit] = useState<string>("All");
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Horizontal scroll ref for Botanical Library
  const ingredientsScrollRef = useRef<HTMLDivElement>(null);

  const scrollIngredients = (direction: "left" | "right") => {
    if (ingredientsScrollRef.current) {
      const offset = direction === "left" ? -340 : 340;
      ingredientsScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const filteredProducts =
    activeBenefit === "All"
      ? featuredProducts
      : products
          .filter((p) =>
            p.benefits.some((b) => b.toLowerCase().includes(activeBenefit.toLowerCase()))
          )
          .slice(0, 8);

  const nextTestimonial = () => {
    setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[testimonialIdx] || testimonials[0];

  // Signature Spotlight Product (e.g., Organic Ashwagandha or first signature product)
  const spotlightProduct =
    products.find((p) => p.isFeatured && p.images.length > 0) || products[0];

  return (
    <div className="bg-forest-950 text-ivory-100 overflow-hidden font-sans selection:bg-gold-500/30 selection:text-gold-200">
      {/* ==================== 1. FULL-SCREEN LUXURY HERO ==================== */}
      <section className="relative min-h-[94vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Cinematic Atmospheric Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={
              brandSettings.heroImage ||
              "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1920&q=85"
            }
            alt="Ayutrika Herbals Luxury Botanical Sanctuary"
            fill
            priority
            className="object-cover object-center filter brightness-[0.42] contrast-[1.12] transition-transform duration-[12000ms] hover:scale-105"
          />
          {/* Depth Gradients to blend seamlessly into Deep Forest Green (#10261C) */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/45 to-forest-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(16,38,28,0.75)_100%)]" />
        </div>

        {/* Floating Subtle Botanical Auras */}
        <div className="absolute top-24 left-10 w-32 h-32 rounded-full bg-gold-500/5 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-24 right-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-float-slow" />

        {/* Hero Editorial Composition */}
        <div className="relative z-10 max-w-4xl mx-auto text-center py-20">
          {/* Subtitle Monogram Pill */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-forest-900/80 border border-gold-500/40 backdrop-blur-md mb-8 shadow-luxury">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            <span className="text-[10px] sm:text-xs font-sans tracking-[0.35em] uppercase text-gold-300 font-semibold">
              AYUTRIKA HERBALS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
          </div>

          {/* Main Large Editorial Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.14em] uppercase text-ivory-100 font-normal leading-[1.06] mb-6">
            ROOTED IN NATURE.
            <br />
            <span className="text-gold-gradient font-light">REFINED FOR WELLNESS.</span>
          </h1>

          {/* Editorial Tagline */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-ivory-200/90 max-w-2xl mx-auto font-light leading-relaxed tracking-wide mb-10">
            {brandSettings.heroSubtitle ||
              "Discover a curated world of botanical wellness and natural rituals."}
          </p>

          {/* Luxury CTA Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-bold text-xs tracking-[0.25em] uppercase rounded-luxury transition-all duration-300 shadow-luxury-lg hover:shadow-gold-glow flex items-center justify-center space-x-2"
            >
              <span>{brandSettings.heroCtaText || "EXPLORE COLLECTION"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-forest-900/60 hover:bg-forest-900 border border-gold-500/40 hover:border-gold-500 text-ivory-200 hover:text-gold-300 font-sans font-semibold text-xs tracking-[0.25em] uppercase rounded-luxury transition-all backdrop-blur-md text-center"
            >
              OUR STORY
            </Link>
          </div>

          {/* Downward Scroll Indicator */}
          <div className="mt-16 sm:mt-20 inline-flex flex-col items-center text-ivory-400/80 hover:text-gold-400 transition-colors">
            <span className="text-[9px] uppercase tracking-[0.3em] font-sans mb-2">
              DISCOVER BOTANICALS
            </span>
            <div className="w-5 h-8 rounded-full border border-forest-700 flex items-start justify-center p-1">
              <span className="w-1 h-2 bg-gold-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. EDITORIAL BRAND INTRODUCTION ==================== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-forest-900 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Asymmetrical Editorial Typography */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold">
                <Leaf className="w-3.5 h-3.5 text-gold-400" />
                <span>THE ART OF NATURAL WELLNESS</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory-100 tracking-wide leading-[1.12]">
                Ancient botanical wisdom,
                <br />
                <span className="italic text-ivory-300/90 font-light">
                  reimagined for modern living.
                </span>
              </h2>
              <div className="w-20 h-[1.5px] bg-gold-500/60 my-6" />
              <p className="text-ivory-300 text-sm sm:text-base font-sans leading-relaxed font-light max-w-xl">
                {brandSettings.brandDescription ||
                  "Ayutrika Herbals is a premium herbal wellness brand offering thoughtfully presented botanical and natural products inspired by the richness of nature."}
              </p>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-forest-900 text-center sm:text-left">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-gold-400 block font-normal">
                    100%
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-ivory-400 font-sans mt-0.5 block">
                    Pure Botanical
                  </span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-gold-400 block font-normal">
                    Stone-Milled
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-ivory-400 font-sans mt-0.5 block">
                    Low Heat Processing
                  </span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-gold-400 block font-normal">
                    Wildcrafted
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-ivory-400 font-sans mt-0.5 block">
                    Mineral Rich Soils
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Visual Still */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-luxury overflow-hidden border border-forest-800 shadow-luxury-lg bg-forest-900 group">
                <Image
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=85"
                  alt="Ayurvedic Botanical Harvest"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-forest-950/85 backdrop-blur-md border border-forest-800/80 rounded-luxury">
                  <span className="text-[9px] uppercase tracking-widest text-gold-400 font-sans block mb-1">
                    APOTHECARY PRINCIPLE
                  </span>
                  <p className="font-serif text-sm text-ivory-100 italic leading-snug">
                    &ldquo;When diet is wrong, medicine is of no use. When diet is correct,
                    medicine is of no need.&rdquo;
                  </p>
                  <span className="text-[9px] text-ivory-400 font-sans block mt-1">
                    — Ayurvedic Proverb
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. THE SIGNATURE COLLECTION ==================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-forest-900">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-forest-900 gap-6">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                CURATED BOTANICAL TREASURES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory-100 tracking-wide uppercase">
                The Signature Collection
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-gold-400 hover:text-gold-300 font-sans font-semibold border-b border-gold-500/40 pb-1 self-start md:self-auto transition-colors"
            >
              <span>Explore All {products.length} Formulations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. ASYMMETRIC EDITORIAL CATEGORY EXPERIENCE ==================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-950/60 border-b border-forest-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
                APOTHECARY FORMS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory-100 tracking-wide uppercase">
                Curated Categories
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light max-w-md">
              Explore our master classifications crafted to harmonize diverse wellness rituals and daily lifestyles.
            </p>
          </div>

          {/* Asymmetric / Editorial Bento Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Featured Primary Category: Large Left Feature (7 Cols) */}
            {categories[0] && (
              <Link
                href={`/categories/${categories[0].slug}`}
                className="md:col-span-7 group relative aspect-[16/10] md:aspect-auto md:min-h-[460px] rounded-luxury overflow-hidden border border-forest-850 hover:border-gold-500/60 shadow-luxury transition-all duration-700 flex flex-col justify-end p-8"
              >
                <Image
                  src={categories[0].image}
                  alt={categories[0].name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 filter brightness-[0.55] group-hover:brightness-[0.65]"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold">
                    SIGNATURE FORM • {categories[0].productCount || 0} FORMULATIONS
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-ivory-100 group-hover:text-gold-300 transition-colors">
                    {categories[0].name}
                  </h3>
                  <p className="text-xs sm:text-sm text-ivory-300/80 font-sans max-w-md line-clamp-2 leading-relaxed">
                    {categories[0].description}
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-gold-400 text-xs font-sans tracking-[0.2em] uppercase">
                    <span>Explore Formulation Form</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )}

            {/* Right Stack (5 Cols): 2 stacked editorial cards */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {categories.slice(1, 3).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative h-[218px] rounded-luxury overflow-hidden border border-forest-850 hover:border-gold-500/60 shadow-luxury transition-all duration-700 flex flex-col justify-end p-6"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.55] group-hover:brightness-[0.65]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
                  <div className="relative z-10">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-gold-400 font-sans font-medium mb-1 block">
                      {category.productCount || 0} Formulations
                    </span>
                    <h3 className="font-serif text-2xl text-ivory-100 group-hover:text-gold-300 transition-colors">
                      {category.name}
                    </h3>
                    <div className="mt-2 flex items-center space-x-1 text-gold-400 text-[10px] font-sans tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom Row of Categories (3 equal columns) */}
            {categories.slice(3, 6).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="md:col-span-4 group relative aspect-[4/3] rounded-luxury overflow-hidden border border-forest-850 hover:border-gold-500/60 shadow-luxury transition-all duration-700 flex flex-col justify-end p-6"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.55] group-hover:brightness-[0.65]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
                <div className="relative z-10">
                  <span className="text-[9px] tracking-[0.25em] uppercase text-gold-400 font-sans font-medium mb-1 block">
                    {category.productCount || 0} Formulations
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-ivory-100 group-hover:text-gold-300 transition-colors">
                    {category.name}
                  </h3>
                  <div className="mt-2 flex items-center space-x-1 text-gold-400 text-[10px] font-sans tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. SHOP BY WELLNESS GOAL ==================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-forest-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
                PERSONALIZED DISCOVERY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory-100 tracking-wide uppercase">
                Shop by Wellness Goal
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light max-w-md">
              Every individual constitution thrives on tailored botanical balance. Discover formulations by holistic focus.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {benefits.map((benefit) => (
              <Link
                key={benefit.id}
                href={`/shop?benefit=${encodeURIComponent(benefit.name)}`}
                className="group p-5 sm:p-6 bg-forest-900/40 hover:bg-forest-900/90 border border-forest-800 hover:border-gold-500/50 rounded-luxury transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-forest-950 border border-forest-750 group-hover:border-gold-500/70 flex items-center justify-center text-gold-400 mb-4 transition-colors">
                    <Droplets className="w-5 h-5 stroke-1" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl text-ivory-100 group-hover:text-gold-300 transition-colors">
                    {benefit.name}
                  </h3>
                  <p className="text-[11px] text-ivory-300/80 font-sans mt-2 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-forest-850/80 flex items-center justify-between text-[10px] font-sans tracking-widest uppercase text-gold-400">
                  <span>{benefit.tag || "Explore"}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 6. THE BOTANICAL LIBRARY (HORIZONTAL SCROLL) ==================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-forest-950/40 border-b border-forest-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
                OUR BOTANICAL MONOGRAPHS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory-100 tracking-wide uppercase">
                The Botanical Library
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => scrollIngredients("left")}
                className="w-10 h-10 rounded-full bg-forest-900 border border-forest-750 hover:border-gold-500 text-ivory-200 hover:text-gold-400 flex items-center justify-center transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollIngredients("right")}
                className="w-10 h-10 rounded-full bg-forest-900 border border-forest-750 hover:border-gold-500 text-ivory-200 hover:text-gold-400 flex items-center justify-center transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <Link
                href="/ingredients"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-gold-400 hover:text-gold-300 font-sans font-semibold border-b border-gold-500/40 pb-1 ml-4"
              >
                <span>All {ingredients.length} Herbs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Horizontal Scrolling Carousel with Ref Controls */}
          <div
            ref={ingredientsScrollRef}
            className="flex space-x-6 overflow-x-auto pb-6 custom-gold-scrollbar snap-x scroll-smooth"
          >
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="w-72 sm:w-80 flex-shrink-0 bg-forest-900/50 border border-forest-800 rounded-luxury overflow-hidden snap-start flex flex-col justify-between group hover:border-gold-500/50 transition-all shadow-luxury"
              >
                <div className="relative h-44 w-full bg-forest-950 overflow-hidden">
                  <Image
                    src={ing.image}
                    alt={ing.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] italic font-serif text-gold-400 block mb-1">
                      {ing.botanicalName}
                    </span>
                    <h3 className="font-serif text-xl text-ivory-100 mb-2">
                      {ing.name}
                    </h3>
                    <p className="text-xs text-ivory-300/80 font-sans line-clamp-3 leading-relaxed">
                      {ing.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-forest-850 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-ivory-400 font-sans">
                      Traditional Use
                    </span>
                    <Link
                      href={`/shop?ingredient=${encodeURIComponent(ing.name)}`}
                      className="text-gold-400 hover:text-gold-300 text-xs font-sans tracking-wider uppercase flex items-center gap-1"
                    >
                      <span>Formulations</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 7. BRAND STORY SECTION ==================== */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-forest-950 border-b border-forest-900">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gold-400 font-sans font-semibold mb-4 inline-block">
            AUTHENTIC BOTANICAL HERITAGE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory-100 tracking-wide uppercase leading-tight mb-8">
            ROOTED IN NATURE.
            <br />
            <span className="italic text-gold-400 font-light">
              CRAFTED FOR MODERN RITUALS.
            </span>
          </h2>
          <div className="w-24 h-[1.5px] bg-gold-500/50 mx-auto mb-8" />
          <div className="space-y-6 text-ivory-200/90 font-sans text-sm sm:text-base leading-relaxed max-w-3xl mx-auto font-light whitespace-pre-line">
            {brandSettings.brandStory ||
              "Rooted in ancient Ayurvedic wisdom, Ayutrika Herbals brings centuries of botanical knowledge into modern daily wellness rituals. Every harvest is consciously selected, honoring purity and traditional integrity."}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              href="/about"
              className="px-8 py-3.5 bg-forest-900/80 hover:bg-gold-500 hover:text-forest-950 border border-gold-500/50 text-gold-300 text-xs uppercase tracking-[0.25em] font-sans font-bold rounded-luxury transition-all"
            >
              Discover Our Story &amp; Sourcing
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== 8. PREMIUM FULL-WIDTH PRODUCT SPOTLIGHT ==================== */}
      {spotlightProduct && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-forest-900 bg-forest-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-luxury overflow-hidden border border-forest-800 bg-forest-950 grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
              <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-[540px] bg-forest-900">
                <Image
                  src={spotlightProduct.images[0]}
                  alt={spotlightProduct.name}
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-forest-950/80 hidden lg:block" />
              </div>

              <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold mb-2 block">
                    OUR BOTANICAL SIGNATURE
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory-100 uppercase tracking-wide leading-tight mb-4">
                    {spotlightProduct.name}
                  </h3>
                  <p className="font-serif italic text-gold-400/90 text-lg mb-6">
                    Ancient botanical wisdom for modern balance.
                  </p>
                  <p className="text-ivory-300 text-xs sm:text-sm font-sans leading-relaxed font-light mb-8">
                    {spotlightProduct.shortDesc}
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center space-x-3 text-xs font-sans text-ivory-200">
                      <Award className="w-4 h-4 text-gold-400 flex-shrink-0" />
                      <span>Single-Origin Certified Organic Harvest</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs font-sans text-ivory-200">
                      <Shield className="w-4 h-4 text-gold-400 flex-shrink-0" />
                      <span>Triple Heavy-Metal &amp; Microbiological Purity Certified</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs font-sans text-ivory-200">
                      <Droplets className="w-4 h-4 text-gold-400 flex-shrink-0" />
                      <span>Zero Preservatives, Artificial Binders, or Additives</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href={`/product/${spotlightProduct.slug}`}
                    className="w-full sm:w-auto px-8 py-4 bg-gold-500 hover:bg-gold-400 text-forest-950 font-sans font-bold text-xs tracking-[0.25em] uppercase rounded-luxury transition-all text-center shadow-luxury"
                  >
                    DISCOVER PRODUCT
                  </Link>
                  <Link
                    href="/journal"
                    className="w-full sm:w-auto text-xs uppercase tracking-[0.2em] text-ivory-300 hover:text-gold-400 font-sans text-center py-2"
                  >
                    Read Botanical Monograph
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 9. CUSTOMER TESTIMONIALS SLIDER ==================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-forest-900 bg-forest-950/80">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold mb-2 block">
            PATRON TESTIMONIALS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ivory-100 tracking-wide uppercase mb-12">
            Praised by Discerning Seekers
          </h2>

          <div className="relative bg-forest-900/50 border border-forest-800 p-8 sm:p-12 rounded-luxury shadow-luxury">
            <div className="flex items-center justify-center space-x-1 text-gold-400 mb-6">
              {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold-400" />
              ))}
            </div>

            <p className="font-serif text-lg sm:text-2xl text-ivory-100 italic leading-relaxed mb-8 max-w-2xl mx-auto">
              &ldquo;{currentTestimonial.quote}&rdquo;
            </p>

            <div className="space-y-1">
              <h4 className="font-sans font-semibold text-sm text-gold-400 tracking-wider">
                {currentTestimonial.name}
              </h4>
              <p className="text-[11px] text-ivory-400 font-sans">
                {currentTestimonial.location} •{" "}
                <span className="text-emerald-400">Verified Purchase</span>
              </p>
              {currentTestimonial.product && (
                <span className="text-[10px] text-gold-500/80 font-sans tracking-widest uppercase block pt-1">
                  Ritual: {currentTestimonial.product}
                </span>
              )}
            </div>

            {/* Slider Controls */}
            <div className="flex items-center justify-between absolute inset-y-0 left-2 right-2 pointer-events-none">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-forest-950/80 hover:bg-gold-500 hover:text-forest-950 text-ivory-200 border border-forest-750 flex items-center justify-center pointer-events-auto transition-all"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-forest-950/80 hover:bg-gold-500 hover:text-forest-950 text-ivory-200 border border-forest-750 flex items-center justify-center pointer-events-auto transition-all"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 10. EDITORIAL BOTANICAL JOURNAL ==================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-forest-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
                EDITORIAL ESSAYS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory-100 tracking-wide uppercase">
                The Botanical Journal
              </h2>
            </div>
            <Link
              href="/journal"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-gold-400 hover:text-gold-300 font-sans font-semibold border-b border-gold-500/40 pb-1 transition-colors"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                className="group flex flex-col justify-between bg-forest-900/30 border border-forest-850 hover:border-gold-500/50 rounded-luxury overflow-hidden transition-all shadow-luxury"
              >
                <div className="relative aspect-[16/10] bg-forest-950 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] tracking-widest uppercase font-sans text-gold-400 mb-2">
                      <span>{post.category}</span>
                      <span>{post.readingTime}</span>
                    </div>
                    <h3 className="font-serif text-xl text-ivory-100 group-hover:text-gold-300 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-ivory-300/80 font-sans mt-2 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-forest-850 flex items-center justify-between text-[10px] font-sans tracking-widest uppercase text-gold-400">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
