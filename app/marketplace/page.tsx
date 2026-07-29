"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Leaf,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/marketplace/CartDrawer";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import HeroSection from "@/components/marketplace/HeroSection";


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

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
      className="min-h-screen pb-0 bg-[#F0F7F0]"
        style={{ fontFamily: "'Inter', sans-serif" }}
    >
        {/* Fonts are loaded globally via app/globals.css */}

       {/* ── Cart Drawer (global) ── */}
       <CartDrawer />

       {/* ── Fixed Navbar ─────────────────────────────────────────────────── */}
      
       <div className="">
        <Navbar 
      showSearch={true} 
      searchTerm={search} 
      onSearch={setSearch} 
      />
       </div>

        <div className="w-full  sm:px-8 lg:px-12 pt-0 pb-16max-w-screen-xl mx-auto px-4 sm:px-6 pt-20 pb-0">
          
          <HeroSection />

          {/* ── 2. Category Pill Scroller (Hero එකට යටින්, ඒ ප්‍රමාණයටම) ── */}
        <div className="w-full bg-white/95 backdrop-blur-[10px] border border-[#E4EEE4] rounded-2xl shadow-[0_1px_6px_rgba(26,48,32,0.05)] my-5">
     <div className="px-3 sm:px-6 flex items-center">
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
      </div>

      {/* ── Main Content (offset for fixed header + pill bar = 64+56=120px) ── */}
      <main className="pt-[10px] max-w-screen-lg mx-auto px-3 sm:px-4 pb-16">

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-10 sm:gap-5">
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                category={product.category}
                currentPrice={product.currentPrice}
                basePrice={product.basePrice}
                demandScore={product.demandScore}
                demandFactor={(product as any).demandFactor}
                unit={product.unit}
                image={product.images?.[0] ?? ""}
                farmerId={product.farmerId?._id ?? "#"}
                farmerName={product.farmerId?.name ?? "Unknown Farmer"}
                stockQty={product.stockQty}
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