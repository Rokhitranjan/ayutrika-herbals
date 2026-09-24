"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Ingredient } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { PlusCircle, Search, Edit, Trash2, Leaf, X } from "lucide-react";

interface IngredientsClientProps {
  initialIngredients: Ingredient[];
}

export default function IngredientsClient({ initialIngredients }: IngredientsClientProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);

  // Form
  const [name, setName] = useState("");
  const [botanicalName, setBotanicalName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [traditionalUse, setTraditionalUse] = useState("");
  const [benefitsText, setBenefitsText] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = ingredients.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.botanicalName.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingItem(null);
    setName("");
    setBotanicalName("");
    setSlug("");
    setImage("https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80");
    setDescription("");
    setTraditionalUse("");
    setBenefitsText("Vitality, Stress Relief, Cognitive Clarity");
    setIsModalOpen(true);
  };

  const openEditModal = (item: Ingredient) => {
    setEditingItem(item);
    setName(item.name);
    setBotanicalName(item.botanicalName);
    setSlug(item.slug);
    setImage(item.image);
    setDescription(item.description);
    setTraditionalUse(item.traditionalUse);
    setBenefitsText(item.benefits.join(", "));
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingItem) setSlug(slugify(val));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      botanicalName,
      slug: slug || slugify(name),
      image,
      description,
      traditionalUse,
      benefits: benefitsText.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const url = editingItem ? `/api/ingredients/${editingItem.id}` : "/api/ingredients";
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data) {
        if (editingItem) {
          setIngredients(ingredients.map((i) => (i.id === editingItem.id ? data : i)));
        } else {
          setIngredients([...ingredients, data]);
        }
        setIsModalOpen(false);
      } else {
        alert(data.error || "Failed to save botanical ingredient");
      }
    } catch {
      alert("Error saving ingredient");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, ingName: string) => {
    if (!confirm(`Delete botanical entry "${ingName}"?`)) return;
    try {
      const res = await fetch(`/api/ingredients/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setIngredients(ingredients.filter((i) => i.id !== id));
      } else {
        alert(data.error || "Failed to delete botanical entry");
      }
    } catch {
      alert("Error deleting ingredient");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            BOTANICAL ARCHIVE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Sacred Herbal Ingredients ({ingredients.length})
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Curate Latin taxonomy, traditional Vedic uses, and phytomedicinal properties.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-semibold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-2 shadow-luxury w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Herb / Botanical</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-forest-950 border border-forest-850 p-4 rounded-luxury">
        <div className="relative">
          <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by common name, Latin botanical binomial, or therapeutic use..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs pl-9 pr-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
          />
        </div>
      </div>

      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ing) => (
          <div
            key={ing.id}
            className="bg-forest-950 border border-forest-850 rounded-luxury p-5 flex flex-col justify-between hover:border-gold-500/40 transition-all group"
          >
            <div>
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 rounded-luxury overflow-hidden relative flex-shrink-0 border border-forest-800 bg-forest-900">
                  <Image
                    src={ing.image}
                    alt={ing.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="64px"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-ivory-100 group-hover:text-gold-300 transition-colors">
                    {ing.name}
                  </h3>
                  <p className="text-[11px] text-gold-400/90 italic font-serif">
                    {ing.botanicalName}
                  </p>
                  <span className="text-[10px] text-ivory-500 font-mono mt-0.5 block">
                    /{ing.slug}
                  </span>
                </div>
              </div>

              <p className="text-xs text-ivory-300 font-sans leading-relaxed line-clamp-3 mb-3">
                {ing.description}
              </p>

              <div className="bg-forest-900/40 p-2.5 rounded-luxury border border-forest-850/80 mb-3 text-[11px] text-ivory-400 font-sans">
                <strong className="text-gold-400 font-serif block text-xs mb-0.5">Traditional Vedic Lore:</strong>
                {ing.traditionalUse}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {ing.benefits.map((b, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-2 py-0.5 bg-forest-900 text-ivory-300 rounded font-mono border border-forest-800"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-forest-850 flex items-center justify-end space-x-2">
              <button
                onClick={() => openEditModal(ing)}
                className="p-1.5 text-ivory-400 hover:text-gold-400 rounded transition-colors"
                title="Edit Botanical Entry"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(ing.id, ing.name)}
                className="p-1.5 text-ivory-400 hover:text-red-400 rounded transition-colors"
                title="Delete Botanical Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forest-950 border border-forest-800 w-full max-w-lg rounded-luxury p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-gold-scrollbar">
            <div className="flex items-center justify-between border-b border-forest-850 pb-3">
              <h2 className="font-serif text-lg text-ivory-100">
                {editingItem ? "Edit Botanical Entry" : "Catalog New Botanical"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-ivory-400 hover:text-ivory-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Botanical Common Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Ashwagandha"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Latin Binomial (Botanical Name) *
                </label>
                <input
                  type="text"
                  required
                  value={botanicalName}
                  onChange={(e) => setBotanicalName(e.target.value)}
                  placeholder="e.g. Withania somnifera"
                  className="w-full bg-forest-900/60 border border-forest-800 text-gold-400 italic text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-serif"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Traditional Ayurvedic Lore &amp; Uses *
                </label>
                <textarea
                  required
                  rows={2}
                  value={traditionalUse}
                  onChange={(e) => setTraditionalUse(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Key Benefits (comma separated)
                </label>
                <input
                  type="text"
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  placeholder="Vitality, Deep Sleep, Immunity"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-forest-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-forest-900 hover:bg-forest-850 text-ivory-300 text-xs rounded-luxury"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-bold uppercase tracking-wider rounded-luxury transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingItem ? "Update Herb" : "Catalog Herb"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
