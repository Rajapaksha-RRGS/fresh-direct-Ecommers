/**
 * GET /api/products
 *
 * Returns all APPROVED products with a freshly-calculated dynamic price (v2 engine).
 * For every product:
 *   1. Resolve demandLevel via getDemandLevel()
 *   2. Compute live dynamic price via calculateDynamicPrice()
 *   3. Persist currentPrice and demandLevel to MongoDB
 *   4. Return updated products list with populated farmer name & demand factors
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import PricingConfig from "@/models/PricingConfig";
import { getDemandLevel, calculateDynamicPrice } from "@/lib/pricing";

async function getOrCreateConfig() {
  let config = await PricingConfig.findOne().lean();
  if (!config) {
    config = await PricingConfig.create({});
    config = await PricingConfig.findOne().lean();
  }
  return config!;
}

export async function GET() {
  try {
    await connectDB();

    const [products, config] = await Promise.all([
      Product.find({}).populate("farmerId", "name").lean(),
      getOrCreateConfig(),
    ]);

    if (!products || products.length === 0) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const priceUpdates = products.map(async (p: any) => {
      const demandLevel = getDemandLevel(
        p.demandScore ?? 0,
        p.totalViews ?? 0,
        p.totalSold ?? 0
      );
      const maxStockQty = p.maxStockQty ?? 1000;
      const livePrice = calculateDynamicPrice(
        p.basePrice,
        demandLevel,
        p.stockQty ?? 0,
        maxStockQty,
        config
      );

      const demandFactor =
        demandLevel === "High" ? 1.3 : demandLevel === "Low" ? 0.8 : 1.0;

      await Product.updateOne(
        { _id: p._id },
        { $set: { currentPrice: livePrice, demandLevel } }
      );

      return {
        ...p,
        currentPrice: livePrice,
        demandFactor,
        demandLevel,
      };
    });

    const updatedProducts = await Promise.all(priceUpdates);

    return NextResponse.json(
      { products: JSON.parse(JSON.stringify(updatedProducts)) },
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
