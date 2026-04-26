"use client";

/**
 * components/marketplace/CartDrawer.tsx
 *
 * Slide-in cart sidebar (Drawer) that opens from the right when the user
 * adds a product to cart. Managed entirely by the Zustand cartStore.
 */

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Leaf,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// ─── Price formatter ──────────────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(n);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    increment,
    decrement,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCartStore();

  const count = totalItems();
  const total = totalPrice();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#1A3020]/50 backdrop-blur-[3px]"
            onClick={closeDrawer}
          />

          {/* ── Drawer Panel ── */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-[−8px_0_40px_rgba(26,48,32,0.18)] flex flex-col"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8F0E8]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2
                    className="text-[#1A3020] font-extrabold text-[1rem] leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Your Cart
                  </h2>
                  <p className="text-[#6B8F6E] text-[0.72rem] font-medium">
                    {count} {count === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                aria-label="Close cart"
                onClick={closeDrawer}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#6B8F6E] hover:text-[#1A3020] hover:bg-[#F0F7F0] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Item List ── */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#F0F7F0] flex items-center justify-center mb-4">
                    <Leaf className="w-8 h-8 text-[#C8DFC8]" />
                  </div>
                  <p className="text-[#1A3020] font-bold text-[0.95rem] mb-1">
                    Your cart is empty
                  </p>
                  <p className="text-[#6B8F6E] text-[0.8rem]">
                    Add some fresh produce to get started!
                  </p>
                  <button
                    onClick={closeDrawer}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-[#3E7B27] text-white text-[0.82rem] font-bold hover:bg-[#1A3020] transition-colors"
                  >
                    Browse Marketplace
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="flex items-center gap-3 bg-[#F8FCF8] border border-[#E4EEE4] rounded-2xl p-3"
                  >
                    {/* Thumbnail / initials */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#E8F0E8]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-[#3E7B27]" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1A3020] font-bold text-[0.85rem] truncate">
                        {item.name}
                      </p>
                      <p className="text-[#6B8F6E] text-[0.72rem] truncate">
                        {item.farmerName}
                      </p>
                      <p className="text-[#F2B441] font-extrabold text-[0.88rem] mt-0.5">
                        {fmt(item.currentPrice)}{" "}
                        <span className="text-[#8FAF9A] font-normal text-[0.7rem]">
                          / {item.unit}
                        </span>
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex flex-col items-center gap-1.5">
                      <button
                        onClick={() => increment(item.id)}
                        className="w-7 h-7 rounded-lg bg-[#3E7B27] text-white flex items-center justify-center hover:bg-[#1A3020] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[#1A3020] font-bold text-[0.85rem] min-w-[20px] text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => decrement(item.id)}
                        className="w-7 h-7 rounded-lg bg-[#F0F7F0] border border-[#C8DFC8] text-[#3E7B27] flex items-center justify-center hover:bg-[#E0F0E0] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 text-[#C8DFC8] hover:text-red-400 transition-colors flex items-center justify-center"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* ── Footer (Summary + CTA) ── */}
            {items.length > 0 && (
              <div className="border-t border-[#E8F0E8] px-5 py-4 flex flex-col gap-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-[#4A6355] text-sm font-medium">
                    Subtotal ({count} items)
                  </span>
                  <span className="text-[#1A3020] font-extrabold text-[1.1rem]">
                    {fmt(total)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full min-h-[48px] rounded-2xl bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white font-bold text-[0.9rem] flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,48,32,0.3)] transition-all duration-200"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Clear cart */}
                <button
                  onClick={clearCart}
                  className="text-[0.75rem] text-[#8FAF9A] hover:text-red-400 font-medium text-center transition-colors"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
