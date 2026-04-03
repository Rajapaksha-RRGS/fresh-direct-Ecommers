"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatHarvestDate } from "@/lib/utils";

// Static fallback products (same as listing page)
const STATIC_PRODUCTS = [
  {
    id: "p1", name: "Baby Spinach", category: "Vegetables",
    basePrice: 220, currentPrice: 264, demandFactor: 1.35,
    unit: "500g", imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&h=600&fit=crop",
    harvestDate: new Date(Date.now() - 4 * 3600000).toISOString(),
    farmerId: "f1", farmerName: "Nimal Perera", farmLocation: "Nuwara Eliya",
    stockQty: 28, isOrganic: true,
    description: "Freshly harvested baby spinach from the cool highlands of Nuwara Eliya. Rich in iron, vitamins A & C. Grown without chemical pesticides.",
  },
  {
    id: "p2", name: "King Coconut", category: "Fruits",
    basePrice: 120, currentPrice: 96, demandFactor: 0.8,
    unit: "piece", imageUrl: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&h=600&fit=crop",
    harvestDate: new Date(Date.now() - 8 * 3600000).toISOString(),
    farmerId: "f2", farmerName: "Sudu Banda", farmLocation: "Kurunegala",
    stockQty: 4, isOrganic: false,
    description: "Sweet, refreshing king coconuts harvested this morning from Kurunegala. High in electrolytes — nature's sports drink.",
  },
  {
    id: "p3", name: "Cherry Tomatoes", category: "Vegetables",
    basePrice: 380, currentPrice: 399, demandFactor: 1.05,
    unit: "kg", imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=600&fit=crop",
    harvestDate: new Date(Date.now() - 6 * 3600000).toISOString(),
    farmerId: "f3", farmerName: "Kamala Devi", farmLocation: "Jaffna",
    stockQty: 15, isOrganic: true,
    description: "Sun-ripened cherry tomatoes from Jaffna's fertile soil. Perfect for salads and pasta. Organic certified.",
  },
  {
    id: "p4", name: "Red Lotus Rice", category: "Grains",
    basePrice: 560, currentPrice: 560, demandFactor: 1.0,
    unit: "kg", imageUrl: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop",
    harvestDate: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    farmerId: "f4", farmerName: "Ravi Kumaran", farmLocation: "Polonnaruwa",
    stockQty: 50, isOrganic: false,
    description: "Traditional Sri Lankan red rice from Polonnaruwa. Nutty flavour, high fibre, naturally grown in paddy fields.",
  },
  {
    id: "p5", name: "Murunga Leaves", category: "Herbs",
    basePrice: 80, currentPrice: 104, demandFactor: 1.4,
    unit: "bunch", imageUrl: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800&h=600&fit=crop",
    harvestDate: new Date(Date.now() - 2 * 3600000).toISOString(),
    farmerId: "f1", farmerName: "Nimal Perera", farmLocation: "Nuwara Eliya",
    stockQty: 8, isOrganic: true,
    description: "Fresh moringa (murunga) leaves — one of the most nutritious plants in the world. Great in curries and teas.",
  },
  {
    id: "p6", name: "Pineapple", category: "Fruits",
    basePrice: 350, currentPrice: 315, demandFactor: 0.9,
    unit: "piece", imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&h=600&fit=crop",
    harvestDate: new Date(Date.now() - 12 * 3600000).toISOString(),
    farmerId: "f5", farmerName: "Saman Wickrama", farmLocation: "Gampaha",
    stockQty: 22, isOrganic: false,
    description: "Sweet, golden pineapples from Gampaha's tropical farmlands. Hand-picked at peak ripeness.",
  },
];

type Product = typeof STATIC_PRODUCTS[0];

