/**
 * GET /api/farmers
 *
 * ✅ PUBLIC endpoint — returns all FarmerProfiles whose status === "APPROVED".
 * No auth required. Sensitive fields (bankDetails, userId.email, etc.) are excluded.
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";
import {
  successResponseEnglish,
  errorResponseEnglish,
} from "@/lib/utils/farmerResponse";
import { handleEndpointErrorEnglish } from "@/lib/utils/errorHandler";

export async function GET() {
  try {
    await connectDB();

    const farmers = await FarmerProfile.find({ status: "APPROVED" })
      .populate<{ userId: { _id: string; name: string } }>(
        "userId",
        "name" // only surface the farmer's display name
      )
      .select(
        "userId farmName location cropTypes profileImage isVerified whatsappEnabled approvedAt"
      )
      .sort({ approvedAt: -1 })
      .lean();

    // Serialise ObjectIds → strings so Next.js can JSON-encode the response
    const payload = JSON.parse(JSON.stringify(farmers));

    return successResponseEnglish({ success: true, farmers: payload }, 200);
  } catch (err) {
    return handleEndpointErrorEnglish(err, "Failed to load farmers");
  }
}
