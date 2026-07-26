/**
 * lib/pricing.ts — Dynamic Pricing Engine Utilities (Pure Functions)
 *
 * All functions here are pure (no DB calls, no side-effects) so they can be
 * unit-tested in isolation without a running database.
 *
 * ── v1 Legacy export (kept for backward-compat) ────────────────────────────
 *   calculateLivePrice()  — original linear formula (still used by old routes)
 *
 * ── v2 Exports (new factor-based engine) ────────────────────────────────────
 *   getDemandLevel()       — classify a product's demand tier
 *   calculateDynamicPrice()— compute the live price using config factors
 */

import type { IPricingConfig } from "@/models/PricingConfig";

// ─── v1 Legacy (preserved for backward-compat) ────────────────────────────────

/**
 * Calculate the live market price for a product (original v1 formula).
 *
 * @param basePrice   - The farmer's minimum acceptable price (price floor)
 * @param demandScore - Cumulative demand/popularity score (view-driven)
 * @param stockQty    - Current units available (higher supply → lower price)
 * @returns           - Live price, always ≥ basePrice, rounded to 2 d.p.
 */
export function calculateLivePrice(
  basePrice: number,
  demandScore: number,
  stockQty: number
): number {
  const raw = basePrice * (1 + 0.01 * demandScore - 0.005 * stockQty);
  const safe = Math.max(raw, basePrice);
  return Math.round(safe * 100) / 100;
}

// ─── v2 Demand classification ─────────────────────────────────────────────────

/**
 * Classify a product's demand tier from its analytics metrics.
 *
 * Heuristic (thresholds can be tuned later):
 *   High   — demandScore ≥ 50  OR  totalSold > 50
 *   Medium — demandScore ≥ 20  OR  totalSold > 20  (and not High)
 *   Low    — everything else
 *
 * @param demandScore  Cumulative popularity score stored on the product
 * @param totalViews   Lifetime view count
 * @param totalSold    Lifetime units sold
 */
export function getDemandLevel(
  demandScore: number,
  totalViews: number,
  totalSold: number
): "High" | "Medium" | "Low" {
  // Composite signal: weight demandScore heavily, use totalSold as tie-breaker
  const compositeScore = demandScore + totalSold * 0.5 + totalViews * 0.01;

  if (compositeScore >= 50 || totalSold > 50) return "High";
  if (compositeScore >= 20 || totalSold > 20) return "Medium";
  return "Low";
}

// ─── v2 Dynamic price calculation ────────────────────────────────────────────

/**
 * Calculate the dynamic market price using the factor-based v2 engine.
 *
 * Algorithm:
 *   1. Resolve demandFactor from config based on demandLevel
 *   2. Compute supplyPct = (stockQty / maxStockQty) * 100
 *   3. Resolve supplyFactor:
 *        supplyPct < supplyLowThreshold  → supplyLowFactor  (low stock premium)
 *        supplyPct > supplyHighThreshold → supplyHighFactor (high stock discount)
 *        otherwise                       → 1.0 (neutral)
 *   4. multiplier = demandFactor × supplyFactor, clamped to [minMultiplier, maxMultiplier]
 *   5. return Math.round(basePrice × multiplier)
 *
 * @param basePrice   Farmer's minimum acceptable price
 * @param demandLevel Tier computed by getDemandLevel()
 * @param stockQty    Current stock quantity
 * @param maxStockQty Reference ceiling for supply % calculation
 * @param config      PricingConfig document (only the v2 numeric fields are used)
 * @returns           Rounded integer price in the same currency as basePrice
 */
export function calculateDynamicPrice(
  basePrice: number,
  demandLevel: "High" | "Medium" | "Low",
  stockQty: number,
  maxStockQty: number,
  config: Partial<
    Pick<
      IPricingConfig,
      | "demandHighFactor"
      | "demandMediumFactor"
      | "demandLowFactor"
      | "supplyLowThreshold"
      | "supplyHighThreshold"
      | "supplyLowFactor"
      | "supplyHighFactor"
      | "minMultiplier"
      | "maxMultiplier"
    >
  >
): number {
  // Use schema defaults as fallback if config values are undefined/null/NaN in DB (e.g. existing records)
  const demandHighFactor = config?.demandHighFactor ?? 1.18;
  const demandMediumFactor = config?.demandMediumFactor ?? 1.0;
  const demandLowFactor = config?.demandLowFactor ?? 0.88;
  const supplyLowThreshold = config?.supplyLowThreshold ?? 30;
  const supplyHighThreshold = config?.supplyHighThreshold ?? 60;
  const supplyLowFactor = config?.supplyLowFactor ?? 1.10;
  const supplyHighFactor = config?.supplyHighFactor ?? 0.92;
  const minMultiplier = config?.minMultiplier ?? 0.7;
  const maxMultiplier = config?.maxMultiplier ?? 1.3;

  // 1. Demand factor
  const demandFactor =
    demandLevel === "High"
      ? demandHighFactor
      : demandLevel === "Low"
      ? demandLowFactor
      : demandMediumFactor;

  // 2. Supply percentage (0–100)
  const supplyPct =
    maxStockQty > 0 ? (stockQty / maxStockQty) * 100 : 0;

  // 3. Supply factor
  const supplyFactor =
    supplyPct < supplyLowThreshold
      ? supplyLowFactor
      : supplyPct > supplyHighThreshold
      ? supplyHighFactor
      : 1.0;

  // 4. Combined multiplier, clamped
  const rawMultiplier = demandFactor * supplyFactor;
  const multiplier = Math.min(
    maxMultiplier,
    Math.max(minMultiplier, rawMultiplier)
  );

  // 5. Final rounded price
  return Math.round(basePrice * multiplier);
}
