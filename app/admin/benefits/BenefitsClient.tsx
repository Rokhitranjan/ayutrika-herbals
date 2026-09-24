"use client";

import React, { useState } from "react";
import { Benefit } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { PlusCircle, Search, Edit, Trash2, Sparkles, X } from "lucide-react";

interface BenefitsClientProps {
  initialBenefits: Benefit[];
}

export default function BenefitsClient({ initialBenefits }: BenefitsClientProps) {
  const [benefits, setBenefits] = useState<Benefit[]>(initialBenefits);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Benefit | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = benefits.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingItem(null);
    setName("");
    setSlug("");
    setDescription("");
    setTag("Wellness");
    setIsModalOpen(true);
  };

  const openEditModal = (item: Benefit) => {
    setEditingItem(item);
    setName(item.name);
    setSlug(item.slug);
    setDescription(item.description);
    setTag(item.tag || "Wellness");
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
      slug: slug || slugify(name),
      description,
      tag,
    };

    try {
      const url = editingItem ? `/api/benefits/${editingItem.id}` : "/api/benefits";
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data) {
        if (editingItem) {
          setBenefits(benefits.map((b) => (b.id === editingItem.id ? data : b)));
        } else {
          setBenefits([...benefits, data]);
        }
        setIsModalOpen(false);
      } else {
        alert(data.error || "Failed to save benefit");
      }
    } catch {
      alert("Error saving benefit");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, benefitName: string) => {
    if (!confirm(`Delete benefit "${benefitName}"?`)) return;
    try {
      const res = await fetch(`/api/benefits/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setBenefits(benefits.filter((b) => b.id !== id));
      } else {
        alert(data.error || "Failed to delete benefit");
      }
    } catch {
      alert("Error deleting benefit");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            WELLNESS TARGETS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Therapeutic Benefits ({benefits.length})
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Classify formulations by holistic wellness outcomes (Sleep, Immunity, Digestion).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-semibold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-2 shadow-luxury w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Wellness Goal</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-forest-950 border border-forest-850 p-4 rounded-luxury">
        <div className="relative">
          <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search benefits by name or target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs pl-9 pr-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-forest-950 border border-forest-850 rounded-luxury p-5 flex flex-col justify-between hover:border-gold-500/40 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-forest-900 text-gold-300 text-[10px] font-mono rounded border border-forest-800">
                  {b.tag || "Wellness"}
                </span>
                <span className="text-[10px] text-ivory-500 font-mono">/{b.slug}</span>
              </div>

              <h3 className="font-serif text-lg text-ivory-100 group-hover:text-gold-300 transition-colors mb-2">
                {b.name}
              </h3>

              <p className="text-xs text-ivory-300 font-sans leading-relaxed">
                {b.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-forest-850 flex items-center justify-end space-x-2">
              <button
                onClick={() => openEditModal(b)}
                className="p-1.5 text-ivory-400 hover:text-gold-400 rounded transition-colors"
                title="Edit Benefit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(b.id, b.name)}
                className="p-1.5 text-ivory-400 hover:text-red-400 rounded transition-colors"
                title="Delete Benefit"
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
          <div className="bg-forest-950 border border-forest-800 w-full max-w-md rounded-luxury p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-forest-850 pb-3">
              <h2 className="font-serif text-lg text-ivory-100">
                {editingItem ? "Edit Wellness Benefit" : "Add Wellness Benefit"}
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
                  Benefit / Wellness Goal *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Deep Restorative Sleep"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-300 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Classification Tag
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Nervous System"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-200 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Therapeutic Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
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
                  {saving ? "Saving..." : editingItem ? "Update Benefit" : "Save Benefit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
