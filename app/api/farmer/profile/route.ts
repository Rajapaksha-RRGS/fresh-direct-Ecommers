/**
 * GET /api/farmer/profile
 *
 * Fetches the current farmer's profile including verification status.
 * Used to:
 *  - Display farmer details on dashboard
 *  - Check if status is PENDING (to disable product add)
 *  - Show account verification state
 *
 * Returns: IFarmerProfileResponse
 * Errors: 401 Unauthorized, 404 Not Found, 500 Internal Server Error
 */

import { NextResponse } from "next/server";
import { checkFarmerAuth } from "@/lib/utils/farmerAuth";
import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";
import { IFarmerProfileResponse } from "@/types/farmerApi";

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

    // Step 3: Fetch farmer profile using userId (not farmerId ID)
    const profile = await FarmerProfile.findOne({ userId: farmerId });

    if (!profile) {
      return NextResponse.json(
        { error: "Not Found", message: "Farmer profile not found" },
        { status: 404 }
      );
    }

    // Step 4: Format and return response
    const response: IFarmerProfileResponse = {
      id: profile._id.toString(),
      userId: profile.userId.toString(),
      farmName: profile.farmName,
      location: profile.location,
      cropTypes: profile.cropTypes,
      bio: profile.bio,
      certifications: profile.certifications,
      profileImage: profile.profileImage,
      isVerified: profile.isVerified,
      whatsappEnabled: profile.whatsappEnabled,
      bankDetails: profile.bankDetails,
      status: profile.status,
      approvedAt: profile.approvedAt?.toISOString() || null,
      approvedBy: profile.approvedBy?.toString() || null,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching farmer profile:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
