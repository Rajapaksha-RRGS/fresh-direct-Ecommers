/**
 * app/api/admin/products/route.ts — Product Oversight
 *
 * GET /api/admin/products?sortBy=demandScore&order=desc
 *   Fetch all products across all farmers to monitor the marketplace.
 *   Supports sorting by demandScore or stockQty.
 *   Includes farmer names using efficient populate.
 */

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";

type SortField = "demandScore" | "stockQty" | "currentPrice" | "totalSold";
type SortOrder = "asc" | "desc";

interface ProductOverviewItem {
  _id: string;
  name: string;
  category: string;
  status: string;
  basePrice: number;
  currentPrice: number;
  stockQty: number;
  demandScore: number;
  totalSold: number;
  farmerName: string;
  farmerId: string;
  createdAt: Date;
}

/**
 * GET /api/admin/products — Fetch all products with farmer info
 *
 * Query parameters:
 *   - sortBy: 'demandScore' | 'stockQty' | 'currentPrice' | 'totalSold' (default: demandScore)
 *   - order: 'asc' | 'desc' (default: desc)
 *   - status: filter by product status (PENDING, APPROVED, etc.)
 *   - limit: max results (default: 100)
 */
export async function GET(req: NextRequest) {
  try {
    // Establish (or reuse) the MongoDB connection before any DB operations.
    await connectDB();

    // Extract query parameters
    const sortByParam = (req.nextUrl.searchParams.get("sortBy") ||
      "demandScore") as SortField;
    const orderParam = (req.nextUrl.searchParams.get("order") ||
      "desc") as SortOrder;
    const statusParam = req.nextUrl.searchParams.get("status");
    const limitParam = parseInt(req.nextUrl.searchParams.get("limit") || "100");

    // Validate sort field
    const validSortFields: SortField[] = [
      "demandScore",
      "stockQty",
      "currentPrice",
      "totalSold",
    ];
    const sortBy: SortField = validSortFields.includes(sortByParam)
      ? sortByParam
      : "demandScore";

    // Validate sort order
    const order: SortOrder = orderParam === "asc" ? "asc" : "desc";

    // Validate limit
    const limit = Math.min(Math.max(limitParam, 1), 500); // Between 1-500

    // Build filter
    const filter: Record<string, any> = {};
    if (statusParam) {
      const validStatuses = ["PENDING", "APPROVED", "REJECTED", "OUT_OF_STOCK"];
      if (validStatuses.includes(statusParam)) {
        filter.status = statusParam;
      }
    }

    // Aggregate query: Product + Farmer name (efficient populate)
    const products = await Product.aggregate([
      // Match filter
      { $match: filter },

      // Lookup to get farmer names
      {
        $lookup: {
          from: "users",
          localField: "farmerId",
          foreignField: "_id",
          as: "farmerInfo",
        },
      },

      // Unwind farmer info
      { $unwind: "$farmerInfo" },

      // Project required fields
      {
        $project: {
          _id: 1,
          name: 1,
          category: 1,
          status: 1,
          basePrice: 1,
          currentPrice: 1,
          stockQty: 1,
          demandScore: 1,
          totalSold: 1,
          farmerId: 1,
          farmerName: "$farmerInfo.name",
          createdAt: 1,
        },
      },

      // Sort by specified field
      { $sort: { [sortBy]: order === "asc" ? 1 : -1 } },

      // Limit results
      { $limit: limit },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: products,
        count: products.length,
        pagination: {
          limit,
          sortBy,
          order,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        messageNL: "භාණ්ඩ ලබා ගැනීම අසფල විය",
      },
      { status: 500 }
    );
  }
}
