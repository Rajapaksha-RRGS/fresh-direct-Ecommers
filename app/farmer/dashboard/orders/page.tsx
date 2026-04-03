const ORDERS = [
  { id: "ORD-001", customer: "Kamal Silva", items: "Baby Spinach × 3", amount: 792, status: "PENDING", date: "2026-04-03", address: "45 Galle Road, Colombo 3" },
  { id: "ORD-002", customer: "Nisha Fernando", items: "Murunga Leaves × 2", amount: 208, status: "CONFIRMED", date: "2026-04-03", address: "12 Temple Road, Kandy" },
  { id: "ORD-003", customer: "Roshan Perera", items: "Baby Spinach × 1", amount: 264, status: "DELIVERED", date: "2026-04-01", address: "88 Beach Road, Negombo" },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  PENDING:   { bg: "#FFF9E6", color: "#B7791F" },
  CONFIRMED: { bg: "#E3F2FD", color: "#1565C0" },
  SHIPPED:   { bg: "#F3E5F5", color: "#7B1FA2" },
  DELIVERED: { bg: "#D8F3DC", color: "#1B4332" },
  CANCELLED: { bg: "#FEECEC", color: "#C62828" },
};

export default function FarmerOrdersPage() {
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text-dark)" }}>
          Received Orders 📦
        </h1>
        <p style={{ color: "var(--color-text-mid)", marginTop: "0.25rem" }}>View and manage orders placed for your products.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {ORDERS.map((order) => (
          <div key={order.id} style={{ background: "white", borderRadius: "20px", padding: "1.5rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontWeight: 800, color: "var(--color-text-dark)", fontSize: "1rem" }}>{order.id}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--color-text-light)", marginTop: "2px" }}>{order.date}</p>
              </div>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, padding: "4px 12px", borderRadius: "50px",
                background: statusStyle[order.status]?.bg, color: statusStyle[order.status]?.color }}>
                {order.status}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontSize: "0.72rem", color: "var(--color-text-light)", fontWeight: 600 }}>CUSTOMER</p>
                <p style={{ fontWeight: 700, color: "var(--color-text-dark)", fontSize: "0.88rem" }}>{order.customer}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.72rem", color: "var(--color-text-light)", fontWeight: 600 }}>ITEMS</p>
                <p style={{ fontWeight: 600, color: "var(--color-text-mid)", fontSize: "0.88rem" }}>{order.items}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.72rem", color: "var(--color-text-light)", fontWeight: 600 }}>AMOUNT</p>
                <p style={{ fontFamily: "var(--font-serif)", fontWeight: 800, color: "var(--color-forest)", fontSize: "1rem" }}>Rs. {order.amount.toFixed(2)}</p>
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-mid)" }}>📍 {order.address}</p>
            {order.status === "PENDING" && (
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button style={{ padding: "0.5rem 1.25rem", background: "linear-gradient(135deg, var(--color-forest), #52B788)", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                  Confirm Order ✓
                </button>
                <button style={{ padding: "0.5rem 1.25rem", background: "#FEECEC", color: "#C62828", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
