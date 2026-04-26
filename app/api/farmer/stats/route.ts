/**
 * GET /api/farmer/stats
 *
 * Aggregates dashboard statistics for the farmer.
 * Calculates:
 *  - Total products owned
 *  - Active (non-rejected) products
 *  - Total stock quantity
 *  - Total views and sales across all products
 *  - Estimated revenue
 *  - Pending product approvals
 *
 * Returns: IStatsResponse
 * Errors: 401 Unauthorized, 500 Internal Server Error
 */

import { NextResponse } from "next/server";
import { checkFarmerAuth } from "@/lib/utils/farmerAuth";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { IDashboardStats, IStatsResponse } from "@/types/farmerApi";

export async function GET() {
  try {
    // Step 1: Verify farmer role
    const authResult = await checkFarmerAuth();
    if (!authResult.authenticated) {
      return authResult.error;
    }

    const farmerId = authResult.farmerId!;

    // Step 2: Connect to database
    await connectDB();

    // Step 3: Fetch all products for this farmer
    const products = await Product.find({ farmerId });

    // Step 4: Calculate statistics
    const stats: IDashboardStats = {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.status !== "REJECTED").length,
      totalStockQty: products.reduce((sum, p) => sum + p.stockQty, 0),
      totalViews: products.reduce((sum, p) => sum + p.totalViews, 0),
      totalSold: products.reduce((sum, p) => sum + p.totalSold, 0),
      estimatedRevenue: products.reduce(
        (sum, p) => sum + p.currentPrice * p.totalSold,
        0
      ),
      pendingApprovals: products.filter((p) => p.status === "PENDING").length,
    };

    const response: IStatsResponse = {
      stats,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching farmer stats:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
