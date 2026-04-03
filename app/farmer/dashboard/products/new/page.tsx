"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Vegetables", "Fruits", "Grains", "Herbs", "Dairy", "Other"];

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", category: "Vegetables", description: "", basePrice: "", unit: "kg", stockQty: "", imageUrl: "", isOrganic: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    setForm((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess("Product submitted for approval! 🌿");
    setSubmitting(false);
    setTimeout(() => router.push("/farmer/dashboard/products"), 1500);
  };

  return (
    <div style={{ maxWidth: "640px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text-dark)" }}>
          Add New Product 🌾
        </h1>
        <p style={{ color: "var(--color-text-mid)", marginTop: "0.25rem" }}>
          Fill in the details below. Your listing will be reviewed before going live.
        </p>
      </div>

      {success && (
        <div style={{ padding: "0.9rem 1.25rem", borderRadius: "12px", background: "#D8F3DC", color: "#1B4332", fontWeight: 600, marginBottom: "1.5rem" }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "20px", padding: "2rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Name */}
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-dark)", marginBottom: "0.4rem" }}>
            Product Name *
          </label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Baby Spinach"
            style={{ width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-border)", borderRadius: "12px", fontSize: "0.9rem", outline: "none" }} />
        </div>

        {/* Category + Unit */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-dark)", marginBottom: "0.4rem" }}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-border)", borderRadius: "12px", fontSize: "0.9rem", outline: "none", background: "white" }}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-dark)", marginBottom: "0.4rem" }}>Unit *</label>
            <input name="unit" value={form.unit} onChange={handleChange} required placeholder="kg / bunch / piece"
              style={{ width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-border)", borderRadius: "12px", fontSize: "0.9rem", outline: "none" }} />
          </div>
        </div>

        {/* Price + Stock */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-dark)", marginBottom: "0.4rem" }}>Base Price (Rs.) *</label>
            <input name="basePrice" type="number" min="1" value={form.basePrice} onChange={handleChange} required placeholder="220"
              style={{ width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-border)", borderRadius: "12px", fontSize: "0.9rem", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-dark)", marginBottom: "0.4rem" }}>Stock Quantity *</label>
            <input name="stockQty" type="number" min="0" value={form.stockQty} onChange={handleChange} required placeholder="50"
              style={{ width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-border)", borderRadius: "12px", fontSize: "0.9rem", outline: "none" }} />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-dark)", marginBottom: "0.4rem" }}>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Describe your product..."
            style={{ width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-border)", borderRadius: "12px", fontSize: "0.9rem", outline: "none", resize: "vertical" }} />
        </div>

        {/* Image URL */}
        <div>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-dark)", marginBottom: "0.4rem" }}>Image URL</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..."
            style={{ width: "100%", padding: "0.75rem 1rem", border: "2px solid var(--color-border)", borderRadius: "12px", fontSize: "0.9rem", outline: "none" }} />
        </div>

        {/* Organic toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <input type="checkbox" id="isOrganic" name="isOrganic" checked={form.isOrganic}
            onChange={handleChange} style={{ width: "18px", height: "18px", accentColor: "#2D6A4F", cursor: "pointer" }} />
          <label htmlFor="isOrganic" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text-dark)", cursor: "pointer" }}>
            🌿 This product is organically grown
          </label>
        </div>

        {/* Submit */}
        <button type="submit" disabled={submitting}
          style={{ padding: "0.9rem", background: "linear-gradient(135deg, var(--color-forest), #52B788)", color: "white", border: "none", borderRadius: "14px", fontWeight: 700, fontSize: "1rem", cursor: "pointer", boxShadow: "0 6px 24px rgba(45,106,79,0.3)", opacity: submitting ? 0.7 : 1 }}>
          {submitting ? "Submitting…" : "Submit for Approval 🌿"}
        </button>
      </form>
    </div>
  );
}
