/**
 * GET /api/products
 *
 * Returns all APPROVED products with a freshly-calculated live price.
 * For every product:
 *   1. Run calculateLivePrice(basePrice, demandScore, stockQty)
 *   2. Persist the new currentPrice to the DB (atomic $set)
 *   3. Return the updated list with farmerId populated (farmer name)
 *
 * Client-side price manipulation is impossible — no price logic runs
 * in the browser; only this server route writes currentPrice.
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { calculateLivePrice } from "@/lib/pricing";

export async function GET() {
  try {
    await connectDB();

    // ── 1. Fetch all approved products ──────────────────────────────────────
    const products = await Product.find({ status: "APPROVED" })
      .populate("farmerId", "name") // only expose farmer's display name
      .lean();

    if (products.length === 0) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    // ── 2. Recalculate & sync prices in parallel ─────────────────────────────
    const priceUpdates = products.map((p) => {
      const livePrice = calculateLivePrice(p.basePrice, p.demandScore, p.stockQty);
      return Product.updateOne(
        { _id: p._id },
        { $set: { currentPrice: livePrice } }
      ).then(() => ({ ...p, currentPrice: livePrice }));
    });

    const updated = await Promise.all(priceUpdates);

    // ── 3. Serialise and return ──────────────────────────────────────────────
    return NextResponse.json(
      { products: JSON.parse(JSON.stringify(updated)) },
      { status: 200 }
    );
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
