/**
 * lib/utils/farmerAuth.ts — Shared Auth Guard for Farmer API Routes
 *
 * This utility centralizes the role verification logic.
 * Every route under /api/farmer/ should call this at the start.
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";


interface AuthCheckResult {
  authenticated: boolean;
  farmerId?: string;
  error?: NextResponse;
}

/**
 * Verifies the request has a valid session with FARMER role.
 * Returns farmerId if authenticated, or an error response if not.
 */
export async function checkFarmerAuth(): Promise<AuthCheckResult> {
  try {
    const session = await auth();

    if (!session) {
      return {
        authenticated: false,
        error: NextResponse.json(
          { error: "Unauthorized", message: "No session found" },
          { status: 401 }
        ),
      };
    }

    if (session.user.role !== "FARMER") {
      return {
        authenticated: false,
        error: NextResponse.json(
          { error: "Forbidden", message: "User is not a farmer" },
          { status: 403 }
        ),
      };
    }

    if (!session.user.id) {
      return {
        authenticated: false,
        error: NextResponse.json(
          { error: "Unauthorized", message: "User ID not found in session" },
          { status: 401 }
        ),
      };
    }

    return {
      authenticated: true,
      farmerId: session.user.id,
    };
  } catch (error) {
    return {
      authenticated: false,
      error: NextResponse.json(
        { error: "Internal Error", message: "Failed to verify session" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Helper: Returns true if user is authenticated farmer, false otherwise.
 * Useful for conditional logic within routes.
 */
export async function isFarmer(): Promise<boolean> {
  const result = await checkFarmerAuth();
  return result.authenticated;
}
