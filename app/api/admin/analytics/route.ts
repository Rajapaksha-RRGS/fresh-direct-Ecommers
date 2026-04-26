/**
 * app/api/admin/analytics/route.ts — Dashboard Analytics Summary
 *
 * GET /api/admin/analytics
 *   High-level summary for dashboard cards using Mongoose aggregation.
 *   Returns:
 *     - Total Active Farmers (status: APPROVED)
 *     - Pending Approvals (status: PENDING)
 *     - Market Liquidity (total stockQty of approved products)
 *     - Revenue Estimates (sum of basePrice * totalSold)
 */

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";
import Product from "@/models/Product";

interface AnalyticsData {
  totalActiveFarmers: number;
  pendingApprovals: number;
  marketLiquidity: number; // Total stockQty
  revenueEstimates: number; // LKR
  topDemandProducts: Array<{
    _id: string;
    name: string;
    demandScore: number;
    stockQty: number;
    currentPrice: number;
  }>;
}

/**
 * GET /api/admin/analytics — Fetch dashboard analytics summary
 */
export async function GET(req: NextRequest) {
  try {
    // Establish (or reuse) the MongoDB connection before any DB operations.
    await connectDB();

    // ─── Query 1: Total Active Farmers (APPROVED status) ─────────────────
    const activeFarmersCount = await FarmerProfile.countDocuments({
      status: "APPROVED",
    });

    // ─── Query 2: Pending Approvals (PENDING status) ────────────────────
    const pendingApprovalsCount = await FarmerProfile.countDocuments({
      status: "PENDING",
    });

    // ─── Query 3: Market Liquidity + Revenue (Aggregation on Products) ───
    const marketMetrics = await Product.aggregate([
      // Only approved products count towards market metrics
      { $match: { status: "APPROVED" } },

      // Group to calculate totals
      {
        $group: {
          _id: null,
          totalStockQty: { $sum: "$stockQty" },
          totalRevenue: {
            $sum: {
              $multiply: ["$basePrice", "$totalSold"],
            },
          },
          productCount: { $sum: 1 },
        },
      },

      // Project clean output
      {
        $project: {
          _id: 0,
          marketLiquidity: "$totalStockQty",
          revenueEstimates: { $round: ["$totalRevenue", 2] },
          productCount: 1,
        },
      },
    ]);

    // Default values if no products exist
    const metrics = marketMetrics[0] || {
      marketLiquidity: 0,
      revenueEstimates: 0,
      productCount: 0,
    };

    // ─── Query 4: Top Demand Products ────────────────────────────────────
    const topDemandProducts = await Product.find(
      { status: "APPROVED" },
      { name: 1, demandScore: 1, stockQty: 1, currentPrice: 1 }
    )
      .sort({ demandScore: -1 })
      .limit(5);

    // Build response
    const analytics: AnalyticsData = {
      totalActiveFarmers: activeFarmersCount,
      pendingApprovals: pendingApprovalsCount,
      marketLiquidity: metrics.marketLiquidity,
      revenueEstimates: metrics.revenueEstimates,
      topDemandProducts: topDemandProducts.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        demandScore: p.demandScore,
        stockQty: p.stockQty,
        currentPrice: p.currentPrice,
      })),
    };

    return NextResponse.json(
      {
        success: true,
        data: analytics,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch analytics",
        messageNL: "විශ්ලේෂණ ලබා ගැනීම අසफල විය",
      },
      { status: 500 }
    );
  }
}
