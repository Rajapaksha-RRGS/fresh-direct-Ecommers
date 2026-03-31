import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ProductCard, { ProductCardProps } from "@/components/product/ProductCard";
import FarmerCard, { FarmerCardProps } from "@/components/farmer/FarmerCard";

// ─── Static Demo Data (replace with MongoDB fetch in Phase 3) ─────────────────
const FEATURED_PRODUCTS: ProductCardProps[] = [
  {
    id: "p1", name: "Baby Spinach", category: "Vegetables",
    basePrice: 220, currentPrice: 264, demandFactor: 1.35,
    unit: "500g", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 4 * 3600000).toISOString(),
    farmerId: "f1", farmerName: "Nimal Perera", farmLocation: "Nuwara Eliya",
    stockQty: 28, isOrganic: true,
  },
  {
    id: "p2", name: "King Coconut", category: "Fruits",
    basePrice: 120, currentPrice: 96, demandFactor: 0.8,
    unit: "piece", image: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 8 * 3600000).toISOString(),
    farmerId: "f2", farmerName: "Sudu Banda", farmLocation: "Kurunegala",
    stockQty: 4, isOrganic: false,
  },
  {
    id: "p3", name: "Cherry Tomatoes", category: "Vegetables",
    basePrice: 380, currentPrice: 399, demandFactor: 1.05,
    unit: "kg", image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 6 * 3600000).toISOString(),
    farmerId: "f3", farmerName: "Kamala Devi", farmLocation: "Jaffna",
    stockQty: 15, isOrganic: true,
  },
  {
    id: "p4", name: "Red Lotus Rice", category: "Grains",
    basePrice: 560, currentPrice: 560, demandFactor: 1.0,
    unit: "kg", image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    farmerId: "f4", farmerName: "Ravi Kumaran", farmLocation: "Polonnaruwa",
    stockQty: 50, isOrganic: false,
  },
  {
    id: "p5", name: "Murunga Leaves", category: "Herbs",
    basePrice: 80, currentPrice: 104, demandFactor: 1.4,
    unit: "bunch", image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 2 * 3600000).toISOString(),
    farmerId: "f1", farmerName: "Nimal Perera", farmLocation: "Nuwara Eliya",
    stockQty: 8, isOrganic: true,
  },
  {
    id: "p6", name: "Pineapple", category: "Fruits",
    basePrice: 350, currentPrice: 315, demandFactor: 0.9,
    unit: "piece", image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=300&fit=crop",
    harvestDate: new Date(Date.now() - 12 * 3600000).toISOString(),
    farmerId: "f5", farmerName: "Saman Wickrama", farmLocation: "Gampaha",
    stockQty: 22, isOrganic: false,
  },
];

const FEATURED_FARMER: FarmerCardProps = {
  id: "f1", farmerName: "Nimal Perera", farmName: "Green Hills Farm",
  location: "Nuwara Eliya, Central Province",
  bio: "Third-generation farmer specializing in highland vegetables. Our farm sits at 1,800m elevation, producing some of the finest organic greens in Sri Lanka. We believe in sustainable farming that respects both nature and the consumer.",
  image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=200&h=200&fit=crop",
  productCount: 14, certifications: ["Organic Certified", "SL GAP", "Chemical-Free"],
  isVerified: true, rating: 4.9, reviewCount: 234,
};

