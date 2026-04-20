/**
 * Farmer Public Profile Page — /app/farmers/[id]/page.tsx
 *
 * Server Component: fetches FarmerProfile + User + Products directly from DB.
 * Theme: Rural Utility High-Contrast (#1A3020 / #F0F7F0)
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/mongoose";
import FarmerProfile from "@/models/FarmerProfile";
import Product from "@/models/Product";
import {
  ShieldCheck,
  MapPin,
  Leaf,
  Droplets,
  Clock,
  ShoppingCart,
  ChevronLeft,
  Star,
  Phone,
  Sprout,
  Package,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
}

interface FarmerData {
  _id: string;
  userId: PopulatedUser;
  farmName: string;
  location: string;
  cropTypes: string[];
  bio?: string;
  profileImage?: string;
  isVerified: boolean;
  whatsappEnabled: boolean;
  status: string;
  approvedAt: string | null;
}

interface ProductData {
  _id: string;
  name: string;
  category: string;
  basePrice: number;
  unit: string;
  stockQty: number;
  images: string[];
  description: string;
  tags: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(price);
}

// Category colour chips
const CATEGORY_COLORS: Record<string, string> = {
  vegetables: "bg-[#E8F8E8] text-[#1A5C1A]",
  fruits:     "bg-[#FFF3E0] text-[#B45309]",
  herbs:      "bg-[#E0F7F4] text-[#0E7490]",
  grains:     "bg-[#FEF9C3] text-[#854D0E]",
  other:      "bg-[#F3F4F6] text-[#374151]",
};

// ─── Server-side data fetch ───────────────────────────────────────────────────
async function getFarmerData(id: string): Promise<{ farmer: FarmerData; products: ProductData[] } | null> {
  try {
    await connectDB();

    const profile = await FarmerProfile.findById(id)
      .populate<{ userId: PopulatedUser }>("userId", "name email mobile")
      .lean();

    if (!profile || profile.status !== "APPROVED") return null;

    const products = await Product.find({
      farmerId: (profile.userId as any)._id,
      status: "APPROVED",
    })
      .select("name category basePrice unit stockQty images description tags")
      .sort({ createdAt: -1 })
      .lean();

    return {
      farmer:   JSON.parse(JSON.stringify(profile))   as FarmerData,
      products: JSON.parse(JSON.stringify(products))  as ProductData[],
    };
  } catch {
    return null;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Avataar initials when no profile image is set */
function FarmerAvatar({ name, image }: { name: string; image?: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover shadow-[0_8px_30px_rgba(26,48,32,0.25)] border-4 border-white flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] flex items-center justify-center shadow-[0_8px_30px_rgba(26,48,32,0.3)] border-4 border-white flex-shrink-0">
      <span
        className="text-white font-extrabold text-4xl sm:text-5xl select-none"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {initials}
      </span>
    </div>
  );
}

/** Product card for Current Harvest grid */
function ProductCard({ product }: { product: ProductData }) {
  const img = product.images?.[0];
  const inStock = product.stockQty > 0;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#C8DFC8] shadow-[0_4px_20px_rgba(26,48,32,0.07)] hover:shadow-[0_8px_32px_rgba(26,48,32,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-[#F0F7F0] overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sprout className="w-14 h-14 text-[#C8DFC8]" />
          </div>
        )}

        {/* Category badge */}
        <span
          className={cn(
            "absolute top-3 left-3 px-2.5 py-1 rounded-xl text-[0.7rem] font-bold capitalize",
            CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS.other,
          )}
        >
          {product.category}
        </span>

        {/* Stock badge */}
        {!inStock && (
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.45)] flex items-center justify-center">
            <span className="bg-white/90 text-[#1A3020] text-[0.75rem] font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-extrabold text-[#1A3020] text-[0.95rem] leading-snug mb-0.5">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-[#4A6355] text-[0.78rem] leading-relaxed line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <span className="text-[1.15rem] font-extrabold text-[#1A3020]">
              {formatPrice(product.basePrice)}
            </span>
            <span className="text-[0.72rem] text-[#6B8F6E] ml-1">/ {product.unit}</span>
          </div>
          {inStock && (
            <span className="text-[0.7rem] text-[#3E7B27] font-semibold flex items-center gap-1">
              <Package className="w-3 h-3" />
              {product.stockQty} {product.unit}
            </span>
          )}
        </div>

        {/* Buy button */}
        <Link
          href={`/products/${product._id}`}
          className={cn(
            "w-full min-h-[48px] rounded-2xl font-bold text-[0.88rem]",
            "flex items-center justify-center gap-2 transition-all duration-200",
            inStock
              ? "bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,48,32,0.3)]"
              : "bg-[#F0F7F0] text-[#6B8F6E] cursor-not-allowed pointer-events-none",
          )}
        >
          <ShoppingCart className="w-4 h-4" />
          {inStock ? "Buy Now" : "Unavailable"}
        </Link>
      </div>
    </div>
  );
}

