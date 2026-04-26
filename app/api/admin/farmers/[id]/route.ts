/**
 * app/api/admin/farmers/[id]/route.ts — Farmer Management
 *
 * ✅ CONSOLIDATED ENDPOINT (replaces /status and /verify routes)
 *
 * GET /api/admin/farmers/[id]
 *   Fetch farmer details (admin only)
 *
 * PATCH /api/admin/farmers/[id]
 *   Update farmer status to APPROVED or REJECTED.
 *   Accepts both "status" and "action" fields for backward compatibility.
 *   Side effect: If approved, set approvedAt to current timestamp.
 *   Requires: ADMIN role (enforced by middleware/proxy)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";
import {
  validateFarmerId,
  normalizeFarmerUpdatePayload,
} from "@/lib/utils/farmerValidation";
import {
  successResponse,
  errorResponse,
  invalidFarmerIdResponse,
  farmerNotFoundResponse,
  serverErrorResponse,
} from "@/lib/utils/farmerResponse";
import { handleEndpointError } from "@/lib/utils/errorHandler";

/**
 * PATCH /api/admin/farmers/[id] — Update farmer approval status
 *
 * Supports both request formats for backward compatibility:
 *
 * Format 1 (legacy - from /verify endpoint):
 * {
 *   "action": "APPROVE" | "REJECT",
 *   "reason": "Optional rejection reason"
 * }
 *
 * Format 2 (from /status endpoint):
 * {
 *   "status": "APPROVED" | "REJECTED",
 *   "reason": "Optional rejection reason"
 * }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Establish (or reuse) the MongoDB connection before any DB operations.
    await connectDB();

    const farmerId = id;

    // Validate MongoDB ObjectId
    if (!validateFarmerId(farmerId)) {
      return invalidFarmerIdResponse();
    }

    // Parse and normalize request body (supports both "status" and "action")
    const body = await req.json();
    const normalizedPayload = normalizeFarmerUpdatePayload(body);

    // Extract normalized fields
    const { status, reason, rejectionReason } = normalizedPayload;

    // Validate status field
    if (!status || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return errorResponse(
        400,
        "Invalid status. Must be 'APPROVED' or 'REJECTED'",
        "වලංගු නොවන තත්ත්වය. 'APPROVED' හෝ 'REJECTED' විය යුතුයි"
      );
    }

    // Find farmer profile
    const farmerProfile = await FarmerProfile.findById(farmerId);

    if (!farmerProfile) {
      return farmerNotFoundResponse();
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      status,
      approvedBy: status === "APPROVED" ? id : null,
    };

    // If approving, set approvedAt and verify
    if (status === "APPROVED") {
      updateData.approvedAt = new Date();
      updateData.isVerified = true;
    } else if (status === "REJECTED") {
      // If rejecting, clear approval data and store rejection reason
      updateData.approvedAt = null;
      updateData.isVerified = false;
      if (reason) {
        updateData.rejectionReason = reason;
      } else if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
    }

    // Update farmer profile
    const updatedFarmer = await FarmerProfile.findByIdAndUpdate(
      farmerId,
      updateData,
      { new: true }
    );

    // Audit log: log the action
    console.log(
      `[ADMIN AUDIT] ${id} updated farmer ${farmerId} status to ${status}`
    );

    return successResponse(
      `Farmer ${status.toLowerCase()} successfully`,
      `ගොවියා ${
        status === "APPROVED"
          ? "අනුමත"
          : status === "REJECTED"
            ? "ප්‍රතික්ෂේප"
            : "පෙන්ඩිං"
      } විය`,
      updatedFarmer,
      200
    );
  } catch (error) {
    return handleEndpointError(
      error,
      "Failed to update farmer",
      "ගොවියා යාවත්කාලීන කිරීම අසФල විය"
    );
  }
}

/**
 * GET /api/admin/farmers/[id] — Fetch farmer details (admin only)
 *
 * Returns full farmer profile including sensitive data
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Establish (or reuse) the MongoDB connection before any DB operations.
    await connectDB();

    const farmerId = id;

    // Validate MongoDB ObjectId
    if (!validateFarmerId(farmerId)) {
      return invalidFarmerIdResponse();
    }

    // Find farmer profile with populated user data
    const farmerProfile = await FarmerProfile.findById(farmerId).populate(
      "userId approvedBy",
      "name email role"
    );

    if (!farmerProfile) {
      return farmerNotFoundResponse();
    }

    // Serialize ObjectIds → strings so Next.js can JSON-encode
    const payload = JSON.parse(JSON.stringify(farmerProfile));

    return successResponse("Farmer profile retrieved", "ගොවියා පැතිකඩ ලබා ගන්න ලදි", payload, 200);
  } catch (error) {
    return handleEndpointError(
      error,
      "Failed to fetch farmer",
      "ගොවියා ලබා ගැනීම අසफල විය"
    );
  }
}
