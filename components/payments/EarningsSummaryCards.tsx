"use client";

import { TrendingUp } from "lucide-react";

interface EarningsCard {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  color: string;
}

interface EarningsSummaryCardsProps {
  cards: EarningsCard[];
}

const T = {
  cardBg: "#FFFFFF",
  border: "#C8DFC8",
  textDark: "#1A3020",
  textLight: "#6B8F6E",
  gold: "#F2B441",
} as const;

export default function EarningsSummaryCards({ cards }: EarningsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="rounded-3xl p-6 sm:p-7 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300"
            style={{
              background: T.cardBg,
              border: `1.5px solid ${T.border}`,
              boxShadow: "0 6px 24px rgba(26,48,32,0.08)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${card.color}15` }}
            >
              <Icon className="w-7 h-7" style={{ color: card.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold tracking-wide uppercase" style={{ color: T.textLight }}>
                {card.label}
              </p>
              <p
                className="font-black text-2xl sm:text-3xl leading-tight mt-1 truncate"
                style={{
                  color: card.color === T.gold ? T.gold : T.textDark,
                }}
              >
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
