/**
 * app/api/pricing/route.ts
 *
 * GET /api/pricing
 *   Fetch ALL products (no status filter), compute dynamic price live
 *   (always fresh — never returns stored currentPrice), and return an array
 *   of PricingRow objects matching the shape expected by PricingConsole.tsx.
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
    // Create with all v2 defaults; lastModifiedBy is optional so we skip it
    config = await PricingConfig.create({});
    config = await PricingConfig.findOne().lean();
  }
  return config!;
}

// ─── GET /api/pricing ─────────────────────────────────────────────────────────
export async function GET() {
  try {
    await connectDB();

    const [products, config] = await Promise.all([
      Product.find({}).lean(),   // no status filter — show all products
      getOrCreateConfig(),
    ]);

    // Debug log: visible in the Next.js server terminal
    console.log(
      `[GET /api/pricing] found ${products.length} product(s):`,
      products.map((p) => ({ name: p.name, status: p.status }))
    );

    if (!products.length) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    const rows = products.map((p) => {
      const demandLevel: DemandLevel = getDemandLevel(
        p.demandScore,
        p.totalViews,
        p.totalSold
      );

      const maxStockQty = p.maxStockQty ?? 1000;
      const supplyPct = Math.min(
        100,
        Math.round((p.stockQty / maxStockQty) * 100)
      );

      const dynamicPrice = calculateDynamicPrice(
        p.basePrice,
        demandLevel,
        p.stockQty,
        maxStockQty,
        config
      );

      return {
        id: String(p._id),
        name: p.name,
        category: p.category,
        unit: p.unit ?? "kg",
        basePrice: p.basePrice,
        supply: p.stockQty,       // raw stockQty — matches PricingRow.supply
        supplyMax: maxStockQty,   // denominator — matches PricingRow.supplyMax
        supplyPct,                // 0-100 — matches PricingRow.supplyPct
        demand: demandLevel,      // "High"|"Medium"|"Low" — matches PricingRow.demand
        dynamicPrice,
      };
    });

    // Sort: High demand first, then by dynamicPrice desc
    const demandOrder: Record<DemandLevel, number> = {
      High: 0,
      Medium: 1,
      Low: 2,
    };
    rows.sort((a, b) => {
      const dOrder =
        demandOrder[a.demand as DemandLevel] -
        demandOrder[b.demand as DemandLevel];
      if (dOrder !== 0) return dOrder;
      return b.dynamicPrice - a.dynamicPrice;
    });

    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (error) {
    console.error("GET /api/pricing error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pricing data" },
      { status: 500 }
    );
  }
}
