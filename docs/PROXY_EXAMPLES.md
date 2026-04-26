/**
 * EXAMPLE API ROUTES — Using the New Proxy System
 *
 * These examples show how to update your API routes to use
 * the header injection from proxy.ts instead of doing auth checks.
 */

// ============================================================================
// EXAMPLE 1: Admin Farmers Endpoint (Already Protected by Proxy)
// ============================================================================

// File: app/api/admin/farmers/route.ts
/*
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";

export async function GET(request: NextRequest) {
  try {
    // ✅ Headers already injected by proxy.ts
    const userRole = request.headers.get("x-user-role");
    const userId = request.headers.get("x-user-id");

    // Proxy already verified role === ADMIN, but double-check if needed
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get query parameters
    const status = new URL(request.url).searchParams.get("status");
    const filter = status ? { status } : {};

    // Fetch farmers
    const farmers = await FarmerProfile.aggregate([
      { $match: filter },
      { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userDetails" } },
      { $unwind: "$userDetails" },
      { $project: { farmName: 1, location: 1, status: 1, userName: "$userDetails.name" } },
      { $sort: { createdAt: -1 } },
    ]);

    console.log(`[AUDIT] Admin ${userId} accessed farmers list`);

    return NextResponse.json({
      success: true,
      data: farmers,
      count: farmers.length,
    });
  } catch (error) {
    console.error("Error fetching farmers:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch farmers" },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// EXAMPLE 2: Verify Farmer Endpoint (Admin Only)
// ============================================================================

// File: app/api/admin/farmers/[id]/verify/route.ts
/*
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";
import mongoose from "mongoose";

interface VerifyRequest {
  action: "APPROVE" | "REJECT";
  reason?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ Use injected headers
    const adminId = request.headers.get("x-user-id");
    const adminRole = request.headers.get("x-user-role");

    // Proxy already verified, but let's be extra safe
    if (adminRole !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const farmerId = params.id;
    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid farmer ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const body: VerifyRequest = await request.json();

    if (!["APPROVE", "REJECT"].includes(body.action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }

    const newStatus = body.action === "APPROVE" ? "APPROVED" : "REJECTED";

    const updatedFarmer = await FarmerProfile.findByIdAndUpdate(
      farmerId,
      {
        status: newStatus,
        approvedBy: adminId,
        ...(body.action === "APPROVE" && { approvedAt: new Date() }),
      },
      { new: true }
    );

    if (!updatedFarmer) {
      return NextResponse.json(
        { success: false, message: "Farmer not found" },
        { status: 404 }
      );
    }

    // 📝 Audit log
    console.log(
      `[AUDIT] Admin ${adminId} ${body.action}ED farmer ${farmerId}`
    );

    return NextResponse.json({
      success: true,
      message: `Farmer ${newStatus.toLowerCase()} successfully`,
      data: updatedFarmer,
    });
  } catch (error) {
    console.error("Error verifying farmer:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify farmer" },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// EXAMPLE 3: Analytics Endpoint (Admin Only)
// ============================================================================

// File: app/api/admin/analytics/route.ts
/*
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    // ✅ Headers injected by proxy
    const userRole = request.headers.get("x-user-role");

    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admin only" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get analytics data
    const [activeFarmers, pendingApprovals, marketMetrics] = await Promise.all([
      FarmerProfile.countDocuments({ status: "APPROVED" }),
      FarmerProfile.countDocuments({ status: "PENDING" }),
      Product.aggregate([
        { $match: { status: "APPROVED" } },
        { $group: { _id: null, totalStock: { $sum: "$stockQty" }, totalRevenue: { $sum: { $multiply: ["$basePrice", "$totalSold"] } } } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalActiveFarmers: activeFarmers,
        pendingApprovals,
        marketLiquidity: marketMetrics[0]?.totalStock || 0,
        revenueEstimates: marketMetrics[0]?.totalRevenue || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// EXAMPLE 4: Farmer Profile Endpoint (Farmer Only)
// ============================================================================

// File: app/api/farmer/profile/route.ts
/*
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";

export async function GET(request: NextRequest) {
  try {
    // ✅ Get farmer's own ID from headers
    const farmerId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (userRole !== "FARMER") {
      return NextResponse.json(
        { success: false, message: "Farmer access only" },
        { status: 403 }
      );
    }

    await connectDB();

    const profile = await FarmerProfile.findOne({ userId: farmerId });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error fetching farmer profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const farmerId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (userRole !== "FARMER") {
      return NextResponse.json(
        { success: false, message: "Farmer access only" },
        { status: 403 }
      );
    }

    await connectDB();

    const updates = await request.json();

    const updatedProfile = await FarmerProfile.findOneAndUpdate(
      { userId: farmerId },
      updates,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating farmer profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// EXAMPLE 5: Public Products Endpoint (No Auth Required)
// ============================================================================

// File: app/api/products/route.ts
/*
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    // ✅ No auth needed - proxy bypasses this endpoint
    // But we could still check headers if we wanted user-specific filtering

    await connectDB();

    const products = await Product.find({ status: "APPROVED" })
      .sort({ demandScore: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// EXAMPLE 6: Multi-Role Endpoint (Any Authenticated User)
// ============================================================================

// File: app/api/orders/route.ts
/*
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET(request: NextRequest) {
  try {
    // ✅ Any authenticated user can access (via proxy ROUTE_RULES)
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    await connectDB();

    let query: Record<string, any> = {};

    // Filter based on role
    if (userRole === "CUSTOMER") {
      query.buyerId = userId;
    } else if (userRole === "FARMER") {
      query.farmerId = userId;
    }
    // ADMIN sees all

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    // Only customers can create orders
    if (userRole !== "CUSTOMER") {
      return NextResponse.json(
        { success: false, message: "Customers only" },
        { status: 403 }
      );
    }

    await connectDB();

    const orderData = await request.json();
    orderData.buyerId = userId;
    orderData.createdAt = new Date();

    const order = await Order.create(orderData);

    return NextResponse.json({
      success: true,
      message: "Order created",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// KEY PATTERNS TO REMEMBER
// ============================================================================

/*
✅ DO:
  const userRole = request.headers.get("x-user-role");
  const userId = request.headers.get("x-user-id");
  
  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

❌ DON'T:
  import { verifyAdminRole } from "@/middleware/adminAuth";
  const { authorized, error } = await verifyAdminRole(request);
  
  (This is old - proxy.ts handles it now)

✅ ALWAYS:
  - Read x-user-* headers
  - Trust the proxy (it already verified JWT & role)
  - Log audit trails with userId
  - Handle edge cases (missing headers, invalid IDs)

✅ FOR PUBLIC ROUTES:
  - No need to check headers
  - Proxy bypasses them automatically
  - Handle unauthenticated requests normally
*/
