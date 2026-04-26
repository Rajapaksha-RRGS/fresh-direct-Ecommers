/**
 * lib/pricing.ts — Dynamic Pricing Engine (Server-side Only)
 *
 * Formula:
 *   P_final = P_base × (1 + (0.01 × demandScore) − (0.005 × stockQty))
 *
 * Safety constraints:
 *   • finalPrice is NEVER lower than basePrice  (price floor = farmer's ask)
 *   • Result is always rounded to 2 decimal places
 */

/**
 * Calculate the live market price for a product.
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
  // Core formula
  const raw = basePrice * (1 + 0.01 * demandScore - 0.005 * stockQty);

  // Safety: price must never dip below the farmer's base price
  const safe = Math.max(raw, basePrice);

  // Round to 2 decimal places (LKR cents)
  return Math.round(safe * 100) / 100;
}
