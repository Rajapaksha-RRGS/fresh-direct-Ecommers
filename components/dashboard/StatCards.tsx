"use client";

import { TrendingUp, ShoppingBag, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCard {
  label: string;
  sublabel: string;
  value: string;
  change: string;
  positive: boolean | null;
  icon: typeof TrendingUp;
  accent: string;
  badge: string | null;
}

interface StatCardsProps {
  cards: StatCard[];
}

const T = {
  cardBg: "#FFFFFF",
  border: "#C8DFC8",
  success: "#3E7B27",
  gold: "#F2B441",
  textDark: "#1A3020",
  textMid: "#3D5C42",
  textLight: "#6B8F6E",
} as const;

export default function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="rounded-3xl p-5 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300 cursor-default relative overflow-hidden"
            style={{
              background: T.cardBg,
              border: `1.5px solid ${T.border}`,
              boxShadow: "0 4px 20px rgba(26,48,32,0.07)",
            }}
          >
            {card.badge && (
              <span
                className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: "#2C4DA0" }}
              >
                {card.badge}
              </span>
            )}

            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: `${card.accent}18` }}
            >
              <Icon className="w-5 h-5" style={{ color: card.accent }} />
            </div>

            <div>
              <p
                className="font-extrabold text-2xl leading-tight"
                style={{
                  color:
                    card.accent === T.gold ? T.gold : T.textDark,
                }}
              >
                {card.value}
              </p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: T.textMid }}>
                {card.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: T.textLight }}>
                {card.sublabel}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {card.positive === true && (
                <ArrowUpRight className="w-3.5 h-3.5" style={{ color: T.success }} />
              )}
              {card.positive === false && (
                <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
              )}
              <span
                className="text-xs font-semibold"
                style={{
                  color:
                    card.positive === true
                      ? T.success
                      : card.positive === false
                        ? "#DC2626"
                        : T.gold,
                }}
              >
                {card.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
