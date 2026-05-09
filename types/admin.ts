// ─── Admin Dashboard Types — Fresh Direct ─────────────────────────────────────

// ─── Navigation ───────────────────────────────────────────────────────────────
export type AdminPage =
  | "dashboard"
  | "approvals"
  | "pricing"
  | "orders"
  | "users";

// ─── Stat Card ────────────────────────────────────────────────────────────────
export interface AdminStat {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  /** positive = green trend, false = red trend, null = neutral */
  trend: number | null;
}

// ─── Farmer Approval Row ──────────────────────────────────────────────────────
export interface PendingFarmer {
  id: string;
  name: string;
  nic: string;
  location: string;
  farmName: string;
  mobile: string;
  submittedAt: string;
  cropTypes: string[];
}

// ─── Pricing Engine ───────────────────────────────────────────────────────────
export type DemandLevel = "High" | "Medium" | "Low";

export interface PricingRow {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  unit: string;
  supply: number;      // raw stockQty
  supplyMax: number;   // highest stockQty across all products (denominator)
  supplyPct: number;   // 0–100 percentage for the progress bar
  demand: DemandLevel;
  dynamicPrice: number;
}
