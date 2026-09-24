"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/types";
import { formatDate, slugify } from "@/lib/utils";
import { PlusCircle, Search, Edit, Trash2, ExternalLink, BookOpen, Check, X } from "lucide-react";

interface BlogAdminClientProps {
  initialPosts: BlogPost[];
}

export default function BlogAdminClient({ initialPosts }: BlogAdminClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("Vaidya Editorial Board");
  const [category, setCategory] = useState("Ayurvedic Wisdom");
  const [tagsText, setTagsText] = useState("ayurveda, herbs, wellness, rituals");
  const [readingTime, setReadingTime] = useState("4 min read");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCoverImage("https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80");
    setAuthor("Vaidya Editorial Board");
    setCategory("Ayurvedic Wisdom");
    setTagsText("ayurveda, herbs, wellness, rituals");
    setReadingTime("5 min read");
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: BlogPost) => {
    setEditingPost(p);
    setTitle(p.title);
    setSlug(p.slug);
    setExcerpt(p.excerpt);
    setContent(p.content);
    setCoverImage(p.coverImage);
    setAuthor(p.author);
    setCategory(p.category);
    setTagsText(p.tags.join(", "));
    setReadingTime(p.readingTime);
    setIsPublished(p.isPublished);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) setSlug(slugify(val));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      slug: slug || slugify(title),
      excerpt,
      content,
      coverImage,
      author,
      category,
      tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
      readingTime,
      isPublished,
    };

    try {
      if (editingPost) {
        const res = await fetch(`/api/blog/${editingPost.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        if (res.ok && updated) {
          setPosts(posts.map((p) => (p.id === editingPost.id ? updated : p)));
          setIsModalOpen(false);
        } else {
          alert("Failed to update post");
        }
      } else {
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        if (res.ok && created) {
          setPosts([created, ...posts]);
          setIsModalOpen(false);
        } else {
          alert("Failed to create post");
        }
      }
    } catch {
      alert("Error saving blog article");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, postTitle: string) => {
    if (!confirm(`Delete journal article "${postTitle}"?`)) return;

    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete article");
      }
    } catch {
      alert("Error deleting article");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-forest-850">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold">
            EDITORIAL SANCTUARY
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase">
            Herbal Journal &amp; Wisdom Articles ({posts.length})
          </h1>
          <p className="text-xs text-ivory-400 font-sans mt-0.5">
            Publish educational articles on botanical wellness, seasonal rituals, and Ayurveda.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-semibold uppercase tracking-wider rounded-luxury transition-all flex items-center space-x-2 shadow-luxury w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write Journal Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-forest-950 border border-forest-850 p-4 rounded-luxury">
        <div className="relative">
          <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, category, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs pl-9 pr-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
          />
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="bg-forest-950 border border-forest-850 rounded-luxury overflow-hidden hover:border-gold-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[16/9] bg-forest-900 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-forest-950/90 text-gold-300 text-[10px] font-mono rounded">
                  {post.category}
                </span>
                <span
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono uppercase ${
                    post.isPublished
                      ? "bg-emerald-950/90 text-emerald-300 border border-emerald-800"
                      : "bg-forest-900/90 text-ivory-400 border border-forest-700"
                  }`}
                >
                  {post.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg text-ivory-100 group-hover:text-gold-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-ivory-400 font-sans line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-2 text-[10px] text-ivory-500 font-mono">
                  <span>By {post.author}</span>
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-forest-850 flex items-center justify-between">
              <Link
                href={`/journal/${post.slug}`}
                target="_blank"
                className="text-xs text-ivory-400 hover:text-gold-400 font-sans flex items-center space-x-1"
              >
                <span>Read Article</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => openEditModal(post)}
                  className="p-1.5 text-ivory-400 hover:text-gold-400 rounded transition-colors"
                  title="Edit Article"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="p-1.5 text-ivory-400 hover:text-red-400 rounded transition-colors"
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Journal Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-forest-950 border border-forest-800 w-full max-w-2xl rounded-luxury p-6 space-y-5 max-h-[90vh] overflow-y-auto custom-gold-scrollbar">
            <div className="flex items-center justify-between border-b border-forest-850 pb-3">
              <h2 className="font-serif text-lg text-ivory-100">
                {editingPost ? "Edit Journal Article" : "Compose Journal Article"}
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
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. The Sacred Science of Ashwagandha: An Ancient Adaptogen"
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    URL Slug
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
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-forest-900/60 border border-forest-800 text-ivory-200 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Author
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-forest-900/60 border border-forest-800 text-ivory-200 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    className="w-full bg-forest-900/60 border border-forest-800 text-ivory-200 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Editorial Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Full Article Content (Markdown / Text) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-100 text-xs p-3 rounded-luxury focus:outline-none focus:border-gold-500 font-sans font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-ivory-300 block mb-1 font-sans">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="w-full bg-forest-900/60 border border-forest-800 text-ivory-200 text-xs px-3 py-2.5 rounded-luxury focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheck"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-forest-800 bg-forest-900 text-gold-500 focus:ring-gold-500"
                />
                <label htmlFor="publishedCheck" className="text-xs text-ivory-200 cursor-pointer">
                  Publish to Public Journal Immediately
                </label>
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
                  {saving ? "Publishing..." : editingPost ? "Update Article" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
