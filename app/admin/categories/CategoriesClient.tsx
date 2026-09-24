"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/lib/types";
import { PlusCircle, Search, Edit, Trash2, Layers, Check, X, ExternalLink } from "lucide-react";
import { slugify } from "@/lib/utils";

interface CategoriesClientProps {
  initialCategories: Category[];
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCategory) {
        // Update
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, slug: slug || slugify(name), description, image }),
        });
        const updated = await res.json();
        if (res.ok && updated) {
          setCategories(categories.map((c) => (c.id === editingCategory.id ? updated : c)));
          setIsModalOpen(false);
        } else {
          alert("Failed to update category");
        }
      } else {
        // Create
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, slug: slug || slugify(name), description, image }),
        });
        const created = await res.json();
        if (res.ok && created) {
          setCategories([...categories, created]);
          setIsModalOpen(false);
        } else {
          alert("Failed to create category");
        }
      }
    } catch {
      alert("Error saving category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch {
      alert("Error deleting category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            TAXONOMY ARCHITECTURE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Apothecary Categories ({categories.length})
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Organize botanical remedies into sacred wellness classifications.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-semibold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-2 shadow-luxury w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-forest-950 border border-forest-850 p-4 rounded-luxury">
        <div className="relative">
          <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs pl-9 pr-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            className="bg-forest-950 border border-forest-850 rounded-luxury overflow-hidden hover:border-gold-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[16/9] bg-forest-900 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-forest-950/80 backdrop-blur-sm text-gold-400 text-[10px] font-mono rounded">
                  {cat.productCount ?? 0} Products
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-serif text-lg text-ivory-100 group-hover:text-gold-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-ivory-400 font-sans line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <span className="text-[10px] text-ivory-500 font-mono block">
                  Slug: /{cat.slug}
                </span>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-forest-850 flex items-center justify-between">
              <Link
                href={`/categories/${cat.slug}`}
                target="_blank"
                className="text-xs text-ivory-400 hover:text-gold-400 font-sans flex items-center space-x-1"
              >
                <span>View Store Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 text-ivory-400 hover:text-gold-400 rounded transition-colors"
                  title="Edit Category"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 text-ivory-400 hover:text-red-400 rounded transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forest-950 border border-forest-800 w-full max-w-lg rounded-luxury p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-forest-850 pb-3">
              <h2 className="font-serif text-lg text-ivory-100">
                {editingCategory ? "Edit Apothecary Category" : "Add Apothecary Category"}
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
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Herbal Powders & Churnas"
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
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Botanical description and therapeutic classifications..."
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
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
                  {saving ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
