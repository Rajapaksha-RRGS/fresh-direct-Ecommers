"use client";

import { TrendingUp, Wallet, Clock } from "lucide-react";

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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="rounded-3xl p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300"
            style={{
              background: T.cardBg,
              border: `1.5px solid ${T.border}`,
              boxShadow: "0 4px 20px rgba(26,48,32,0.07)",
            }}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${card.color}12` }}
            >
              <Icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: T.textLight }}>
                {card.label}
              </p>
              <p
                className="font-extrabold text-lg leading-tight mt-0.5"
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
