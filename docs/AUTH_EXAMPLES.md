/**
 * ============================================================================
 * QUICK SETUP EXAMPLES — How to Protect Your Pages
 * ============================================================================
 */

// ───────────────────────────────────────────────────────────────────────────
// EXAMPLE 1: Admin Dashboard Page
// ───────────────────────────────────────────────────────────────────────────

// File: app/admin/dashboard/page.tsx
/*
"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import AdminContent from "@/components/AdminContent";

export default function AdminDashboard() {
  // ✅ Redirects non-admin users away
  useAuthRedirect({ allowedRoles: ["ADMIN"] });

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AdminContent />
    </div>
  );
}
*/

// ───────────────────────────────────────────────────────────────────────────
// EXAMPLE 2: Farmer Dashboard (with ProtectedRoute wrapper)
// ───────────────────────────────────────────────────────────────────────────

// File: app/farmer/dashboard/page.tsx
/*
"use client";

import { ProtectedRoute, AuthLoadingFallback } from "@/components/auth/ProtectedRoute";
import FarmerContent from "@/components/FarmerContent";

export default function FarmerDashboard() {
  return (
    <ProtectedRoute 
      allowedRoles={["FARMER"]} 
      fallback={<AuthLoadingFallback />}
    >
      <div>
        <h1>Farmer Dashboard</h1>
        <FarmerContent />
      </div>
    </ProtectedRoute>
  );
}
*/

// ───────────────────────────────────────────────────────────────────────────
// EXAMPLE 3: Conditional UI Based on Role
// ───────────────────────────────────────────────────────────────────────────

// File: components/Navigation.tsx
/*
"use client";

import { useIsAdmin, useIsFarmer, useCurrentUser } from "@/hooks/useAuthRedirect";

export function Navigation() {
  const isAdmin = useIsAdmin();
  const isFarmer = useIsFarmer();
  const { user, isLoading } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <nav>
      <ul>
        {isAdmin && (
          <li>
            <a href="/admin/dashboard">Admin Dashboard</a>
          </li>
        )}
        {isFarmer && (
          <li>
            <a href="/farmer/dashboard">Farmer Dashboard</a>
          </li>
        )}
        {!isAdmin && !isFarmer && (
          <li>
            <a href="/products">Shop</a>
          </li>
        )}
      </ul>
      {user && <p>Welcome, {user.name}!</p>}
    </nav>
  );
}
*/

// ───────────────────────────────────────────────────────────────────────────
// EXAMPLE 4: Multi-Role Protection
// ───────────────────────────────────────────────────────────────────────────

// File: app/reports/page.tsx
/*
"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function ReportsPage() {
  // ✅ Only ADMIN and FARMER can access (CUSTOMER will be redirected)
  useAuthRedirect({ 
    allowedRoles: ["ADMIN", "FARMER"],
    redirectTo: "/products" // Custom redirect path
  });

  return (
    <div>
      <h1>Reports</h1>
      <p>Only admins and farmers can see this</p>
    </div>
  );
}
*/

// ───────────────────────────────────────────────────────────────────────────
// EXAMPLE 5: Component-Level Role Check
// ───────────────────────────────────────────────────────────────────────────

// File: components/AdminPanel.tsx
/*
"use client";

import { useIsAdmin } from "@/hooks/useAuthRedirect";

export function AdminPanel() {
  const isAdmin = useIsAdmin();

  // ✅ Component only renders for admins
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-panel">
      <h2>Admin Controls</h2>
      <button>Delete User</button>
      <button>Ban Account</button>
    </div>
  );
}
*/

// ───────────────────────────────────────────────────────────────────────────
// EXAMPLE 6: Login Page (redirect if already logged in)
// ───────────────────────────────────────────────────────────────────────────

// File: app/login/page.tsx
/*
"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (status === "authenticated" && session?.user) {
      const role = (session.user as any).role;
      const dashboard =
        role === "ADMIN"
          ? "/admin/dashboard"
          : role === "FARMER"
            ? "/farmer/dashboard"
            : "/products";

      router.replace(dashboard);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return null; // Redirect will happen above
  }

  return (
    <div>
      <h1>Login</h1>
      {/* Login form here */}
    </div>
  );
}
*/

// ───────────────────────────────────────────────────────────────────────────
// EXAMPLE 7: Server-Side Protection (Alternative)
// ───────────────────────────────────────────────────────────────────────────

// File: app/admin/products/page.tsx
/*
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminProductsPage() {
  // ✅ Server-side auth check (runs on server)
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/products");
  }

  return (
    <div>
      <h1>Manage Products</h1>
      {/* Server-side component content */}
    </div>
  );
}
*/

// ───────────────────────────────────────────────────────────────────────────
// EXAMPLE 8: Layout-Level Protection
// ───────────────────────────────────────────────────────────────────────────

// File: app/admin/layout.tsx
/*
"use client";

import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
*/

// ───────────────────────────────────────────────────────────────────────────
// SUMMARY
// ───────────────────────────────────────────────────────────────────────────

/*
PROTECTION LAYERS:

1. SERVER-SIDE PROTECTION (middleware.ts)
   ✅ Prevents unauthenticated access
   ✅ Redirects based on role before page loads
   ✅ Runs on every request

2. CLIENT-SIDE PROTECTION (hooks)
   ✅ useAuthRedirect() - Redirect hook
   ✅ useIsAdmin/useIsFarmer/useIsCustomer() - Role checkers
   ✅ useCurrentUser() - Get current user info

3. COMPONENT-LEVEL PROTECTION (ProtectedRoute)
   ✅ Wraps pages
   ✅ Shows loading state
   ✅ Prevents rendering unauthorized content

BEST PRACTICES:

✅ Use useAuthRedirect() in page components
✅ Use role-check hooks for conditional rendering
✅ Use ProtectedRoute wrapper for extra safety
✅ Always show loading state while checking session
✅ Test all role redirects thoroughly

NEVER:

❌ Store session data in localStorage (use NextAuth session)
❌ Trust client-side auth checks alone (always verify on server)
❌ Expose sensitive data in client components
❌ Skip middleware checks
*/
