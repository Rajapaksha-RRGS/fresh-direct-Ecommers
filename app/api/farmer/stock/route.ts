/**
 * PATCH /api/farmer/stock
 *
 * Farmer Stock Update — allows an authenticated farmer to update the
 * stockQty of one of their own products.
 *
 * Business logic:
 *   • Validates that productId and stockQty are present and valid
 *   • Ensures the requesting farmer owns the product (farmerId guard)
 *   • Updates stockQty, then immediately recalculates and persists
 *     currentPrice — higher supply lowers the live price per the formula
 *
 * Body (JSON):
 *   { productId: string, stockQty: number, farmerId: string }
 *
 * HTTP status codes:
 *   200 OK              — stock + price updated successfully
 *   400 Bad Request     — missing / invalid body fields
 *   403 Forbidden       — farmer does not own this product
 *   404 Not Found       — product does not exist
 *   500 Internal Error  — DB / unexpected error
 */

import { NextRequest, NextResponse } from "next/server";
import { checkFarmerAuth } from "@/lib/utils/farmerAuth";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { calculateLivePrice } from "@/lib/pricing";
import {
  successResponseEnglish,
  errorResponseEnglish,
} from "@/lib/utils/farmerResponse";
import { handleEndpointErrorEnglish } from "@/lib/utils/errorHandler";

export async function PATCH(req: NextRequest) {
  try {
    // ── 1. Verify farmer role & get authenticated farmerId ──────────────────
    const authResult = await checkFarmerAuth();
    if (!authResult.authenticated) {
      return authResult.error;
    }

    const farmerId = authResult.farmerId!;

    // ── 2. Parse & validate request body ─────────────────────────────────────
    let body: { productId?: string; stockQty?: unknown };
    try {
      body = await req.json();
    } catch {
      return errorResponseEnglish(400, "Invalid JSON body");
    }

    const { productId, stockQty } = body;

    if (!productId || typeof productId !== "string") {
      return errorResponseEnglish(400, "productId is required");
    }

    const newStock = Number(stockQty);
    if (!Number.isFinite(newStock) || newStock < 0) {
      return errorResponseEnglish(
        400,
        "stockQty must be a non-negative number"
      );
    }

    await connectDB();

    // ── 3. Fetch product & verify ownership ──────────────────────────────────
    const product = await Product.findById(productId);

    if (!product) {
      return errorResponseEnglish(404, "Product not found");
    }

    // Guard: the farmerId recorded on the product must match the authenticated user
    if (product.farmerId.toString() !== farmerId) {
      return errorResponseEnglish(
        403,
        "Forbidden — you do not own this product"
      );
    }

    // ── 3. Update stock ───────────────────────────────────────────────────────
    product.stockQty = newStock;

    // ── 4. Recalculate live price with new supply level ───────────────────────
    const livePrice = calculateLivePrice(
      product.basePrice,
      product.demandScore,
      newStock // use the incoming value directly
    );
    product.currentPrice = livePrice;

    // ── 5. Persist both changes in a single save ──────────────────────────────
    await product.save();

    return successResponseEnglish(
      {
        success: true,
        message: "Stock updated successfully",
        data: {
          productId,
          stockQty: product.stockQty,
          currentPrice: livePrice,
          demandScore: product.demandScore,
        },
      },
      200
    );
  } catch (err) {
    return handleEndpointErrorEnglish(err, "Failed to update stock");
  }
}
