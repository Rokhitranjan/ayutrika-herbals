import { getBlogPosts } from "@/lib/data/store";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Botanical Journal | Ayutrika Herbals",
  description: "Editorial essays on classical Ayurveda, herbal monographs, mindful wellness rituals, and botanical science.",
};

export default async function JournalPage() {
  const posts = await getBlogPosts();

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-sans font-semibold block mb-2">
            BOTANICAL ESSAYS & MONOGRAPHS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory-100 uppercase tracking-wide">
            The Botanical Journal
          </h1>
          <div className="w-16 h-[1.5px] bg-gold-500/50 mx-auto my-6" />
          <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light leading-relaxed">
            Thoughtfully penned dispatches exploring ancient plant wisdom, daily Dinacharya rituals, adaptogenic science, and mindful natural living.
          </p>
        </div>

        {/* Featured First Article */}
        {posts[0] && (
          <div className="mb-16">
            <Link
              href={`/journal/${posts[0].slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 rounded-luxury overflow-hidden border border-forest-850 hover:border-gold-500/50 bg-forest-900/40 shadow-2xl transition-all"
            >
              <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] bg-forest-900 overflow-hidden">
                <Image
                  src={posts[0].coverImage}
                  alt={posts[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-gold-400 font-sans mb-3 font-semibold">
                    <span>{posts[0].category}</span>
                    <span>•</span>
                    <span>{posts[0].readingTime}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-4xl text-ivory-100 group-hover:text-gold-300 transition-colors leading-snug mb-4">
                    {posts[0].title}
                  </h2>
                  <p className="text-xs sm:text-sm text-ivory-300 font-sans font-light leading-relaxed mb-6">
                    {posts[0].excerpt}
                  </p>
                </div>
                <div className="pt-4 border-t border-forest-850 flex items-center justify-between text-xs font-sans text-gold-400 uppercase tracking-widest font-semibold">
                  <span>Read Full Essay</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Secondary Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(1).map((post) => (
            <Link
              key={post.id}
              href={`/journal/${post.slug}`}
              className="group flex flex-col justify-between bg-forest-900/40 border border-forest-850 hover:border-gold-500/50 rounded-luxury overflow-hidden transition-all shadow-luxury"
            >
              <div className="relative aspect-[16/10] w-full bg-forest-950 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
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
                  <p className="text-xs text-ivory-300/80 font-sans mt-2 line-clamp-3 leading-relaxed font-light">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-forest-850 flex items-center justify-between text-[10px] font-sans tracking-widest uppercase text-gold-400 font-semibold">
                  <span>Read Essay</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
