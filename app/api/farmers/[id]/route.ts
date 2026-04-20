import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";
import Product from "@/models/Product";

// ─── GET /api/farmers/[id] ────────────────────────────────────────────────────
// Public endpoint — returns a farmer's profile + their active listed products.
// [id] = FarmerProfile._id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    // Fetch farmer profile and populate user fields
    const profile = await FarmerProfile.findById(id)
      .populate("userId", "name email mobile")
      .lean();

    if (!profile || profile.status !== "APPROVED") {
      return NextResponse.json(
        { message: "Farmer not found." },
        { status: 404 },
      );
    }

    // Fetch only APPROVED products listed by this farmer
    const products = await Product.find({
      farmerId: (profile as any).userId._id ?? (profile as any).userId,
      status: "APPROVED",
    })
      .select("name category basePrice unit stockQty images description tags")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { profile, products },
      { status: 200 },
    );
  } catch (err) {
    console.error("[GET /api/farmers/[id]]", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
