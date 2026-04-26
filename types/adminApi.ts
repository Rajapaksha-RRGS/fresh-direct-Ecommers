/**
 * types/adminApi.ts — TypeScript types for Admin API endpoints
 *
 * Provides type safety for frontend requests and responses to all admin endpoints.
 */

import { IUser } from "@/models/User";
import { IFarmerProfile } from "@/models/FarmerProfile";
import { IProduct } from "@/models/Product";
import { IPricingConfig } from "@/models/PricingConfig";

// ─── Farmer Management Types ──────────────────────────────────────────────────

export interface FarmerOverviewItem {
  _id: string;
  farmName: string;
  location: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  approvedAt: Date | null;
  createdAt: Date;
  userId: string;
  userName: string;
  userNIC: string;
  userMobile: string;
  isVerified: boolean;
  cropTypes: string[];
}

export interface GetFarmersResponse {
  success: boolean;
  data: FarmerOverviewItem[];
  count: number;
}

export interface VerifyFarmerRequest {
  action: "APPROVE" | "REJECT";
  reason?: string;
}

export interface VerifyFarmerResponse {
  success: boolean;
  message: string;
  messageNL: string;
  data: Partial<IFarmerProfile>;
}

// ─── Analytics Types ─────────────────────────────────────────────────────────

export interface TopDemandProduct {
  _id: string;
  name: string;
  demandScore: number;
  stockQty: number;
  currentPrice: number;
}

export interface AnalyticsData {
  totalActiveFarmers: number;
  pendingApprovals: number;
  marketLiquidity: number; // Total stockQty
  revenueEstimates: number; // LKR
  topDemandProducts: TopDemandProduct[];
}

export interface GetAnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  timestamp: string;
}

// ─── Pricing Config Types ────────────────────────────────────────────────────

export interface PricingConfigData {
  demandSensitivity: number; // 0-1, α factor
  supplySensitivity: number; // 0-1, β factor
  lastModifiedAt: Date;
  lastModifiedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface GetPricingConfigResponse {
  success: boolean;
  data: PricingConfigData;
}

export interface UpdatePricingConfigRequest {
  demandSensitivity?: number;
  supplySensitivity?: number;
}

export interface UpdatePricingConfigResponse {
  success: boolean;
  message: string;
  messageNL: string;
  data: Omit<PricingConfigData, "lastModifiedBy">;
}

// ─── Product Oversight Types ──────────────────────────────────────────────────

export interface ProductOverviewItem {
  _id: string;
  name: string;
  category: "vegetables" | "fruits" | "herbs" | "grains" | "other";
  status: "PENDING" | "APPROVED" | "REJECTED" | "OUT_OF_STOCK";
  basePrice: number;
  currentPrice: number;
  stockQty: number;
  demandScore: number;
  totalSold: number;
  farmerName: string;
  farmerId: string;
  createdAt: Date;
}

export interface PaginationInfo {
  limit: number;
  sortBy: "demandScore" | "stockQty" | "currentPrice" | "totalSold";
  order: "asc" | "desc";
}

export interface GetProductsResponse {
  success: boolean;
  data: ProductOverviewItem[];
  count: number;
  pagination: PaginationInfo;
}

export interface GetProductsQueryParams {
  sortBy?: "demandScore" | "stockQty" | "currentPrice" | "totalSold";
  order?: "asc" | "desc";
  status?: "PENDING" | "APPROVED" | "REJECTED" | "OUT_OF_STOCK";
  limit?: number;
}

// ─── Error Response Types ────────────────────────────────────────────────────

export interface ApiError {
  success: false;
  message: string;
  messageNL: string;
}

export interface ApiErrorWithDetails extends ApiError {
  details?: Record<string, unknown>;
}

// ─── Auth Error Types ───────────────────────────────────────────────────────

export type AuthError =
  | "NO_SESSION"
  | "USER_NOT_FOUND"
  | "INSUFFICIENT_PERMISSIONS"
  | "INVALID_REQUEST"
  | "SERVER_ERROR";

export interface UnauthorizedError extends ApiError {
  error: AuthError;
}

// ─── Generic API Response Wrapper ──────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  messageNL?: string;
  error?: string;
  timestamp?: string;
  pagination?: PaginationInfo;
}

// ─── Hooks for Frontend (React) ─────────────────────────────────────────────

/**
 * Hook hook types for useQuery/useMutation patterns
 * Compatible with React Query or SWR
 */

export type UseFarmersOptions = {
  status?: string;
  enabled?: boolean;
};

export type UseAnalyticsOptions = {
  enabled?: boolean;
  refetchInterval?: number;
};

export type UsePricingConfigOptions = {
  enabled?: boolean;
};

export type UseProductsOptions = {
  sortBy?: "demandScore" | "stockQty" | "currentPrice" | "totalSold";
  order?: "asc" | "desc";
  status?: string;
  limit?: number;
  enabled?: boolean;
};

// ─── Pricing Formula Documentation ───────────────────────────────────────────

/**
 * Dynamic Pricing Formula:
 *
 * P_final = P_base × (1 + (α × demandScore) − (β × stockQty))
 *
 * Where:
 *   P_base = Farmer's minimum acceptable price (price floor)
 *   α (demandSensitivity) = How much demand affects price [0-1]
 *   β (supplySensitivity) = How much stock reduces price [0-1]
 *   demandScore = Cumulative demand indicator
 *   stockQty = Current units available
 *
 * Safety Constraint:
 *   P_final is NEVER lower than P_base
 *
 * Example:
 *   P_base = 100
 *   demandScore = 50
 *   stockQty = 200
 *   α = 0.01
 *   β = 0.005
 *
 *   P_raw = 100 × (1 + (0.01 × 50) − (0.005 × 200))
 *   P_raw = 100 × (1 + 0.5 − 1)
 *   P_raw = 100 × 0.5 = 50
 *
 *   P_final = max(50, 100) = 100 (price floor kicks in)
 */
