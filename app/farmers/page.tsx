/**
 * /app/farmers/page.tsx  — Public Farmers Gallery
 *
 * "Client Component" so we can run instant, zero-reload filtering.
 * Data is fetched once on mount from /api/farmers (APPROVED only).
 * Theme: Rural Utility High-Contrast (#F0F7F0 / #1A3020 / #3E7B27)
 */

"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";

import {
  Search,
  MapPin,
  ShieldCheck,
  Leaf,
  Users,
  ChevronLeft,
  X,
  SlidersHorizontal,
  Sprout,
  RefreshCw,
} from "lucide-react";
import { Footer } from "@/components/home";
import Navbar from "@/components/layout/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FarmerCard {
  _id: string;
  userId: { _id: string; name: string };
  farmName: string;
  location: string;
  cropTypes: string[];
  profileImage?: string;
  isVerified: boolean;
  whatsappEnabled: boolean;
  approvedAt: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SRI_LANKA_DISTRICTS = [
  "All Districts",
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

const CROP_FILTERS = [
  "All",
  "Vegetables",
  "Fruits",
  "Organic",
  "Herbs",
  "Grains",
  "Dairy",
];

// Crop pill colour map
const CROP_PILL_COLORS: Record<string, string> = {
  vegetables: "bg-[#E8F8E8] text-[#1A5C1A] border-[#B8E8B8]",
  fruits:     "bg-[#FFF3E0] text-[#B45309] border-[#FDDCAA]",
  organic:    "bg-[#E0F7F4] text-[#0E7490] border-[#A5DDD5]",
  herbs:      "bg-[#F0FBF1] text-[#2D6A4F] border-[#B8E8D4]",
  grains:     "bg-[#FEF9C3] text-[#854D0E] border-[#F5E69A]",
  dairy:      "bg-[#F5F0FF] text-[#6D28D9] border-[#D4C5F9]",
};

function getCropPill(crop: string): string {
  return (
    CROP_PILL_COLORS[crop.toLowerCase()] ??
    "bg-[#F3F4F6] text-[#374151] border-[#D1D5DB]"
  );
}

// ─── Farmer Avatar ────────────────────────────────────────────────────────────
function FarmerAvatar({
  name,
  image,
  size = "lg",
}: {
  name: string;
  image?: string;
  size?: "sm" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClass =
    size === "lg"
      ? "w-20 h-20 text-2xl"
      : "w-14 h-14 text-base";

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizeClass} rounded-2xl object-cover flex-shrink-0 border-2 border-white shadow-md`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-2xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] flex items-center justify-center flex-shrink-0 border-2 border-white shadow-md`}
    >
      <span
        className="text-white font-extrabold select-none"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {initials}
      </span>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-[#E8F0E8] p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-2xl bg-[#E8F0E8] flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <div className="h-4 w-3/4 bg-[#E8F0E8] rounded-full" />
          <div className="h-3 w-1/2 bg-[#E8F0E8] rounded-full" />
          <div className="h-3 w-2/3 bg-[#E8F0E8] rounded-full mt-1" />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <div className="h-6 w-16 bg-[#E8F0E8] rounded-full" />
        <div className="h-6 w-20 bg-[#E8F0E8] rounded-full" />
      </div>
      <div className="h-12 w-full bg-[#E8F0E8] rounded-2xl mt-auto" />
    </div>
  );
}

