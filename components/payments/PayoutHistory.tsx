"use client";

import { Wallet } from "lucide-react";

interface PayoutItem {
  month: string;
  amount: number;
  isPending?: boolean;
}

interface PayoutHistoryProps {
  payouts: PayoutItem[];
}

const T = {
  cardBg: "#FFFFFF",
  border: "#C8DFC8",
  success: "#3E7B27",
  gold: "#F2B441",
  textDark: "#1A3020",
  textLight: "#6B8F6E",
  bg: "#F0F7F0",
} as const;

export default function PayoutHistory({ payouts }: PayoutHistoryProps) {
  const sortedPayouts = [...payouts].reverse();

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
          Payout History
        </h2>
      </div>
      {sortedPayouts.map((payout, i) => (
        <div
          key={payout.month}
          className="px-6 py-4 flex items-center justify-between border-b last:border-0 transition-colors duration-150"
          style={{ borderColor: `${T.border}50` }}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: payout.isPending ? `${T.gold}15` : `${T.success}10`,
              }}
            >
              <Wallet
                className="w-4 h-4"
                style={{
                  color: payout.isPending ? T.gold : T.success,
                }}
              />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: T.textDark }}>
                {payout.month} 2026 Payout
              </p>
              <p className="text-xs" style={{ color: T.textLight }}>
                {payout.isPending ? "Pending" : "Completed"}
              </p>
            </div>
          </div>
          <p
            className="font-extrabold text-sm"
            style={{
              color: payout.isPending ? T.gold : T.textDark,
            }}
          >
            Rs.&nbsp;{payout.amount.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
