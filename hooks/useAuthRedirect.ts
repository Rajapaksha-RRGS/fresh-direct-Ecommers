/**
 * hooks/useAuthRedirect.ts — Client-side role-based redirect hook
 *
 * Ensures users are on the correct page based on their role.
 * Redirects to appropriate dashboard if on wrong page.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export type UserRole = "ADMIN" | "FARMER" | "CUSTOMER";

interface UseAuthRedirectOptions {
  allowedRoles: UserRole[];
  redirectTo?: string; // Custom redirect path
}

/**
 * Hook: Redirect user if they're on a page they shouldn't be on
 *
 * Example:
 * ```tsx
 * 'use client'
 * import { useAuthRedirect } from '@/hooks/useAuthRedirect'
 *
 * export default function AdminPage() {
 *   useAuthRedirect({ allowedRoles: ['ADMIN'] })
 *   return <div>Admin content</div>
 * }
 * ```
 */
export function useAuthRedirect({
  allowedRoles,
  redirectTo,
}: UseAuthRedirectOptions) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    // Not logged in - redirect to login
    if (!session) {
      router.replace("/login");
      return;
    }

    const userRole = (session.user as any)?.role as UserRole;

    // Check if user's role is allowed on this page
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard
      const dashboard =
        userRole === "ADMIN"
          ? "/admin/dashboard"
          : userRole === "FARMER"
            ? "/farmer/dashboard"
            : "/products";

      router.replace(redirectTo || dashboard);
    }
  }, [session, status, allowedRoles, router, redirectTo]);

  // Return loading state
  return {
    isLoading: status === "loading",
    isUnauthorized:
      status === "authenticated" &&
      !allowedRoles.includes((session?.user as any)?.role),
  };
}

/**
 * Hook: Get current user info from session
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user
      ? {
          id: (session.user as any).id,
          name: session.user.name,
          email: session.user.email,
          role: (session.user as any).role as UserRole,
          image: (session.user as any).image,
        }
      : null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}

/**
 * Hook: Check if user can access admin features
 */
export function useIsAdmin() {
  const { user } = useCurrentUser();
  return user?.role === "ADMIN";
}

/**
 * Hook: Check if user is a farmer
 */
export function useIsFarmer() {
  const { user } = useCurrentUser();
  return user?.role === "FARMER";
}

/**
 * Hook: Check if user is a customer
 */
export function useIsCustomer() {
  const { user } = useCurrentUser();
  return user?.role === "CUSTOMER";
}
