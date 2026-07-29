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

function fmt(n: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function PayoutHistory({ payouts }: PayoutHistoryProps) {
  const sortedPayouts = [...payouts].reverse();

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: T.cardBg,
        border: `1.5px solid ${T.border}`,
        boxShadow: "0 6px 24px rgba(26,48,32,0.08)",
      }}
    >
      <div className="px-6 sm:px-8 py-5 border-b" style={{ borderColor: T.border }}>
        <h2
          className="font-extrabold text-xl sm:text-2xl"
          style={{
            color: T.textDark,
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Payout History
        </h2>
      </div>

      <div className="divide-y" style={{ borderColor: `${T.border}60` }}>
        {sortedPayouts.map((payout, i) => (
          <div
            key={payout.month + i}
            className="px-6 sm:px-8 py-5 flex items-center justify-between transition-colors duration-150"
            onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: payout.isPending ? `${T.gold}20` : `${T.success}15`,
                }}
              >
                <Wallet
                  className="w-6 h-6"
                  style={{
                    color: payout.isPending ? T.gold : T.success,
                  }}
                />
              </div>
              <div>
                <p className="font-extrabold text-base sm:text-lg" style={{ color: T.textDark }}>
                  {payout.month} 2026 Monthly Payout
                </p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: T.textLight }}>
                  Status: {payout.isPending ? "⏳ Pending Dispatch" : "✅ Completed & Transferred"}
                </p>
              </div>
            </div>

            <p
              className="font-black text-lg sm:text-2xl"
              style={{
                color: payout.isPending ? T.gold : T.textDark,
              }}
            >
              {fmt(payout.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
