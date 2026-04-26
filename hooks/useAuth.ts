"use client";

/**
 * useAuth Hook
 *
 * Provides easy access to session data and authentication functions.
 * Returns user data, role, email, and common auth operations.
 */

import { useSession, signOut, signIn } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user as any;

  return {
    user,
    role: user?.role,
    email: user?.email,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    status,
    session,
    signOut: async () => {
      await signOut({ redirect: true, callbackUrl: "/" });
    },
    signIn: async (provider: string) => {
      await signIn(provider, { redirect: false });
    },
  };
}
