"use client";

import { Loader2 } from "lucide-react";

interface StockItem {
  id: string;
  name?: string;
  crop?: string;
  stockQty?: number;
  stock?: number;
  unit: string;
  currentPrice?: number;
  price?: number;
  status: string;
  category?: string;
}

interface PaginationInfo {
  page?: number;
  perPage?: number;
  total?: number;
  totalPages?: number;
}

interface CurrentStockListProps {
  items: StockItem[];
  isLoading?: boolean;
  pagination?: PaginationInfo;
}

const T = {
  cardBg: "#FFFFFF",
  border: "#C8DFC8",
  success: "#3E7B27",
  gold: "#F2B441",
  textDark: "#1A3020",
  textMid: "#3D5C42",
  textLight: "#6B8F6E",
  bg: "#F0F7F0",
} as const;

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  "In Stock": { color: T.success, bg: `${T.success}10` },
  "Low Stock": { color: T.gold, bg: `${T.gold}12` },
  "Out of Stock": { color: "#DC2626", bg: "#FEECEC" },
  PENDING: { color: "#F59E0B", bg: "#FEF3C7" },
  APPROVED: { color: T.success, bg: `${T.success}10` },
  REJECTED: { color: "#DC2626", bg: "#FEECEC" },
  OUT_OF_STOCK: { color: "#DC2626", bg: "#FEECEC" },
};

export default function CurrentStockList({
  items,
  isLoading,
  pagination,
}: CurrentStockListProps) {
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status] || { color: T.textMid, bg: T.bg };
  };

  const getDisplayStatus = (status: string): string => {
    if (status === "PENDING") return "Pending Approval";
    if (status === "APPROVED") return "In Stock";
    if (status === "REJECTED") return "Rejected";
    if (status === "OUT_OF_STOCK") return "Out of Stock";
    return status;
  };

  const getItemName = (item: StockItem): string =>
    item.name || item.crop || "Unknown";
  const getItemPrice = (item: StockItem): number =>
    item.currentPrice ?? item.price ?? 0;
  const getItemStock = (item: StockItem): number =>
    item.stockQty ?? item.stock ?? 0;

  if (isLoading) {
    return (
      <div
        className="rounded-3xl overflow-hidden flex items-center justify-center py-12"
        style={{
          background: T.cardBg,
          border: `1.5px solid ${T.border}`,
          boxShadow: "0 4px 20px rgba(26,48,32,0.07)",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: T.success }}
          />
          <p style={{ color: T.textLight }}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: T.cardBg,
        border: `1.5px solid ${T.border}`,
        boxShadow: "0 4px 20px rgba(26,48,32,0.07)",
      }}
    >
      <div className="px-6 py-4 border-b" style={{ borderColor: T.border }}>
        <h2
          className="font-extrabold text-base"
          style={{
            color: T.textDark,
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Your Products
        </h2>
        {pagination && (
          <p className="text-xs mt-1" style={{ color: T.textLight }}>
            Showing {items.length} of {pagination.total || 0} products
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p style={{ color: T.textLight }}>
            No products yet. Start by adding one above!
          </p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: T.border }}>
          {items.map((item) => {
            const displayStatus = getStatusColor(item.status);

            return (
              <div
                key={item.id}
                className="px-5 py-4 flex items-center justify-between gap-4 transition-colors duration-150"
                onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-sm"
                    style={{ color: T.textDark }}
                  >
                    {getItemName(item)}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: T.textLight }}>
                    Rs. {getItemPrice(item)}/{item.unit}
                  </p>
                </div>
                <p
                  className="font-extrabold text-sm whitespace-nowrap"
                  style={{ color: T.textMid }}
                >
                  {getItemStock(item)} {item.unit}
                </p>
                <span
                  className="text-[11px] font-bold px-3 py-1 rounded-lg whitespace-nowrap"
                  style={{
                    background: displayStatus.bg,
                    color: displayStatus.color,
                  }}
                >
                  {getDisplayStatus(item.status)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Info */}
      {pagination && pagination.totalPages && pagination.totalPages > 1 && (
        <div
          className="px-6 py-4 text-center text-xs border-t"
          style={{ color: T.textLight, borderColor: T.border }}
        >
          Page {pagination.page} of {pagination.totalPages}
        </div>
      )}
    </div>
  );
}
