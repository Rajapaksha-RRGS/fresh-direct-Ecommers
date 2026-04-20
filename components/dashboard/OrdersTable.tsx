"use client";

import { CheckCircle2, Loader2, RefreshCw, AlertCircle } from "lucide-react";

type CropStatus = "Ready" | "Processing" | "Harvesting" | "Cancelled";

interface Order {
  id: string;
  crop: string;
  weight: string;
  buyer: string;
  date: string;
  amount: number;
  status: CropStatus;
}

interface OrdersTableProps {
  orders: Order[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

const T = {
  cardBg: "#FFFFFF",
  border: "#C8DFC8",
  success: "#3E7B27",
  textDark: "#1A3020",
  textMid: "#3D5C42",
  textLight: "#6B8F6E",
  bg: "#F0F7F0",
} as const;

const STATUS_CFG: Record<
  CropStatus,
  { bg: string; text: string; dot: string }
> = {
  Ready: { bg: "bg-[#E6F4E6]", text: "text-[#2A6B1E]", dot: "bg-[#3E7B27]" },
  Processing: {
    bg: "bg-[#FEF3CD]",
    text: "text-[#7D5A00]",
    dot: "bg-[#F2B441]",
  },
  Harvesting: {
    bg: "bg-[#E8F0FF]",
    text: "text-[#2C4DA0]",
    dot: "bg-[#4A6FDB]",
  },
  Cancelled: { bg: "bg-[#FEE8E8]", text: "text-[#8B1C1C]", dot: "bg-[#D94040]" },
};

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function OrdersTable({
  orders,
  title = "Active Orders",
  subtitle = "Recent orders",
  showViewAll = true,
}: OrdersTableProps) {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: T.cardBg,
        border: `1.5px solid ${T.border}`,
        boxShadow: "0 4px 20px rgba(26,48,32,0.07)",
      }}
    >
      <div
        className="px-6 py-4 flex items-center justify-between border-b"
        style={{ borderColor: T.border }}
      >
        <div>
          <h2
            className="font-extrabold text-base"
            style={{
              color: T.textDark,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {title}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: T.textLight }}>
            {subtitle}
          </p>
        </div>
        {showViewAll && (
          <button
            className="text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 hover:opacity-80 min-h-[36px]"
            style={{
              background: `${T.success}12`,
              color: T.success,
              border: `1.5px solid ${T.success}30`,
            }}
          >
            View All
          </button>
        )}
      </div>

      {/* Mobile stacked */}
      <div className="sm:hidden divide-y" style={{ borderColor: T.border }}>
        {orders.map((order) => {
          const sc = STATUS_CFG[order.status];
          return (
            <div
              key={order.id}
              className="px-4 py-4 flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold text-sm truncate"
                  style={{ color: T.textDark }}
                >
                  {order.crop}
                </p>
                <p className="text-xs mt-0.5" style={{ color: T.textLight }}>
                  {order.weight} · {order.id}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap flex-shrink-0",
                  sc.bg,
                  sc.text
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />
                {order.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1.5px solid ${T.border}` }}>
              {["Crop Name", "Weight", "Buyer", "Date", "Total", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-bold px-5 py-3 whitespace-nowrap"
                    style={{ color: T.textLight }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const sc = STATUS_CFG[order.status];
              return (
                <tr
                  key={order.id}
                  className="transition-colors duration-150"
                  style={{ borderBottom: `1px solid ${T.border}40` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `${T.bg}80`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td
                    className="px-5 py-3.5 font-bold text-sm whitespace-nowrap"
                    style={{ color: T.textDark }}
                  >
                    {order.crop}
                  </td>
                  <td
                    className="px-5 py-3.5 font-semibold text-sm whitespace-nowrap"
                    style={{ color: T.textMid }}
                  >
                    {order.weight}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm whitespace-nowrap"
                    style={{ color: T.textMid }}
                  >
                    {order.buyer}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs whitespace-nowrap"
                    style={{ color: T.textLight }}
                  >
                    {new Date(order.date).toLocaleDateString("en-LK", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                  <td
                    className="px-5 py-3.5 font-extrabold text-sm whitespace-nowrap"
                    style={{ color: T.textDark }}
                  >
                    Rs.&nbsp;{order.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap",
                        sc.bg,
                        sc.text
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", sc.dot)} />
                      {order.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
