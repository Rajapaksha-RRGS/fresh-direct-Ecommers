import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";

// ─── GET /api/products/[id] — single product detail ──────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (err) {
    console.error("[Product Detail API]", err);
    return NextResponse.json({ error: "Failed to fetch product." }, { status: 500 });
  }
}
