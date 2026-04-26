/**
 * lib/utils/farmerResponse.ts
 * Standardized response format helpers for farmer endpoints
 */

import { NextResponse } from "next/server";

/**
 * Standard success response format (Type A)
 */
export function successResponse(
  message: string,
  messageNL: string,
  data: any = null,
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      messageNL,
      ...(data && { data }),
    },
    { status }
  );
}

/**
 * Standard error response format (Type A)
 */
export function errorResponse(
  status: number,
  message: string,
  messageNL: string,
  data: any = null
) {
  return NextResponse.json(
    {
      success: false,
      message,
      messageNL,
      ...(data && { data }),
    },
    { status }
  );
}

/**
 * Standard error response (English only - for public endpoints)
 */
export function errorResponseEnglish(status: number, message: string) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

/**
 * Standard success response (English only - for public endpoints)
 */
export function successResponseEnglish(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Invalid farmer ID response
 */
export function invalidFarmerIdResponse() {
  return errorResponse(
    400,
    "Invalid farmer ID format",
    "වලංගු නොවන ගොවියා හැඳුනුම්පත් ආකෘතිය"
  );
}

/**
 * Farmer not found response
 */
export function farmerNotFoundResponse() {
  return errorResponse(
    404,
    "Farmer not found",
    "ගොවියා සොයාගත නොහැක"
  );
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse() {
  return errorResponse(
    401,
    "Unauthorized: Admin access required",
    "අවසරයි නැත: පරිපාලක ප්‍රවේශය අවශ්‍ය"
  );
}

/**
 * Validation error response
 */
export function validationErrorResponse(error: any) {
  return errorResponse(
    400,
    "Validation error",
    "වලංගු කිරීම් දෝෂය",
    error
  );
}

/**
 * Server error response
 */
export function serverErrorResponse() {
  return errorResponse(
    500,
    "Internal server error",
    "අභ්‍යන්තර සර්වර දෝෂය"
  );
}
