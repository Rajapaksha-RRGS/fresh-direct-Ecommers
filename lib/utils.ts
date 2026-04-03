// ─── Utility helper functions ─────────────────────────────────────────────────

/** Format a number as Sri Lankan Rupees */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format an ISO date string to a relative "X ago" label */
export function formatHarvestDate(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Just harvested";
  if (diffH < 24) return `Harvested ${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `Harvested ${diffD} day${diffD !== 1 ? "s" : ""} ago`;
}

/** Format a date to a readable string */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Simple class names combiner */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Order status display helpers */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:    { bg: "#FFF9E6", color: "#B7791F" },
  CONFIRMED:  { bg: "#E8F5E9", color: "#2D6A4F" },
  PROCESSING: { bg: "#E3F2FD", color: "#1565C0" },
  SHIPPED:    { bg: "#F3E5F5", color: "#7B1FA2" },
  DELIVERED:  { bg: "#E8F5E9", color: "#1B4332" },
  CANCELLED:  { bg: "#FEECEC", color: "#C62828" },
};
