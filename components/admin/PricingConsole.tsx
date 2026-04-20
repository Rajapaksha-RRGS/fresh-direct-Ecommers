"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { AT } from "@/constants/adminData";
import type { PricingRow, DemandLevel } from "@/types/admin";

const cn = (...c: (string | boolean | undefined | null)[]) => c.filter(Boolean).join(" ");

// ─── Demand config ────────────────────────────────────────────────────────────
const DEMAND_CFG: Record<DemandLevel, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
  High:   { bg: "#FDECEA", text: "#B91C1C", label: "High Demand",   icon: <TrendingUp  className="w-3.5 h-3.5" /> },
  Medium: { bg: "#FEF3CD", text: "#854D0E", label: "Steady",        icon: <Minus       className="w-3.5 h-3.5" /> },
  Low:    { bg: "#E6F4E6", text: "#1A5C1A", label: "Low Demand",    icon: <TrendingDown className="w-3.5 h-3.5" /> },
};

interface PricingConsoleProps {
  rows: PricingRow[];
}

export default function PricingConsole({ rows: initial }: PricingConsoleProps) {
  const [rows, setRows] = useState<PricingRow[]>(initial);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    // In production: refetch from /api/admin/pricing
    setRefreshing(false);
  };

  const formatLKR = (n: number) =>
    new Intl.NumberFormat("si-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(n);

  const priceDelta = (row: PricingRow) => {
    const pct = ((row.dynamicPrice - row.basePrice) / row.basePrice) * 100;
    return { pct: Math.abs(pct).toFixed(0), up: pct >= 0, zero: pct === 0 };
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Table header */}
      <div
        className="hidden md:grid grid-cols-[2fr_1fr_1fr_1.2fr_1fr] gap-4 px-5 py-3 rounded-2xl mb-2 text-[0.72rem] font-bold uppercase tracking-wide"
        style={{ background: AT.bg, color: AT.textLight }}
      >
        <span>Product</span>
        <span>Base Price</span>
        <span>Supply (kg)</span>
        <span>Demand</span>
        <span className="text-right">Dynamic Price</span>
      </div>

      {/* Rows */}
      {rows.map((row) => {
        const d = DEMAND_CFG[row.demand];
        const { pct, up, zero } = priceDelta(row);

        return (
          <div
            key={row.id}
            className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.2fr_1fr] gap-3 md:gap-4 items-center px-5 py-4 rounded-3xl border mb-2 hover:shadow-[0_4px_16px_rgba(26,48,32,0.09)] transition-all duration-200"
            style={{ borderColor: AT.border, background: AT.cardBg }}
          >
            {/* Name */}
            <div>
              <p className="font-bold text-[0.9rem]" style={{ color: AT.textDark }}>
                {row.name}
              </p>
              <p className="text-[0.72rem] capitalize" style={{ color: AT.textLight }}>
                {row.category} · per {row.unit}
              </p>
            </div>

            {/* Base price */}
            <div>
              <span className="text-[0.78rem] font-semibold md:hidden mr-1" style={{ color: AT.textLight }}>Base:</span>
              <span className="font-bold text-[0.9rem]" style={{ color: AT.textMid }}>
                {formatLKR(row.basePrice)}
              </span>
            </div>

            {/* Supply */}
            <div>
              <span className="text-[0.78rem] font-semibold md:hidden mr-1" style={{ color: AT.textLight }}>Supply:</span>
              <span
                className="text-[0.82rem] font-bold px-2.5 py-1 rounded-xl"
                style={{ background: AT.bg, color: AT.textDark }}
              >
                {row.supply} {row.unit}
              </span>
            </div>

            {/* Demand badge */}
            <div>
              <span
                className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold px-3 py-1.5 rounded-xl"
                style={{ background: d.bg, color: d.text }}
              >
                {d.icon}
                {d.label}
              </span>
            </div>

            {/* Dynamic price */}
            <div className="md:text-right flex md:flex-col items-center md:items-end gap-2">
              <span
                className="font-extrabold text-[1rem]"
                style={{ color: zero ? AT.textDark : up ? "#B91C1C" : AT.success }}
              >
                {formatLKR(row.dynamicPrice)}
              </span>
              {!zero && (
                <span
                  className={cn(
                    "text-[0.68rem] font-bold px-2 py-0.5 rounded-lg",
                  )}
                  style={{ background: up ? "#FDECEA" : "#E6F4E6", color: up ? "#B91C1C" : "#1A5C1A" }}
                >
                  {up ? "▲" : "▼"} {pct}%
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Refresh */}
      <div className="flex justify-end mt-2">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-[0.8rem] font-bold px-4 py-2.5 rounded-2xl border transition-all duration-200 hover:opacity-80"
          style={{ borderColor: AT.border, color: AT.textMid, background: AT.bg }}
        >
          <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
          {refreshing ? "Recalculating…" : "Refresh Prices"}
        </button>
      </div>
    </div>
  );
}
