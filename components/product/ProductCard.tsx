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
  if (factor >= 1.3) return { label: "🔥 High Demand", color: "text-[#FF6B35]", bg: "bg-[#FFF0EA]" };
  if (factor <= 0.8) return { label: "💚 Great Deal", color: "text-[#2D6A4F]", bg: "bg-[#D8F3DC]" };
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
      className="group bg-white rounded-[22px] overflow-hidden shadow-[0_4px_20px_rgba(45,106,79,0.06)] border border-[#D0EDD8] transition-all duration-300 flex flex-col hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(45,106,79,0.16)]"
    >
      {/* Image Section */}
      <div className="relative h-[210px] bg-[#F0FBF1] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-col">
          {isOrganic && (
            <span className="bg-[#2D6A4F] text-white text-[0.7rem] font-bold px-3 py-1 rounded-full tracking-[0.05em] shadow-sm">
              🌿 ORGANIC
            </span>
          )}
          {demandBadge && (
            <span className={`${demandBadge.bg} ${demandBadge.color} text-[0.7rem] font-bold px-3 py-1 rounded-full shadow-sm`}>
              {demandBadge.label}
            </span>
          )}
        </div>

        {/* Stock Warning */}
        {stockQty <= 5 && stockQty > 0 && (
          <span className="absolute bottom-3 right-3 bg-[rgba(255,107,53,0.92)] backdrop-blur-sm text-white text-[0.72rem] font-bold px-3 py-1 rounded-full shadow-sm">
            Only {stockQty} left!
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-3.5 flex-1">
        {/* Category + Harvest */}
        <div className="flex justify-between items-center">
          <span className="text-[0.72rem] font-semibold text-[#2D6A4F] uppercase tracking-[0.1em] bg-[#F0FBF1] px-2.5 py-0.5 rounded-md">
            {category}
          </span>
          <span className="text-[0.72rem] text-[#8FAF9A] flex items-center gap-1">
            🕐 {formatHarvestDate(harvestDate)}
          </span>
        </div>

        {/* Product Name */}
        <h3
          className="text-[1.15rem] font-bold text-[#1A2E22] leading-snug m-0"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {name}
        </h3>

        {/* Farmer Info — Links to FarmerProfile */}
        <Link
          href={`/farmers/${farmerId}`}
          className="no-underline flex items-center gap-2 group/farmer"
        >
          <div className="w-[24px] h-[24px] rounded-full bg-[#D8F3DC] flex items-center justify-center text-[0.75rem] flex-shrink-0">
            👨‍🌾
          </div>
          <div>
            <p className="text-[0.8rem] font-semibold text-[#2D6A4F] m-0 group-hover/farmer:text-[#1B4332] transition-colors">{farmerName}</p>
            <p className="text-[0.72rem] text-[#8FAF9A] m-0">📍 {farmLocation}</p>
          </div>
        </Link>

        {/* Dynamic Price */}
        <div className="flex items-end gap-2 mt-auto pt-2">
          <span
            className="text-[1.45rem] font-extrabold text-[#2D6A4F]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Rs. {currentPrice.toFixed(2)}
          </span>
          <span className="text-[0.8rem] text-[#8FAF9A] mb-0.5">/ {unit}</span>
          {priceChanged && (
            <span
              className={`text-[0.72rem] font-bold px-2 py-0.5 rounded-full mb-0.5 ${
                priceUp
                  ? "text-[#FF6B35] bg-[#FFF0EA]"
                  : "text-[#2D6A4F] bg-[#D8F3DC]"
              }`}
            >
              {priceUp ? "▲" : "▼"} vs base
            </span>
          )}
        </div>

        {/* Add to Cart CTA */}
        <button
          id={`add-to-cart-${id}`}
          className="w-full py-3.5 bg-gradient-to-r from-[#2D6A4F] to-[#52B788] text-white border-none rounded-xl font-bold text-[0.9rem] cursor-pointer transition-all duration-300 tracking-[0.02em] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.35)] active:translate-y-0"
        >
          Add to Cart 🛒
        </button>
      </div>
    </article>
  );
}
