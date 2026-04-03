export default function FarmerDashboardPage() {
  const stats = [
    { label: "Total Products", value: "12", icon: "🌾", change: "+2 this week" },
    { label: "Active Orders", value: "8", icon: "📦", change: "+3 today" },
    { label: "Revenue (LKR)", value: "Rs. 48,200", icon: "💰", change: "+12% this month" },
    { label: "Rating", value: "4.8 ★", icon: "⭐", change: "124 reviews" },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Kamal Silva", product: "Baby Spinach × 3", amount: "Rs. 792", status: "PENDING" },
    { id: "ORD-002", customer: "Nisha Fernando", product: "Murunga Leaves × 2", amount: "Rs. 208", status: "CONFIRMED" },
    { id: "ORD-003", customer: "Roshan Perera", product: "Baby Spinach × 1", amount: "Rs. 264", status: "DELIVERED" },
  ];

  const statusColors: Record<string, { bg: string; color: string }> = {
    PENDING:   { bg: "#FFF9E6", color: "#B7791F" },
    CONFIRMED: { bg: "#E8F5E9", color: "#2D6A4F" },
    DELIVERED: { bg: "#D8F3DC", color: "#1B4332" },
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text-dark)" }}>
          Welcome back, Farmer 🌿
        </h1>
        <p style={{ color: "var(--color-text-mid)", marginTop: "0.25rem" }}>Here is your farm activity at a glance.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: "white", borderRadius: "20px", padding: "1.5rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-mid)", fontWeight: 600 }}>{stat.label}</p>
              <span style={{ fontSize: "1.5rem" }}>{stat.icon}</span>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text-dark)" }}>{stat.value}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--color-forest)", marginTop: "0.25rem" }}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ background: "white", borderRadius: "20px", padding: "1.75rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 800, color: "var(--color-text-dark)", marginBottom: "1.5rem" }}>
          📦 Recent Orders
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {recentOrders.map((order) => (
            <div key={order.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem", borderRadius: "12px", background: "var(--color-mint-light)", border: "1px solid var(--color-border)" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: "var(--color-text-dark)", fontSize: "0.9rem" }}>{order.id}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-mid)" }}>{order.customer} · {order.product}</p>
              </div>
              <p style={{ fontWeight: 700, color: "var(--color-forest)", fontSize: "0.9rem" }}>{order.amount}</p>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "50px",
                background: statusColors[order.status]?.bg, color: statusColors[order.status]?.color }}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
