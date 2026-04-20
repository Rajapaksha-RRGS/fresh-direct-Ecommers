"use client";

interface StockItem {
  id: string;
  crop: string;
  stock: number;
  unit: string;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface CurrentStockListProps {
  items: StockItem[];
}

const T = {
  cardBg: "#FFFFFF",
  border: "#C8DFC8",
  success: "#3E7B27",
  gold: "#F2B441",
  textDark: "#1A3020",
  textMid: "#3D5C42",
  textLight: "#6B8F6E",
  bg: "#F0F7F0",
} as const;

export default function CurrentStockList({ items }: CurrentStockListProps) {
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
          Current Stock
        </h2>
      </div>
      <div className="divide-y" style={{ borderColor: T.border }}>
        {items.map((item) => {
          const col =
            item.status === "In Stock"
              ? T.success
              : item.status === "Low Stock"
                ? T.gold
                : "#DC2626";
          const bg =
            item.status === "In Stock"
              ? `${T.success}10`
              : item.status === "Low Stock"
                ? `${T.gold}12`
                : "#FEECEC";

          return (
            <div
              key={item.id}
              className="px-5 py-4 flex items-center justify-between gap-4 transition-colors duration-150"
              onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: T.textDark }}>
                  {item.crop}
                </p>
                <p className="text-xs mt-0.5" style={{ color: T.textLight }}>
                  Rs. {item.price}/{item.unit}
                </p>
              </div>
              <p
                className="font-extrabold text-sm whitespace-nowrap"
                style={{ color: T.textMid }}
              >
                {item.stock} {item.unit}
              </p>
              <span
                className="text-[11px] font-bold px-3 py-1 rounded-lg whitespace-nowrap"
                style={{ background: bg, color: col }}
              >
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
