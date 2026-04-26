"use client";

/**
 * app/providers.tsx
 *
 * Client-side provider wrapper.
 * Keeps app/layout.tsx a pure Server Component while giving client
 * components access to the NextAuth session via useSession().
 */

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
