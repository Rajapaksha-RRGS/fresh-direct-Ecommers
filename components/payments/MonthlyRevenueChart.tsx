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
  const maxEarning = Math.max(...earnings.map((e) => e.amount));

  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background: T.cardBg,
        border: `1.5px solid ${T.border}`,
        boxShadow: "0 4px 20px rgba(26,48,32,0.07)",
      }}
    >
      <h2
        className="font-extrabold text-base mb-5"
        style={{
          color: T.textDark,
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Monthly Revenue
      </h2>
      <div className="flex items-end gap-3 h-40">
        {earnings.map((e, i) => {
          const pct = (e.amount / maxEarning) * 100;
          const isLast = i === earnings.length - 1;
          return (
            <div key={e.month} className="flex-1 flex flex-col items-center gap-2">
              {isLast && (
                <p className="text-xs font-bold" style={{ color: T.textMid }}>
                  Rs.{(e.amount / 1000).toFixed(0)}k
                </p>
              )}
              <div
                className="w-full flex items-end justify-center"
                style={{ height: "80px" }}
              >
                <div
                  className="w-full rounded-xl transition-all duration-500"
                  style={{
                    height: `${pct}%`,
                    background: isLast
                      ? `linear-gradient(180deg, ${T.gold}, ${T.gold}80)`
                      : `linear-gradient(180deg, ${T.success}, ${T.success}60)`,
                    minHeight: "8px",
                  }}
                />
              </div>
              <p className="text-[11px] font-semibold" style={{ color: T.textLight }}>
                {e.month}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
