"use client";

/**
 * Usage Examples for Auth Hooks
 *
 * This file demonstrates how to use useAuth and useSessionWithRedirect
 */

// ─── Example 1: Using useAuth in any client component ──────────────────────
// import { useAuth } from "@/hooks/useAuth";
//
// export function MyComponent() {
//   const { user, role, isAuthenticated, isLoading } = useAuth();
//
//   if (isLoading) return <div>Loading...</div>;
//
//   if (!isAuthenticated) return <div>Please sign in</div>;
//
//   return (
//     <div>
//       <p>Welcome, {user?.name}</p>
//       <p>Your role: {role}</p>
//     </div>
//   );
// }

// ─── Example 2: Using useSessionWithRedirect in protected pages ───────────
// import { useSessionWithRedirect } from "@/hooks/useSessionWithRedirect";
//
// export default function AdminDashboard() {
//   // Auto-redirects if not authenticated
//   const { user, isLoading } = useSessionWithRedirect();
//
//   if (isLoading) return <div>Loading...</div>;
//
//   return <div>Admin Panel for {user?.name}</div>;
// }

// ─── Example 3: Role-based protection ──────────────────────────────────────
// export default function FarmerPortal() {
//   // Only allows FARMER role, redirects to /unauthorized otherwise
//   const { user, isLoading } = useSessionWithRedirect({
//     redirectUrl: "/login",
//     allowedRoles: ["FARMER"],
//   });
//
//   if (isLoading) return <div>Loading...</div>;
//
//   return <div>Farmer Portal</div>;
// }

// ─── Example 4: Sign out with useAuth ─────────────────────────────────────
// export function LogoutButton() {
//   const { signOut } = useAuth();
//
//   return (
//     <button onClick={() => signOut()}>
//       Sign Out
//     </button>
//   );
// }
