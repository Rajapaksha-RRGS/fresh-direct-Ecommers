"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalAmount } = useCartStore();
  const total = totalAmount();

  if (items.length === 0) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--color-off-white)", paddingTop: "5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text-dark)", marginBottom: "0.5rem" }}>
            Your cart is empty
          </h2>
          <p style={{ color: "var(--color-text-mid)", marginBottom: "2rem" }}>
            Browse fresh produce and add items to your cart.
          </p>
          <Link href="/products" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.85rem 2rem", background: "linear-gradient(135deg, var(--color-forest), #52B788)",
            color: "white", textDecoration: "none", borderRadius: "14px",
            fontWeight: 700, boxShadow: "0 6px 24px rgba(45,106,79,0.3)",
          }}>
            Shop Fresh Products →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-off-white)", paddingTop: "5rem" }}>
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 800, color: "var(--color-text-dark)" }}>
            🛒 Your Cart
          </h1>
          <button onClick={clearCart}
            style={{ fontSize: "0.82rem", color: "#C62828", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
            Clear cart
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
          {/* Cart items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {items.map((item) => (
              <div key={item.productId}
                style={{ background: "white", borderRadius: "20px", padding: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "center", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)" }}>
                <img src={item.imageUrl} alt={item.name}
                  style={{ width: "80px", height: "80px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 700, color: "var(--color-text-dark)", fontSize: "1rem", marginBottom: "0.25rem" }}>
                    {item.name}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>Rs. {item.unitPrice.toFixed(2)} / {item.unit}</p>
                </div>

                {/* Quantity controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "0", border: "2px solid var(--color-border)", borderRadius: "10px", overflow: "hidden" }}>
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    style={{ width: "32px", height: "36px", background: "var(--color-mint-light)", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: "var(--color-forest)" }}>
                    −
                  </button>
                  <span style={{ width: "36px", textAlign: "center", fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text-dark)" }}>
                    {item.quantity}
                  </span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    style={{ width: "32px", height: "36px", background: "var(--color-mint-light)", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "1rem", color: "var(--color-forest)" }}>
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div style={{ minWidth: "80px", textAlign: "right" }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontWeight: 800, color: "var(--color-forest)", fontSize: "1.05rem" }}>
                    Rs. {(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button onClick={() => removeItem(item.productId)}
                  style={{ background: "#FEECEC", border: "none", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer", fontSize: "0.8rem", color: "#C62828", fontWeight: 700 }}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div style={{ background: "white", borderRadius: "24px", padding: "1.75rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-border)", position: "sticky", top: "6rem" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 800, fontSize: "1.2rem", color: "var(--color-text-dark)", marginBottom: "1.25rem" }}>
              Order Summary
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
              {items.map((item) => (
                <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--color-text-mid)" }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>Rs. {(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, color: "var(--color-text-mid)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                <span>Subtotal</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, color: "var(--color-text-mid)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                <span>Delivery</span>
                <span style={{ color: "#2D6A4F" }}>Free 🚚</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: "var(--color-text-dark)", fontSize: "1.15rem" }}>
                <span>Total</span>
                <span style={{ color: "var(--color-forest)" }}>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" style={{
              display: "block", textAlign: "center", padding: "0.95rem",
              background: "linear-gradient(135deg, var(--color-forest), #52B788)",
              color: "white", textDecoration: "none", borderRadius: "14px",
              fontWeight: 700, fontSize: "1rem", boxShadow: "0 6px 24px rgba(45,106,79,0.3)",
            }}>
              Proceed to Checkout →
            </Link>

            <Link href="/products" style={{ display: "block", textAlign: "center", marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--color-forest)", textDecoration: "none", fontWeight: 600 }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
