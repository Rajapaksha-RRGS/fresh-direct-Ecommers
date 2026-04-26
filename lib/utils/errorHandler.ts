/**
 * lib/utils/errorHandler.ts
 * Centralized error handling for API endpoints
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Handle various error types and return standardized response
 */
export function handleEndpointError(
  error: any,
  defaultMessage: string,
  defaultMessageNL: string,
  includeDetails = false
) {
  console.error(`[API Error] ${defaultMessage}:`, error);

  // Zod validation error
  if (error instanceof ZodError) {
    const issues = error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return NextResponse.json(
      {
        success: false,
        message: "Validation error",
        messageNL: "වලංගු කිරීම් දෝෂය",
        data: includeDetails ? issues : undefined,
      },
      { status: 400 }
    );
  }

  // Generic error
  return NextResponse.json(
    {
      success: false,
      message: defaultMessage,
      messageNL: defaultMessageNL,
    },
    { status: 500 }
  );
}

/**
 * Handle endpoint error (English only - for public endpoints)
 */
export function handleEndpointErrorEnglish(
  error: any,
  message: string = "Internal server error"
) {
  console.error(`[API Error] ${message}:`, error);

  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 500 }
  );
}