/** Trust signal pill */
function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 p-5 bg-white rounded-3xl border border-[#C8DFC8] shadow-[0_2px_12px_rgba(26,48,32,0.06)] flex-1 min-w-[120px]">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] flex items-center justify-center shadow-[0_4px_12px_rgba(26,48,32,0.25)]">
        {icon}
      </div>
      <span className="text-[0.78rem] font-bold text-[#1A3020] text-center leading-snug">
        {label}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function FarmerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getFarmerData(id);

  if (!data) notFound();

  const { farmer, products } = data;
  const user = farmer.userId;

  return (
    <>
      {/* ── Global page font ── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-[#F0F7F0]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── Top nav bar ─────────────────────────────────────────────────── */}
        <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-[12px] border-b border-[#C8DFC8] shadow-[0_2px_12px_rgba(26,48,32,0.06)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-[0.85rem] font-semibold text-[#3D5C42] hover:text-[#1A3020] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Marketplace
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 font-extrabold text-[#1A3020] text-[1.05rem]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              🌿 Fresh<span className="text-[#F2B441]">Direct</span>
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-[0.85rem] font-semibold text-[#3D5C42] hover:text-[#1A3020] transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

          {/* ── HERO SECTION ───────────────────────────────────────────────── */}
          <section
            id="farmer-hero"
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A3020] via-[#2D6A4F] to-[#3E7B27] p-8 sm:p-10 shadow-[0_12px_48px_rgba(26,48,32,0.25)]"
          >
            {/* Decorative blobs */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[rgba(242,180,65,0.06)] pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Avatar */}
              <FarmerAvatar name={user.name} image={farmer.profileImage} />

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                {/* Verified badge */}
                {farmer.isVerified && (
                  <div className="inline-flex items-center gap-1.5 bg-[rgba(242,180,65,0.18)] border border-[rgba(242,180,65,0.4)] rounded-full px-3 py-1 mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F2B441]" />
                    <span className="text-[0.72rem] font-bold text-[#F2B441] uppercase tracking-wide">
                      Verified Farmer
                    </span>
                  </div>
                )}

                <h1
                  className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {user.name}
                </h1>
                <p className="text-white/70 font-semibold text-[0.95rem] mb-4">
                  {farmer.farmName}
                </p>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-5">
                  <span className="inline-flex items-center gap-1.5 bg-white/12 border border-white/20 rounded-full px-3 py-1 text-[0.78rem] text-white/80 font-medium">
                    <MapPin className="w-3 h-3" />
                    {farmer.location}
                  </span>
                  {farmer.whatsappEnabled && (
                    <span className="inline-flex items-center gap-1.5 bg-[rgba(37,211,102,0.18)] border border-[rgba(37,211,102,0.4)] rounded-full px-3 py-1 text-[0.78rem] text-[#25D366] font-semibold">
                      <Phone className="w-3 h-3" />
                      WhatsApp Orders
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 bg-white/12 border border-white/20 rounded-full px-3 py-1 text-[0.78rem] text-white/80 font-medium">
                    <Star className="w-3 h-3 text-[#F2B441]" />
                    {products.length} {products.length === 1 ? "Product" : "Products"} Listed
                  </span>
                </div>

                {/* Crop type chips */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {farmer.cropTypes.map((crop) => (
                    <span
                      key={crop}
                      className="bg-white/15 border border-white/25 text-white text-[0.72rem] font-semibold px-2.5 py-1 rounded-xl"
                    >
                      🌱 {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── TWO-COLUMN LAYOUT (story + trust) ──────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── FARM STORY ────────────────────────────────────────────── */}
            <section
              id="farm-story"
              className="lg:col-span-2 bg-white rounded-3xl border border-[#C8DFC8] shadow-[0_4px_20px_rgba(26,48,32,0.07)] p-7 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] flex items-center justify-center shadow-[0_4px_12px_rgba(26,48,32,0.25)]">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h2
                  className="text-[1.2rem] font-extrabold text-[#1A3020]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  මගේ කතාව{" "}
                  <span className="text-[#3E7B27] font-bold text-[1rem]">
                    (My Story)
                  </span>
                </h2>
              </div>

              {farmer.bio ? (
                <p className="text-[#3D5C42] leading-relaxed text-[0.95rem] whitespace-pre-line">
                  {farmer.bio}
                </p>
              ) : (
                <p className="text-[#8FAF9A] italic text-[0.9rem]">
                  This farmer hasn&apos;t added their story yet. Check back soon!
                </p>
              )}

              {/* Approval date */}
              {farmer.approvedAt && (
                <p className="mt-5 text-[0.75rem] text-[#8FAF9A] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3E7B27]" />
                  Verified partner since{" "}
                  {new Date(farmer.approvedAt).toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </section>

            {/* ── TRUST SIGNALS ─────────────────────────────────────────── */}
            <section
              id="trust-signals"
              className="lg:col-span-1 bg-white rounded-3xl border border-[#C8DFC8] shadow-[0_4px_20px_rgba(26,48,32,0.07)] p-7"
            >
              <h2
                className="text-[1.05rem] font-extrabold text-[#1A3020] mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Why Buy From {user.name.split(" ")[0]}?
              </h2>
              <div className="flex flex-row lg:flex-col gap-3">
                <TrustBadge
                  icon={<Sprout className="w-6 h-6 text-white" />}
                  label="Direct from Farm"
                />
                <TrustBadge
                  icon={<Droplets className="w-6 h-6 text-white" />}
                  label="Chemical Free"
                />
                <TrustBadge
                  icon={<Clock className="w-6 h-6 text-white" />}
                  label="24h Freshness"
                />
              </div>
            </section>
          </div>

          {/* ── CURRENT HARVEST ─────────────────────────────────────────────── */}
          <section id="current-harvest">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] flex items-center justify-center shadow-[0_4px_12px_rgba(26,48,32,0.25)]">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <h2
                  className="text-[1.2rem] font-extrabold text-[#1A3020]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Current Harvest
                </h2>
              </div>
              <span className="text-[0.78rem] font-semibold text-[#6B8F6E] bg-[#F0F7F0] border border-[#C8DFC8] rounded-full px-3 py-1">
                {products.length} item{products.length !== 1 ? "s" : ""} available
              </span>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#C8DFC8] p-12 text-center shadow-[0_4px_20px_rgba(26,48,32,0.07)]">
                <Sprout className="w-14 h-14 text-[#C8DFC8] mx-auto mb-4" />
                <p className="text-[#1A3020] font-bold text-[1rem] mb-1">
                  No produce listed yet
                </p>
                <p className="text-[#8FAF9A] text-[0.85rem]">
                  {user.name.split(" ")[0]} hasn&apos;t listed any products yet — check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* ── CTA FOOTER STRIP ────────────────────────────────────────────── */}
          <section className="bg-gradient-to-br from-[#1A3020] to-[#3E7B27] rounded-3xl p-8 text-center shadow-[0_8px_30px_rgba(26,48,32,0.2)] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <p
              className="text-white/70 text-[0.82rem] font-medium mb-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Want fresh produce delivered daily?
            </p>
            <h3
              className="text-white text-[1.5rem] font-extrabold mb-5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Explore the Full Marketplace
            </h3>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-[#1A3020] font-bold text-[0.9rem] px-8 py-3.5 rounded-2xl min-h-[48px] hover:bg-[#F0F7F0] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
            >
              <ShoppingCart className="w-4 h-4" />
              Shop All Produce
            </Link>
          </section>

        </main>
      </div>
    </>
  );
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getFarmerData(id);

  if (!data) {
    return { title: "Farmer Not Found | FreshDirect" };
  }

  const { farmer } = data;
  return {
    title: `${farmer.userId.name} — ${farmer.farmName} | FreshDirect`,
    description: farmer.bio
      ? farmer.bio.slice(0, 155)
      : `Buy fresh produce directly from ${farmer.farmName} located in ${farmer.location}. Verified farmer on FreshDirect.`,
  };
}
