# Plan and Implement Farmer Dashboard

This plan details the implementation of a secure, role-based Farmer Dashboard for "Fresh Direct", establishing dedicated API routes with strict access controls, and a reactive frontend setup using custom hooks.

## User Review Required
> [!IMPORTANT]
> - Since there's no central proxy middleware protecting `/api/farmer/*`, each API route **must** individually verify `session.user.role === 'FARMER'`.
> - The hook implementation assumes standard `fetch` with React state for reactivity. If you prefer `swr` or `@tanstack/react-query`, please let me know. 
> - Is the folder name `FamerDashbord` correct or should we rename it to `farmer-dashboard`? We will keep it as `FamerDashbord` for now.

## Proposed Changes

### 1. Unified Authentication Logic (For each Route)
Each API route under `/api/farmer/` will strictly follow this structure:
```typescript
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const farmerId = session.user.id;
  // Implementation...
}
```

---

### 2. API Routes (`/app/api/farmer/`)

#### [NEW] `app/api/farmer/profile/route.ts`
- **GET**: Fetches the `FarmerProfile` document using `userId: session.user.id`. This is needed to check `status` ("PENDING", "APPROVED") and disable the "Add Product" button if pending.

#### [NEW] `app/api/farmer/stats/route.ts`
- **GET**: Aggregates data for the dashboard overview.
  - Queries `Product` where `farmerId` matches.
  - Calculates total stock, total items sold, total views, revenue (from matched `Order` items). 

#### [NEW] `app/api/farmer/products/route.ts`
- **GET**: Lists products owned by the farmer (`farmerId === session.user.id`).
- **POST**: Creates a new `Product` linked to current user.

#### [NEW] `app/api/farmer/orders/route.ts`
- **GET**: Fetches `Order` documents where `items.farmerId === session.user.id`. Uses aggregation or find filtering `{"items.farmerId": session.user.id}` to fetch only relevant orders.

---

### 3. Frontend Custom Hooks

#### [NEW] `hooks/useFarmerDashboard.ts` (or separated hooks)
We will create hooks strictly for the Farmer dashboard:
- `useFarmerProfile()`
- `useFarmerStats()`
- `useFarmerProducts()`
- `useFarmerOrders()`
These will return `data`, `loading`, `error`, and `mutate` functions so that after POSTing a new product, we can successfully rebuild the stats and products without a full page refresh.

---

### 4. UI Adjustments (`app/FamerDashbord/` & `components/dashboard/`)

#### [MODIFY] `components/dashboard/DashboardPage.tsx`
- Consume `useFarmerStats()` and `useFarmerProfile()`.
- **Verification UI**: If `profile.status === "PENDING"`, display a prominent warning banner: *"Your account is pending verification. You cannot add products yet."* Disable related action buttons.
- Make the "Product Count", "Sales" stats strictly reactive based on the fetched data.

#### [MODIFY] `components/dashboard/InventoryPage.tsx`
- Consume `useFarmerProducts()` to list items.
- Provide callback that triggers `useFarmerProducts().mutate()` and `useFarmerStats().mutate()` upon successful item addition.

## Open Questions
1. Should we utilize `swr` for the fetching mechanism in custom hooks for easier state mutations?
2. Do you want the Add Product form to handle Image Uploading logic at this stage, or just placeholder text?

## Verification Plan
1. Send authenticated requests to `/api/farmer/stats` with a non-Farmer session to verify `401 Unauthorized`.
2. Add a Product as an authenticated Farmer and verify the "Product Count" instantly increments visually using custom hooks.
3. Switch an account to `PENDING` and verify the UI locks down the Add action.
