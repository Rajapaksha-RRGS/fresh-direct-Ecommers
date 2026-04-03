// ─── TypeScript Interfaces matching the Class Diagram ────────────────────────

export type UserRole = "CUSTOMER" | "FARMER" | "ADMIN";

export interface IUserBase {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  createdAt: string;
}

export interface ICustomer extends IUserBase {
  role: "CUSTOMER";
}

export interface IFarmer extends IUserBase {
  role: "FARMER";
  farmName: string;
  location: string;
  bio: string;
  certifications: string[];
  isVerified: boolean;
  profileImage?: string;
  rating?: number;
  reviewCount?: number;
  productCount?: number;
}

export interface IAdmin extends IUserBase {
  role: "ADMIN";
}

// ─── Product ──────────────────────────────────────────────────────────────────
export type ProductStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ProductCategory =
  | "Vegetables"
  | "Fruits"
  | "Grains"
  | "Herbs"
  | "Dairy"
  | "Other";

export interface IProduct {
  productId: string;
  name: string;
  category: ProductCategory;
  description: string;
  basePrice: number;
  currentPrice: number;
  demandFactor: number;
  stockQty: number;
  unit: string;
  imageUrl: string;
  status: ProductStatus;
  isOrganic: boolean;
  listedAt: string;
  harvestDate: string;
  farmerId: string;
  farmerName: string;
  farmLocation: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface ICartItem {
  cartItemId: string;
  productId: string;
  name: string;
  imageUrl: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

export interface ICart {
  cartId: string;
  customerId: string;
  items: ICartItem[];
  totalAmount: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface IOrderItem {
  orderItemId: string;
  productId: string;
  name: string;
  imageUrl: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

export interface IOrder {
  orderId: string;
  customerId: string;
  customerName: string;
  items: IOrderItem[];
  deliveryAddress: string;
  status: OrderStatus;
  totalAmount: number;
  trackingInfo?: string;
  placedAt: string;
  updatedAt: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────
export type PaymentMethod =
  | "LANKAQR"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "CASH_ON_DELIVERY";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface IPayment {
  paymentId: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  transactionRef?: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface IReview {
  reviewId: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export type NotificationType =
  | "ORDER_PLACED"
  | "ORDER_CONFIRMED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "PRODUCT_APPROVED"
  | "PRODUCT_REJECTED";
export type NotificationChannel = "SMS" | "WHATSAPP" | "IN_APP";

export interface INotification {
  notificationId: string;
  userId: string;
  type: NotificationType;
  message: string;
  channel: NotificationChannel;
  isRead: boolean;
  createdAt: string;
}
