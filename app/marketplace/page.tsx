"use client";

/**
 * app/marketplace/page.tsx — Live Marketplace
 *
 * Features:
 *  • Fetches live prices from /api/products (server-side dynamic pricing)
 *  • PATCH /api/products/[id]/view on product click (demand tracking)
 *  • Category pill filter + full-text search (client-side, instant)
 *  • framer-motion entrance animations
 *  • Skeleton loaders while fetching
 *  • Zustand cart → Cart Drawer slides in on "Add to Cart"
 *  • Mobile-first responsive grid: 1 → 2 → 4 → 5 columns
 */

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Leaf,
  X,
  TrendingUp,
  Package,
  Sprout,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Zap,
} from "lucide-react";

import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/marketplace/CartDrawer";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  images: string[];
  tags?: string[];
  basePrice: number;
  currentPrice: number;
  stockQty: number;
  demandScore: number;
  totalViews: number;
  status: string;
  farmerId: { _id: string; name: string } | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",        label: "All",        emoji: "🛒" },
  { id: "vegetables", label: "Vegetables", emoji: "🥬" },
  { id: "fruits",     label: "Fruits",     emoji: "🍎" },
  { id: "grains",     label: "Grains",     emoji: "🌾" },
  { id: "herbs",      label: "Herbs",      emoji: "🌿" },
  { id: "other",      label: "Other",      emoji: "📦" },
];

const CATEGORY_BADGE: Record<string, string> = {
  vegetables: "bg-[#E8F8E8] text-[#1A5C1A] border-[#B8E8B8]",
  fruits:     "bg-[#FFF3E0] text-[#B45309] border-[#FDDCAA]",
  herbs:      "bg-[#E0F7F4] text-[#0E7490] border-[#A5DDD5]",
  grains:     "bg-[#FEF9C3] text-[#854D0E] border-[#F5E69A]",
  other:      "bg-[#F3F4F6] text-[#374151] border-[#D1D5DB]",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(n);
}

