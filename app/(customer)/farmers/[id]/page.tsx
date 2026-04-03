"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardProps } from "@/components/product/ProductCard";

const FARMERS: Record<string, {
  id: string; farmerName: string; farmName: string; location: string; bio: string;
  image: string; certifications: string[]; isVerified: boolean; rating: number; reviewCount: number;
  story: string; farmingMethod: string; since: string;
}> = {
  f1: {
    id: "f1", farmerName: "Nimal Perera", farmName: "Green Hills Farm",
    location: "Nuwara Eliya", bio: "Third-generation farmer specializing in highland vegetables and herbs.",
    image: "https://images.unsplash.com/photo-1592748379328-afd77dc70038?w=400&h=400&fit=crop&crop=face",
    certifications: ["Organic", "SL-GAP"], isVerified: true, rating: 4.8, reviewCount: 124,
    story: "My grandfather started this farm in 1958. We have always believed in working with nature, not against it. Our highland location at 6,000 feet gives us cool temperatures perfect for leafy greens.",
    farmingMethod: "Regenerative Agriculture", since: "1958",
  },
  f2: {
    id: "f2", farmerName: "Sudu Banda", farmName: "Kurunegala Coconut Estate",
    location: "Kurunegala", bio: "Family-owned coconut farm with over 200 acres.",
    image: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=400&h=400&fit=crop&crop=face",
    certifications: ["Export Quality"], isVerified: true, rating: 4.6, reviewCount: 87,
    story: "Our coconut estate has been in the family for four generations. We take pride in supplying king coconuts that are hand-picked at peak sweetness every morning.",
    farmingMethod: "Traditional Coconut Cultivation", since: "1972",
  },
  f3: {
    id: "f3", farmerName: "Kamala Devi", farmName: "Jaffna Organic Gardens",
    location: "Jaffna", bio: "We grow Northern Province vegetables using traditional Jaffna methods.",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=400&fit=crop&crop=face",
    certifications: ["Organic", "Women Farmer"], isVerified: true, rating: 4.9, reviewCount: 203,
    story: "After years of hardship, I rebuilt our family farm with organic methods. Today, our tomatoes and vegetables are sought after across the country for their exceptional taste.",
    farmingMethod: "Traditional Organic", since: "2005",
  },
};

const PRODUCTS_BY_FARMER: Record<string, ProductCardProps[]> = {
  f1: [
    {
      id: "p1", name: "Baby Spinach", category: "Vegetables",
      basePrice: 220, currentPrice: 264, demandFactor: 1.35,
      unit: "500g", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
      harvestDate: new Date(Date.now() - 4 * 3600000).toISOString(),
      farmerId: "f1", farmerName: "Nimal Perera", farmLocation: "Nuwara Eliya",
      stockQty: 28, isOrganic: true,
    },
    {
      id: "p5", name: "Murunga Leaves", category: "Herbs",
      basePrice: 80, currentPrice: 104, demandFactor: 1.4,
      unit: "bunch", image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop",
      harvestDate: new Date(Date.now() - 2 * 3600000).toISOString(),
      farmerId: "f1", farmerName: "Nimal Perera", farmLocation: "Nuwara Eliya",
      stockQty: 8, isOrganic: true,
    },
  ],
  f2: [
    {
      id: "p2", name: "King Coconut", category: "Fruits",
      basePrice: 120, currentPrice: 96, demandFactor: 0.8,
      unit: "piece", image: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400&h=300&fit=crop",
      harvestDate: new Date(Date.now() - 8 * 3600000).toISOString(),
      farmerId: "f2", farmerName: "Sudu Banda", farmLocation: "Kurunegala",
      stockQty: 4, isOrganic: false,
    },
  ],
  f3: [
    {
      id: "p3", name: "Cherry Tomatoes", category: "Vegetables",
      basePrice: 380, currentPrice: 399, demandFactor: 1.05,
      unit: "kg", image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop",
      harvestDate: new Date(Date.now() - 6 * 3600000).toISOString(),
      farmerId: "f3", farmerName: "Kamala Devi", farmLocation: "Jaffna",
      stockQty: 15, isOrganic: true,
    },
  ],
};

export default function FarmerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const farmer = FARMERS[id];
  const products = PRODUCTS_BY_FARMER[id] || [];

  if (!farmer) {
    return (
      <main style={{ minHeight: "100vh", paddingTop: "5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.1rem", color: "var(--color-text-mid)", marginBottom: "1rem" }}>Farmer not found.</p>
          <Link href="/farmers" style={{ color: "var(--color-forest)", fontWeight: 600, textDecoration: "none" }}>← Back to Farmers</Link>
        </div>
      </main>
    );
  }

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(farmer.rating) ? "⭐" : "☆").join("");

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-off-white)", paddingTop: "5rem" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F, #52B788)", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "2rem", alignItems: "center" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img src={farmer.image} alt={farmer.farmerName}
              style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,255,0.3)" }} />
            {farmer.isVerified && (
              <span style={{ position: "absolute", bottom: 4, right: 4, background: "#FFB703", color: "#1B4332", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, border: "3px solid white" }}>
                ✓
              </span>
            )}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 800, color: "white" }}>
                {farmer.farmerName}
              </h1>
              {farmer.isVerified && (
                <span style={{ fontSize: "0.72rem", background: "rgba(255,255,255,0.15)", color: "white", padding: "2px 10px", borderRadius: "50px", fontWeight: 700 }}>
                  Verified
                </span>
              )}
            </div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, marginBottom: "0.25rem" }}>{farmer.farmName}</p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}>📍 {farmer.location}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
              <span style={{ fontSize: "0.9rem" }}>{stars}</span>
              <span style={{ color: "white", fontWeight: 700 }}>{farmer.rating.toFixed(1)}</span>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>({farmer.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
          {/* About */}
          <div style={{ background: "white", borderRadius: "20px", padding: "1.75rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 800, color: "var(--color-text-dark)", marginBottom: "1rem" }}>
              🌿 Their Story
            </h2>
            <p style={{ color: "var(--color-text-mid)", lineHeight: 1.7, fontSize: "0.9rem" }}>{farmer.story}</p>
          </div>

          {/* Details */}
          <div style={{ background: "white", borderRadius: "20px", padding: "1.75rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 800, color: "var(--color-text-dark)", marginBottom: "1rem" }}>
              📋 Farm Details
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Farming Since", value: farmer.since },
                { label: "Method", value: farmer.farmingMethod },
                { label: "Location", value: farmer.location },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.5rem" }}>
                  <span style={{ color: "var(--color-text-light)", fontWeight: 600 }}>{row.label}</span>
                  <span style={{ color: "var(--color-text-dark)", fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>
            {farmer.certifications.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)", fontWeight: 600, marginBottom: "0.5rem" }}>Certifications</p>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {farmer.certifications.map((c) => (
                    <span key={c} style={{ fontSize: "0.72rem", background: "var(--color-mint)", color: "var(--color-forest)", padding: "3px 10px", borderRadius: "50px", fontWeight: 600 }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        {products.length > 0 && (
          <>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-text-dark)", marginBottom: "1.5rem" }}>
              🌾 Products by {farmer.farmerName}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {products.map((p) => <ProductCard key={p.id} {...p} />)}
            </div>
          </>
        )}

        <div style={{ marginTop: "2.5rem" }}>
          <Link href="/farmers" style={{ color: "var(--color-forest)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>
            ← Back to all farmers
          </Link>
        </div>
      </section>
    </main>
  );
}
