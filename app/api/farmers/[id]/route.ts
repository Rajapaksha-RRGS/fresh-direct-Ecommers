import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";
import Product from "@/models/Product";
import {
  successResponseEnglish,
  errorResponseEnglish,
} from "@/lib/utils/farmerResponse";
import { handleEndpointErrorEnglish } from "@/lib/utils/errorHandler";
import { validateFarmerId } from "@/lib/utils/farmerValidation";

// ─── GET /api/farmers/[id] ────────────────────────────────────────────────────
// ✅ PUBLIC endpoint — returns a farmer's profile + their active listed products.
// No auth required. [id] = FarmerProfile._id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    // Validate ObjectId
    if (!validateFarmerId(id)) {
      return errorResponseEnglish(400, "Invalid farmer ID format");
    }

    // Fetch farmer profile and populate user fields
    const profile = await FarmerProfile.findById(id)
      .populate("userId", "name email mobile")
      .lean();

    if (!profile || profile.status !== "APPROVED") {
      return errorResponseEnglish(404, "Farmer not found");
    }

    // Fetch only APPROVED products listed by this farmer
    const products = await Product.find({
      farmerId: (profile as any).userId._id ?? (profile as any).userId,
      status: "APPROVED",
    })
      .select("name category basePrice unit stockQty images description tags")
      .sort({ createdAt: -1 })
      .lean();

    return successResponseEnglish({ success: true, profile, products }, 200);
  } catch (err) {
    return handleEndpointErrorEnglish(err, "Failed to fetch farmer profile");
  }
}