function cn(...cls: (string | boolean | undefined | null)[]) {
  return cls.filter(Boolean).join(" ");
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-[#E8F0E8] overflow-hidden animate-pulse">
      <div className="aspect-square bg-[#E8F0E8]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 w-3/4 bg-[#E8F0E8] rounded-full" />
        <div className="h-3 w-1/2 bg-[#E8F0E8] rounded-full" />
        <div className="h-6 w-2/5 bg-[#E8F0E8] rounded-full" />
        <div className="h-12 w-full bg-[#E8F0E8] rounded-2xl mt-1" />
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  index,
  onView,
}: {
  product: Product;
  index: number;
  onView: (id: string) => void;
}) {
  const { addItem, openDrawer } = useCartStore();
  const [adding, setAdding] = useState(false);
  const farmerName = product.farmerId?.name ?? "Unknown Farmer";
  const img = product.images?.[0];
  const inStock = product.stockQty > 0;
  const priceUp = product.currentPrice > product.basePrice;

  function handleAddToCart() {
    setAdding(true);
    addItem({
      id: product._id,
      name: product.name,
      farmerName,
      unit: product.unit,
      currentPrice: product.currentPrice,
      image: img,
    });
    setTimeout(() => setAdding(false), 700);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.045, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-3xl border border-[#C8DFC8] overflow-hidden flex flex-col",
        "shadow-[0_2px_12px_rgba(26,48,32,0.06)]",
        "hover:shadow-[0_12px_36px_rgba(26,48,32,0.14)] hover:-translate-y-1",
        "transition-all duration-300"
      )}
    >
      {/* ── Image ── */}
      <Link
        href={`/products/${product._id}`}
        onClick={() => onView(product._id)}
        className="relative block aspect-square overflow-hidden bg-[#F0F7F0] group"
      >
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sprout className="w-14 h-14 text-[#C8DFC8]" />
          </div>
        )}

        {/* Category badge */}
        <span
          className={cn(
            "absolute top-3 left-3 text-[0.65rem] font-bold border px-2.5 py-0.5 rounded-full capitalize",
            CATEGORY_BADGE[product.category] ?? CATEGORY_BADGE.other
          )}
        >
          {product.category}
        </span>

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-[#1A3020]/50 flex items-center justify-center">
            <span className="bg-white text-[#1A3020] text-[0.75rem] font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Demand badge */}
        {product.demandScore > 10 && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-[#F2B441] text-[#1A3020] text-[0.6rem] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
            <TrendingUp className="w-2.5 h-2.5" />
            HOT
          </span>
        )}
      </Link>

      {/* ── Info ── */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Name */}
        <h2 className="text-[#1A3020] font-extrabold text-[0.95rem] leading-tight line-clamp-1">
          {product.name}
        </h2>

        {/* Farmer link */}
        <Link
          href={`/farmers/${product.farmerId?._id ?? "#"}`}
          onClick={() => product.farmerId && onView(product._id)}
          className="text-[#3E7B27] text-[0.72rem] font-semibold hover:text-[#1A3020] transition-colors truncate"
        >
          ගොවියා: {farmerName}
        </Link>

        {/* Stock info */}
        <p className="flex items-center gap-1 text-[#8FAF9A] text-[0.7rem]">
          <Package className="w-3 h-3" />
          {inStock ? `${product.stockQty} ${product.unit} available` : "Sold out"}
        </p>

        {/* ── Price row ── */}
        <div className="flex items-end gap-2 mt-1">
          <span
            className="text-[1.25rem] font-extrabold"
            style={{ color: "#F2B441" }}
          >
            {fmt(product.currentPrice)}
          </span>
          <span className="text-[#8FAF9A] text-[0.7rem] pb-0.5">
            / {product.unit}
          </span>

          {/* Live Price badge */}
          <span className="ml-auto flex items-center gap-0.5 bg-[#F0F7F0] border border-[#C8DFC8] text-[#3E7B27] text-[0.6rem] font-bold px-2 py-0.5 rounded-full">
            <Zap className="w-2.5 h-2.5" />
            Live
          </span>
        </div>

        {/* Base price (if price went up due to demand) */}
        {priceUp && (
          <p className="text-[0.68rem] text-[#8FAF9A]">
            Base:{" "}
            <span className="line-through">{fmt(product.basePrice)}</span>
          </p>
        )}

        {/* ── Add to Cart button ── */}
        <button
          disabled={!inStock || adding}
          onClick={handleAddToCart}
          className={cn(
            "mt-auto w-full min-h-[48px] rounded-2xl font-bold text-[0.88rem]",
            "flex items-center justify-center gap-2 transition-all duration-200",
            inStock && !adding
              ? "bg-[#3E7B27] text-white hover:bg-[#1A3020] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(62,123,39,0.35)]"
              : "bg-[#F0F7F0] text-[#8FAF9A] cursor-not-allowed"
          )}
        >
          {adding ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {inStock ? "Add to Cart" : "Unavailable"}
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { totalItems, openDrawer } = useCartStore();
  const pillsRef = useRef<HTMLDivElement>(null);

  // ── Fetch products ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Demand tracking ────────────────────────────────────────────────────────
  const handleView = useCallback(async (id: string) => {
    try {
      await fetch(`/api/products/${id}/view`, { method: "PATCH" });
    } catch {
      // Non-critical — silently fail
    }
  }, []);

  // ── Client-side filter ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === "all" || p.category === category;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.farmerId?.name ?? "").toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [products, category, search]);

  const cartCount = totalItems();

  // ── Pill scroller helpers ──────────────────────────────────────────────────
  function scrollPills(dir: "left" | "right") {
    pillsRef.current?.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
  }

  return (
    <div
      className="min-h-screen bg-[#F0F7F0]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── Cart Drawer (global) ── */}
      <CartDrawer />

      {/* ── Fixed Navbar ─────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-[12px] border-b border-[#C8DFC8] shadow-[0_2px_12px_rgba(26,48,32,0.06)]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          {/* Brand */}
          <Link
            href="/"
            className="flex-shrink-0 font-extrabold text-[#1A3020] text-[1.05rem] mr-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            🌿 Fresh<span className="text-[#F2B441]">Direct</span>
          </Link>

          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8FAF9A] pointer-events-none" />
            <input
              id="marketplace-search"
              type="text"
              placeholder="Search produce, farmer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full h-10 pl-9 pr-9 rounded-2xl border text-sm",
                "bg-[#F8FCF8] border-[#C8DFC8] text-[#1A3020] placeholder-[#8FAF9A]",
                "focus:outline-none focus:border-[#3E7B27] focus:ring-2 focus:ring-[#3E7B27]/20 transition-all"
              )}
            />
            {search && (
              <button
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FAF9A] hover:text-[#1A3020] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cart button */}
          <button
            id="open-cart-drawer"
            aria-label="Open cart"
            onClick={openDrawer}
            className="relative flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] flex items-center justify-center shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#F2B441] text-[#1A3020] text-[0.6rem] font-extrabold rounded-full flex items-center justify-center shadow"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* ── Category Pill Scroller ────────────────────────────────────────── */}
      <div className="fixed top-16 left-0 right-0 z-20 bg-white/95 backdrop-blur-[10px] border-b border-[#E4EEE4] shadow-[0_1px_6px_rgba(26,48,32,0.05)]">
        <div className="max-w-screen-xl mx-auto px-2 sm:px-6 flex items-center">
          {/* Scroll left */}
          <button
            onClick={() => scrollPills("left")}
            className="p-1.5 text-[#8FAF9A] hover:text-[#1A3020] flex-shrink-0 sm:hidden"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={pillsRef}
            className="flex gap-2 py-3 overflow-x-auto scrollbar-hide flex-1 px-1"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`cat-${cat.id}`}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 min-h-[36px] rounded-full",
                  "text-[0.78rem] font-semibold border transition-all duration-200",
                  category === cat.id
                    ? "bg-[#1A3020] text-white border-[#1A3020] shadow-sm"
                    : "bg-[#F0F7F0] text-[#3D5C42] border-[#C8DFC8] hover:bg-[#E0F0E0]"
                )}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Scroll right */}
          <button
            onClick={() => scrollPills("right")}
            className="p-1.5 text-[#8FAF9A] hover:text-[#1A3020] flex-shrink-0 sm:hidden"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Content (offset for fixed header + pill bar = 64+56=120px) ── */}
      <main className="pt-[120px] max-w-screen-xl mx-auto px-4 sm:px-6 pb-16">

        {/* Results bar */}
        {!loading && !error && (
          <div className="flex items-center justify-between py-4">
            <p className="text-[#4A6355] text-sm font-medium">
              <span className="font-bold text-[#1A3020]">{filtered.length}</span>
              {" "}
              {filtered.length === 1 ? "product" : "products"} found
              {category !== "all" && (
                <span className="ml-1 text-[#3E7B27] font-semibold capitalize">
                  in {category}
                </span>
              )}
            </p>
            <button
              onClick={fetchProducts}
              className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-[#3E7B27] hover:text-[#1A3020] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh prices
            </button>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-red-300" />
            </div>
            <p className="text-[#1A3020] font-bold mb-1">Couldn&apos;t load products</p>
            <p className="text-[#6B8F6E] text-sm mb-5">{error}</p>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center gap-2 bg-[#3E7B27] text-white font-bold text-sm px-6 min-h-[48px] rounded-2xl hover:bg-[#1A3020] transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}

        {/* Skeleton grid */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E8F8E8] to-[#C8EAC8] flex items-center justify-center mb-5 shadow-md">
              <Leaf className="w-10 h-10 text-[#3E7B27]" />
            </div>
            <h3
              className="text-[#1A3020] font-extrabold text-xl mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              No products found
            </h3>
            <p className="text-[#6B8F6E] text-sm max-w-xs mb-6">
              Try a different category or clear your search.
            </p>
            <div className="flex gap-3">
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="px-5 min-h-[48px] rounded-2xl border border-[#C8DFC8] text-[#3D5C42] text-sm font-bold hover:bg-[#F0F7F0] transition-all"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={() => { setCategory("all"); setSearch(""); }}
                className="px-5 min-h-[48px] rounded-2xl bg-[#3E7B27] text-white text-sm font-bold hover:bg-[#1A3020] transition-all"
              >
                Show All
              </button>
            </div>
          </motion.div>
        )}

        {/* Product grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {filtered.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                index={i}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Sticky bottom bar on mobile: cart summary ─────────────────────── */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-20 sm:hidden px-4 pb-4"
          >
            <button
              onClick={openDrawer}
              className="w-full min-h-[52px] rounded-2xl bg-gradient-to-r from-[#1A3020] to-[#3E7B27] text-white font-bold text-[0.9rem] flex items-center justify-between px-5 shadow-[0_8px_24px_rgba(26,48,32,0.35)]"
            >
              <span className="bg-white/20 rounded-xl px-2.5 py-1 text-[0.8rem] font-extrabold">
                {cartCount}
              </span>
              <span>View Cart</span>
              <ShoppingCart className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
