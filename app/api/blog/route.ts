import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, getAllAdminBlogPosts, createBlogPost } from "@/lib/data/store";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const posts = all ? await getAllAdminBlogPosts() : await getBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
    }

    const post = await createBlogPost({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || "",
      content: body.content,
      coverImage: body.coverImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85",
      author: body.author || "Ayutrika Botanical Circle",
      category: body.category || "Ayurvedic Foundations",
      tags: Array.isArray(body.tags) ? body.tags : ["Ayurveda", "Wellness"],
      readingTime: body.readingTime || "5 min read",
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
