/**
 * app/api/pricing/refresh/route.ts
 *
 * POST /api/pricing/refresh
 *   Recalculate and persist dynamic prices for ALL APPROVED products.
 *   Updates `currentPrice` and `demandLevel` on each product document,
 *   then returns the refreshed pricing rows in the same shape as GET /api/pricing.
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import PricingConfig from "@/models/PricingConfig";
import {
  getDemandLevel,
  calculateDynamicPrice,
} from "@/lib/pricing";
import type { DemandLevel } from "@/types/admin";

// ─── Helper: get or create the singleton PricingConfig ───────────────────────
async function getOrCreateConfig() {
  let config = await PricingConfig.findOne().lean();
  if (!config) {
    config = await PricingConfig.create({});
    config = await PricingConfig.findOne().lean();
  }
  return config!;
}

// ─── POST /api/pricing/refresh ────────────────────────────────────────────────
export async function POST() {
  try {
    await connectDB();

    const [products, config] = await Promise.all([
      Product.find({}).lean(),
      getOrCreateConfig(),
    ]);

    if (!products.length) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    // Build the update ops and response rows in a single pass
    const bulkOps: Parameters<typeof Product.bulkWrite>[0] = [];
    const rows: object[] = [];

    for (const p of products) {
      const demandLevel: DemandLevel = getDemandLevel(
        p.demandScore,
        p.totalViews,
        p.totalSold
      );

      const maxStockQty = p.maxStockQty ?? 1000;
      const dynamicPrice = calculateDynamicPrice(
        p.basePrice,
        demandLevel,
        p.stockQty,
        maxStockQty,
        config
      );

      const supplyPct = Math.min(
        100,
        Math.round((p.stockQty / maxStockQty) * 100)
      );

      // Persist updated fields back to MongoDB
      bulkOps.push({
        updateOne: {
          filter: { _id: p._id },
          update: {
            $set: {
              currentPrice: dynamicPrice,
              demandLevel,
              updatedAt: new Date(),
            },
          },
        },
      });

      rows.push({
        id: String(p._id),
        name: p.name,
        category: p.category,
        unit: p.unit ?? "kg",
        basePrice: p.basePrice,
        supply: p.stockQty,
        supplyMax: maxStockQty,
        supplyPct,
        demand: demandLevel,
        dynamicPrice,
      });
    }

    // Execute all updates in a single round-trip
    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    // Sort: High demand first, then by dynamicPrice desc
    const demandOrder: Record<DemandLevel, number> = {
      High: 0,
      Medium: 1,
      Low: 2,
    };
    (rows as Array<{ demand: DemandLevel; dynamicPrice: number }>).sort(
      (a, b) => {
        const dOrder = demandOrder[a.demand] - demandOrder[b.demand];
        if (dOrder !== 0) return dOrder;
        return b.dynamicPrice - a.dynamicPrice;
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: `Refreshed prices for ${rows.length} product(s)`,
        data: rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/pricing/refresh error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to refresh pricing data" },
      { status: 500 }
    );
  }
}