const REVIEWS = [
  { id: "r1", name: "Sachini Fernando", location: "Colombo 7", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=60&h=60&fit=crop&face", rating: 5, text: "Absolutely incredible quality! The spinach was so fresh it still had dew on it. Delivered within 12 hours of ordering. My family couldn't believe it!", product: "Baby Spinach from Nimal Perera" },
  { id: "r2", name: "Dinesh Jayawardena", location: "Kandy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&face", rating: 5, text: "Finally, a platform that connects us to the real source! The tomatoes were perfect and the price was much better than the supermarket.", product: "Cherry Tomatoes from Kamala Devi" },
  { id: "r3", name: "Priya Ratnayake", location: "Nugegoda", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&face", rating: 5, text: "I love that I can see exactly which farmer grew my food. The king coconuts from Sudu Banda were the sweetest I've ever had!", product: "King Coconut from Sudu Banda" },
];

const STATS = [
  { value: "500+", label: "Verified Farmers", icon: "👨‍🌾" },
  { value: "10K+", label: "Happy Families", icon: "🏠" },
  { value: "24h", label: "Max Delivery Time", icon: "⚡" },
  { value: "98%", label: "Freshness Rating", icon: "🌿" },
];

const STEPS = [
  { num: "01", icon: "🔍", title: "Browse & Choose", desc: "Search thousands of fresh produce listings from verified Sri Lankan farmers. Filter by category, location, or harvest date." },
  { num: "02", icon: "🌾", title: "Farmer Harvests", desc: "Your order triggers a real-time harvest notification to the farmer. Produce is picked fresh, same day — no cold storage delays." },
  { num: "03", icon: "🚚", title: "Delivered Fresh", desc: "Farm-direct to your door within 24 hours. Track your order in real-time via WhatsApp or SMS updates." },
];

// ─── Page Component ───────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ── 1. HERO SECTION ─────────────────────────────────────────────── */}
        <section
          id="hero"
          style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg, #F0FBF1 0%, #D8F3DC 40%, #B7E4C7 100%)",
            display: "flex",
            alignItems: "center",
            padding: "7rem 1.5rem 4rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative floating leaves */}
          {["🍃", "🌿", "🍂", "🌱"].map((leaf, i) => (
            <span
              key={i}
              className="animate-float-leaf"
              style={{
                position: "absolute",
                fontSize: `${1.5 + i * 0.5}rem`,
                opacity: 0.25,
                top: `${15 + i * 18}%`,
                right: `${5 + i * 4}%`,
                animationDelay: `${i * 0.8}s`,
                userSelect: "none",
              }}
            >
              {leaf}
            </span>
          ))}

          <div style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            {/* Left: Text */}
            <div className="animate-fade-in-up">
              {/* Live badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "white", border: "1px solid var(--color-border)", borderRadius: "50px", padding: "0.4rem 1rem", marginBottom: "1.5rem", boxShadow: "var(--shadow-card)" }}>
                <span className="animate-pulse-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-forest)" }}>Live Marketplace — 1,240 products fresh today</span>
              </div>

              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.15, color: "var(--color-forest-dark)", marginBottom: "1.25rem" }}>
                Harvested Today,<br />
                <span style={{ color: "var(--color-golden)", WebkitTextStroke: "0px" }}>On Your Table</span>{" "}
                Tomorrow
              </h1>

              <p style={{ fontSize: "1.1rem", color: "var(--color-text-mid)", lineHeight: 1.8, maxWidth: "480px", marginBottom: "2rem" }}>
                Connect directly with <strong>500+ verified Sri Lankan farmers</strong>. Skip the middleman — get chemical-free, garden-fresh produce at fair prices, delivered in 24 hours.
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
                <Link
                  href="/products"
                  id="hero-shop-cta"
                  style={{
                    textDecoration: "none",
                    background: "var(--color-golden)",
                    color: "#1A2E22",
                    fontWeight: 800,
                    fontSize: "1rem",
                    padding: "0.9rem 2.2rem",
                    borderRadius: "50px",
                    boxShadow: "var(--shadow-cta)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "all 0.25s ease",
                  }}
                >
                  Shop Fresh Now 🛒
                </Link>
                <Link
                  href="/farmers"
                  id="hero-farmers-cta"
                  style={{
                    textDecoration: "none",
                    background: "transparent",
                    color: "var(--color-forest)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    padding: "0.9rem 2rem",
                    borderRadius: "50px",
                    border: "2px solid var(--color-forest)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  Meet Our Farmers 👨‍🌾
                </Link>
              </div>

              {/* Mini trust signals */}
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                {["✅ No Middlemen", "🌿 Chemical-Free", "⚡ 24h Delivery"].map((item) => (
                  <span key={item} style={{ fontSize: "0.85rem", color: "var(--color-text-mid)", fontWeight: 500 }}>{item}</span>
                ))}
              </div>
            </div>

            {/* Right: Hero visual card */}
            <div className="animate-fade-in-up delay-300" style={{ position: "relative" }}>
              <div style={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 30px 80px rgba(45,106,79,0.25)", aspectRatio: "4/3", position: "relative" }}>
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=700&h=525&fit=crop"
                  alt="Fresh vegetables from Sri Lankan farm"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* Floating price card */}
                <div style={{
                  position: "absolute", bottom: "1.5rem", left: "1.5rem",
                  background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
                  borderRadius: "16px", padding: "0.9rem 1.2rem",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  display: "flex", alignItems: "center", gap: "0.75rem",
                }}>
                  <span style={{ fontSize: "2rem" }}>🥬</span>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--color-text-dark)", margin: 0 }}>Baby Leeks</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", margin: 0 }}>🕐 Harvested 2h ago</p>
                    <p style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-forest)", margin: 0 }}>Rs. 180 <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)", fontWeight: 400 }}>/ bunch</span></p>
                  </div>
                </div>
              </div>

              {/* Floating stats pill */}
              <div style={{
                position: "absolute", top: "-1rem", right: "-1rem",
                background: "var(--color-golden)", borderRadius: "16px",
                padding: "0.75rem 1.25rem", boxShadow: "var(--shadow-cta)",
                textAlign: "center",
              }}>
                <p style={{ fontFamily: "var(--font-serif)", fontWeight: 800, fontSize: "1.5rem", color: "#1A2E22", margin: 0 }}>500+</p>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1A2E22", margin: 0 }}>Verified Farmers</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. PROBLEM / SOLUTION ───────────────────────────────────────── */}
        <section id="problem-solution" style={{ padding: "5rem 1.5rem", background: "var(--color-white)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-forest)", textTransform: "uppercase", letterSpacing: "0.12em" }}>The Problem</span>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "var(--color-text-dark)", marginTop: "0.5rem" }}>
                Your Supermarket Produce Traveled Further<br />Than You Did Last Month
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "2rem", alignItems: "center" }}>
              {/* Old Way */}
              <div style={{ background: "#FFF5F5", border: "2px solid #FFD0D0", borderRadius: "20px", padding: "2rem" }}>
                <h3 style={{ fontWeight: 800, color: "#C53030", fontSize: "1.05rem", marginBottom: "1.25rem" }}>❌ Traditional Supermarket</h3>
                {[
                  "Farmer → Collector → Wholesale → Distributor → Supermarket → You",
                  "5–7 days old produce by the time it reaches you",
                  "Pesticides & wax coatings to extend shelf life",
                  "Farmer earns only 20% of what you pay",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ color: "#FC8181", flexShrink: 0, marginTop: "2px" }}>✗</span>
                    <p style={{ fontSize: "0.88rem", color: "#744210", margin: 0, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>

              {/* VS divider */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "1px", height: "60px", background: "var(--color-border)" }} />
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 800, fontSize: "1.2rem", color: "var(--color-text-light)", padding: "0.5rem 0.75rem", border: "1px solid var(--color-border)", borderRadius: "50%" }}>VS</span>
                <div style={{ width: "1px", height: "60px", background: "var(--color-border)" }} />
              </div>

              {/* Fresh Direct Way */}
              <div style={{ background: "var(--color-mint-light)", border: "2px solid var(--color-border)", borderRadius: "20px", padding: "2rem" }}>
                <h3 style={{ fontWeight: 800, color: "var(--color-forest)", fontSize: "1.05rem", marginBottom: "1.25rem" }}>✅ Fresh Direct Way</h3>
                {[
                  "Farmer → You (Direct!). Two steps, maximum freshness.",
                  "Harvested today, delivered to your door within 24 hours",
                  "100% chemical-free, naturally grown produce",
                  "Farmer earns up to 80% of what you pay — fair & transparent",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--color-forest)", flexShrink: 0, marginTop: "2px" }}>✓</span>
                    <p style={{ fontSize: "0.88rem", color: "var(--color-text-mid)", margin: 0, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. TRUST BAR / STATS ────────────────────────────────────────── */}
        <section id="trust-bar" style={{ background: "linear-gradient(135deg, var(--color-forest), var(--color-forest-dark))", padding: "4rem 1.5rem" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", textAlign: "center" }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--color-golden)", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.75)", marginTop: "0.4rem", fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. HOW IT WORKS ─────────────────────────────────────────────── */}
        <section id="how-it-works" style={{ padding: "5rem 1.5rem", background: "var(--color-off-white)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-golden)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Simple Process</span>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, color: "var(--color-text-dark)", marginTop: "0.5rem" }}>
                From Field to Fork in 3 Simple Steps
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", position: "relative" }}>
              {/* Connecting line */}
              <div style={{ position: "absolute", top: "3.5rem", left: "calc(16.67% + 2rem)", right: "calc(16.67% + 2rem)", height: "2px", background: "var(--color-border)", zIndex: 0 }} />

              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  id={`step-${i + 1}`}
                  style={{
                    background: "white",
                    borderRadius: "24px",
                    padding: "2rem",
                    textAlign: "center",
                    boxShadow: "var(--shadow-card)",
                    border: "1px solid var(--color-border)",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {/* Step number */}
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "50%", background: "var(--color-forest)", color: "white", fontWeight: 800, fontSize: "1.1rem", marginBottom: "1.25rem", position: "relative" }}>
                    <span style={{ fontSize: "1.6rem" }}>{step.icon}</span>
                    <span style={{ position: "absolute", top: "-8px", right: "-8px", background: "var(--color-golden)", color: "#1A2E22", fontSize: "0.65rem", fontWeight: 800, width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {step.num}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-text-dark)", marginBottom: "0.75rem" }}>{step.title}</h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--color-text-mid)", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. FEATURED MARKETPLACE ─────────────────────────────────────── */}
        <section id="marketplace" style={{ padding: "5rem 1.5rem", background: "var(--color-white)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-forest)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Live Marketplace</span>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "var(--color-text-dark)", marginTop: "0.4rem" }}>
                  Fresh From the Fields Today
                </h2>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-mid)", marginTop: "0.25rem" }}>Prices update dynamically based on real-time demand</p>
              </div>
              <Link
                href="/products"
                id="see-all-products"
                style={{
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "var(--color-forest)",
                  border: "2px solid var(--color-forest)",
                  padding: "0.6rem 1.5rem",
                  borderRadius: "50px",
                  whiteSpace: "nowrap",
                }}
              >
                See All Products →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {FEATURED_PRODUCTS.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. FARMER OF THE MONTH SPOTLIGHT ────────────────────────────── */}
        <section id="farmer-spotlight" style={{ padding: "5rem 1.5rem", background: "var(--color-mint)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-golden)", textTransform: "uppercase", letterSpacing: "0.12em" }}>🏆 Farmer Spotlight</span>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, color: "var(--color-forest-dark)", marginTop: "0.5rem" }}>
                Farmer of the Month
              </h2>
              <p style={{ color: "var(--color-text-mid)", marginTop: "0.5rem" }}>Meet the dedicated growers behind your food</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", background: "white", borderRadius: "28px", overflow: "hidden", boxShadow: "var(--shadow-hover)" }}>
              {/* Photo side */}
              <div style={{ position: "relative", height: "460px" }}>
                <img
                  src="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&h=460&fit=crop"
                  alt="Farmer Nimal Perera at Green Hills Farm, Nuwara Eliya"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* Overlay badge */}
                <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", background: "rgba(255,183,3,0.95)", borderRadius: "14px", padding: "0.7rem 1.2rem" }}>
                  <p style={{ fontWeight: 800, fontSize: "0.85rem", color: "#1A2E22", margin: 0 }}>🏆 Farmer of the Month</p>
                  <p style={{ fontSize: "0.75rem", color: "#1A2E22", margin: 0, opacity: 0.8 }}>April 2026</p>
                </div>
              </div>

              {/* Content side */}
              <div style={{ padding: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-forest-dark)" }}>
                    {FEATURED_FARMER.farmerName}
                  </h3>
                  <span style={{ background: "var(--color-forest)", color: "white", borderRadius: "50%", width: "24px", height: "24px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", flexShrink: 0 }}>✓</span>
                </div>
                <p style={{ color: "var(--color-golden)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{FEATURED_FARMER.farmName}</p>
                <p style={{ color: "var(--color-text-light)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>📍 {FEATURED_FARMER.location}</p>

                <p style={{ color: "var(--color-text-mid)", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                  {FEATURED_FARMER.bio}
                </p>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.75rem" }}>
                  {[
                    { val: `${FEATURED_FARMER.productCount}`, label: "Products" },
                    { val: `${FEATURED_FARMER.rating}★`, label: "Rating" },
                    { val: `${FEATURED_FARMER.reviewCount}`, label: "Reviews" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center", padding: "0.75rem", background: "var(--color-mint-light)", borderRadius: "12px" }}>
                      <p style={{ fontFamily: "var(--font-serif)", fontWeight: 800, fontSize: "1.3rem", color: "var(--color-forest)", margin: 0 }}>{s.val}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", margin: 0 }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
                  {FEATURED_FARMER.certifications.map((cert) => (
                    <span key={cert} style={{ fontSize: "0.78rem", background: "var(--color-mint)", color: "var(--color-forest)", padding: "4px 12px", borderRadius: "50px", fontWeight: 600 }}>
                      {cert}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/farmers/${FEATURED_FARMER.id}`}
                  id="view-spotlight-farmer"
                  style={{
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "var(--color-forest)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    padding: "0.85rem 2rem",
                    borderRadius: "50px",
                  }}
                >
                  Visit Farm Profile →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. SOCIAL PROOF / REVIEWS ───────────────────────────────────── */}
        <section id="reviews" style={{ padding: "5rem 1.5rem", background: "var(--color-white)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-forest)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Social Proof</span>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, color: "var(--color-text-dark)", marginTop: "0.5rem" }}>
                10,000+ Families Choose Fresh Direct
              </h2>
              <div style={{ display: "flex", justifyContent: "center", gap: "0.25rem", marginTop: "0.75rem", fontSize: "1.3rem" }}>
                {"⭐⭐⭐⭐⭐"}
              </div>
              <p style={{ color: "var(--color-text-light)", fontSize: "0.88rem", marginTop: "0.25rem" }}>4.9 / 5 average from 3,200+ reviews</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {REVIEWS.map((review) => (
                <div
                  key={review.id}
                  id={`review-${review.id}`}
                  style={{
                    background: "var(--color-off-white)",
                    borderRadius: "20px",
                    padding: "1.75rem",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    position: "relative",
                  }}
                >
                  {/* Quote mark */}
                  <span style={{ position: "absolute", top: "1rem", right: "1.25rem", fontFamily: "var(--font-serif)", fontSize: "4rem", color: "var(--color-border)", lineHeight: 1, userSelect: "none" }}>&ldquo;</span>

                  {/* Stars */}
                  <div style={{ fontSize: "1rem" }}>{"⭐".repeat(review.rating)}</div>

                  {/* Review text */}
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-mid)", lineHeight: 1.7, margin: 0, position: "relative", zIndex: 1 }}>
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Product reference */}
                  <div style={{ background: "var(--color-mint)", borderRadius: "8px", padding: "0.5rem 0.75rem" }}>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-forest)", fontWeight: 600, margin: 0 }}>🌿 {review.product}</p>
                  </div>

                  {/* Reviewer */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <img
                      src={review.avatar}
                      alt={review.name}
                      style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--color-mint)" }}
                    />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--color-text-dark)", margin: 0 }}>{review.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", margin: 0 }}>📍 {review.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. FINAL CTA BANNER ─────────────────────────────────────────── */}
        <section id="cta-banner" style={{ padding: "5rem 1.5rem", background: "linear-gradient(135deg, var(--color-forest-dark), var(--color-forest))", textAlign: "center" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "white", marginBottom: "1rem", lineHeight: 1.2 }}>
              Ready to Taste the Difference?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", marginBottom: "2.5rem", lineHeight: 1.7 }}>
              Join 10,000+ Sri Lankan families already enjoying farm-fresh produce.<br />Your first box ships free!
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/register"
                id="final-register-cta"
                style={{
                  textDecoration: "none",
                  background: "var(--color-golden)",
                  color: "#1A2E22",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  padding: "1rem 2.5rem",
                  borderRadius: "50px",
                  boxShadow: "var(--shadow-cta)",
                }}
              >
                Get Started Free 🚀
              </Link>
              <Link
                href="/products"
                id="final-browse-cta"
                style={{
                  textDecoration: "none",
                  background: "transparent",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  padding: "1rem 2.5rem",
                  borderRadius: "50px",
                  border: "2px solid rgba(255,255,255,0.4)",
                }}
              >
                Browse Products
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer style={{ background: "var(--color-forest-dark)", padding: "3rem 1.5rem 1.5rem", color: "rgba(255,255,255,0.65)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "2.5rem" }}>
              {/* Brand */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>🌿</span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 700, color: "white" }}>
                    Fresh<span style={{ color: "var(--color-golden)" }}>Direct</span>
                  </span>
                </div>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.7, maxWidth: "260px" }}>
                  Connecting Sri Lankan farmers directly with families who care about what they eat.
                </p>
              </div>
              {[
                { heading: "Marketplace", links: ["All Products", "Vegetables", "Fruits", "Herbs", "Grains"] },
                { heading: "Farmers", links: ["Join as Farmer", "Farmer Dashboard", "Success Stories", "Certification"] },
                { heading: "Company", links: ["About Us", "How It Works", "Blog", "Contact"] },
              ].map((col) => (
                <div key={col.heading}>
                  <h4 style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" }}>{col.heading}</h4>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {col.links.map((link) => (
                      <li key={link}>
                        <Link href="#" style={{ textDecoration: "none", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}>
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <p style={{ fontSize: "0.8rem" }}>© 2026 Fresh Direct. Made with 💚 in Sri Lanka</p>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <Link key={item} href="#" style={{ textDecoration: "none", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{item}</Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
