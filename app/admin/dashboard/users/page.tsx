const USERS = [
  { id: "u1", name: "Kamal Silva", email: "kamal@example.com", role: "CUSTOMER", phone: "+94 77 123 4567", joined: "2026-03-15", isActive: true },
  { id: "u2", name: "Nimal Perera", email: "nimal@greenhills.lk", role: "FARMER", phone: "+94 71 987 6543", joined: "2025-11-02", isActive: true },
  { id: "u3", name: "Kamala Devi", email: "kamala@jaffna.lk", role: "FARMER", phone: "+94 76 456 7890", joined: "2025-12-10", isActive: true },
  { id: "u4", name: "Dinesh Fernando", email: "dinesh@example.com", role: "CUSTOMER", phone: "+94 70 234 5678", joined: "2026-04-01", isActive: false },
];

const roleColors: Record<string, { bg: string; color: string }> = {
  CUSTOMER: { bg: "#E3F2FD", color: "#1565C0" },
  FARMER:   { bg: "#D8F3DC", color: "#1B4332" },
  ADMIN:    { bg: "#F3E5F5", color: "#7B1FA2" },
};

export default function AdminUsersPage() {
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text-dark)" }}>
          Manage Users 👥
        </h1>
        <p style={{ color: "var(--color-text-mid)", marginTop: "0.25rem" }}>View and manage all registered users on the platform.</p>
      </div>

      <div style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-mint-light)", borderBottom: "1px solid var(--color-border)" }}>
              {["User", "Email", "Role", "Phone", "Joined", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "1rem 1.25rem", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "var(--color-text-mid)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USERS.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < USERS.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-mint)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--color-forest)", flexShrink: 0 }}>
                      {u.name[0]}
                    </div>
                    <span style={{ fontWeight: 700, color: "var(--color-text-dark)", fontSize: "0.88rem" }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--color-text-mid)" }}>{u.email}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "50px",
                    background: roleColors[u.role]?.bg, color: roleColors[u.role]?.color }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--color-text-mid)" }}>{u.phone}</td>
                <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--color-text-mid)" }}>{u.joined}</td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "50px",
                    background: u.isActive ? "#D8F3DC" : "#FEECEC", color: u.isActive ? "#1B4332" : "#C62828" }}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <button style={{ fontSize: "0.75rem", padding: "4px 12px", borderRadius: "8px", border: "1px solid var(--color-border)", background: u.isActive ? "#FEECEC" : "#D8F3DC", cursor: "pointer", color: u.isActive ? "#C62828" : "#1B4332", fontWeight: 600 }}>
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
