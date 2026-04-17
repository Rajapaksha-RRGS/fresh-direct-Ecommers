import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ProductCard, { ProductCardProps } from "@/components/product/ProductCard";
import FarmerCard, { FarmerCardProps } from "@/components/farmer/FarmerCard";

// ─── Static Demo Data (replace with MongoDB fetch in Phase 3) ─────────────────
const FEATURED_PRODUCTS: ProductCardProps[] = [
  {
    id: "p1",
    name: "Baby Spinach",
    category: "Vegetables",
    basePrice: 220,
    currentPrice: 264,
    demandFactor: 1.35,
    unit: "500g",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 4 * 3600000).toISOString(),
    farmerId: "f1",
    farmerName: "Nimal Perera",
    farmLocation: "Nuwara Eliya",
    stockQty: 28,
    isOrganic: true,
  },
  {
    id: "p2",
    name: "King Coconut",
    category: "Fruits",
    basePrice: 120,
    currentPrice: 96,
    demandFactor: 0.8,
    unit: "piece",
    image:
      "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 8 * 3600000).toISOString(),
    farmerId: "f2",
    farmerName: "Sudu Banda",
    farmLocation: "Kurunegala",
    stockQty: 4,
    isOrganic: false,
  },
  {
    id: "p3",
    name: "Cherry Tomatoes",
    category: "Vegetables",
    basePrice: 380,
    currentPrice: 399,
    demandFactor: 1.05,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 6 * 3600000).toISOString(),
    farmerId: "f3",
    farmerName: "Kamala Devi",
    farmLocation: "Jaffna",
    stockQty: 15,
    isOrganic: true,
  },
  {
    id: "p4",
    name: "Red Lotus Rice",
    category: "Grains",
    basePrice: 560,
    currentPrice: 560,
    demandFactor: 1.0,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    farmerId: "f4",
    farmerName: "Ravi Kumaran",
    farmLocation: "Polonnaruwa",
    stockQty: 50,
    isOrganic: false,
  },
  {
    id: "p5",
    name: "Murunga Leaves",
    category: "Herbs",
    basePrice: 80,
    currentPrice: 104,
    demandFactor: 1.4,
    unit: "bunch",
    image:
      "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 2 * 3600000).toISOString(),
    farmerId: "f1",
    farmerName: "Nimal Perera",
    farmLocation: "Nuwara Eliya",
    stockQty: 8,
    isOrganic: true,
  },
  {
    id: "p6",
    name: "Pineapple",
    category: "Fruits",
    basePrice: 350,
    currentPrice: 315,
    demandFactor: 0.9,
    unit: "piece",
    image:
      "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 12 * 3600000).toISOString(),
    farmerId: "f5",
    farmerName: "Saman Wickrama",
    farmLocation: "Gampaha",
    stockQty: 22,
    isOrganic: false,
  },
];

const FEATURED_FARMER: FarmerCardProps = {
  id: "f1",
  farmerName: "Nimal Perera",
  farmName: "Green Hills Farm",
  location: "Nuwara Eliya, Central Province",
  bio: "Third-generation farmer specializing in highland vegetables. Our farm sits at 1,800m elevation, producing some of the finest organic greens in Sri Lanka. We believe in sustainable farming that respects both nature and the consumer.",
  image:
    "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=200&h=200&fit=crop",
  productCount: 14,
  certifications: ["Organic Certified", "SL GAP", "Chemical-Free"],
  isVerified: true,
  rating: 4.9,
  reviewCount: 234,
};

const REVIEWS = [
  {
    id: "r1",
    name: "Sachini Fernando",
    location: "Colombo 7",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=60&h=60&fit=crop&face",
    rating: 5,
    text: "Absolutely incredible quality! The spinach was so fresh it still had dew on it. Delivered within 12 hours of ordering. My family couldn't believe it!",
    product: "Baby Spinach from Nimal Perera",
  },
  {
    id: "r2",
    name: "Dinesh Jayawardena",
    location: "Kandy",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&face",
    rating: 5,
    text: "Finally, a platform that connects us to the real source! The tomatoes were perfect and the price was much better than the supermarket.",
    product: "Cherry Tomatoes from Kamala Devi",
  },
  {
    id: "r3",
    name: "Priya Ratnayake",
    location: "Nugegoda",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&face",
    rating: 5,
    text: "I love that I can see exactly which farmer grew my food. The king coconuts from Sudu Banda were the sweetest I've ever had!",
    product: "King Coconut from Sudu Banda",
  },
];

