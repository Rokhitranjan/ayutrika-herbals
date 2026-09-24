"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product, Category, Ingredient, Benefit, ProductStatus } from "@/lib/types";
import { formatPrice, slugify } from "@/lib/utils";
import {
  Upload,
  Trash2,
  Star,
  CheckCircle2,
  ArrowLeft,
  Eye,
  Sparkles,
  Heart,
  ShoppingBag,
  Info,
  Check,
  Plus,
  Layers,
  ShieldCheck,
  ArrowRight,
  MoveLeft,
  MoveRight,
  ExternalLink,
  Save,
  Send,
  X,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface ProductEditorProps {
  initialProduct?: Product;
  categories: Category[];
  availableIngredients?: Ingredient[];
  availableBenefits?: Benefit[];
  isEdit?: boolean;
}

const PRESET_BOTANICAL_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512290900672-1f413d07730e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
];

const SECTIONS = [
  { id: "basic", label: "1. Basic Info" },
  { id: "pricing", label: "2. Pricing" },
  { id: "images", label: "3. Images" },
  { id: "description", label: "4. Description" },
  { id: "ingredients", label: "5. Ingredients" },
  { id: "benefits", label: "6. Benefits" },
  { id: "usage", label: "7. Usage & Rituals" },
  { id: "inventory", label: "8. Inventory" },
  { id: "seo", label: "9. SEO" },
  { id: "publishing", label: "10. Publishing" },
];

