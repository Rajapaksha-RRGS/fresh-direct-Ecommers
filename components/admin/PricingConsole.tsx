"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { AT } from "@/constants/adminData";
import type { PricingRow, DemandLevel } from "@/types/admin";

// ─── Helper ───────────────────────────────────────────────────────────────────
const cn = (...c: (string | boolean | undefined | null)[]) =>
  c.filter(Boolean).join(" ");

const formatLKR = (n: number) =>
  new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(n);

// ─── Demand badge config ───────────────────────────────────────────────────────
const DEMAND_CFG: Record<
  DemandLevel,
  { bg: string; text: string; dot: string; label: string }
> = {
  High: {
    bg: "#FEE2E2",
    text: "#991B1B",
    dot: "#EF4444",
    label: "High Demand",
  },
  Medium: {
    bg: "#FEF3C7",
    text: "#92400E",
    dot: "#F59E0B",
    label: "Steady",
  },
  Low: {
    bg: "#DBEAFE",
    text: "#1E40AF",
    dot: "#3B82F6",
    label: "Low Demand",
  },
};

// ─── Supply Progress Bar ───────────────────────────────────────────────────────
function SupplyBar({ pct, qty, unit }: { pct: number; qty: number; unit: string }) {
  // Color: green when high stock, amber when medium, red when low
  const barColor =
    pct >= 60
      ? "linear-gradient(90deg, #3E7B27, #5AA832)"
      : pct >= 30
      ? "linear-gradient(90deg, #D97706, #F59E0B)"
      : "linear-gradient(90deg, #DC2626, #F87171)";

  return (
    <div className="flex flex-col gap-1 min-w-[90px]">
      {/* Track */}
      <div
        className="relative w-full h-2 rounded-full overflow-hidden"
        style={{ background: "#E5E7EB" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      {/* Labels */}
      <div className="flex justify-between items-center">
        <span
          className="text-[0.68rem] font-bold tabular-nums"
          style={{ color: AT.textDark }}
        >
          {qty} {unit}
        </span>
        <span
          className="text-[0.65rem] font-semibold"
          style={{ color: pct >= 60 ? "#3E7B27" : pct >= 30 ? "#D97706" : "#DC2626" }}
        >
          {pct}%
        </span>
      </div>
    </div>
  );
}

// ─── Demand Badge ─────────────────────────────────────────────────────────────
function DemandBadge({ level }: { level: DemandLevel }) {
  const cfg = DEMAND_CFG[level];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[0.73rem] font-bold px-2.5 py-1.5 rounded-xl select-none"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {/* Pulsing dot */}
      <span
        className="relative flex h-2 w-2 flex-shrink-0"
      >
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ background: cfg.dot }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ background: cfg.dot }}
        />
      </span>
      {cfg.label}
    </span>
  );
}

// ─── Price Cell ───────────────────────────────────────────────────────────────
function PriceCell({ row }: { row: PricingRow }) {
  const delta = row.dynamicPrice - row.basePrice;
  const increased = delta > 0;
  const decreased = delta < 0;
  const neutral  = delta === 0;

  return (
    <div className="flex flex-col items-end gap-0.5">
      {/* Strike-through base price */}
      <span
        className="text-[0.72rem] line-through"
        style={{ color: AT.textLight }}
      >
        {formatLKR(row.basePrice)}
      </span>

      {/* Dynamic price + trend arrow in one row */}
      <div className="flex items-center gap-1.5">
        {!neutral && (
          <span
            className="text-[0.9rem] font-extrabold leading-none"
            style={{ color: increased ? "#B91C1C" : "#16A34A" }}
          >
            {increased ? "▲" : "▼"}
          </span>
        )}
        <span
          className="font-extrabold text-[1rem]"
          style={{
            color: neutral ? AT.textDark : increased ? "#B91C1C" : "#16A34A",
          }}
        >
          {formatLKR(row.dynamicPrice)}
        </span>
      </div>

      {/* % change pill */}
      {!neutral && (
        <span
          className="text-[0.65rem] font-bold px-2 py-0.5 rounded-lg"
          style={{
            background: increased ? "#FEE2E2" : "#DCFCE7",
            color:      increased ? "#991B1B" : "#166534",
          }}
        >
          {increased ? "+" : ""}
          {(((row.dynamicPrice - row.basePrice) / row.basePrice) * 100).toFixed(
            1
          )}
          %
        </span>
      )}
    </div>
  );
}

