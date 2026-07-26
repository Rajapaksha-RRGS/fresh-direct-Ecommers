/**
 * app/api/pricing/config/route.ts
 *
 * GET  /api/pricing/config   — Return the singleton PricingConfig (create with
 *                              v2 defaults if none exists yet).
 *
 * PATCH /api/pricing/config  — Admin: update any numeric config field.
 *                              Validates that all supplied values are numbers
 *                              within reasonable bounds, then upserts the doc.
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import PricingConfig from "@/models/PricingConfig";

// ─── Fields that callers are allowed to update via PATCH ─────────────────────
const NUMERIC_FIELDS = [
  "demandSensitivity",
  "supplySensitivity",
  "demandHighFactor",
  "demandMediumFactor",
  "demandLowFactor",
  "supplyLowThreshold",
  "supplyHighThreshold",
  "supplyLowFactor",
  "supplyHighFactor",
  "minMultiplier",
  "maxMultiplier",
] as const;

type PatchableField = (typeof NUMERIC_FIELDS)[number];

// Per-field min/max validation bounds
const FIELD_BOUNDS: Record<PatchableField, [number, number]> = {
  demandSensitivity:  [0, 1],
  supplySensitivity:  [0, 1],
  demandHighFactor:   [0.1, 5],
  demandMediumFactor: [0.1, 5],
  demandLowFactor:    [0.1, 5],
  supplyLowThreshold: [0, 100],
  supplyHighThreshold:[0, 100],
  supplyLowFactor:    [0.1, 5],
  supplyHighFactor:   [0.1, 5],
  minMultiplier:      [0.1, 1],
  maxMultiplier:      [1, 5],
};

// ─── Helper ───────────────────────────────────────────────────────────────────
async function getOrCreateConfig() {
  let config = await PricingConfig.findOne();
  if (!config) {
    // Bootstrap with all schema defaults
    config = await PricingConfig.create({});
  }
  return config;
}

// ─── GET /api/pricing/config ──────────────────────────────────────────────────
export async function GET() {
  try {
    await connectDB();
    const config = await getOrCreateConfig();

    return NextResponse.json(
      {
        success: true,
        data: {
          // v1 legacy
          demandSensitivity: config.demandSensitivity,
          supplySensitivity: config.supplySensitivity,
          // v2 demand factors
          demandHighFactor: config.demandHighFactor,
          demandMediumFactor: config.demandMediumFactor,
          demandLowFactor: config.demandLowFactor,
          // v2 supply config
          supplyLowThreshold: config.supplyLowThreshold,
          supplyHighThreshold: config.supplyHighThreshold,
          supplyLowFactor: config.supplyLowFactor,
          supplyHighFactor: config.supplyHighFactor,
          // v2 clamps
          minMultiplier: config.minMultiplier,
          maxMultiplier: config.maxMultiplier,
          // metadata
          updatedAt: config.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/pricing/config error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pricing configuration" },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/pricing/config ────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const body: Partial<Record<PatchableField, unknown>> = await req.json();

    // Validate: only known numeric fields, within bounds
    const updates: Partial<Record<PatchableField, number>> = {};
    const validationErrors: string[] = [];

    for (const field of NUMERIC_FIELDS) {
      if (!(field in body)) continue;

      const value = body[field];

      if (typeof value !== "number" || !isFinite(value)) {
        validationErrors.push(`"${field}" must be a finite number`);
        continue;
      }

      const [min, max] = FIELD_BOUNDS[field];
      if (value < min || value > max) {
        validationErrors.push(`"${field}" must be between ${min} and ${max}`);
        continue;
      }

      updates[field] = value;
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: validationErrors },
        { status: 400 }
      );
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields provided to update" },
        { status: 400 }
      );
    }

    // Upsert (handles the case where no config doc exists yet)
    const config = await PricingConfig.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true }
    );

    console.log("[ADMIN AUDIT] Updated pricing config:", updates);

    return NextResponse.json(
      {
        success: true,
        message: "Pricing configuration updated successfully",
        data: {
          demandSensitivity: config.demandSensitivity,
          supplySensitivity: config.supplySensitivity,
          demandHighFactor: config.demandHighFactor,
          demandMediumFactor: config.demandMediumFactor,
          demandLowFactor: config.demandLowFactor,
          supplyLowThreshold: config.supplyLowThreshold,
          supplyHighThreshold: config.supplyHighThreshold,
          supplyLowFactor: config.supplyLowFactor,
          supplyHighFactor: config.supplyHighFactor,
          minMultiplier: config.minMultiplier,
          maxMultiplier: config.maxMultiplier,
          updatedAt: config.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/pricing/config error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update pricing configuration" },
      { status: 500 }
    );
  }
}
