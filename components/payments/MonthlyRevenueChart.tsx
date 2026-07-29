"use client";

interface EarningData {
  month: string;
  amount: number;
}

interface MonthlyRevenueChartProps {
  earnings: EarningData[];
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

export default function MonthlyRevenueChart({ earnings }: MonthlyRevenueChartProps) {
  const maxEarning = Math.max(...earnings.map((e) => e.amount), 1);

  return (
    <div
      className="rounded-3xl p-6 sm:p-8"
      style={{
        background: T.cardBg,
        border: `1.5px solid ${T.border}`,
        boxShadow: "0 6px 24px rgba(26,48,32,0.08)",
      }}
    >
      <h2
        className="font-extrabold text-xl sm:text-2xl mb-6"
        style={{
          color: T.textDark,
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Monthly Revenue Overview
      </h2>

      <div className="flex items-end gap-4 h-56 sm:h-64 pt-4">
        {earnings.map((e, i) => {
          const pct = (e.amount / maxEarning) * 100;
          const isLast = i === earnings.length - 1;
          return (
            <div key={e.month} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
              <p className="text-xs sm:text-sm font-bold text-[#1A3020]">
                {e.amount > 0 ? `Rs. ${(e.amount / 1000).toFixed(0)}k` : "Rs. 0"}
              </p>
              <div
                className="w-full flex items-end justify-center max-w-[64px]"
                style={{ height: "180px" }}
              >
                <div
                  className="w-full rounded-2xl transition-all duration-500 hover:brightness-110"
                  style={{
                    height: `${Math.max(pct, 6)}%`,
                    background: isLast
                      ? `linear-gradient(180deg, ${T.gold}, ${T.gold}80)`
                      : `linear-gradient(180deg, ${T.success}, ${T.success}70)`,
                  }}
                />
              </div>
              <p className="text-sm font-bold uppercase tracking-wider" style={{ color: T.textLight }}>
                {e.month}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
