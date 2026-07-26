"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShoppingCart, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

// ─── Types matching the Product Mongoose model ────────────────────────────────
export interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  currentPrice: number;       // Dynamic price adjusted by demandFactor
  basePrice: number;
  demandFactor?: number;      // > 1 = high demand, < 1 = low demand
  demandScore?: number;       // alt. demand signal (views/interactions) — shows 🔥 HOT if > 10
  unit: string;
  image: string;
  harvestDate?: string;       // ISO date string — line hidden if not provided
  farmerId: string;
  farmerName: string;
  farmLocation?: string;      // line hidden if not provided
  stockQty: number;
  isOrganic?: boolean;
  onView?: (id: string) => void; // optional demand/view tracking callback
}

function getDemandBadge(factor?: number) {
  if (!factor) return null;
  if (factor >= 1.3) return { label: "🔥 High Demand", color: "text-[#FF6B35]", bg: "bg-[#FFF0EA]" };
  if (factor <= 0.8) return { label: "💚 Great Deal", color: "text-[#2D6A4F]", bg: "bg-[#D8F3DC]" };
  return null;
}

export default function ProductCard({
  id, name, category, currentPrice, basePrice, demandFactor, demandScore,
  unit, image, farmerId, farmerName,
  stockQty, isOrganic, onView,
}: ProductCardProps) {
  const { addItem, openDrawer } = useCartStore();
  const [adding, setAdding] = useState(false);
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const demandBadge = getDemandBadge(demandFactor);
  const isHot = (demandScore ?? 0) > 10;
  const priceChanged = currentPrice !== basePrice;
  const priceUp = currentPrice > basePrice;
  const inStock = stockQty > 0;

  const handleAddToCart = useCallback(() => {
    if (adding || !inStock) return;

    // ── Not signed in → redirect to login, come back to this page after ──
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    setAdding(true);
    addItem({
      id,
      name,
      farmerName,
      unit,
      currentPrice,
      image,
    });
    openDrawer();
    setTimeout(() => setAdding(false), 700);
  }, [adding, inStock, status, router, pathname, addItem, openDrawer, id, name, farmerName, unit, currentPrice, image]);
  return (
    <article
      id={`product-card-${id}`}
      className="group bg-white rounded-[22px] overflow-hidden shadow-[0_4px_20px_rgba(45,106,79,0.06)] border border-[#D0EDD8] transition-all duration-300 flex flex-col hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(45,106,79,0.16)]"
    >
      {/* Image Section */}
      <Link
        href={`/products/${id}`}
        onClick={() => onView?.(id)}
        className="relative block h-[140px] bg-[#F0FBF1] overflow-hidden"
      >
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
          {isHot && !demandBadge && (
            <span className="bg-[#FFF0EA] text-[#FF6B35] text-[0.7rem] font-bold px-3 py-1 rounded-full shadow-sm">
              🔥 HOT
            </span>
          )}
        </div>

        {/* Out of Stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-[#1A2E22] text-[0.75rem] font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Stock Warning */}
        {inStock && stockQty <= 5 && (
          <span className="absolute bottom-3 right-3 bg-[rgba(255,107,53,0.92)] backdrop-blur-sm text-white text-[0.72rem] font-bold px-3 py-1 rounded-full shadow-sm">
            Only {stockQty} left!
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        {/* Category */}
        <span className="self-start text-[0.62rem] font-semibold text-[#2D6A4F] uppercase tracking-[0.08em] bg-[#F0FBF1] px-2 py-0.5 rounded-md">
          {category}
        </span>

        {/* Product Name */}
        <h3
          className="text-[0.92rem] font-bold text-[#1A2E22] leading-tight m-0 line-clamp-1"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {name}
        </h3>

        {/* Farmer + stock (single compact row) */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/farmers/${farmerId}`}
            onClick={() => onView?.(id)}
            className="no-underline text-[0.7rem] font-semibold text-[#2D6A4F] hover:text-[#1B4332] transition-colors truncate"
          >
            👨‍🌾 {farmerName}
          </Link>
          <span className="flex items-center gap-1 text-[0.65rem] text-[#8FAF9A] flex-shrink-0">
            <Package className="w-2.5 h-2.5" />
            {inStock ? stockQty : "0"}
          </span>
        </div>

        {/* Dynamic Price */}
        <div className="flex items-end gap-1.5 mt-auto pt-1">
          <span
            className="text-[1.1rem] font-extrabold text-[#2D6A4F]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Rs. {currentPrice.toFixed(2)}
          </span>
          <span className="text-[0.7rem] text-[#8FAF9A] mb-0.5">/ {unit}</span>
          {priceChanged && (
            <span
              className={`text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full mb-0.5 ml-auto ${
                priceUp
                  ? "text-[#FF6B35] bg-[#FFF0EA]"
                  : "text-[#2D6A4F] bg-[#D8F3DC]"
              }`}
            >
              {priceUp ? "▲" : "▼"}
            </span>
          )}
        </div>

        {/* Add to Cart CTA */}
        <button
          disabled={!inStock || adding}
          onClick={handleAddToCart}
          className="w-full mt-1"
        >
          <span
            className={`w-full flex items-center justify-center gap-1.5 text-center text-[0.78rem] font-bold px-4 py-2 rounded-full transition-colors ${
              inStock && !adding
                ? "text-white bg-[#2D6A4F] hover:bg-[#1B4332]"
                : "text-[#8FAF9A] bg-[#F0FBF1] cursor-not-allowed"
            }`}
          >
            {adding ? (
              "Added! ✓"
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                {inStock ? "Add to Cart" : "Unavailable"}
              </>
            )}
          </span>
        </button>
      </div>
    </article>
  );
}