// ─── Single Farmer Card ───────────────────────────────────────────────────────
function FarmerCardComponent({ farmer }: { farmer: FarmerCard }) {
  const name = farmer.userId?.name ?? "Unnamed Farmer";

  return (
    <article
      className={
        "bg-white rounded-3xl border border-[#C8DFC8] " +
        "shadow-[0_2px_12px_rgba(26,48,32,0.06)] " +
        "hover:shadow-[0_10px_36px_rgba(26,48,32,0.14)] " +
        "hover:scale-[1.02] transition-all duration-300 " +
        "flex flex-col p-6 gap-4"
      }
    >
      {/* ── Top row: avatar + basic info ── */}
      <div className="flex items-start gap-4">
        <FarmerAvatar name={name} image={farmer.profileImage} />

        <div className="flex-1 min-w-0">
          {/* Verified badge */}
          {farmer.isVerified && (
            <span className="inline-flex items-center gap-1 bg-[#E8F8E8] border border-[#B8E8B8] text-[#1A5C1A] text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1.5">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          )}

          {/* Name */}
          <h2
            className="text-[#1A3020] font-extrabold text-[1rem] leading-tight truncate"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {name}
          </h2>

          {/* Farm name */}
          <p className="text-[#4A6355] text-[0.8rem] font-medium leading-tight truncate mt-0.5">
            {farmer.farmName}
          </p>

          {/* Location */}
          <p className="flex items-center gap-1 text-[#6B8F6E] text-[0.78rem] mt-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#3E7B27]" />
            <span className="truncate">{farmer.location}</span>
          </p>
        </div>
      </div>

      {/* ── Crop type pills ── */}
      {farmer.cropTypes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {farmer.cropTypes.slice(0, 4).map((crop) => (
            <span
              key={crop}
              className={`text-[0.68rem] font-semibold border px-2.5 py-0.5 rounded-full capitalize ${getCropPill(crop)}`}
            >
              {crop}
            </span>
          ))}
          {farmer.cropTypes.length > 4 && (
            <span className="text-[0.68rem] font-semibold border border-[#D1D5DB] text-[#374151] bg-[#F3F4F6] px-2.5 py-0.5 rounded-full">
              +{farmer.cropTypes.length - 4}
            </span>
          )}
        </div>
      )}

      {/* ── CTA Button ── */}
      <Link
        href={`/farmers/${farmer._id}`}
        className={
          "mt-auto w-full min-h-[48px] rounded-2xl font-bold text-[0.88rem] " +
          "flex items-center justify-center gap-2 " +
          "bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white " +
          "hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,48,32,0.3)] " +
          "transition-all duration-200"
        }
      >
        <Leaf className="w-4 h-4" />
        View Profile
      </Link>
    </article>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E8F8E8] to-[#C8EAC8] flex items-center justify-center mb-5 shadow-md">
        <Sprout className="w-10 h-10 text-[#3E7B27]" />
      </div>
      <h3
        className="text-[#1A3020] font-extrabold text-xl mb-2"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        No farmers found
      </h3>
      <p className="text-[#6B8F6E] text-sm max-w-xs mb-6">
        No farmers match your current filters. Try a different location or crop
        type.
      </p>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-2 bg-[#3E7B27] text-white font-bold text-sm px-6 min-h-[48px] rounded-2xl hover:bg-[#1A3020] hover:-translate-y-0.5 transition-all duration-200 shadow-md"
      >
        <RefreshCw className="w-4 h-4" />
        Clear Filters
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FarmersGalleryPage() {
  const [farmers, setFarmers] = useState<FarmerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All Districts");
  const [cropFilter, setCropFilter] = useState("All");

  // ── Fetch approved farmers once ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/farmers");
        if (!res.ok) throw new Error("Failed to load farmers");
        const data = await res.json();
        setFarmers(data.farmers ?? []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Client-side filter — instant, no page reload ─────────────────────────
  const filtered = useMemo(() => {
    return farmers.filter((f) => {
      const name = (f.userId?.name ?? "").toLowerCase();
      const farm = (f.farmName ?? "").toLowerCase();
      const loc  = (f.location ?? "").toLowerCase();

      const matchSearch =
        search.trim() === "" ||
        name.includes(search.toLowerCase()) ||
        farm.includes(search.toLowerCase()) ||
        loc.includes(search.toLowerCase());

      const matchDistrict =
        district === "All Districts" ||
        loc.includes(district.toLowerCase());

      const matchCrop =
        cropFilter === "All" ||
        f.cropTypes.some(
          (c) => c.toLowerCase() === cropFilter.toLowerCase()
        );

      return matchSearch && matchDistrict && matchCrop;
    });
  }, [farmers, search, district, cropFilter]);

  // ── Reset all filters ────────────────────────────────────────────────────
  const clearFilters = useCallback(() => {
    setSearch("");
    setDistrict("All Districts");
    setCropFilter("All");
  }, []);

  const hasActiveFilters =
    search.trim() !== "" ||
    district !== "All Districts" ||
    cropFilter !== "All";

  return (
    <div
      className="min-h-screen bg-[#F0F7F0]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Font Link ─────────────────────────────────────────────────────── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── Sticky Nav ────────────────────────────────────────────────────── */}
      
      <Navbar/>

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <header className="relative bg-gradient-to-br from-[#F0FBF1] via-[#D8F3DC] to-[#B7E4C7] overflow-hidden">
  {/* Decorative glows (පැහැදිලිව පෙනීම සඳහා මේවායේ opacity එක පොඩ්ඩක් වැඩි කළා) */}
  <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#2D6A4F]/5 pointer-events-none" />
  <div className="absolute bottom-0 -left-16 w-60 h-60 rounded-full bg-[#FFB703]/10 pointer-events-none" />

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
    {/* Eyebrow - මෙහි background එක සහ text color එක ලා කොළ පාටට ගැළපෙන්න වෙනස් කළා */}
    <span className="inline-flex items-center gap-2 bg-white/80 border border-[#D0EDD8] text-[#2D6A4F] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-sm">
      <Leaf className="w-3.5 h-3.5" />
      Sri Lanka&apos;s Verified Farm Network
    </span>

    {/* Heading - අකුරු වල පාට තද කොළ (#1B4332) කළා එවිට ලා පසුබිමේ හොඳින් පෙනේ */}
    <h1
      className="text-3xl sm:text-5xl font-extrabold text-[#1B4332] leading-tight mb-4"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      Meet Your <span className="text-[#FFB703]">Farmers</span>
    </h1>
    
    {/* Paragraph text color එකත් වෙනස් කළා */}
    <p className="text-[#4A6355] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
      Every farmer here is verified, approved, and passionate about
      growing clean food for your family. Browse profiles and connect
      directly with the source.
    </p>

    {/* Stat pills - මේවායේ background සහ border Hero section එකට ගැළපෙන ලෙස සකස් කළා */}
    <div className="flex flex-wrap gap-3 justify-center mt-8">
      <div className="flex items-center gap-2 bg-white/90 border border-[#D0EDD8] rounded-full px-4 py-2 text-sm text-[#2D6A4F] font-semibold shadow-sm">
        <Users className="w-4 h-4 text-[#FFB703]" />
        {loading ? "—" : `${farmers.length} Verified Farmers`}
      </div>
      <div className="flex items-center gap-2 bg-white/90 border border-[#D0EDD8] rounded-full px-4 py-2 text-sm text-[#2D6A4F] font-semibold shadow-sm">
        <MapPin className="w-4 h-4 text-[#FFB703]" />
        25 Districts Covered
      </div>
      <div className="flex items-center gap-2 bg-white/90 border border-[#D0EDD8] rounded-full px-4 py-2 text-sm text-[#2D6A4F] font-semibold shadow-sm">
        <ShieldCheck className="w-4 h-4 text-[#FFB703]" />
        100% Approved Only
      </div>
    </div>
  </div>
</header>

      {/* ── Filter Bar ────────────────────────────────────────────────────── */}
      <section
        id="filter-bar"
        className="sticky top-16 z-30 bg-white/95 backdrop-blur-[10px] border-b border-[#C8DFC8] shadow-[0_2px_8px_rgba(26,48,32,0.05)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3">
          {/* Row 1: Search + District */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8FAF9A] pointer-events-none" />
              <input
                id="farmer-search"
                type="text"
                placeholder="Search by name, farm, or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={
                  "w-full min-h-[48px] pl-10 pr-4 rounded-2xl border text-sm " +
                  "bg-[#F8FCF8] border-[#C8DFC8] text-[#1A3020] placeholder-[#8FAF9A] " +
                  "focus:outline-none focus:border-[#3E7B27] focus:ring-2 focus:ring-[#3E7B27]/20 " +
                  "transition-all duration-200"
                }
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

            {/* District dropdown */}
            <div className="relative sm:w-56">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3E7B27] pointer-events-none" />
              <select
                id="district-filter"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={
                  "w-full min-h-[48px] pl-10 pr-4 rounded-2xl border text-sm appearance-none " +
                  "bg-[#F8FCF8] border-[#C8DFC8] text-[#1A3020] " +
                  "focus:outline-none focus:border-[#3E7B27] focus:ring-2 focus:ring-[#3E7B27]/20 " +
                  "transition-all duration-200 cursor-pointer"
                }
              >
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8FAF9A] pointer-events-none" />
            </div>
          </div>

          {/* Row 2: Crop type pills */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-[0.75rem] font-semibold text-[#6B8F6E] mr-1">
              Crop:
            </span>
            {CROP_FILTERS.map((c) => (
              <button
                key={c}
                id={`crop-filter-${c.toLowerCase()}`}
                onClick={() => setCropFilter(c)}
                className={`min-h-[36px] px-4 rounded-full text-[0.78rem] font-semibold border transition-all duration-200 ${
                  cropFilter === c
                    ? "bg-[#1A3020] text-white border-[#1A3020] shadow-sm"
                    : "bg-[#F0F7F0] text-[#3D5C42] border-[#C8DFC8] hover:bg-[#E0F0E0] hover:border-[#3E7B27]"
                }`}
              >
                {c}
              </button>
            ))}

            {/* Clear filters — only show when active */}
            {hasActiveFilters && (
              <button
                id="clear-filters"
                onClick={clearFilters}
                className="ml-auto min-h-[36px] px-4 rounded-full text-[0.78rem] font-semibold border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-200 flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main id="farmers-grid" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Results count */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-[#4A6355] text-sm font-medium">
              {hasActiveFilters ? (
                <>
                  Showing{" "}
                  <span className="font-bold text-[#1A3020]">
                    {filtered.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[#1A3020]">
                    {farmers.length}
                  </span>{" "}
                  farmers
                </>
              ) : (
                <>
                  <span className="font-bold text-[#1A3020]">
                    {farmers.length}
                  </span>{" "}
                  verified farmers available
                </>
              )}
            </p>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-[#3E7B27] hover:text-[#1A3020] transition-colors"
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-[#1A3020] font-bold mb-2">
              Couldn&apos;t load farmers
            </p>
            <p className="text-[#6B8F6E] text-sm mb-5">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-[#3E7B27] text-white font-bold text-sm px-6 min-h-[48px] rounded-2xl hover:bg-[#1A3020] transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Loading skeleton grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Farmer card grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              filtered.map((farmer) => (
                <FarmerCardComponent key={farmer._id} farmer={farmer} />
              ))
            )}
          </div>
        )}
      </main>

      {/* ── Footer CTA ────────────────────────────────────────────────────── */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 mt-4">
        <div className="bg-gradient-to-br from-[#1A3020] to-[#3E7B27] rounded-3xl p-8 sm:p-12 text-center shadow-[0_8px_30px_rgba(26,48,32,0.2)] relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-0 -left-8 w-40 h-40 rounded-full bg-[rgba(242,180,65,0.06)] pointer-events-none" />

          <p className="relative z-10 text-white/70 text-sm font-medium mb-2">
            Are you a farmer? Join our growing community.
          </p>
          <h2
            className="relative z-10 text-white text-2xl sm:text-3xl font-extrabold mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Sell Direct. Earn More.
          </h2>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-[#F2B441] text-[#1A3020] font-bold text-sm px-8 min-h-[48px] rounded-2xl hover:bg-[#FFD166] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_16px_rgba(242,180,65,0.4)]"
            >
              <Leaf className="w-4 h-4" />
              Register as a Farmer
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-bold text-sm px-8 min-h-[48px] rounded-2xl hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </footer>
      
      <Footer/>
    </div>
  );
}
