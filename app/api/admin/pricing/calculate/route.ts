/**
 * app/api/admin/pricing/calculate/route.ts — Live Dynamic Pricing Engine
 *
 * GET /api/admin/pricing/calculate
 *   Fetch PricingConfig sensitivity factors, then for every APPROVED product
 *   compute a real-time dynamic price using:
 *
 *     dynamicPrice = basePrice + (basePrice × ((totalSold × α) − (stockQty × β)))
 *
 *   Clamped between:  floor = basePrice × 0.5   ceiling = basePrice × 3
 *
 *   Also returns:
 *     demandLevel  — "High" (totalSold > 50) | "Medium" (> 20) | "Low"
 *     supplyPct    — stock as % of the highest-stocked product (0–100)
 *     supplyMax    — the denominator used for supplyPct
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import PricingConfig from "@/models/PricingConfig";
import Product from "@/models/Product";
import type { DemandLevel } from "@/types/admin";

export interface PricingCalculateRow {
  id: string;
  name: string;
  category: string;
  unit: string;
  basePrice: number;
  dynamicPrice: number;
  supply: number;        // raw stockQty
  supplyMax: number;     // denominator for the progress bar
  supplyPct: number;     // 0–100
  demand: DemandLevel;
  totalSold: number;
}

export interface GetPricingCalculateResponse {
  success: true;
  data: PricingCalculateRow[];
  meta: {
    demandSensitivity: number;
    supplySensitivity: number;
    calculatedAt: string;
  };
}

// ─── Helper: derive demand level from totalSold ────────────────────────────
function getDemandLevel(totalSold: number): DemandLevel {
  if (totalSold > 50) return "High";
  if (totalSold > 20) return "Medium";
  return "Low";
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    // ── 1. Fetch pricing config (create defaults if missing) ─────────────────
    let config = await PricingConfig.findOne();

    if (!config) {
      const adminUser = await (await import("@/models/User")).default.findOne({
        role: "ADMIN",
      });

      const configData: any = {
        demandSensitivity: 0.01,
        supplySensitivity: 0.005,
      };
      if (adminUser) configData.lastModifiedBy = adminUser._id;

      config = await PricingConfig.create(configData);
    }

    const α = config.demandSensitivity;   // demand sensitivity
    const β = config.supplySensitivity;   // supply sensitivity

    // ── 2. Fetch all approved products ───────────────────────────────────────
    const products = await Product.find({}).lean();

    if (!products.length) {
      return NextResponse.json<GetPricingCalculateResponse>(
        {
          success: true,
          data: [],
          meta: {
            demandSensitivity: α,
            supplySensitivity: β,
            calculatedAt: new Date().toISOString(),
          },
        },
        { status: 200 }
      );
    }

    // ── 3. Determine supplyMax for the progress bars ─────────────────────────
    //      Use the highest stockQty across all products (min floor: 500)
    const maxStock = Math.max(...products.map((p) => p.stockQty), 500);

    // ── 4. Compute dynamic price for every product ───────────────────────────
    const rows: PricingCalculateRow[] = products.map((p) => {
      const raw =
        p.basePrice +
        p.basePrice * (p.totalSold * α - p.stockQty * β);

      // Safety clamps
      const floor = p.basePrice * 0.5;
      const ceiling = p.basePrice * 3;
      const dynamicPrice = Math.max(floor, Math.min(ceiling, raw));

      return {
        id: String(p._id),
        name: p.name,
        category: p.category,
        unit: p.unit ?? "kg",
        basePrice: p.basePrice,
        dynamicPrice: Math.round(dynamicPrice * 100) / 100,  // 2 d.p.
        supply: p.stockQty,
        supplyMax: maxStock,
        supplyPct: Math.min(100, Math.round((p.stockQty / maxStock) * 100)),
        demand: getDemandLevel(p.totalSold),
        totalSold: p.totalSold,
      };
    });

    // Sort by demand: High → Medium → Low, then by dynamicPrice desc
    const demandOrder: Record<DemandLevel, number> = { High: 0, Medium: 1, Low: 2 };
    rows.sort((a, b) => {
      const dOrder = demandOrder[a.demand] - demandOrder[b.demand];
      if (dOrder !== 0) return dOrder;
      return b.dynamicPrice - a.dynamicPrice;
    });

    return NextResponse.json<GetPricingCalculateResponse>(
      {
        success: true,
        data: rows,
        meta: {
          demandSensitivity: α,
          supplySensitivity: β,
          calculatedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/pricing/calculate error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate dynamic pricing",
        messageNL: "ගතික මිල ගණනය කිරීම අසफल විය",
      },
      { status: 500 }
    );
  }
}
