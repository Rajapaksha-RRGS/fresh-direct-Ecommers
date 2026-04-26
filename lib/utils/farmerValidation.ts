/**
 * lib/utils/farmerValidation.ts
 * Shared validation utilities for farmer endpoints
 */

import mongoose from "mongoose";
import { z } from "zod";

/**
 * Validate if a string is a valid MongoDB ObjectId
 * @throws Returns null if invalid, otherwise returns the validated id
 */
export function validateFarmerId(id: string): string | null {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return id;
}

/**
 * Schema for farmer status update payload
 * Accepts both "status" and "action" fields for backward compatibility
 */
export const farmerUpdateSchema = z.object({
  status: z
    .enum(["APPROVED", "REJECTED", "PENDING"])
    .optional(),
  action: z
    .enum(["APPROVE", "REJECT"])
    .optional(),
  reason: z.string().optional(),
  approvedBy: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export type FarmerUpdatePayload = z.infer<typeof farmerUpdateSchema>;

/**
 * Normalize and validate farmer update payload
 * Converts "action" field to "status" for consistency
 */
export function normalizeFarmerUpdatePayload(body: any): FarmerUpdatePayload {
  const parsed = farmerUpdateSchema.parse(body);

  // Convert action to status for consistency
  let normalizedBody = { ...parsed };
  if (parsed.action === "APPROVE" && !parsed.status) {
    normalizedBody.status = "APPROVED";
  } else if (parsed.action === "REJECT" && !parsed.status) {
    normalizedBody.status = "REJECTED";
  }

  return normalizedBody;
}

/**
 * Schema for farmer creation/registration
 */
export const farmerRegistrationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  district: z.string().min(1),
});

export type FarmerRegistrationPayload = z.infer<
  typeof farmerRegistrationSchema
>;