export default function ProductEditor({
  initialProduct,
  categories,
  availableIngredients = [],
  availableBenefits = [],
  isEdit = false,
}: ProductEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSection, setActiveSection] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // 1. Basic Information
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [isManualSlug, setIsManualSlug] = useState(Boolean(initialProduct?.slug));
  const [sku, setSku] = useState(
    initialProduct?.sku || `AYU-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || categories[0]?.id || ""
  );
  const [subcategory, setSubcategory] = useState(initialProduct?.subcategory || "Single Herb Powders");
  const [productType, setProductType] = useState(initialProduct?.productType || "Botanical Powder");
  const [weight, setWeight] = useState(initialProduct?.weight || "200g");
  const [tagsText, setTagsText] = useState(
    initialProduct?.tags.join(", ") || "Adaptogen, Organic, Pure, Classical"
  );
  const [shortDesc, setShortDesc] = useState(
    initialProduct?.shortDesc ||
      "Single-origin wildcrafted botanical formulation, finely stone-milled for daily wellness rituals."
  );
  const [fullDesc, setFullDesc] = useState(
    initialProduct?.fullDesc ||
      "Harvested at seasonal peak maturity from mineral-rich soils. Through low-temperature stone milling, active botanical profiles are preserved in their complete synergy according to classical Ayurvedic principles."
  );

  // 2. Pricing
  const [price, setPrice] = useState(initialProduct?.price ? String(initialProduct.price) : "890");
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialProduct?.originalPrice || initialProduct?.compareAtPrice
      ? String(initialProduct.originalPrice || initialProduct?.compareAtPrice)
      : "1190"
  );

  // 3. Images
  const [images, setImages] = useState<string[]>(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images
      : [PRESET_BOTANICAL_IMAGES[0]]
  );
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // 4. Description & Additional Info
  const [keyBenefitsText, setKeyBenefitsText] = useState(
    initialProduct?.benefits.join("\n") || "Promotes natural circadian rest\nSoothes daily oxidative fatigue\nRestores holistic vitality"
  );
  const [importantInfo, setImportantInfo] = useState(
    initialProduct?.importantInfo ||
      "Formulated for holistic wellness support. Free from artificial fillers, binders, heavy metals, and synthetic preservatives."
  );

  // 5. Ingredients
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    initialProduct?.ingredients || ["Ashwagandha"]
  );
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientBotanical, setNewIngredientBotanical] = useState("");
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);

  // 6. Benefits
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(
    initialProduct?.benefits || ["Stress Relief", "Sleep & Calm", "Energy & Stamina"]
  );

  // 7. Usage & Rituals
  const [howToUse, setHowToUse] = useState(
    initialProduct?.howToUse ||
      "Whisk 1/2 teaspoon into warm milk, almond mylk, or steeped herbal infusion before rest."
  );
  const [dosage, setDosage] = useState(
    initialProduct?.dosage || "3g daily with warm liquid"
  );
  const [storage, setStorage] = useState(
    initialProduct?.storage || "Store in a cool, dry place away from direct sunlight in an airtight jar."
  );

  // 8. Inventory
  const [stockQuantity, setStockQuantity] = useState(
    initialProduct?.stock !== undefined ? String(initialProduct.stock) : "45"
  );
  const [reservedQuantity, setReservedQuantity] = useState(
    initialProduct?.reservedQuantity !== undefined ? String(initialProduct.reservedQuantity) : "0"
  );
  const [lowStockThreshold, setLowStockThreshold] = useState(
    initialProduct?.lowStockThreshold !== undefined ? String(initialProduct.lowStockThreshold) : "10"
  );

  // 9. SEO
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialProduct?.seoDescription || "");
  const [seoKeywordsText, setSeoKeywordsText] = useState(
    initialProduct?.seoKeywords?.join(", ") || ""
  );

  // 10. Publishing & Flags
  const [status, setStatus] = useState<ProductStatus>(
    initialProduct?.status || (initialProduct?.isActive === false ? "DRAFT" : "PUBLISHED")
  );
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? true);
  const [isBestSeller, setIsBestSeller] = useState(initialProduct?.isBestSeller ?? false);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.isNewArrival ?? false);

  // Computed Pricing & Inventory
  const parsedPrice = parseFloat(price) || 0;
  const parsedCompareAt = parseFloat(compareAtPrice) || 0;
  const computedDiscount =
    parsedCompareAt > parsedPrice && parsedPrice > 0
      ? Math.round(((parsedCompareAt - parsedPrice) / parsedCompareAt) * 100)
      : 0;

  const parsedStock = parseInt(stockQuantity, 10) || 0;
  const parsedReserved = parseInt(reservedQuantity, 10) || 0;
  const parsedThreshold = parseInt(lowStockThreshold, 10) || 10;
  const availableStock = Math.max(0, parsedStock - parsedReserved);

  const stockStatusLabel =
    availableStock <= 0
      ? "OUT OF STOCK"
      : availableStock <= parsedThreshold
      ? "LOW STOCK"
      : "IN STOCK";

  // Slug generation
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isManualSlug) {
      setSlug(slugify(val));
    }
  };

  // Image manipulation
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImages([...images, data.url]);
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch {
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addCustomImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setImages([...images, customImageUrl.trim()]);
    setCustomImageUrl("");
  };

  const removeImage = (index: number) => {
    if (images.length <= 1) {
      alert("At least one product image is required for catalog display.");
      return;
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const setAsPrimaryImage = (index: number) => {
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([selected, ...rest]);
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const newArr = [...images];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;
    setImages(newArr);
  };

  // Save handler with explicit status option
  const handleSaveWithStatus = async (targetStatus?: ProductStatus) => {
    setSaving(true);
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Product Name is required.");
      setActiveSection("basic");
      setSaving(false);
      return;
    }
    if (!sku.trim()) {
      setError("SKU is required.");
      setActiveSection("basic");
      setSaving(false);
      return;
    }
    if (!categoryId) {
      setError("Please select a valid Category.");
      setActiveSection("basic");
      setSaving(false);
      return;
    }
    if (parsedPrice <= 0) {
      setError("Price must be a positive number.");
      setActiveSection("pricing");
      setSaving(false);
      return;
    }
    if (parsedCompareAt < 0) {
      setError("Compare-at price cannot be negative.");
      setActiveSection("pricing");
      setSaving(false);
      return;
    }
    if (!shortDesc.trim()) {
      setError("Short Description is required.");
      setActiveSection("basic");
      setSaving(false);
      return;
    }
    if (images.length === 0) {
      setError("At least one product image is required.");
      setActiveSection("images");
      setSaving(false);
      return;
    }

    const finalStatus: ProductStatus = targetStatus || status;

    const payload = {
      name: name.trim(),
      slug: slug || slugify(name),
      sku: sku.trim().toUpperCase(),
      categoryId,
      subcategory,
      productType,
      weight,
      price: parsedPrice,
      originalPrice: parsedCompareAt > parsedPrice ? parsedCompareAt : undefined,
      compareAtPrice: parsedCompareAt > 0 ? parsedCompareAt : undefined,
      discount: computedDiscount > 0 ? computedDiscount : undefined,
      stock: parsedStock,
      reservedQuantity: parsedReserved,
      lowStockThreshold: parsedThreshold,
      availableStock,
      shortDesc: shortDesc.trim(),
      fullDesc: fullDesc.trim(),
      images,
      thumbnail: images[0],
      ingredients: selectedIngredients,
      benefits: selectedBenefits,
      howToUse,
      dosage,
      storage,
      importantInfo,
      tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
      seoTitle: seoTitle || `${name.trim()} | Ayutrika Herbals`,
      seoDescription: seoDescription || shortDesc.trim(),
      seoKeywords: seoKeywordsText ? seoKeywordsText.split(",").map((s) => s.trim()) : [],
      status: finalStatus,
      isActive: finalStatus === "PUBLISHED",
      isFeatured,
      isBestSeller,
      isNewArrival,
      rating: initialProduct?.rating || 4.95,
      reviewCount: initialProduct?.reviewCount || 1,
    };

    try {
      const url = isEdit ? `/api/products/${initialProduct?.id}` : `/api/products`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 600);
      } else {
        setError(data.error || "Failed to save product.");
      }
    } catch {
      setError("Network error communicating with catalog server.");
    } finally {
      setSaving(false);
    }
  };

  const selectedCategoryName =
    categories.find((c) => c.id === categoryId)?.name || "Herbal Wellness";

  return (
    <div className="space-y-6 font-sans pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-luxury bg-forest-900 hover:bg-forest-850 text-ivory-300 hover:text-gold-400 border border-forest-800 transition-colors"
            title="Return to Product List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
                APOTHECARY EDITOR
              </span>
              <span
                className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-sans font-bold ${
                  status === "PUBLISHED"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : status === "DRAFT"
                    ? "bg-amber-950/80 text-amber-300 border border-amber-800"
                    : "bg-charcoal-900 text-ivory-400 border border-forest-800"
                }`}
              >
                {status}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase tracking-wide">
              {isEdit ? `Edit: ${name || "Formulation"}` : "Create New Herbal Formulation"}
            </h1>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preview Button */}
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-4 py-2.5 bg-forest-900 hover:bg-forest-850 text-ivory-200 hover:text-gold-300 border border-forest-750 text-xs font-sans font-semibold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>PREVIEW</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSaveWithStatus("DRAFT")}
            className="px-4 py-2.5 bg-forest-900/90 hover:bg-forest-850 text-gold-300 border border-gold-500/50 text-xs font-sans font-bold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE DRAFT</span>
          </button>

          {/* Publish */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSaveWithStatus("PUBLISHED")}
            className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-sans font-bold uppercase tracking-[0.2em] rounded-luxury transition-all flex items-center space-x-1.5 shadow-luxury disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{saving ? "SAVING..." : "PUBLISH"}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-luxury text-red-300 text-xs font-sans flex items-center space-x-2 shadow-luxury">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-luxury text-emerald-300 text-xs font-sans flex items-center space-x-2 shadow-luxury">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>Formulation saved successfully. Redirecting to catalog...</span>
        </div>
      )}

      {/* Section Tabs Navigator */}
      <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-forest-850 no-scrollbar">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`px-3.5 py-2 rounded-luxury text-xs font-sans uppercase tracking-wider whitespace-nowrap transition-all ${
              activeSection === sec.id
                ? "bg-gold-500 text-forest-950 font-bold shadow-luxury"
                : "bg-forest-950 border border-forest-850 text-ivory-300 hover:border-gold-500/50"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* 10-SECTION FORM WORKSPACE */}
      <div className="bg-forest-950 border border-forest-850 p-6 sm:p-8 rounded-luxury shadow-2xl space-y-8">
        {/* ==================== SECTION 1: BASIC INFORMATION ==================== */}
        {activeSection === "basic" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-forest-850">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                1. Basic Formulation Information
              </h2>
              <p className="text-xs text-ivory-400 font-sans mt-0.5">
                Core identity, taxonomy, unique SKU, and primary presentation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-gold-400 font-sans font-semibold block mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Organic Ashwagandha Reserve Powder"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-sm px-4 py-3 rounded-luxury focus:outline-none focus:border-gold-500 font-serif"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  URL Slug * (auto-generated or custom)
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsManualSlug(true);
                  }}
                  placeholder="organic-ashwagandha-reserve-powder"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-mono"
                />
                <span className="text-[10px] text-ivory-400 mt-1 block">
                  Live URL: /product/{slug || "slug"}
                </span>
              </div>

              {/* SKU */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Stock Keeping Unit (SKU) *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  placeholder="AYU-ASH-001"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-mono uppercase"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="Single Herb Powders, Infusions, Lipid Elixirs..."
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              {/* Product Type */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Product Type
                </label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans cursor-pointer"
                >
                  <option value="Botanical Powder">Botanical Powder (Churna)</option>
                  <option value="Herbal Tea">Herbal Tea &amp; Infusion (Kwath)</option>
                  <option value="Botanical Oil">Botanical Oil (Tailam)</option>
                  <option value="Classical Churna">Classical Compound Churna</option>
                  <option value="Herbal Capsules">Herbal Capsules (Vati)</option>
                  <option value="Natural Skincare">Natural Skincare Formulation</option>
                  <option value="Botanical Hair Oil">Botanical Hair Oil</option>
                </select>
              </div>

              {/* Net Weight */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Net Weight / Volume
                </label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="200g, 100ml, 60 Capsules..."
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Catalog Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="Adaptogen, Organic, Vata Balancing, Stress Relief"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-gold-400 font-sans font-semibold block mb-1.5">
                  Short Description * (Appears on product cards &amp; summary)
                </label>
                <textarea
                  rows={2}
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="A concise, luxurious summary of the formulation..."
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== SECTION 2: PRICING ==================== */}
        {activeSection === "pricing" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-forest-850">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                2. Pricing &amp; Currency (INR)
              </h2>
              <p className="text-xs text-ivory-400 font-sans mt-0.5">
                Set customer retail price and optional compare-at strike price.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Selling Price */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gold-400 font-sans font-semibold block mb-1.5">
                  Selling Price (₹ INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-400 font-sans font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="890"
                    className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-base font-bold pl-8 pr-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
                <span className="text-[10px] text-ivory-400 mt-1 block">
                  Formatted: {formatPrice(parsedPrice)}
                </span>
              </div>

              {/* Compare-at Price */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Compare-at Price (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-400 font-sans">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="1190"
                    className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-base pl-8 pr-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
                <span className="text-[10px] text-ivory-400 mt-1 block">
                  Formatted: {parsedCompareAt > 0 ? formatPrice(parsedCompareAt) : "None"}
                </span>
              </div>

              {/* Auto Discount Preview */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Calculated Discount %
                </label>
                <div className="p-3 bg-forest-900/60 border border-forest-800 rounded-luxury flex items-center justify-between">
                  <span className="font-serif text-lg text-gold-400 font-bold">
                    {computedDiscount > 0 ? `${computedDiscount}% OFF` : "No Discount"}
                  </span>
                  {computedDiscount > 0 && (
                    <span className="text-[10px] bg-gold-500 text-forest-950 font-bold px-2 py-0.5 rounded uppercase">
                      Badge Active
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-ivory-400 mt-1 block">
                  Automatically computed when compare-at price exceeds selling price.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SECTION 3: IMAGES ==================== */}
        {activeSection === "images" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-forest-850">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                3. Formulation Images &amp; Media
              </h2>
              <p className="text-xs text-ivory-400 font-sans mt-0.5">
                The first image acts as the <strong>PRIMARY IMAGE</strong> shown on catalog cards and stage galleries.
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-luxury overflow-hidden border transition-all group ${
                    idx === 0
                      ? "border-gold-500 ring-2 ring-gold-500/30 shadow-luxury"
                      : "border-forest-800"
                  }`}
                >
                  <div className="relative aspect-square w-full bg-forest-900">
                    <Image src={img} alt={`Formulation Image ${idx + 1}`} fill className="object-cover" />
                  </div>

                  {/* Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    {idx === 0 ? (
                      <span className="bg-gold-500 text-forest-950 text-[9px] font-sans font-bold px-2 py-0.5 rounded uppercase shadow">
                        PRIMARY IMAGE
                      </span>
                    ) : (
                      <span className="bg-forest-950/80 text-ivory-300 text-[9px] font-sans px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Image Controls Overlay */}
                  <div className="absolute inset-0 bg-forest-950/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => setAsPrimaryImage(idx)}
                        className="px-2.5 py-1 bg-gold-500 text-forest-950 text-[10px] font-sans font-bold rounded uppercase"
                      >
                        Make Primary
                      </button>
                    )}

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => moveImage(idx, "left")}
                        disabled={idx === 0}
                        className="p-1 bg-forest-900 hover:bg-forest-800 text-ivory-200 rounded disabled:opacity-30"
                        title="Move left"
                      >
                        <MoveLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(idx, "right")}
                        disabled={idx === images.length - 1}
                        className="p-1 bg-forest-900 hover:bg-forest-800 text-ivory-200 rounded disabled:opacity-30"
                        title="Move right"
                      >
                        <MoveRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1 bg-red-950 hover:bg-red-900 text-red-300 rounded"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Image Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-forest-850">
              {/* File Upload */}
              <div className="p-4 bg-forest-900/40 border border-forest-800 rounded-luxury">
                <span className="text-[10px] uppercase tracking-wider text-gold-400 font-sans block mb-2 font-semibold">
                  Upload Device Media
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="text-xs text-ivory-300 file:mr-3 file:py-2 file:px-3 file:rounded-luxury file:border-0 file:text-xs file:font-semibold file:bg-gold-500 file:text-forest-950 hover:file:bg-gold-400 cursor-pointer"
                />
                {uploadingImage && (
                  <span className="text-xs text-gold-400 mt-2 block animate-pulse">
                    Uploading image...
                  </span>
                )}
              </div>

              {/* Direct Image URL input */}
              <div className="p-4 bg-forest-900/40 border border-forest-800 rounded-luxury">
                <span className="text-[10px] uppercase tracking-wider text-gold-400 font-sans block mb-2 font-semibold">
                  Or Add Cloud / Direct Image URL
                </span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-forest-950 border border-forest-750 text-ivory-100 text-xs px-3 py-2 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                  <button
                    type="button"
                    onClick={addCustomImageUrl}
                    className="px-3.5 py-2 bg-forest-850 hover:bg-forest-800 text-gold-300 text-xs font-semibold uppercase rounded-luxury border border-forest-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Preset Library Shortcuts */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-ivory-400 font-sans block mb-2">
                Quick Botanical Sample Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_BOTANICAL_IMAGES.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (!images.includes(preset)) setImages([...images, preset]);
                    }}
                    className="px-2.5 py-1 bg-forest-900 hover:bg-forest-850 text-ivory-300 text-[10px] rounded border border-forest-800"
                  >
                    + Botanical Preset {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SECTION 4: DESCRIPTION ==================== */}
        {activeSection === "description" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-forest-850">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                4. Editorial Description &amp; Specifications
              </h2>
              <p className="text-xs text-ivory-400 font-sans mt-0.5">
                Detailed description, verified botanical benefits, and apothecary information.
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-gold-400 font-sans font-semibold block mb-1.5">
                Full Formulation Narrative *
              </label>
              <textarea
                rows={6}
                required
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                placeholder="Comprehensive editorial narrative detailing sourcing, processing, and dosha actions..."
                className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Key Benefits (One per line)
                </label>
                <textarea
                  rows={4}
                  value={keyBenefitsText}
                  onChange={(e) => setKeyBenefitsText(e.target.value)}
                  placeholder="Line 1: Promotes natural restful sleep&#10;Line 2: Relieves daily fatigue..."
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Important Information &amp; Disclaimer
                </label>
                <textarea
                  rows={4}
                  value={importantInfo}
                  onChange={(e) => setImportantInfo(e.target.value)}
                  placeholder="Not intended to diagnose or cure medical conditions. Consult your vaidya..."
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== SECTION 5: INGREDIENTS ==================== */}
        {activeSection === "ingredients" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-forest-850 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                  5. Active Botanical Ingredients
                </h2>
                <p className="text-xs text-ivory-400 font-sans mt-0.5">
                  Select authenticated herbs from the library or create new monographs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddIngredientModal(true)}
                className="px-3.5 py-1.5 bg-forest-900 hover:bg-forest-850 border border-gold-500/60 text-gold-300 text-xs font-sans font-semibold rounded-luxury flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ CREATE INGREDIENT</span>
              </button>
            </div>

            {/* Selected Chips */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-sans block mb-2 font-semibold">
                Formulation Contains ({selectedIngredients.length}):
              </span>
              <div className="flex flex-wrap gap-2 min-h-[42px] p-3 bg-forest-900/40 border border-forest-800 rounded-luxury">
                {selectedIngredients.length === 0 ? (
                  <span className="text-xs text-ivory-400 italic font-sans">
                    No ingredients selected. Click an herb below to add.
                  </span>
                ) : (
                  selectedIngredients.map((ing) => (
                    <span
                      key={ing}
                      className="inline-flex items-center space-x-1.5 bg-forest-950 border border-gold-500/50 text-gold-300 px-3 py-1 rounded text-xs font-sans"
                    >
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedIngredients(selectedIngredients.filter((i) => i !== ing))
                        }
                        className="text-ivory-400 hover:text-red-400 p-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Herb Library Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans font-semibold">
                  Browse Botanical Library
                </span>
                <input
                  type="text"
                  placeholder="Filter herbs..."
                  value={ingredientSearch}
                  onChange={(e) => setIngredientSearch(e.target.value)}
                  className="bg-forest-900 border border-forest-750 text-ivory-100 text-xs px-3 py-1.5 rounded-luxury font-sans"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {availableIngredients
                  .filter((ing) =>
                    ing.name.toLowerCase().includes(ingredientSearch.toLowerCase()) ||
                    ing.botanicalName.toLowerCase().includes(ingredientSearch.toLowerCase())
                  )
                  .map((ing) => {
                    const isSelected = selectedIngredients.includes(ing.name);
                    return (
                      <button
                        key={ing.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedIngredients(selectedIngredients.filter((i) => i !== ing.name));
                          } else {
                            setSelectedIngredients([...selectedIngredients, ing.name]);
                          }
                        }}
                        className={`p-2.5 rounded-luxury text-left text-xs font-sans border transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-gold-500/20 border-gold-500 text-gold-300 font-semibold"
                            : "bg-forest-900/50 border-forest-800 text-ivory-300 hover:border-gold-500/40"
                        }`}
                      >
                        <div className="truncate">
                          <span className="block truncate">{ing.name}</span>
                          <span className="text-[9px] text-ivory-400 italic font-serif block truncate">
                            {ing.botanicalName}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Inline Quick Modal for New Herb */}
            {showAddIngredientModal && (
              <div className="p-4 bg-forest-900 border border-gold-500/50 rounded-luxury space-y-3">
                <span className="text-xs uppercase tracking-wider text-gold-400 font-sans font-bold block">
                  Add New Botanical Ingredient to Master Archive
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Common Name (e.g. Giloy)"
                    value={newIngredientName}
                    onChange={(e) => setNewIngredientName(e.target.value)}
                    className="bg-forest-950 border border-forest-750 text-ivory-100 text-xs px-3 py-2 rounded-luxury"
                  />
                  <input
                    type="text"
                    placeholder="Botanical Name (e.g. Tinospora cordifolia)"
                    value={newIngredientBotanical}
                    onChange={(e) => setNewIngredientBotanical(e.target.value)}
                    className="bg-forest-950 border border-forest-750 text-ivory-100 text-xs px-3 py-2 rounded-luxury"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddIngredientModal(false)}
                    className="px-3 py-1.5 text-xs text-ivory-400 hover:text-ivory-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newIngredientName.trim()) return;
                      setSelectedIngredients([...selectedIngredients, newIngredientName.trim()]);
                      setNewIngredientName("");
                      setNewIngredientBotanical("");
                      setShowAddIngredientModal(false);
                    }}
                    className="px-4 py-1.5 bg-gold-500 text-forest-950 text-xs font-bold uppercase rounded-luxury"
                  >
                    Include in Formulation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== SECTION 6: BENEFITS ==================== */}
        {activeSection === "benefits" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-forest-850">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                6. Wellness Goals &amp; Benefits
              </h2>
              <p className="text-xs text-ivory-400 font-sans mt-0.5">
                Select targeted wellness domains (avoids unsupported medical claims).
              </p>
            </div>

            {/* Selected Chips */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-sans block mb-2 font-semibold">
                Active Wellness Goals ({selectedBenefits.length}):
              </span>
              <div className="flex flex-wrap gap-2 min-h-[42px] p-3 bg-forest-900/40 border border-forest-800 rounded-luxury">
                {selectedBenefits.length === 0 ? (
                  <span className="text-xs text-ivory-400 italic font-sans">
                    No wellness benefits selected. Click cards below to add.
                  </span>
                ) : (
                  selectedBenefits.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center space-x-1.5 bg-forest-950 border border-gold-500/50 text-gold-300 px-3 py-1 rounded text-xs font-sans"
                    >
                      <span>{b}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedBenefits(selectedBenefits.filter((x) => x !== b))}
                        className="text-ivory-400 hover:text-red-400 p-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableBenefits.map((b) => {
                const isSelected = selectedBenefits.includes(b.name);
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedBenefits(selectedBenefits.filter((x) => x !== b.name));
                      } else {
                        setSelectedBenefits([...selectedBenefits, b.name]);
                      }
                    }}
                    className={`p-3.5 rounded-luxury text-left text-xs font-sans border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-gold-500/20 border-gold-500 text-gold-300 shadow-luxury"
                        : "bg-forest-900/50 border-forest-800 text-ivory-300 hover:border-gold-500/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{b.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-gold-400" />}
                      </div>
                      <p className="text-[10px] text-ivory-400 leading-snug line-clamp-2">
                        {b.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== SECTION 7: USAGE & RITUALS ==================== */}
        {activeSection === "usage" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-forest-850">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                7. Usage, Rituals &amp; Storage Instructions
              </h2>
              <p className="text-xs text-ivory-400 font-sans mt-0.5">
                Guide the patron in seamlessly weaving this formulation into their daily Dinacharya.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gold-400 font-sans font-semibold block mb-1.5">
                  How to Use &amp; Ritual Guidance *
                </label>
                <textarea
                  rows={3}
                  value={howToUse}
                  onChange={(e) => setHowToUse(e.target.value)}
                  placeholder="Consume 1/2 teaspoon twice daily with warm water, almond milk, or infused with raw honey..."
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Recommended Dosage
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="3g to 5g daily or as advised by an Ayurvedic vaidya."
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Storage Instructions
                </label>
                <input
                  type="text"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  placeholder="Store in a cool, dry place away from direct sunlight in an airtight container."
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== SECTION 8: INVENTORY ==================== */}
        {activeSection === "inventory" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-forest-850">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                8. Inventory &amp; Stock Levels
              </h2>
              <p className="text-xs text-ivory-400 font-sans mt-0.5">
                Monitor physical units, allocated order reserves, and low stock threshold alerts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stock Quantity */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gold-400 font-sans font-semibold block mb-1.5">
                  Total Physical Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="45"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-base font-bold px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-mono"
                />
                <span className="text-[10px] text-ivory-400 mt-1 block">Total units in warehouse</span>
              </div>

              {/* Reserved Quantity */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Reserved in Pending Orders
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={reservedQuantity}
                  onChange={(e) => setReservedQuantity(e.target.value)}
                  placeholder="0"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-base px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-mono"
                />
                <span className="text-[10px] text-ivory-400 mt-1 block">Held for pending checkouts</span>
              </div>

              {/* Low Stock Threshold */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  placeholder="10"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-base px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-mono"
                />
                <span className="text-[10px] text-ivory-400 mt-1 block">Triggers low stock badge</span>
              </div>
            </div>

            {/* Computed Available Stock Card */}
            <div className="p-4 bg-forest-900/60 border border-forest-800 rounded-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-ivory-400 font-sans block">
                  Calculated Available Stock (Stock - Reserved)
                </span>
                <span className="font-serif text-3xl text-ivory-100 font-bold block mt-0.5">
                  {availableStock} Units Available
                </span>
              </div>

              <div>
                <span
                  className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase inline-block ${
                    stockStatusLabel === "OUT OF STOCK"
                      ? "bg-red-950 text-red-300 border border-red-800"
                      : stockStatusLabel === "LOW STOCK"
                      ? "bg-amber-950 text-amber-300 border border-amber-800"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  }`}
                >
                  {stockStatusLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SECTION 9: SEO ==================== */}
        {activeSection === "seo" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-forest-850">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                9. Search Engine Optimization (SEO)
              </h2>
              <p className="text-xs text-ivory-400 font-sans mt-0.5">
                Control how this formulation ranks on search engines and displays across social embeds.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={`${name || "Organic Formulation"} | Ayutrika Herbals`}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={shortDesc || "Pure Ayurvedic botanical formulation..."}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block mb-1.5">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={seoKeywordsText}
                  onChange={(e) => setSeoKeywordsText(e.target.value)}
                  placeholder="ashwagandha, ayurveda, stress relief, herbal powder"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3.5 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              {/* SERP Search Result Mockup */}
              <div className="p-4 bg-forest-900/40 border border-forest-800 rounded-luxury">
                <span className="text-[10px] uppercase tracking-wider text-gold-400 font-sans block mb-2 font-semibold">
                  Google Search Snippet Preview:
                </span>
                <div className="space-y-1">
                  <span className="text-xs text-emerald-400 font-mono block">
                    https://ayutrika.com/product/{slug || "formulation"}
                  </span>
                  <h4 className="font-serif text-base text-gold-300">
                    {seoTitle || `${name || "Product Name"} | Ayutrika Herbals`}
                  </h4>
                  <p className="text-xs text-ivory-300 font-sans line-clamp-2">
                    {seoDescription || shortDesc || "Ayutrika Herbals — Pure botanical formulations crafted for modern wellness rituals."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SECTION 10: PUBLISHING ==================== */}
        {activeSection === "publishing" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-forest-850">
              <h2 className="font-serif text-xl text-ivory-100 uppercase tracking-wide">
                10. Publication Status &amp; Storefront Flags
              </h2>
              <p className="text-xs text-ivory-400 font-sans mt-0.5">
                Control live store visibility and placement in signature sections.
              </p>
            </div>

            {/* Publication Status Selector */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-wider text-gold-400 font-sans font-semibold block">
                Storefront Publication Status
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setStatus("PUBLISHED")}
                  className={`p-4 rounded-luxury border cursor-pointer transition-all ${
                    status === "PUBLISHED"
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-luxury"
                      : "bg-forest-900/40 border-forest-800 text-ivory-300 hover:border-forest-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs font-sans">PUBLISHED</span>
                    {status === "PUBLISHED" && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-ivory-400">
                    Visible immediately to public customers on shop, search, and category pages.
                  </p>
                </div>

                <div
                  onClick={() => setStatus("DRAFT")}
                  className={`p-4 rounded-luxury border cursor-pointer transition-all ${
                    status === "DRAFT"
                      ? "bg-amber-950/80 border-amber-500 text-amber-300 shadow-luxury"
                      : "bg-forest-900/40 border-forest-800 text-ivory-300 hover:border-forest-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs font-sans">DRAFT</span>
                    {status === "DRAFT" && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-ivory-400">
                    Hidden from public browsing. Accessible exclusively to administrators via Preview mode.
                  </p>
                </div>

                <div
                  onClick={() => setStatus("ARCHIVED")}
                  className={`p-4 rounded-luxury border cursor-pointer transition-all ${
                    status === "ARCHIVED"
                      ? "bg-charcoal-900 border-gold-500/50 text-ivory-100 shadow-luxury"
                      : "bg-forest-900/40 border-forest-800 text-ivory-300 hover:border-forest-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs font-sans">ARCHIVED</span>
                    {status === "ARCHIVED" && <Check className="w-4 h-4 text-ivory-300" />}
                  </div>
                  <p className="text-[11px] text-ivory-400">
                    Deactivated from active catalog. Preserves historical orders and formulation logs.
                  </p>
                </div>
              </div>
            </div>

            {/* Merchandising Badges & Flags */}
            <div className="pt-4 border-t border-forest-850 space-y-3">
              <label className="text-[10px] uppercase tracking-wider text-ivory-300 font-sans block font-semibold">
                Storefront Merchandising Highlights
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                <label className="p-3 bg-forest-900/40 border border-forest-800 rounded-luxury flex items-center space-x-3 cursor-pointer hover:border-gold-500/40">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-forest-700 bg-forest-950 text-gold-500 focus:ring-gold-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-ivory-100 font-semibold block">Signature Collection</span>
                    <span className="text-[10px] text-ivory-400">Appears on Homepage feature</span>
                  </div>
                </label>

                <label className="p-3 bg-forest-900/40 border border-forest-800 rounded-luxury flex items-center space-x-3 cursor-pointer hover:border-gold-500/40">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded border-forest-700 bg-forest-950 text-gold-500 focus:ring-gold-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-ivory-100 font-semibold block">Best Seller Badge</span>
                    <span className="text-[10px] text-ivory-400">Highlighted on product card</span>
                  </div>
                </label>

                <label className="p-3 bg-forest-900/40 border border-forest-800 rounded-luxury flex items-center space-x-3 cursor-pointer hover:border-gold-500/40">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded border-forest-700 bg-forest-950 text-gold-500 focus:ring-gold-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-ivory-100 font-semibold block">New Arrival</span>
                    <span className="text-[10px] text-ivory-400">Marked as recent harvest</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Bottom Final Action Buttons */}
            <div className="pt-6 border-t border-forest-850 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="px-5 py-3 bg-forest-900 hover:bg-forest-850 border border-forest-750 text-ivory-200 text-xs font-sans font-semibold uppercase tracking-wider rounded-luxury"
              >
                Open Live Preview
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveWithStatus("DRAFT")}
                className="px-5 py-3 bg-forest-900 hover:bg-forest-850 text-gold-300 border border-gold-500/60 text-xs font-sans font-bold uppercase tracking-wider rounded-luxury"
              >
                Save as Draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveWithStatus("PUBLISHED")}
                className="px-8 py-3 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-sans font-bold uppercase tracking-[0.25em] rounded-luxury shadow-luxury"
              >
                {saving ? "Publishing..." : "Publish Formulation"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================== INTERACTIVE PREVIEW MODAL ==================== */}
      {previewOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-charcoal-950/85 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center">
          <div className="w-full max-w-4xl bg-forest-950 border border-forest-800 rounded-luxury shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Preview Banner */}
            <div className="bg-forest-900 px-6 py-3 border-b border-forest-800 flex items-center justify-between text-xs font-sans">
              <div className="flex items-center space-x-2 text-gold-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span className="uppercase tracking-widest">
                  Live Formulation Preview ({status})
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href={`/product/${slug}?preview=true`}
                  target="_blank"
                  className="text-ivory-300 hover:text-gold-400 flex items-center space-x-1"
                >
                  <span>Open Full Screen</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="text-ivory-400 hover:text-ivory-100 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Stage */}
                <div className="relative aspect-square w-full rounded-luxury overflow-hidden bg-forest-900 border border-forest-800">
                  <Image src={images[0]} alt={name || "Product"} fill className="object-cover" />
                  {computedDiscount > 0 && (
                    <span className="absolute top-3 left-3 bg-gold-500 text-forest-950 text-[10px] font-sans font-bold px-2 py-0.5 rounded uppercase">
                      {computedDiscount}% OFF
                    </span>
                  )}
                </div>

                {/* Right Summary */}
                <div className="space-y-4">
                  <div className="text-[10px] tracking-widest uppercase text-gold-400 font-sans">
                    {subcategory} • {selectedIngredients[0] || "Botanical Formulation"}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
                    {name || "Untitled Formulation"}
                  </h3>
                  <div className="flex items-baseline space-x-3">
                    <span className="font-sans font-bold text-2xl text-gold-400">
                      {formatPrice(parsedPrice)}
                    </span>
                    {parsedCompareAt > parsedPrice && (
                      <span className="text-xs text-ivory-400 line-through">
                        {formatPrice(parsedCompareAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ivory-300 font-sans leading-relaxed">
                    {shortDesc}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-forest-850 text-xs font-sans">
                    <div className="flex justify-between">
                      <span className="text-ivory-400">SKU:</span>
                      <span className="font-mono text-ivory-200">{sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ivory-400">Weight:</span>
                      <span className="text-ivory-200">{weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ivory-400">Stock Availability:</span>
                      <span className={availableStock > 0 ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                        {stockStatusLabel} ({availableStock} units)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 bg-gold-500 text-forest-950 text-xs font-bold uppercase tracking-widest rounded-luxury opacity-90 cursor-not-allowed"
                    >
                      Add to Cart (Preview Only)
                    </button>
                  </div>
                </div>
              </div>

              {/* Description preview */}
              <div className="pt-6 border-t border-forest-850 space-y-4">
                <h4 className="font-serif text-lg text-ivory-100 uppercase">
                  Full Botanical Narrative
                </h4>
                <p className="text-xs text-ivory-300 font-sans leading-relaxed whitespace-pre-line">
                  {fullDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
