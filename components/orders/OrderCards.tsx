"use client";

import React, { useState } from "react";
import {
  Package,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertCircle,
  Clock,
  Truck,
  XCircle,
  MapPin,
  Phone,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { IOrderResponse } from "@/types/farmerApi";

interface OrderCardsProps {
  orders: any[]; // Accepts IOrderResponse or legacy mock order format
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
  { bg: string; text: string; icon: React.ElementType }
> = {
  PENDING: { bg: "bg-[#FEF3CD]", text: "text-[#7D5A00]", icon: Clock },
  CONFIRMED: { bg: "bg-[#E6F4E6]", text: "text-[#2A6B1E]", icon: CheckCircle2 },
  PROCESSING: { bg: "bg-[#FEF3CD]", text: "text-[#7D5A00]", icon: Loader2 },
  SHIPPED: { bg: "bg-[#E8F0FF]", text: "text-[#2C4DA0]", icon: Truck },
  DELIVERED: { bg: "bg-[#E6F4E6]", text: "text-[#2A6B1E]", icon: CheckCircle2 },
  CANCELLED: { bg: "bg-[#FEE8E8]", text: "text-[#8B1C1C]", icon: XCircle },
  // Legacy / fallback mapping
  Ready: { bg: "bg-[#E6F4E6]", text: "text-[#2A6B1E]", icon: CheckCircle2 },
  Harvesting: { bg: "bg-[#E8F0FF]", text: "text-[#2C4DA0]", icon: RefreshCw },
};

function fmt(n: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function OrderCards({ orders }: OrderCardsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-[#C8DFC8]">
        <Package className="w-10 h-10 text-[#6B8F6E] mx-auto mb-3 opacity-60" />
        <p className="text-[#1A3020] font-bold text-base">No orders found</p>
        <p className="text-[#6B8F6E] text-xs mt-1">
          When customers order your products, their orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const orderIdStr = order.orderId || order.id || "ORD";
        const statusKey = order.status || "PENDING";
        const sc = STATUS_CFG[statusKey] || STATUS_CFG.PENDING;
        const StatusIcon = sc.icon;
        const isExpanded = expandedId === (order.id || order.orderId);

        // Normalize items array (Handles real IOrderResponse items & legacy mock format)
        const itemsList = order.items && Array.isArray(order.items) ? order.items : [];
        const isRealOrder = itemsList.length > 0 || order.deliveryAddress;

        const dateFormatted = order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-LK", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : order.date
          ? order.date
          : "Recently";

        const totalAmt = typeof order.totalAmount === "number" ? order.totalAmount : order.amount || 0;

        return (
          <div
            key={order.id || order.orderId || order._id}
            className="rounded-3xl bg-white border border-[#C8DFC8] shadow-[0_2px_12px_rgba(26,48,32,0.06)] overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            {/* Header row */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${T.success}10` }}
                >
                  <Package className="w-6 h-6" style={{ color: T.success }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-extrabold text-base text-[#1A3020]">
                      {isRealOrder
                        ? `Order #${orderIdStr}`
                        : order.crop || `Order #${orderIdStr}`}
                    </p>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#F0F7F0] text-[#6B8F6E]"
                    >
                      {statusKey}
                    </span>
                  </div>

                  <p className="text-sm mt-1 text-[#3D5C42]">
                    {isRealOrder ? (
                      <span>
                        {itemsList.length} {itemsList.length === 1 ? "item" : "items"} for you
                        {order.deliveryAddress?.fullName
                          ? ` · ${order.deliveryAddress.fullName}`
                          : ""}
                      </span>
                    ) : (
                      `${order.weight} · ${order.buyer}`
                    )}
                  </p>

                  <p className="text-xs mt-0.5 text-[#6B8F6E] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#8FAF9A]" />
                    {dateFormatted}
                  </p>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <p className="text-xs font-bold text-[#6B8F6E] uppercase">Your Share</p>
                  <p className="font-extrabold text-lg text-[#1A3020]">
                    {fmt(totalAmt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${sc.bg} ${sc.text}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusKey}
                  </span>

                  {isRealOrder && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : (order.id || order.orderId))}
                      className="w-8 h-8 rounded-full bg-[#F0F7F0] hover:bg-[#E4EEE4] text-[#1A3020] flex items-center justify-center transition-colors"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Item Breakdown & Customer Address Details (If expanded) */}
            {isExpanded && isRealOrder && (
              <div className="px-5 pb-5 pt-3 border-t border-[#F0F7F0] bg-[#F9FBF9] space-y-4">
                {/* Farmer's Items in this order */}
                <div>
                  <p className="text-xs font-bold text-[#6B8F6E] uppercase tracking-wider mb-2">
                    Your Products in this Order:
                  </p>
                  <div className="space-y-2">
                    {itemsList.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-xl border border-[#E8F0E8] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover bg-[#F0F7F0]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#F0F7F0] flex items-center justify-center text-[#3E7B27]">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-[#1A3020]">{item.name || `Product ID: ${item.productId.slice(-6)}`}</p>
                            <p className="text-[#6B8F6E]">
                              {fmt(item.unitPrice)} / {item.unit || "kg"} × {item.quantity}
                            </p>
                          </div>
                        </div>

                        <span className="font-extrabold text-[#1A3020]">
                          {fmt(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery details if available */}
                {order.deliveryAddress && (
                  <div className="bg-white p-3.5 rounded-xl border border-[#E8F0E8] text-xs space-y-1 text-[#1A3020]">
                    <p className="font-bold text-[#6B8F6E] uppercase text-[0.7rem]">
                      Delivery Address & Contact:
                    </p>
                    <p className="font-bold flex items-center gap-1.5 pt-1">
                      <User className="w-3.5 h-3.5 text-[#3E7B27]" />
                      {order.deliveryAddress.fullName}
                    </p>
                    <p className="flex items-center gap-1.5 text-[#4A6355]">
                      <Phone className="w-3.5 h-3.5 text-[#3E7B27]" />
                      {order.deliveryAddress.phone}
                    </p>
                    <p className="flex items-center gap-1.5 text-[#4A6355]">
                      <MapPin className="w-3.5 h-3.5 text-[#3E7B27]" />
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}{" "}
                      {order.deliveryAddress.postalCode}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
