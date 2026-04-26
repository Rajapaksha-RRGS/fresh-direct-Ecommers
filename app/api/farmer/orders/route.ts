/**
 * GET /api/farmer/orders?page=1&perPage=10
 *
 * Lists paginated orders that contain items from this farmer's products.
 * Filters orders where at least one item.farmerId matches the current farmer.
 *
 * Returns: IOrdersListResponse
 * Errors: 401 Unauthorized, 500 Internal Server Error
 */

import { NextRequest, NextResponse } from "next/server";
import { checkFarmerAuth } from "@/lib/utils/farmerAuth";
import { connectDB } from "@/lib/mongoose";
import Order from "@/models/Order";
import { IOrderResponse, IOrdersListResponse } from "@/types/farmerApi";

export async function GET(request: NextRequest) {
  try {
    // Step 1: Verify farmer role
    const authResult = await checkFarmerAuth();
    if (!authResult.authenticated) {
      return authResult.error;
    }

    const farmerId = authResult.farmerId!;

    // Step 2: Parse pagination params
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("perPage") || "10")));
    const skip = (page - 1) * perPage;

    // Step 3: Connect to database
    await connectDB();

    // Step 4: Find orders containing items from this farmer
    // MongoDB query: find orders where any item's farmerId matches the current farmer
    const orders = await Order.find({
      "items.farmerId": farmerId,
    })
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments({
      "items.farmerId": farmerId,
    });

    // Step 5: Format response - filter items to only show this farmer's items
    const formattedOrders: IOrderResponse[] = orders.map((order) => {
      const farmerItems = order.items.filter((item: any) => item.farmerId?.toString() === farmerId);
      return {
        id: order._id.toString(),
        orderId: order._id.toString().slice(-8),
        customerId: order.customerId?.toString() || "",
        customerName: "Customer",
        items: farmerItems.map((item: any) => ({
          productId: item.productId?.toString() || "",
          farmerId: item.farmerId?.toString() || "",
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          subtotal: item.subtotal || 0,
        })),
        totalAmount: farmerItems.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0),
        status: order.status as any,
        createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: order.updatedAt?.toISOString() || new Date().toISOString(),
      };
    });

    const response: IOrdersListResponse = {
      orders: formattedOrders,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching farmer orders:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
