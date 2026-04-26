/**
 * GET /api/farmer/upload-signature
 *
 * Generates a signed upload token for client-side Cloudinary uploads.
 * Farmers can use this to upload images directly from the frontend to Cloudinary
 * without needing to upload through our server first.
 *
 * Returns: { signature, timestamp, cloudName, folder, apiKey }
 * Errors: 401 Unauthorized, 500 Internal Server Error
 */

import { NextResponse } from "next/server";
import { checkFarmerAuth } from "@/lib/utils/farmerAuth";
import { generateUploadSignature } from "@/lib/utils/imageUpload";

export async function GET() {
  try {
    // Step 1: Verify farmer role
    const authResult = await checkFarmerAuth();
    if (!authResult.authenticated) {
      return authResult.error;
    }

    // Step 2: Generate and return upload signature
    const signature = generateUploadSignature();

    return NextResponse.json(signature, { status: 200 });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
