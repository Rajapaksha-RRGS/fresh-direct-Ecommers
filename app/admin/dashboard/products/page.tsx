"use client";

import { useState } from "react";

const PENDING_PRODUCTS = [
  { id: "pn1", name: "Watercress", farmer: "Nimal Perera", farmLocation: "Nuwara Eliya", category: "Vegetables", price: 180, unit: "bunch", description: "Fresh highland watercress, chemical-free.", isOrganic: true },
  { id: "pn2", name: "Dragon Fruit", farmer: "Saman Wickrama", farmLocation: "Gampaha", category: "Fruits", price: 950, unit: "piece", description: "Locally grown dragon fruit, vibrant pink flesh.", isOrganic: false },
  { id: "pn3", name: "Black Sesame", farmer: "Ravi Kumaran", farmLocation: "Polonnaruwa", category: "Grains", price: 320, unit: "100g", description: "Heritage black sesame seeds, sun-dried.", isOrganic: false },
];

export default function AdminProductApprovalsPage() {
  const [products, setProducts] = useState(PENDING_PRODUCTS);
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});

  const decide = (id: string, action: "approved" | "rejected") => {
    setDecisions((prev) => ({ ...prev, [id]: action }));
    setTimeout(() => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDecisions((prev) => { const d = { ...prev }; delete d[id]; return d; });
    }, 800);
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text-dark)" }}>
          Product Approvals ✅
        </h1>
        <p style={{ color: "var(--color-text-mid)", marginTop: "0.25rem" }}>
          Review and approve or reject new product listings from farmers.
        </p>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "white", borderRadius: "20px", boxShadow: "var(--shadow-card)" }}>
          <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎉</p>
          <p style={{ color: "var(--color-text-mid)", fontWeight: 600 }}>All caught up! No pending approvals.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {products.map((p) => {
            const decision = decisions[p.id];
            return (
              <div key={p.id} style={{
                background: "white", borderRadius: "20px", padding: "1.75rem",
                boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)",
                opacity: decision ? 0.5 : 1, transition: "opacity 0.3s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 800, color: "var(--color-text-dark)" }}>{p.name}</h3>
                      {p.isOrganic && <span style={{ fontSize: "0.68rem", background: "#D8F3DC", color: "#1B4332", padding: "2px 8px", borderRadius: "50px", fontWeight: 700 }}>🌿 Organic</span>}
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-mid)" }}>
                      👨‍🌾 {p.farmer} · 📍 {p.farmLocation} · {p.category}
                    </p>
                    <p style={{ fontSize: "0.88rem", color: "var(--color-text-mid)", marginTop: "0.5rem" }}>{p.description}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "1.5rem" }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 800, color: "var(--color-forest)" }}>
                      Rs. {p.price}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--color-text-light)" }}>/ {p.unit}</p>
                  </div>
                </div>

                {!decision ? (
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                    <button onClick={() => decide(p.id, "approved")}
                      style={{ padding: "0.6rem 1.5rem", background: "linear-gradient(135deg, #1B4332, #2D6A4F)", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
                      ✓ Approve
                    </button>
                    <button onClick={() => decide(p.id, "rejected")}
                      style={{ padding: "0.6rem 1.5rem", background: "#FEECEC", color: "#C62828", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
                      ✕ Reject
                    </button>
                  </div>
                ) : (
                  <p style={{ marginTop: "1rem", fontWeight: 700, color: decision === "approved" ? "#1B4332" : "#C62828" }}>
                    {decision === "approved" ? "✅ Approved" : "❌ Rejected"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
