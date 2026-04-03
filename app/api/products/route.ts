import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";

// ─── GET /api/products — list approved products ───────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);

    const query: Record<string, unknown> = { status: "APPROVED" };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ products });
  } catch (err) {
    console.error("[Products API]", err);
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}
