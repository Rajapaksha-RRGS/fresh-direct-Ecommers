/**
 * components/auth/ProtectedRoute.tsx — Client-side route protection wrapper
 *
 * Protects routes by checking user role and showing loading/unauthorized states.
 */

"use client";

import { ReactNode } from "react";
import { useAuthRedirect, UserRole } from "@/hooks/useAuthRedirect";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

/**
 * Component: Wraps page content and protects based on user role
 *
 * Example:
 * ```tsx
 * import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
 *
 * export default function AdminPage() {
 *   return (
 *     <ProtectedRoute allowedRoles={['ADMIN']}>
 *       <AdminContent />
 *     </ProtectedRoute>
 *   )
 * }
 * ```
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  fallback,
}: ProtectedRouteProps) {
  const { isLoading, isUnauthorized } = useAuthRedirect({ allowedRoles });

  // Show loading while checking session
  if (isLoading) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center bg-[#F0F7F0]">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#C8DFC8] border-t-[#3E7B27] mx-auto" />
            <p style={{ color: "#6B8F6E" }}>Loading...</p>
          </div>
        </div>
      )
    );
  }

  // If unauthorized, redirect happens in hook
  if (isUnauthorized) {
    return null; // Redirect will happen in useAuthRedirect hook
  }

  return <>{children}</>;
}

/**
 * Component: Loading placeholder (can be used with Suspense)
 */
export function AuthLoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#F0F7F0]">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#C8DFC8] border-t-[#3E7B27] mx-auto" />
        <p style={{ color: "#6B8F6E" }}>Authenticating...</p>
      </div>
    </div>
  );
}