const STATS = [
  { value: "500+", label: "Verified Farmers", icon: "👨‍🌾" },
  { value: "10K+", label: "Happy Families", icon: "🏠" },
  { value: "24h", label: "Max Delivery Time", icon: "⚡" },
  { value: "98%", label: "Freshness Rating", icon: "🌿" },
];

const STEPS = [
  {
    num: "01",
    icon: "🔍",
    title: "Browse & Choose",
    desc: "Search thousands of fresh produce listings from verified Sri Lankan farmers. Filter by category, location, or harvest date.",
  },
  {
    num: "02",
    icon: "🌾",
    title: "Farmer Harvests",
    desc: "Your order triggers a real-time harvest notification to the farmer. Produce is picked fresh, same day — no cold storage delays.",
  },
  {
    num: "03",
    icon: "🚚",
    title: "Delivered Fresh",
    desc: "Farm-direct to your door within 24 hours. Track your order in real-time via WhatsApp or SMS updates.",
  },
];

const FOOTER_COLUMNS = [
  {
    heading: "Marketplace",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Vegetables", href: "/products?category=vegetables" },
      { label: "Fruits", href: "/products?category=fruits" },
      { label: "Herbs", href: "/products?category=herbs" },
      { label: "Grains", href: "/products?category=grains" },
    ],
  },
  {
    heading: "Farmers",
    links: [
      { label: "Join as Farmer", href: "/register?role=farmer" },
      { label: "Farmer Dashboard", href: "/FamerDashbord" },
      { label: "Success Stories", href: "#" },
      { label: "Certification", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

// ─── Page Component ───────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 1 — HERO
        ───────────────────────────────────────────────────────────────────── */}
        <section
          id="hero"
          className="min-h-screen bg-gradient-to-br from-[#F0FBF1] via-[#D8F3DC] to-[#B7E4C7] flex items-center pt-28 pb-20 px-6 relative overflow-hidden"
        >
          {/* Decorative floating leaves */}
          {["🍃", "🌿", "🍂", "🌱"].map((leaf, i) => (
            <span
              key={i}
              className="animate-float-leaf absolute select-none pointer-events-none"
              style={{
                fontSize: `${1.5 + i * 0.5}rem`,
                opacity: 0.2,
                top: `${15 + i * 18}%`,
                right: `${5 + i * 4}%`,
                animationDelay: `${i * 0.8}s`,
              }}
            >
              {leaf}
            </span>
          ))}

          {/* Subtle radial gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(255,183,3,0.06), transparent)",
            }}
          />

          <div className="max-w-[1280px] mx-auto px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left — Text content */}
              <div className="animate-fade-in-up">
                {/* Live badge */}
                <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-sm border border-[#D0EDD8] rounded-full px-5 py-2 mb-8 shadow-[0_4px_24px_rgba(45,106,79,0.08)]">
                  <span className="animate-pulse-dot w-2.5 h-2.5 rounded-full bg-[#22C55E] inline-block" />
                  <span className="text-[0.82rem] font-semibold text-[#2D6A4F] tracking-[0.01em]">
                    Live Marketplace — 1,240 products fresh today
                  </span>
                </div>

                <h1
                  className="text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold leading-[1.12] text-[#1B4332] mb-6"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Harvested Today,
                  <br />
                  <span className="text-[#FFB703] relative">
                    On Your Table
                    <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-[#FFB703]/30" />
                  </span>{" "}
                  Tomorrow
                </h1>

                <p className="text-[1.1rem] text-[#4A6355] leading-[1.85] max-w-[500px] mb-10">
                  Connect directly with{" "}
                  <strong className="text-[#2D6A4F]">
                    500+ verified Sri Lankan farmers
                  </strong>
                  . Skip the middleman — get chemical-free, garden-fresh produce
                  at fair prices, delivered in 24 hours.
                </p>

                {/* CTAs */}
                <div className="flex gap-10  flex-wrap mt-7 mb-12 p-6 ">
                  <Link
                    href="/products"
                    id="hero-shop-cta"
                    className="no-underline bg-[#FFB703] text-[#1A2E22] font-extrabold text-base px-9 py-4 rounded-full shadow-[0_8px_30px_rgba(255,183,3,0.35)] inline-flex items-center gap-2.5 hover:bg-[#E09F00] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,183,3,0.45)] transition-all duration-200 active:translate-y-0"
                  >
                    Shop Fresh Now 🛒
                  </Link>
                  <Link
                    href="/farmers"
                    id="hero-farmers-cta"
                    className="no-underline bg-transparent text-[#2D6A4F] font-bold text-base px-8 py-4 rounded-full border-2 border-[#2D6A4F] inline-flex items-center gap-2 hover:bg-[#2D6A4F] hover:text-white hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Meet Our Farmers 👨‍🌾
                  </Link>
                </div>

                {/* Mini trust signals */}
                <div className="flex gap-8 flex-wrap mt-12">
                  {[
                    "✅ No Middlemen",
                    "🌿 Chemical-Free",
                    "⚡ 24h Delivery",
                  ].map((item) => (
                    <span
                      key={item}
                      className="text-[0.85rem] text-[#4A6355] font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — Hero visual card */}
              <div className="animate-fade-in-up delay-300 relative">
                <div className="rounded-[28px] overflow-hidden shadow-[0_30px_80px_rgba(45,106,79,0.22)] aspect-[4/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=700&h=525&fit=crop"
                    alt="Fresh vegetables from Sri Lankan farm"
                    className="w-full h-full object-cover"
                  />
                  {/* Floating price card */}
                  <div className="absolute bottom-6 left-6 bg-white/85 backdrop-blur-[16px] border border-[#D0EDD8]/50 rounded-[20px] px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-3.5">
                    <span className="text-[2rem]">🥬</span>
                    <div>
                      <p className="font-extrabold text-[0.95rem] text-[#1A2E22] m-0">
                        Baby Leeks
                      </p>
                      <p className="text-[0.75rem] text-[#8FAF9A] m-0 mt-0.5">
                        🕐 Harvested 2h ago
                      </p>
                      <p className="font-extrabold text-[1.05rem] text-[#2D6A4F] m-0 mt-1">
                        Rs. 180{" "}
                        <span className="text-[0.75rem] text-[#8FAF9A] font-normal">
                          / bunch
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating stats pill */}
                <div className="absolute -top-3 -right-3 bg-[#FFB703] rounded-2xl px-5 py-3.5 shadow-[0_8px_30px_rgba(255,183,3,0.35)] text-center">
                  <p
                    className="font-extrabold text-2xl text-[#1A2E22] m-0"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    500+
                  </p>
                  <p className="text-[0.72rem] font-bold text-[#1A2E22]/80 m-0 mt-0.5">
                    Verified Farmers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 2 — PROBLEM vs SOLUTION
        ───────────────────────────────────────────────────────────────────── */}
        <section id="problem-solution" className="py-28 px-6 bg-white">
          <div className="max-w-[1100px] mx-auto px-6 pb-[20px] flex w-full">
            <div className="text-center mb-16">
                  <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] inline-block mb-3 text-[#2D6A4F]">The Problem</span>
              <h2
                className="font-serif font-extrabold text-[#1A2E22] leading-[1.2] mb-2 text-[clamp(1.8rem,3.5vw,2.8rem)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Your Supermarket Produce Traveled{" "}
                <br className="hidden sm:block" />
                Further Than You Did Last Month
              </h2>
            </div>

            <div className="grid grid-cols-1 mt-16 md:grid-cols-[1fr_auto_1fr] gap-8 items-stretch">
              {/* Old Way */}
              <div className="bg-[#FFF5F5] border-2 border-[#FFD0D0] rounded-[24px] p-8 lg:p-10">
                <h3 className="font-extrabold text-[#C53030] text-[1.1rem] mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#FED7D7] flex items-center justify-center text-sm">
                    ❌
                  </span>
                  Traditional Supermarket
                </h3>
                {[
                  "Farmer → Collector → Wholesale → Distributor → Supermarket → You",
                  "5–7 days old produce by the time it reaches you",
                  "Pesticides & wax coatings to extend shelf life",
                  "Farmer earns only 20% of what you pay",
                ].map((item) => (
                  <div key={item} className="flex gap-3 mb-4 items-start">
                    <span className="text-[#FC8181] flex-shrink-0 mt-1 text-[0.9rem]">
                      ✗
                    </span>
                    <p className="text-[0.9rem] text-[#744210] m-0 leading-[1.7]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* VS divider */}
              <div className="flex md:flex-col items-center gap-2 justify-center py-4 md:py-0">
                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-[#D0EDD8] to-transparent" />
                <div className="md:hidden h-px w-16 bg-gradient-to-r from-transparent via-[#D0EDD8] to-transparent" />
                <span
                  className="font-extrabold text-[1.1rem] text-[#8FAF9A] px-4 py-2.5 border-2 border-[#D0EDD8] rounded-full bg-white"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  VS
                </span>
                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-[#D0EDD8] to-transparent" />
                <div className="md:hidden h-px w-16 bg-gradient-to-r from-transparent via-[#D0EDD8] to-transparent" />
              </div>

              {/* Fresh Direct Way */}
              <div className="bg-[#F0FBF1] border-2 border-[#D0EDD8] rounded-[24px] p-8 lg:p-10">
                <h3 className="font-extrabold text-[#2D6A4F] text-[1.1rem] mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#D8F3DC] flex items-center justify-center text-sm">
                    ✅
                  </span>
                  Fresh Direct Way
                </h3>
                {[
                  "Farmer → You (Direct!). Two steps, maximum freshness.",
                  "Harvested today, delivered to your door within 24 hours",
                  "100% chemical-free, naturally grown produce",
                  "Farmer earns up to 80% of what you pay — fair & transparent",
                ].map((item) => (
                  <div key={item} className="flex gap-3 mb-4 items-start">
                    <span className="text-[#2D6A4F] flex-shrink-0 mt-1 text-[0.9rem]">
                      ✓
                    </span>
                    <p className="text-[0.9rem] text-[#4A6355] m-0 leading-[1.7]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 3 — TRUST BAR / STATS
        ───────────────────────────────────────────────────────────────────── */}
        <section
          id="trust-bar"
          className="bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] py-20 px-6 relative overflow-hidden"
        >
          {/* Subtle dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="max-w-[1100px] mx-auto px-6 pb-[20px] flex w-full relative z-[1]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {STATS.map((s) => (
                <div key={s.label} className="group">
                  <div className="text-[2.5rem] mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    {s.icon}
                  </div>
                  <div
                    className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-[#FFB703] leading-none"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[0.9rem] text-white/70 mt-2 font-medium tracking-[0.02em]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 4 — HOW IT WORKS
        ───────────────────────────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-28 px-6 bg-[#FAFFF8]">
          <div className="max-w-[1100px] mx-auto px-6 pb-[20px] flex w-full">
            <div className="text-center mb-16">
              <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] inline-block mb-3 text-[#FFB703]">
                Simple Process
              </span>
              <h2
                className="font-serif font-extrabold text-[#1A2E22] leading-[1.2] mb-2 text-[clamp(1.8rem,3.5vw,2.6rem)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                From Field to Fork in 3 Simple Steps
              </h2>
              <p className="text-[0.95rem] text-[#4A6355] leading-[1.7] mt-2 max-w-[520px] mx-auto">
                We&apos;ve made it effortless to get the freshest produce
                straight from the farm to your kitchen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-[4.5rem] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-[2px] bg-gradient-to-r from-[#D0EDD8] via-[#52B788] to-[#D0EDD8] z-0 opacity-60" />

              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  id={`step-${i + 1}`}
                  className="bg-white rounded-3xl p-8 lg:p-10 text-center shadow-[0_4px_24px_rgba(45,106,79,0.06)] border border-[#D0EDD8] relative z-[1] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(45,106,79,0.14)]"
                >
                  {/* Step icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D6A4F] to-[#52B788] text-white font-extrabold text-[1.1rem] mb-6 relative shadow-[0_6px_20px_rgba(45,106,79,0.25)]">
                    <span className="text-[1.8rem]">{step.icon}</span>
                    <span className="absolute -top-2 -right-2 bg-[#FFB703] text-[#1A2E22] text-[0.65rem] font-extrabold w-[24px] h-[24px] rounded-full flex items-center justify-center shadow-sm">
                      {step.num}
                    </span>
                  </div>
                  <h3
                    className="text-[1.25rem] font-bold text-[#1A2E22] mb-3"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[0.9rem] text-[#4A6355] leading-[1.75] m-0">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 5 — FEATURED MARKETPLACE
        ───────────────────────────────────────────────────────────────────── */}
        <section id="marketplace" className="py-28 px-6 bg-white">
          <div className="max-w-[1280px] mx-auto px-6 w-full">
            <div className="flex justify-between items-end mb-14 flex-wrap gap-6">
              <div>
                <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] inline-block mb-3 text-[#2D6A4F]">
                  Live Marketplace
                </span>
                <h2
                  className="font-serif font-extrabold text-[#1A2E22] leading-[1.2] mb-2 text-[clamp(1.8rem,3vw,2.4rem)]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Fresh From the Fields Today
                </h2>
                <p className="text-[0.95rem] text-[#4A6355] leading-[1.7] mt-2">
                  Prices update dynamically based on real-time demand
                </p>
              </div>
              <Link
                href="/products"
                id="see-all-products"
                className="no-underline font-bold text-[0.9rem] text-[#2D6A4F] border-2 border-[#2D6A4F] px-7 py-3 rounded-full whitespace-nowrap hover:bg-[#2D6A4F] hover:text-white hover:-translate-y-0.5 transition-all duration-200"
              >
                See All Products →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {FEATURED_PRODUCTS.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 6 — FARMER OF THE MONTH SPOTLIGHT
        ───────────────────────────────────────────────────────────────────── */}
        <section
          id="farmer-spotlight"
          className="py-28 px-6 bg-gradient-to-b from-[#D8F3DC] to-[#E8F5E9]"
        >
          <div className="max-w-[1100px] mx-auto px-6 pb-[20px] flex w-full">
            <div className="text-center mb-14">
              <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] inline-block mb-3 text-[#FFB703]">
                🏆 Farmer Spotlight
              </span>
              <h2
                className="font-serif font-extrabold text-[#1B4332] leading-[1.2] mb-2 text-[clamp(1.8rem,3.5vw,2.6rem)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Farmer of the Month
              </h2>
              <p className="text-[0.95rem] text-[#4A6355] leading-[1.7] mt-2">
                Meet the dedicated growers behind your food
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch bg-white rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(45,106,79,0.15)]">
              {/* Photo side */}
              <div className="relative min-h-[400px] md:min-h-[460px]">
                <img
                  src="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&h=460&fit=crop"
                  alt="Farmer Nimal Perera at Green Hills Farm, Nuwara Eliya"
                  className="w-full h-full object-cover absolute inset-0"
                />
                {/* Overlay badge */}
                <div className="absolute bottom-6 left-6 bg-[rgba(255,183,3,0.95)] backdrop-blur-sm rounded-2xl px-5 py-3">
                  <p className="font-extrabold text-[0.85rem] text-[#1A2E22] m-0">
                    🏆 Farmer of the Month
                  </p>
                  <p className="text-[0.75rem] text-[#1A2E22]/70 m-0 mt-0.5">
                    April 2026
                  </p>
                </div>
              </div>

              {/* Content side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-1">
                  <h3
                    className="text-[1.8rem] font-extrabold text-[#1B4332] m-0"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {FEATURED_FARMER.farmerName}
                  </h3>
                  <span className="bg-[#2D6A4F] text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-[0.75rem] flex-shrink-0">
                    ✓
                  </span>
                </div>
                <p className="text-[#FFB703] font-bold text-[0.95rem] mb-1 mt-1">
                  {FEATURED_FARMER.farmName}
                </p>
                <p className="text-[#8FAF9A] text-[0.85rem] mb-6">
                  📍 {FEATURED_FARMER.location}
                </p>

                <p className="text-[#4A6355] leading-[1.85] text-[0.95rem] mb-8 m-0">
                  {FEATURED_FARMER.bio}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    {
                      val: `${FEATURED_FARMER.productCount}`,
                      label: "Products",
                    },
                    { val: `${FEATURED_FARMER.rating}★`, label: "Rating" },
                    { val: `${FEATURED_FARMER.reviewCount}`, label: "Reviews" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="text-center py-3.5 px-2 bg-[#F0FBF1] rounded-xl border border-[#D0EDD8]"
                    >
                      <p
                        className="font-extrabold text-[1.3rem] text-[#2D6A4F] m-0"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {s.val}
                      </p>
                      <p className="text-[0.75rem] text-[#8FAF9A] m-0 mt-1">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="flex gap-2 flex-wrap mb-8">
                  {FEATURED_FARMER.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="text-[0.78rem] bg-[#D8F3DC] text-[#2D6A4F] px-3.5 py-1.5 rounded-full font-semibold"
                    >
                      {cert}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/farmers/${FEATURED_FARMER.id}`}
                  id="view-spotlight-farmer"
                  className="no-underline inline-flex items-center gap-2 bg-[#2D6A4F] text-white font-bold text-[0.95rem] px-8 py-3.5 rounded-full hover:bg-[#1B4332] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.3)] transition-all duration-200 self-start"
                >
                  Visit Farm Profile →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 7 — SOCIAL PROOF / REVIEWS
        ───────────────────────────────────────────────────────────────────── */}
        <section id="reviews" className="py-28 px-6 bg-white">
          <div className="max-w-[1100px] mx-auto px-6 pb-[20px] flex w-full">
            <div className="text-center mb-14">
              <span className="text-[0.8rem] font-bold uppercase tracking-[0.14em] inline-block mb-3 text-[#2D6A4F]">Social Proof</span>
              <h2
                className="font-serif font-extrabold text-[#1A2E22] leading-[1.2] mb-2 text-[clamp(1.8rem,3.5vw,2.6rem)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                10,000+ Families Choose Fresh Direct
              </h2>
              <div className="flex justify-center gap-1 mt-4 text-[1.3rem]">
                {"⭐⭐⭐⭐⭐"}
              </div>
              <p className="text-[#8FAF9A] text-[0.88rem] mt-2">
                4.9 / 5 average from 3,200+ reviews
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {REVIEWS.map((review) => (
                <div
                  key={review.id}
                  id={`review-${review.id}`}
                  className="bg-[#FAFFF8] rounded-[24px] p-8 border border-[#D0EDD8] flex flex-col gap-5 relative transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(45,106,79,0.12)]"
                >
                  {/* Quote mark */}
                  <span
                    className="absolute top-5 right-6 text-[4rem] text-[#D0EDD8] leading-none select-none pointer-events-none"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    &ldquo;
                  </span>

                  {/* Stars */}
                  <div className="text-base">{"⭐".repeat(review.rating)}</div>

                  {/* Review text */}
                  <p className="text-[0.92rem] text-[#4A6355] leading-[1.75] m-0 relative z-[1]">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Product reference */}
                  <div className="bg-[#D8F3DC] rounded-xl px-4 py-2.5">
                    <p className="text-[0.78rem] text-[#2D6A4F] font-semibold m-0">
                      🌿 {review.product}
                    </p>
                  </div>

                  {/* Reviewer */}
                  <div className="flex items-center gap-3.5 mt-auto">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-[44px] h-[44px] rounded-full object-cover border-[3px] border-[#D8F3DC]"
                    />
                    <div>
                      <p className="font-bold text-[0.88rem] text-[#1A2E22] m-0">
                        {review.name}
                      </p>
                      <p className="text-[0.78rem] text-[#8FAF9A] m-0 mt-0.5">
                        📍 {review.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────
            SECTION 8 — FINAL CTA BANNER
        ───────────────────────────────────────────────────────────────────── */}
        <section
          id="cta-banner"
          className="py-32 px-6 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#1B4332] text-center relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-[-80px] left-[-80px] w-[280px] h-[280px] rounded-full bg-[#52B788]/10 pointer-events-none" />
          <div className="absolute bottom-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full bg-[#FFB703]/10 pointer-events-none" />

          <div className="max-w-[700px] mx-auto relative z-[1]">
            <h2
              className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-white mb-6 leading-[1.2]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Ready to Taste the Difference?
            </h2>
            <p className="text-white/75 text-[1.05rem] mb-12 leading-[1.75]">
              Join 10,000+ Sri Lankan families already enjoying farm-fresh
              produce.
              <br />
              Your first box ships free!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/register"
                id="final-register-cta"
                className="no-underline bg-[#FFB703] text-[#1A2E22] font-extrabold text-[1.05rem] px-10 py-4 rounded-full shadow-[0_8px_30px_rgba(255,183,3,0.35)] hover:bg-[#E09F00] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,183,3,0.45)] transition-all duration-200"
              >
                Get Started Free 🚀
              </Link>
              <Link
                href="/products"
                id="final-browse-cta"
                className="no-underline bg-transparent text-white font-bold text-[1.05rem] px-10 py-4 rounded-full border-2 border-white/40 hover:bg-white/10 hover:border-white/60 transition-all duration-200"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER — Separated from <main> with generous top spacing
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer
        id="site-footer"
        className="bg-[#0F2B1D] pt-28 pb-10 px-6 relative overflow-hidden"
      >
        {/* Subtle top-border glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#52B788]/40 to-transparent" />

        <div className="max-w-[1280px] mx-auto px-6 w-full">
          {/* ── Footer top grid ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2.5fr_1fr_1fr_1fr] gap-x-12 gap-y-14 mb-16">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-2xl">🌿</span>
                <span
                  className="text-[1.4rem] font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Fresh<span className="text-[#FFB703]">Direct</span>
                </span>
              </div>
              <p className="text-[0.9rem] leading-[1.8] text-white/50 max-w-[300px] mb-6">
                Connecting Sri Lankan farmers directly with families who care
                about what they eat. Harvested today, on your table tomorrow.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-4">
                {[
                  { label: "Facebook", icon: "f" },
                  { label: "Twitter", icon: "𝕏" },
                  { label: "Instagram", icon: "📷" },
                  { label: "WhatsApp", icon: "💬" },
                ].map((social) => (
                  <Link
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="no-underline w-10 h-10 rounded-full bg-white/[0.07] border border-white/[0.1] flex items-center justify-center text-white/50 text-sm hover:bg-[#2D6A4F] hover:text-white hover:border-[#2D6A4F] transition-all duration-200"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h4 className="text-white font-bold text-[0.85rem] uppercase tracking-[0.12em] mb-6">
                  {col.heading}
                </h4>
                <ul className="list-none flex flex-col gap-3.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="no-underline text-[0.88rem] text-white/45 hover:text-[#FFB703] hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Newsletter bar ──────────────────────────────────────────────── */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 md:p-10 mb-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4
                  className="text-white font-bold text-[1.15rem] mb-1"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Stay Fresh 🌱
                </h4>
                <p className="text-white/45 text-[0.88rem] m-0">
                  Weekly picks, seasonal recipes, and exclusive farmer stories
                  delivered to your inbox.
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="bg-white/[0.08] border border-white/[0.12] text-white placeholder:text-white/30 rounded-full px-6 py-3 text-[0.88rem] outline-none focus:border-[#FFB703]/50 focus:bg-white/[0.1] transition-all duration-200 w-full md:w-[280px]"
                />
                <button
                  type="button"
                  className="bg-[#FFB703] text-[#1A2E22] font-bold text-[0.88rem] px-7 py-3 rounded-full whitespace-nowrap hover:bg-[#E09F00] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,183,3,0.3)] transition-all duration-200 cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* ── Footer bottom bar ───────────────────────────────────────────── */}
          <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[0.82rem] text-white/35 m-0">
              © 2026 Fresh Direct. Made with 💚 in Sri Lanka
            </p>
            <div className="flex gap-6">
              {LEGAL_LINKS.map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="no-underline text-[0.82rem] text-white/35 hover:text-white/60 transition-colors duration-200"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
