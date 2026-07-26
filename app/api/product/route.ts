// app/api/products/featured/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    // Mongoose query එක Server side එකේ රන් වේ
    const products = await Product.find({ })
      .sort({ createdAt: -1 })
      .populate("farmerId")
      .limit(6)
      .lean();

    const formattedProducts = products.map((Iproduct: any) => {
      const farmer = Iproduct.farmerId;

      return {
        id: Iproduct._id?.toString() || "",
        name: Iproduct.name || "Untitled Product",
        category: Iproduct.category || "Produce",
        currentPrice: Number(Iproduct.currentPrice ?? 0),
        basePrice: Number(Iproduct.basePrice ?? 0),
        demandFactor: Iproduct.demandFactor ?? 1,
        unit: Iproduct.unit || "kg",
        image: Iproduct.images?.[0] || "/placeholder.jpg",
        harvestDate: Iproduct.harvestDate 
          ? new Date(Iproduct.harvestDate).toISOString() 
          : new Date().toISOString(),
        farmerId: farmer?._id?.toString() || String(Iproduct.farmerId || ""),
        farmerName: farmer?.name || Iproduct.farmerName || "Local Farmer",
        farmLocation: farmer?.location || Iproduct.farmLocation || "Sri Lanka",
        stockQty: Number(Iproduct.stockQty ?? 0),
        isOrganic: Boolean(Iproduct.isOrganic ?? false),
      };
    });

    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (error) {
    console.error("Error in featured products API:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}