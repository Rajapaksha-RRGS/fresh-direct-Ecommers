/**
 * PATCH /api/products/[id]/view
 *
 * Demand Tracking — called every time a user views a product detail page.
 *
 * Atomic operation (single DB round-trip):
 *   • demandScore  += 1
 *   • totalViews   += 1
 *
 * After incrementing, immediately recalculates and persists currentPrice
 * using the pricing engine so the live price reflects the new demand.
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { calculateLivePrice } from "@/lib/pricing";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    // ── 1. Atomically increment demand counters ───────────────────────────────
    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { demandScore: 1, totalViews: 1 } },
      { new: true } // return the updated document
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ── 2. Recalculate live price with updated demandScore ────────────────────
    const livePrice = calculateLivePrice(
      product.basePrice,
      product.demandScore,
      product.stockQty
    );

    // ── 3. Persist the new price ──────────────────────────────────────────────
    product.currentPrice = livePrice;
    await product.save();

    return NextResponse.json(
      {
        success: true,
        productId: id,
        demandScore: product.demandScore,
        totalViews: product.totalViews,
        currentPrice: livePrice,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[PATCH /api/products/[id]/view]", err);
    return NextResponse.json(
      { error: "Failed to track product view" },
      { status: 500 }
    );
  }
}
