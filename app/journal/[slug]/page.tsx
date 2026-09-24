import { getBlogPostBySlug, getBlogPosts } from "@/lib/data/store";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Article Not Found | Ayutrika Herbals" };

  return {
    title: `${post.title} | Ayutrika Herbals Journal`,
    description: post.excerpt,
    alternates: {
      canonical: `/journal/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = await getBlogPosts();
  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: [post.coverImage],
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: [
      {
        "@type": "Person",
        name: post.author,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Ayutrika Herbals",
      logo: {
        "@type": "ImageObject",
        url: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=85",
      },
    },
    description: post.excerpt,
  };

  return (
    <div className="bg-forest-950 text-ivory-100 min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <Link
          href="/journal"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-sans mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Journal Essays</span>
        </Link>

        {/* Article Header */}
        <header className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-3 text-[10px] tracking-[0.25em] uppercase text-gold-400 font-sans font-semibold mb-3">
            <span>{post.category}</span>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory-100 tracking-wide leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-center space-x-4 text-xs font-sans text-ivory-400">
            <span>By {post.author}</span>
            <span>•</span>
            <span>Published on {formatDate(post.createdAt)}</span>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="relative aspect-[16/9] w-full rounded-luxury overflow-hidden border border-forest-800 shadow-2xl mb-12 bg-forest-900">
          <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
        </div>

        {/* Article Body */}
        <article className="prose prose-invert max-w-none font-sans text-ivory-200/95 leading-relaxed text-sm sm:text-base font-light space-y-6 pb-12 border-b border-forest-850 whitespace-pre-line">
          {post.content}
        </article>

        {/* Tags */}
        <div className="py-6 border-b border-forest-850 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-ivory-400 font-sans mr-2">Tags:</span>
          {post.tags.map((t) => (
            <span
              key={t}
              className="px-3 py-1 bg-forest-900 border border-forest-800 text-gold-400 text-xs rounded-luxury font-sans"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Related Essays */}
        {related.length > 0 && (
          <div className="pt-12">
            <h3 className="font-serif text-2xl uppercase tracking-wider text-ivory-100 mb-6">
              Continue Reading
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/journal/${p.slug}`}
                  className="p-6 bg-forest-900/40 border border-forest-850 hover:border-gold-500/50 rounded-luxury transition-all space-y-3 block"
                >
                  <span className="text-[10px] tracking-widest uppercase text-gold-400 font-sans block">
                    {p.category}
                  </span>
                  <h4 className="font-serif text-xl text-ivory-100 hover:text-gold-300 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-xs text-ivory-400 font-sans line-clamp-2">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
