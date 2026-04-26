import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import FarmerProfile from "@/models/FarmerProfile";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ── Next.js 15: params is now a Promise ───────────────────────────────────
    const { id } = await params;

    // ── Guard: validate that id is a valid MongoDB ObjectId ──────────────────
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid farmer ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // ── 1. Find FarmerProfile by its own _id and populate user details ────────
    const farmer = await FarmerProfile.findById(id)
      .populate("userId", "name email mobile") // only safe public fields
      .lean();

    if (!farmer) {
      return NextResponse.json(
        { error: "Farmer not found" },
        { status: 404 }
      );
    }

    // ── 2. Get only APPROVED products for this farmer ─────────────────────────
    //    Product.farmerId references User._id (not FarmerProfile._id)
    //    After populate(), farmer.userId is the full User document
    const userId = (farmer.userId as any)?._id ?? farmer.userId;

    const products = await Product.find({
      farmerId: userId
    })
      .sort({ createdAt: -1 })
      .lean();

    // ── 3. Serialise ObjectIds → plain strings for JSON ───────────────────────
    const payload = JSON.parse(JSON.stringify({ farmer, products }));

    return NextResponse.json(payload, { status: 200 });
  } catch (error: any) {
    console.error("[farmerProfile GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}