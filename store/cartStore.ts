/**
 * store/cartStore.ts
 *
 * Global cart state managed by Zustand.
 * Persists to localStorage so cart survives page refreshes.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;            // product _id
  name: string;
  farmerName: string;
  farmerId: string;      // farmer's MongoDB ObjectId
  unit: string;
  currentPrice: number;
  image?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;

  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clearCart: () => void;

  // Derived
  totalItems: () => number;
  totalPrice: () => number;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, qty: 1 }] };
        });
        // Auto-open drawer when item is added
        set({ isDrawerOpen: true });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      increment: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: i.qty + 1 } : i
          ),
        })),

      decrement: (id) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.currentPrice * i.qty, 0),
    }),
    {
      name: "fresh-direct-cart", // localStorage key
      partialize: (state) => ({ items: state.items }), // only persist items
    }
  )
);
