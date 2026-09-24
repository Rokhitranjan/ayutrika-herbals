import { NextRequest, NextResponse } from "next/server";
import { getReviewsByProduct, addReview, getAllAdminReviews } from "@/lib/data/store";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const all = searchParams.get("all") === "true";

    if (all) {
      const allReviews = await getAllAdminReviews();
      return NextResponse.json(allReviews);
    }

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const reviews = await getReviewsByProduct(productId);
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, customerName, rating, title, comment } = body;

    if (!productId || !customerName || !title || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await addReview({
      productId,
      customerName,
      rating: Number(rating) || 5,
      title,
      comment,
      verified: true,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
