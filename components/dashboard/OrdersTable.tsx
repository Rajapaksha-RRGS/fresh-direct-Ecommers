"use client";

import React from "react";
import { Package } from "lucide-react";

interface OrdersTableProps {
  orders: any[];
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
  string,
  { bg: string; text: string; dot: string }
> = {
  PENDING: { bg: "bg-[#FEF3CD]", text: "text-[#7D5A00]", dot: "bg-[#F2B441]" },
  CONFIRMED: { bg: "bg-[#E6F4E6]", text: "text-[#2A6B1E]", dot: "bg-[#3E7B27]" },
  PROCESSING: { bg: "bg-[#FEF3CD]", text: "text-[#7D5A00]", dot: "bg-[#F2B441]" },
  SHIPPED: { bg: "bg-[#E8F0FF]", text: "text-[#2C4DA0]", dot: "bg-[#4A6FDB]" },
  DELIVERED: { bg: "bg-[#E6F4E6]", text: "text-[#2A6B1E]", dot: "bg-[#3E7B27]" },
  CANCELLED: { bg: "bg-[#FEE8E8]", text: "text-[#8B1C1C]", dot: "bg-[#D94040]" },
  Ready: { bg: "bg-[#E6F4E6]", text: "text-[#2A6B1E]", dot: "bg-[#3E7B27]" },
  Harvesting: { bg: "bg-[#E8F0FF]", text: "text-[#2C4DA0]", dot: "bg-[#4A6FDB]" },
};

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

function fmt(n: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function OrdersTable({
  orders,
  title = "Recent Produce Orders",
  subtitle = "Latest orders containing your crops",
  showViewAll = true,
}: OrdersTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <div
        className="rounded-3xl p-8 text-center"
        style={{
          background: T.cardBg,
          border: `1.5px solid ${T.border}`,
          boxShadow: "0 4px 20px rgba(26,48,32,0.07)",
        }}
      >
        <Package className="w-8 h-8 text-[#6B8F6E] mx-auto mb-2 opacity-60" />
        <h3 className="font-bold text-sm text-[#1A3020]">No Recent Orders</h3>
        <p className="text-xs text-[#6B8F6E] mt-0.5">
          New customer orders for your produce will appear here automatically.
        </p>
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
      </div>

      {/* Mobile stacked view */}
      <div className="sm:hidden divide-y" style={{ borderColor: T.border }}>
        {orders.map((order, idx) => {
          const statusKey = order.status || "PENDING";
          const sc = STATUS_CFG[statusKey] || STATUS_CFG.PENDING;
          const cropName =
            order.crop ||
            order.items?.[0]?.name ||
            `Order #${order.orderId || (order.id ? order.id.slice(-6) : idx + 1)}`;
          const totalAmt = typeof order.totalAmount === "number" ? order.totalAmount : order.amount || 0;

          return (
            <div
              key={order.id || order.orderId || idx}
              className="px-4 py-4 flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold text-sm truncate"
                  style={{ color: T.textDark }}
                >
                  {cropName}
                </p>
                <p className="text-xs mt-0.5" style={{ color: T.textLight }}>
                  {order.deliveryAddress?.fullName || order.buyer || "Customer"} · {fmt(totalAmt)}
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
                {statusKey}
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
              {["Produce / Crop", "Qty / Weight", "Buyer / Customer", "Date", "Total Amount", "Status"].map(
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
            {orders.map((order, idx) => {
              const statusKey = order.status || "PENDING";
              const sc = STATUS_CFG[statusKey] || STATUS_CFG.PENDING;
              const cropName =
                order.crop ||
                order.items?.[0]?.name ||
                `Order #${order.orderId || (order.id ? order.id.slice(-6) : idx + 1)}`;
              const weightStr =
                order.weight ||
                (order.items
                  ? `${order.items.reduce((s: number, i: any) => s + (i.quantity || 1), 0)} ${order.items[0]?.unit || "units"}`
                  : "1 unit");
              const buyerName =
                order.deliveryAddress?.fullName ||
                order.buyer ||
                "Customer";
              const dateStr = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-LK", {
                    day: "2-digit",
                    month: "short",
                  })
                : order.date || "Recently";
              const totalAmt = typeof order.totalAmount === "number" ? order.totalAmount : order.amount || 0;

              return (
                <tr
                  key={order.id || order.orderId || idx}
                  className="transition-colors duration-150"
                  style={{ borderBottom: `1px solid ${T.border}40` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `${T.bg}80`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td
                    className="px-5 py-3.5 font-bold text-sm whitespace-nowrap"
                    style={{ color: T.textDark }}
                  >
                    {cropName}
                  </td>
                  <td
                    className="px-5 py-3.5 font-semibold text-sm whitespace-nowrap"
                    style={{ color: T.textMid }}
                  >
                    {weightStr}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm whitespace-nowrap"
                    style={{ color: T.textMid }}
                  >
                    {buyerName}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs whitespace-nowrap"
                    style={{ color: T.textLight }}
                  >
                    {dateStr}
                  </td>
                  <td
                    className="px-5 py-3.5 font-extrabold text-sm whitespace-nowrap"
                    style={{ color: T.textDark }}
                  >
                    {fmt(totalAmt)}
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
                      {statusKey}
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
