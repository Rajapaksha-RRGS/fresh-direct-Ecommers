// ─── Fresh Direct — Farmer Dashboard Types ───────────────────────────────────
// Centralised type definitions for the Farmer Dashboard.
// Import from "@/types/dashboard" in any component.

// ─── Navigation ───────────────────────────────────────────────────────────────

export type Page = "dashboard" | "orders" | "inventory" | "payments";

// ─── Orders ───────────────────────────────────────────────────────────────────

export type CropStatus = "Ready" | "Processing" | "Harvesting" | "Cancelled";

export interface Order {
  id: string;
  crop: string;
  weight: string;
  buyer: string;
  date: string;
  amount: number;
  status: CropStatus;
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface StockItem {
  id: string;
  crop: string;
  stock: number;
  unit: string;
  price: number;
  status: StockStatus;
}

// ─── Earnings ─────────────────────────────────────────────────────────────────

export interface EarningMonth {
  month: string;
  amount: number;
}

export interface PayoutRecord {
  month: string;
  amount: number;
  isPending: boolean;
}

// ─── Farmer ───────────────────────────────────────────────────────────────────

export interface Farmer {
  name: string;
  farm: string;
  location: string;
  initials: string;
  rating: number;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

export interface StatCard {
  label: string;
  sublabel: string;
  value: string;
  change: string;
  positive: boolean | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  accent: string;
  badge: string | null;
}

// ─── Status Badge Config ──────────────────────────────────────────────────────

export interface StatusConfig {
  bg: string;
  text: string;
  dot: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}
