/**
 * types/farmerApi.ts — Farmer API Response & Request Types
 *
 * All types are shared between API routes and frontend hooks.
 * Ensures type safety across the entire farmer dashboard.
 */

// ─── Farmer Profile ───────────────────────────────────────────────────────
export interface IFarmerProfileResponse {
  id: string;
  userId: string;
  farmName: string;
  location: string;
  cropTypes: string[];
  bio?: string;
  certifications?: string[];
  profileImage?: string;
  isVerified: boolean;
  whatsappEnabled: boolean;
  bankDetails: {
    accountName: string;
    bank: string;
    branch: string;
    accountNumber: string;
  };
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  approvedAt: string | null;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Product ──────────────────────────────────────────────────────────────
export interface IProductResponse {
  id: string;
  farmerId: string;
  name: string;
  category: "vegetables" | "fruits" | "herbs" | "grains" | "other";
  description: string;
  unit: string;
  images: string[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "OUT_OF_STOCK";
  tags?: string[];
  basePrice: number;
  currentPrice: number;
  stockQty: number;
  demandScore: number;
  totalViews: number;
  totalSold: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateProductRequest {
  name: string;
  category: "vegetables" | "fruits" | "herbs" | "grains" | "other";
  description: string;
  unit: string;
  basePrice: number;
  stockQty: number;
  images: string[]; // Cloudinary URLs
  tags?: string[];
}

export interface IUpdateProductRequest {
  name?: string;
  description?: string;
  category?: "vegetables" | "fruits" | "herbs" | "grains" | "other";
  unit?: string;
  basePrice?: number;
  stockQty?: number;
  images?: string[];
  tags?: string[];
  status?: "PENDING" | "APPROVED" | "REJECTED" | "OUT_OF_STOCK";
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────
export interface IDashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalStockQty: number;
  totalViews: number;
  totalSold: number;
  estimatedRevenue: number; // Sum of (currentPrice * totalSold) for all products
  pendingApprovals: number; // Count of PENDING products
}

export interface IStatsResponse {
  stats: IDashboardStats;
  lastUpdated: string;
}

// ─── Products List (Paginated) ────────────────────────────────────────────
export interface IProductsListResponse {
  products: IProductResponse[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// ─── Order Item (nested in Order) ─────────────────────────────────────────
export interface IOrderItem {
  productId: string;
  farmerId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// ─── Order ────────────────────────────────────────────────────────────────
export interface IOrderResponse {
  id: string;
  orderId: string; // User-friendly order number
  customerId: string;
  customerName: string;
  items: IOrderItem[];
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface IOrdersListResponse {
  orders: IOrderResponse[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// ─── API Error Response ────────────────────────────────────────────────────
export interface IApiErrorResponse {
  error: string;
  message?: string;
  status?: number;
}

// ─── Image Upload Response ────────────────────────────────────────────────
export interface IImageUploadResponse {
  url: string;
  publicId: string;
}

// ─── Pagination Params ────────────────────────────────────────────────────
export interface IPaginationParams {
  page?: number;
  perPage?: number;
}
