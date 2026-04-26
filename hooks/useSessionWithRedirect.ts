"use client";

/**
 * useSessionWithRedirect Hook
 *
 * Automatically redirects unauthenticated users to login.
 * Useful for protected pages (admin, dashboard, etc).
 */

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UseSessionWithRedirectOptions {
  redirectUrl?: string;
  allowedRoles?: string[];
}

export function useSessionWithRedirect(
  options: UseSessionWithRedirectOptions = {}
) {
  const { redirectUrl = "/login", allowedRoles } = options;
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Not authenticated - redirect to login
    if (status === "unauthenticated") {
      router.push(redirectUrl);
      return;
    }

    // Check role-based access
    if (allowedRoles && status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [status, session, router, redirectUrl, allowedRoles]);

  return {
    user: session?.user,
    role: (session?.user as any)?.role,
    email: session?.user?.email,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    status,
    session,
  };
}
