import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Convert buffer to data URI for instant, robust display and persistence
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mime = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      const dataUri = `data:${mime};base64,${base64}`;

      return NextResponse.json({
        url: dataUri,
        filename: file.name,
        size: file.size,
      });
    } else {
      // JSON payload with url or base64
      const body = await request.json();
      if (!body.url && !body.data) {
        return NextResponse.json({ error: "Image URL or data is required" }, { status: 400 });
      }

      return NextResponse.json({
        url: body.url || body.data,
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