function getDemandBadge(factor?: number) {
  if (!factor) return null;
  if (factor >= 1.3) return { label: "🔥 High Demand", color: "#FF6B35", bg: "#FFF0EA" };
  if (factor <= 0.8) return { label: "💚 Great Deal", color: "#2D6A4F", bg: "#D8F3DC" };
  return null;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [addedMsg, setAddedMsg] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    // Try static data first; in production this would fetch from /api/products/[id]
    const found = STATIC_PRODUCTS.find((p) => p.id === id);
    if (found) {
      setProduct(found);
    } else {
      // Attempt API fetch
      fetch(`/api/products/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.product) setProduct(data.product);
        })
        .catch(() => {});
    }
  }, [id]);

  if (!product) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--color-text-mid)", fontSize: "1.1rem" }}>Loading product…</p>
      </div>
    );
  }

  const demandBadge = getDemandBadge(product.demandFactor);
  const priceUp = product.currentPrice > product.basePrice;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      unit: product.unit,
      unitPrice: product.currentPrice,
      quantity: qty,
    });
    setAddedMsg(`✅ ${qty}× ${product.name} added to cart!`);
    setTimeout(() => setAddedMsg(""), 3000);
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-off-white)", paddingTop: "5rem" }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem 1.5rem 0" }}>
        <nav style={{ fontSize: "0.82rem", color: "var(--color-text-light)" }}>
          <Link href="/" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Home</Link>
          {" / "}
          <Link href="/products" style={{ color: "var(--color-forest)", textDecoration: "none" }}>Products</Link>
          {" / "}
          <span>{product.name}</span>
        </nav>
      </div>

      {/* Main content */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>

          {/* Image */}
          <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "var(--shadow-hover)", position: "relative" }}>
            <img src={product.imageUrl} alt={product.name}
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {product.isOrganic && (
                <span style={{ background: "#2D6A4F", color: "#fff", fontSize: "0.75rem", fontWeight: 700, padding: "4px 12px", borderRadius: "50px" }}>
                  🌿 ORGANIC
                </span>
              )}
              {demandBadge && (
                <span style={{ background: demandBadge.bg, color: demandBadge.color, fontSize: "0.75rem", fontWeight: 700, padding: "4px 12px", borderRadius: "50px" }}>
                  {demandBadge.label}
                </span>
              )}
            </div>
            {product.stockQty <= 5 && product.stockQty > 0 && (
              <span style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(255,107,53,0.9)", color: "#fff", fontSize: "0.75rem", fontWeight: 700, padding: "4px 12px", borderRadius: "50px" }}>
                Only {product.stockQty} left!
              </span>
            )}
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-mid)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {product.category}
              </span>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 800, color: "var(--color-text-dark)", lineHeight: 1.2, marginTop: "0.3rem" }}>
                {product.name}
              </h1>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", marginTop: "0.4rem" }}>
                🕐 {formatHarvestDate(product.harvestDate)}
              </p>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 800, color: "var(--color-forest)" }}>
                Rs. {product.currentPrice.toFixed(2)}
              </span>
              <span style={{ fontSize: "0.9rem", color: "var(--color-text-light)", marginBottom: "0.4rem" }}>/ {product.unit}</span>
              {product.currentPrice !== product.basePrice && (
                <span style={{ fontSize: "0.8rem", color: priceUp ? "#FF6B35" : "#2D6A4F", background: priceUp ? "#FFF0EA" : "#D8F3DC", padding: "3px 10px", borderRadius: "50px", fontWeight: 700, marginBottom: "0.4rem" }}>
                  {priceUp ? "▲" : "▼"} base: Rs. {product.basePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-mid)", lineHeight: 1.7 }}>
              {product.description}
            </p>

            {/* Farmer */}
            <Link href={`/farmers/${product.farmerId}`}
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", borderRadius: "16px", border: "1px solid var(--color-border)", background: "var(--color-mint-light)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--color-mint)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                👨‍🌾
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "var(--color-forest)", fontSize: "0.95rem" }}>{product.farmerName}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>📍 {product.farmLocation}</p>
              </div>
              <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--color-forest)", fontWeight: 600 }}>View Profile →</span>
            </Link>

            {/* Quantity + Add to Cart */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0", border: "2px solid var(--color-border)", borderRadius: "12px", overflow: "hidden" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ width: "40px", height: "44px", background: "var(--color-mint-light)", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--color-forest)", fontWeight: 700 }}>
                  −
                </button>
                <span style={{ width: "44px", textAlign: "center", fontWeight: 700, color: "var(--color-text-dark)", fontSize: "1rem" }}>
                  {qty}
                </span>
                <button onClick={() => setQty(Math.min(product.stockQty, qty + 1))}
                  style={{ width: "40px", height: "44px", background: "var(--color-mint-light)", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--color-forest)", fontWeight: 700 }}>
                  +
                </button>
              </div>

              <button id={`add-to-cart-detail-${id}`} onClick={handleAddToCart}
                disabled={product.stockQty === 0}
                style={{
                  flex: 1, padding: "0.85rem 1.5rem",
                  background: "linear-gradient(135deg, var(--color-forest), #52B788)",
                  color: "white", border: "none", borderRadius: "14px",
                  fontWeight: 700, fontSize: "1rem", cursor: "pointer",
                  boxShadow: "0 6px 24px rgba(45,106,79,0.3)",
                  opacity: product.stockQty === 0 ? 0.5 : 1,
                }}>
                {product.stockQty === 0 ? "Out of Stock" : "Add to Cart 🛒"}
              </button>
            </div>

            {addedMsg && (
              <div style={{ padding: "0.75rem 1rem", borderRadius: "12px", background: "#D8F3DC", color: "#1B4332", fontWeight: 600, fontSize: "0.9rem" }}>
                {addedMsg}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["🚚 Delivery within 24h", "♻️ Eco packaging", "💯 Quality guaranteed"].map((tag) => (
                <span key={tag} style={{ fontSize: "0.78rem", background: "var(--color-mint)", color: "var(--color-forest)", padding: "4px 12px", borderRadius: "50px", fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Back link */}
        <div style={{ marginTop: "3rem" }}>
          <Link href="/products" style={{ color: "var(--color-forest)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>
            ← Back to all products
          </Link>
        </div>
      </section>
    </main>
  );
}
