// ─── Fresh Direct — Mongoose Models ──────────────────────────────────────────
// Central export file — import from here in your API routes:
// import { User, Product, Order, ... } from "@/models"

export { default as User } from "./User";
export { default as FarmerProfile } from "./FarmerProfile";
export { default as Product } from "./Product";
export { default as Cart } from "./Cart";
export { default as Order } from "./Order";
export { default as Payment } from "./Payment";
export { default as Review } from "./Review";
export { default as Notification } from "./Notification";

// Re-export TypeScript interfaces
export type { IUser } from "./User";
export type { IFarmerProfile } from "./FarmerProfile";
export type { IProduct } from "./Product";
export type { ICart, ICartItem } from "./Cart";
export type { IOrder, IOrderItem } from "./Order";
export type { IPayment } from "./Payment";
export type { IReview } from "./Review";
export type { INotification } from "./Notification";
