import Link from "next/link";

const SAMPLE_PRODUCTS = [
  { id: "p1", name: "Baby Spinach", category: "Vegetables", price: 264, unit: "500g", stock: 28, status: "APPROVED", isOrganic: true },
  { id: "p5", name: "Murunga Leaves", category: "Herbs", price: 104, unit: "bunch", stock: 8, status: "APPROVED", isOrganic: true },
  { id: "pn1", name: "Watercress", category: "Vegetables", price: 180, unit: "bunch", stock: 0, status: "PENDING", isOrganic: true },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  APPROVED: { bg: "#D8F3DC", color: "#1B4332" },
  PENDING:  { bg: "#FFF9E6", color: "#B7791F" },
  REJECTED: { bg: "#FEECEC", color: "#C62828" },
};

export default function FarmerProductsPage() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text-dark)" }}>
            My Products 🌾
          </h1>
          <p style={{ color: "var(--color-text-mid)", marginTop: "0.25rem" }}>Manage your product listings and inventory.</p>
        </div>
        <Link href="/farmer/dashboard/products/new"
          style={{ padding: "0.75rem 1.5rem", background: "linear-gradient(135deg, var(--color-forest), #52B788)", color: "white", textDecoration: "none", borderRadius: "12px", fontWeight: 700, fontSize: "0.9rem", boxShadow: "0 4px 16px rgba(45,106,79,0.25)" }}>
          + Add Product
        </Link>
      </div>

      <div style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-mint-light)", borderBottom: "1px solid var(--color-border)" }}>
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "1rem 1.25rem", textAlign: "left", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-mid)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_PRODUCTS.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < SAMPLE_PRODUCTS.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--color-text-dark)", fontSize: "0.9rem" }}>{p.name}</p>
                    {p.isOrganic && <span style={{ fontSize: "0.68rem", color: "#2D6A4F", fontWeight: 600 }}>🌿 Organic</span>}
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--color-text-mid)" }}>{p.category}</td>
                <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--color-forest)", fontSize: "0.9rem" }}>
                  Rs. {p.price} / {p.unit}
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem" }}>
                  <span style={{ color: p.stock === 0 ? "#C62828" : p.stock <= 5 ? "#B7791F" : "var(--color-forest)", fontWeight: 700 }}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} units`}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "50px",
                    background: statusStyle[p.status]?.bg, color: statusStyle[p.status]?.color }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button style={{ fontSize: "0.78rem", padding: "4px 12px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "white", cursor: "pointer", color: "var(--color-forest)", fontWeight: 600 }}>
                      Edit
                    </button>
                    <button style={{ fontSize: "0.78rem", padding: "4px 12px", borderRadius: "8px", border: "1px solid #FEECEC", background: "#FEECEC", cursor: "pointer", color: "#C62828", fontWeight: 600 }}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
