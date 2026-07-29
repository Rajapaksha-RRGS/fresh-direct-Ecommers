"use client";

import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="rounded-3xl p-6 sm:p-7 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300 cursor-default relative overflow-hidden"
            style={{
              background: T.cardBg,
              border: `1.5px solid ${T.border}`,
              boxShadow: "0 6px 24px rgba(26,48,32,0.08)",
            }}
          >
            {card.badge && (
              <span
                className="absolute top-5 right-5 text-xs font-extrabold px-3 py-1 rounded-full text-white tracking-wider"
                style={{ background: "#2C4DA0" }}
              >
                {card.badge}
              </span>
            )}

            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: `${card.accent}18` }}
            >
              <Icon className="w-7 h-7" style={{ color: card.accent }} />
            </div>

            <div>
              <p
                className="font-black text-3xl sm:text-4xl leading-tight"
                style={{
                  color:
                    card.accent === T.gold ? T.gold : T.textDark,
                }}
              >
                {card.value}
              </p>
              <p className="text-base font-extrabold mt-1" style={{ color: T.textMid }}>
                {card.label}
              </p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: T.textLight }}>
                {card.sublabel}
              </p>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              {card.positive === true && (
                <ArrowUpRight className="w-4 h-4" style={{ color: T.success }} />
              )}
              {card.positive === false && (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className="text-sm font-bold"
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
