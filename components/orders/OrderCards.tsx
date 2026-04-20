"use client";

import { Package, CheckCircle2, Loader2, RefreshCw, AlertCircle } from "lucide-react";

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

interface OrderCardsProps {
  orders: Order[];
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
  { bg: string; text: string; icon: typeof CheckCircle2 }
> = {
  Ready: { bg: "bg-[#E6F4E6]", text: "text-[#2A6B1E]", icon: CheckCircle2 },
  Processing: { bg: "bg-[#FEF3CD]", text: "text-[#7D5A00]", icon: Loader2 },
  Harvesting: { bg: "bg-[#E8F0FF]", text: "text-[#2C4DA0]", icon: RefreshCw },
  Cancelled: { bg: "bg-[#FEE8E8]", text: "text-[#8B1C1C]", icon: AlertCircle },
};

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function OrderCards({ orders }: OrderCardsProps) {
  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const sc = STATUS_CFG[order.status];
        const StatusIcon = sc.icon;
        return (
          <div
            key={order.id}
            className="rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: T.cardBg,
              border: `1.5px solid ${T.border}`,
              boxShadow: "0 2px 12px rgba(26,48,32,0.06)",
            }}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${T.success}10` }}
              >
                <Package className="w-6 h-6" style={{ color: T.success }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className="font-extrabold text-base"
                    style={{ color: T.textDark }}
                  >
                    {order.crop}
                  </p>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-lg"
                    style={{ background: T.bg, color: T.textLight }}
                  >
                    {order.id}
                  </span>
                </div>
                <p className="text-sm mt-0.5" style={{ color: T.textMid }}>
                  {order.weight} · {order.buyer}
                </p>
                <p className="text-xs mt-0.5" style={{ color: T.textLight }}>
                  {new Date(order.date).toLocaleDateString("en-LK", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <p
                className="font-extrabold text-lg"
                style={{ color: T.textDark }}
              >
                Rs.&nbsp;{order.amount.toLocaleString()}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold min-h-[36px]",
                  sc.bg,
                  sc.text
                )}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {order.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
