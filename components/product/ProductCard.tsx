"use client";

import Link from "next/link";

// ─── Types matching the Product Mongoose model ────────────────────────────────
export interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  currentPrice: number;       // Dynamic price adjusted by demandFactor
  basePrice: number;
  demandFactor?: number;      // > 1 = high demand, < 1 = low demand
  unit: string;
  image: string;
  harvestDate: string;        // ISO date string
  farmerId: string;
  farmerName: string;
  farmLocation: string;
  stockQty: number;
  isOrganic?: boolean;
}

function getDemandBadge(factor?: number) {
  if (!factor) return null;
  if (factor >= 1.3) return { label: "🔥 High Demand", color: "#FF6B35", bg: "#FFF0EA" };
  if (factor <= 0.8) return { label: "💚 Great Deal", color: "#2D6A4F", bg: "#D8F3DC" };
  return null;
}

function formatHarvestDate(isoDate: string) {
  const d = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 24) return `Harvested ${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `Harvested ${diffD} day${diffD !== 1 ? "s" : ""} ago`;
}

export default function ProductCard({
  id, name, category, currentPrice, basePrice, demandFactor,
  unit, image, harvestDate, farmerId, farmerName, farmLocation,
  stockQty, isOrganic,
}: ProductCardProps) {
  const demandBadge = getDemandBadge(demandFactor);
  const priceChanged = currentPrice !== basePrice;
  const priceUp = currentPrice > basePrice;

  return (
    <article
      id={`product-card-${id}`}
      style={{
        background: "var(--color-white)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
        border: "1px solid var(--color-border)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
      }}
    >
      {/* Image Section */}
      <div style={{ position: "relative", height: "200px", backgroundColor: "var(--color-mint-light)", overflow: "hidden" }}>
        <img
          src={image}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        {/* Badges */}
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px", flexDirection: "column" }}>
          {isOrganic && (
            <span style={{ background: "#2D6A4F", color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "50px", letterSpacing: "0.05em" }}>
              🌿 ORGANIC
            </span>
          )}
          {demandBadge && (
            <span style={{ background: demandBadge.bg, color: demandBadge.color, fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "50px" }}>
              {demandBadge.label}
            </span>
          )}
        </div>

        {/* Stock Warning */}
        {stockQty <= 5 && stockQty > 0 && (
          <span style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(255,107,53,0.9)", color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "50px" }}>
            Only {stockQty} left!
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.7rem", flex: 1 }}>
        {/* Category + Harvest */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-mid)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {category}
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--color-text-light)", display: "flex", alignItems: "center", gap: "4px" }}>
            🕐 {formatHarvestDate(harvestDate)}
          </span>
        </div>

        {/* Product Name */}
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text-dark)", lineHeight: 1.3 }}>
          {name}
        </h3>

        {/* Farmer Info — Links to FarmerProfile */}
        <Link
          href={`/farmers/${farmerId}`}
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "var(--color-mint)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>
            👨‍🌾
          </div>
          <div>
            <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-forest)", margin: 0 }}>{farmerName}</p>
            <p style={{ fontSize: "0.7rem", color: "var(--color-text-light)", margin: 0 }}>📍 {farmLocation}</p>
          </div>
        </Link>

        {/* Dynamic Price */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", marginTop: "auto" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 800, color: "var(--color-forest)" }}>
            Rs. {currentPrice.toFixed(2)}
          </span>
          <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)", marginBottom: "2px" }}>/ {unit}</span>
          {priceChanged && (
            <span style={{ fontSize: "0.72rem", color: priceUp ? "#FF6B35" : "#2D6A4F", background: priceUp ? "#FFF0EA" : "#D8F3DC", padding: "2px 8px", borderRadius: "50px", fontWeight: 700, marginBottom: "2px" }}>
              {priceUp ? "▲" : "▼"} vs base
            </span>
          )}
        </div>

        {/* Add to Cart CTA */}
        <button
          id={`add-to-cart-${id}`}
          style={{
            width: "100%",
            padding: "0.7rem",
            background: "linear-gradient(135deg, var(--color-forest), #52B788)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.25s ease",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(45,106,79,0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          Add to Cart 🛒
        </button>
      </div>
    </article>
  );
}
