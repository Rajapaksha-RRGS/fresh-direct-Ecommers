export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Users", value: "1,284", icon: "👥", sub: "+48 this week" },
    { label: "Active Products", value: "342", icon: "🌾", sub: "12 pending approval" },
    { label: "Orders Today", value: "86", icon: "📦", sub: "Rs. 184,200 revenue" },
    { label: "Platform Rating", value: "4.7 ★", icon: "⭐", sub: "2,801 reviews" },
  ];

  const pendingProducts = [
    { id: "pn1", name: "Watercress", farmer: "Nimal Perera", category: "Vegetables", price: "Rs. 180/bunch" },
    { id: "pn2", name: "Dragon Fruit", farmer: "Saman Wickrama", category: "Fruits", price: "Rs. 950/piece" },
    { id: "pn3", name: "Black Sesame", farmer: "Ravi Kumaran", category: "Grains", price: "Rs. 320/100g" },
  ];

  const recentUsers = [
    { name: "Dinesh Karunarathna", email: "dinesh@example.com", role: "CUSTOMER", joined: "2026-04-03" },
    { name: "Amali Seneviratne", email: "amali@farm.lk", role: "FARMER", joined: "2026-04-02" },
    { name: "Kasun Bandara", email: "kasun@example.com", role: "CUSTOMER", joined: "2026-04-02" },
  ];

  const roleColors: Record<string, { bg: string; color: string }> = {
    CUSTOMER: { bg: "#E3F2FD", color: "#1565C0" },
    FARMER:   { bg: "#D8F3DC", color: "#1B4332" },
    ADMIN:    { bg: "#F3E5F5", color: "#7B1FA2" },
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text-dark)" }}>
          Admin Overview 🛡️
        </h1>
        <p style={{ color: "var(--color-text-mid)", marginTop: "0.25rem" }}>Platform health and activity at a glance.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: "white", borderRadius: "20px", padding: "1.5rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-mid)", fontWeight: 600 }}>{stat.label}</p>
              <span style={{ fontSize: "1.5rem" }}>{stat.icon}</span>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text-dark)" }}>{stat.value}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--color-forest)", marginTop: "0.25rem" }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Pending approvals */}
        <div style={{ background: "white", borderRadius: "20px", padding: "1.75rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text-dark)", marginBottom: "1.25rem" }}>
            ✅ Pending Product Approvals
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {pendingProducts.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem", borderRadius: "12px", background: "#FFFDF0", border: "1px solid #FFF0B3" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: "var(--color-text-dark)", fontSize: "0.88rem" }}>{p.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-mid)" }}>{p.farmer} · {p.category} · {p.price}</p>
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button style={{ padding: "3px 10px", background: "#D8F3DC", color: "#1B4332", border: "none", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
                    Approve
                  </button>
                  <button style={{ padding: "3px 10px", background: "#FEECEC", color: "#C62828", border: "none", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div style={{ background: "white", borderRadius: "20px", padding: "1.75rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 800, color: "var(--color-text-dark)", marginBottom: "1.25rem" }}>
            👥 Recent Registrations
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentUsers.map((u) => (
              <div key={u.email} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem", borderRadius: "12px", background: "var(--color-mint-light)", border: "1px solid var(--color-border)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--color-mint)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--color-forest)", fontSize: "1rem", flexShrink: 0 }}>
                  {u.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: "var(--color-text-dark)", fontSize: "0.88rem" }}>{u.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>{u.email} · {u.joined}</p>
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "50px",
                  background: roleColors[u.role]?.bg, color: roleColors[u.role]?.color }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
