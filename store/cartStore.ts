import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Cart types ───────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  name: string;
  imageUrl: string;
  unit: string;
  unitPrice: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  // Actions matching the Cart class diagram
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  // Computed helpers
  totalItems: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (incoming) => {
        set((state) => {
          const qty = incoming.quantity ?? 1;
          const existing = state.items.find((i) => i.productId === incoming.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === incoming.productId
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: incoming.productId,
                name: incoming.name,
                imageUrl: incoming.imageUrl,
                unit: incoming.unit,
                unitPrice: incoming.unitPrice,
                quantity: qty,
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalAmount: () =>
        get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    }),
    {
      name: "fresh-direct-cart", // persisted in localStorage
    }
  )
);
