/**
 * auth.config.ts — Edge-Compatible NextAuth Configuration
 *
 * ✅ NO database imports (no mongoose, bcryptjs, User model)
 * ✅ Safe to import in Edge Runtime (middleware / proxy)
 *
 * This file defines ONLY the callbacks and pages config.
 * The full auth (with DB providers) lives in lib/auth.ts.
 *
 * Pattern: https://authjs.dev/guides/edge-compatibility
 */

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // Providers are intentionally empty here.
  // Full providers (Credentials + Google) are in lib/auth.ts.
  // The Edge runtime only needs the callbacks to read the session.
  providers: [],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    // ── jwt callback: persist role into the token ────────────────────────
    async jwt({ token, user }: any) {
      if (user) {
        token.id   = user.id;
        token.role = user.role ?? "CUSTOMER";
      }
      return token;
    },

    // ── session callback: expose role on session.user ────────────────────
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id   = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    // ── authorized callback: used by proxy to decide allow/deny ─────────
    // Called automatically when you use auth() as middleware.
    // Return true = allow, false = redirect to signIn page.
    authorized({ auth, request }: any) {
      // We handle all routing logic manually in lib/proxy.ts,
      // so we always return true here and let proxy.ts decide.
      return true;
    },
  },
} satisfies NextAuthConfig;