// ─── Component props ──────────────────────────────────────────────────────────
interface PricingConsoleProps {
  rows: PricingRow[];
  onRefresh?: () => void | Promise<void>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PricingConsole({
  rows: initial,
  onRefresh,
}: PricingConsoleProps) {
  const [rows] = useState<PricingRow[]>(initial);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      // Minimum 600 ms so the spin animation is visible
      await new Promise((r) => setTimeout(r, 600));
      setRefreshing(false);
    }
  };

  if (!rows.length) {
    return (
      <p className="text-sm py-6 text-center" style={{ color: AT.textLight }}>
        No approved products found.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {/* ── Table header ────────────────────────────────────────────────── */}
      <div
        className="hidden md:grid grid-cols-[2fr_1fr_1.4fr_1.2fr_1.2fr] gap-4 px-5 py-3 rounded-2xl mb-2 text-[0.72rem] font-bold uppercase tracking-wide"
        style={{ background: AT.bg, color: AT.textLight }}
      >
        <span>Product</span>
        <span>Base Price</span>
        <span>Supply</span>
        <span>Demand</span>
        <span className="text-right">Dynamic Price</span>
      </div>

      {/* ── Rows ────────────────────────────────────────────────────────── */}
      {rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1.4fr_1.2fr_1.2fr] gap-3 md:gap-4 items-center px-5 py-4 rounded-3xl border mb-2 hover:shadow-[0_4px_16px_rgba(26,48,32,0.09)] transition-all duration-200"
          style={{ borderColor: AT.border, background: AT.cardBg }}
        >
          {/* Name + category */}
          <div>
            <p
              className="font-bold text-[0.9rem]"
              style={{ color: AT.textDark }}
            >
              {row.name}
            </p>
            <p
              className="text-[0.72rem] capitalize"
              style={{ color: AT.textLight }}
            >
              {row.category} · per {row.unit}
            </p>
          </div>

          {/* Base price (plain reference) */}
          <div>
            <span
              className="text-[0.78rem] font-semibold md:hidden mr-1"
              style={{ color: AT.textLight }}
            >
              Base:
            </span>
            <span
              className="font-semibold text-[0.88rem]"
              style={{ color: AT.textMid }}
            >
              {formatLKR(row.basePrice)}
            </span>
          </div>

          {/* Supply progress bar */}
          <div>
            <span
              className="text-[0.78rem] font-semibold md:hidden mr-1 mb-1 block"
              style={{ color: AT.textLight }}
            >
              Supply:
            </span>
            <SupplyBar
              pct={row.supplyPct}
              qty={row.supply}
              unit={row.unit}
            />
          </div>

          {/* Demand badge */}
          <div>
            <DemandBadge level={row.demand} />
          </div>

          {/* Dynamic price cell */}
          <div className="md:flex md:justify-end">
            <PriceCell row={row} />
          </div>
        </div>
      ))}

      {/* ── Refresh button ───────────────────────────────────────────────── */}
      <div className="flex justify-end mt-2">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-[0.8rem] font-bold px-4 py-2.5 rounded-2xl border transition-all duration-200 hover:opacity-80 disabled:opacity-50"
          style={{
            borderColor: AT.border,
            color: AT.textMid,
            background: AT.bg,
          }}
        >
          <RefreshCw
            className={cn("w-3.5 h-3.5", refreshing && "animate-spin")}
          />
          {refreshing ? "Recalculating…" : "Refresh Prices"}
        </button>
      </div>
    </div>
  );
}
