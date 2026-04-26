/**
 * app/api/admin/farmers/route.ts — Farmer Management
 *
 * GET /api/admin/farmers?status=PENDING
 *   Fetch all farmers with optional status filtering.
 *   Returns: Name, NIC, Mobile, Registration Date, Status
 */

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";
import User from "@/models/User";

/**
 * GET /api/admin/farmers — Retrieve all farmers (optionally filtered by status)
 */
export async function GET(req: NextRequest) {
  try {
    // Establish (or reuse) the MongoDB connection before any DB operations.
    await connectDB();

    // Extract query parameters
    const status = req.nextUrl.searchParams.get("status");

    
    const filter: Record<string, any> = {};
    if (status && ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"].includes(status)) {
      filter.status = status;
    }

    // Aggregate query: FarmerProfile + User details
    const farmers = await FarmerProfile.aggregate([
      // Match by status filter
      { $match: filter },

      // Lookup to join User data (name, nic, mobile)
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      // Unwind user details
      { $unwind: "$userDetails" },

      // Project only necessary fields
      {
        $project: {
          _id: 1,
          farmName: 1,
          location: 1,
          status: 1,
          approvedAt: 1,
          createdAt: 1,
          userId: 1,
          userName: "$userDetails.name",
          userNIC: "$userDetails.nic",
          userMobile: "$userDetails.mobile",
          isVerified: 1,
          cropTypes: 1,
        },
      },

      // Sort by creation date (newest first)
      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: farmers,
        count: farmers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/farmers error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch farmers",
        messageNL: "ගොවීන් ලබා ගැනීම අසफල විය",
      },
      { status: 500 }
    );
  }
}
