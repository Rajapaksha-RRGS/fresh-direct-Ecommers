# 🚀 Admin API Quick Reference

## Test in Browser Console

```javascript
// Run all tests
import { runAllTests } from '@/lib/apiTester'
await runAllTests()

// Or test individually
import { 
  testGetFarmers, 
  testGetAnalytics, 
  testGetProducts,
  testGetPricingConfig,
  testPatchPricingConfig,
  testPatchVerifyFarmer 
} from '@/lib/apiTester'

// Test 1: Get all farmers
await testGetFarmers()

// Test 2: Get pending farmers
await testGetFarmers('PENDING')

// Test 3: Get analytics
await testGetAnalytics()

// Test 4: Get products (sorted by demand)
await testGetProducts()

// Test 5: Get products (low stock first)
await testGetProducts('stockQty', 'asc')

// Test 6: Get pricing config
await testGetPricingConfig()

// Test 7: Update pricing (higher demand sensitivity)
await testPatchPricingConfig(0.015, 0.006)

// Test 8: Approve farmer (get ID from test 1)
await testPatchVerifyFarmer('FARMER_ID_HERE', 'APPROVE')

// Test 9: Reject farmer with reason
await testPatchVerifyFarmer('FARMER_ID_HERE', 'REJECT', 'Incomplete docs')
```

---

## Use Hooks in Components

```typescript
'use client'
import { useAnalytics, useFarmers, useProducts } from '@/hooks/useAdminApi'

export function MyComponent() {
  const analytics = useAnalytics()
  const farmers = useFarmers('PENDING')
  const products = useProducts('demandScore', 'desc')

  if (analytics.loading) return <div>Loading...</div>
  if (analytics.error) return <div>Error: {analytics.error}</div>

  return (
    <div>
      <p>Active Farmers: {analytics.data?.totalActiveFarmers}</p>
      <p>Pending: {analytics.data?.pendingApprovals}</p>
    </div>
  )
}
```

---

## API Endpoint Quick Links

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/farmers` | GET | All farmers (add ?status=PENDING) |
| `/api/admin/farmers/[id]/verify` | PATCH | Approve/reject farmer |
| `/api/admin/analytics` | GET | Dashboard KPIs |
| `/api/admin/products` | GET | All products (add ?sortBy=demandScore) |
| `/api/admin/pricing/config` | GET | Get pricing factors |
| `/api/admin/pricing/config` | PATCH | Update pricing factors |

---

## Response Structure (All endpoints)

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Success message",
  "messageNL": "Sinhala message",
  "timestamp": "2026-04-21T12:00:00Z"
}
```

**On Error:**
```json
{
  "success": false,
  "message": "Error in English",
  "messageNL": "දෝෂ සිංහලෙන්"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | ✅ Success |
| 400 | ⚠️ Bad request (invalid data) |
| 401 | 🔐 Not authenticated |
| 403 | 🚫 Not admin |
| 404 | 🔍 Not found |
| 500 | 💥 Server error |

---

## Farmer Statuses

- `PENDING` - Waiting for approval
- `APPROVED` - Active on platform
- `REJECTED` - Application rejected
- `SUSPENDED` - Temporarily blocked

---

## Product Statuses

- `PENDING` - Awaiting review
- `APPROVED` - Live on marketplace
- `REJECTED` - Not approved
- `OUT_OF_STOCK` - No inventory

---

## Pricing Formula

```
P_final = P_base × (1 + (α × demandScore) − (β × stockQty))

Where:
  α (demandSensitivity)   = 0.01 (default)
  β (supplySensitivity)   = 0.005 (default)
  P_final ≥ P_base (always)
```

**Example:**
```
P_base = 100, demand = 50, stock = 200, α = 0.01, β = 0.005

P_raw = 100 × (1 + 0.01×50 - 0.005×200)
      = 100 × (1 + 0.5 - 1)
      = 100 × 0.5 = 50

P_final = max(50, 100) = 100 (price floor)
```

---

## File Locations

```
project/
├── hooks/useAdminApi.ts              ← Use these
├── lib/apiTester.ts                  ← Test with these
├── app/admin/dashboard/page.tsx      ← Updated to use hooks
├── middleware/adminAuth.ts
├── app/api/admin/
│   ├── farmers/route.ts
│   ├── farmers/[id]/verify/route.ts
│   ├── analytics/route.ts
│   ├── products/route.ts
│   └── pricing/config/route.ts
├── models/
│   ├── PricingConfig.ts
│   ├── User.ts
│   ├── FarmerProfile.ts
│   └── Product.ts
├── types/adminApi.ts                 ← TypeScript types
└── docs/
    ├── ADMIN_API_README.md
    ├── TESTING_GUIDE.md
    └── INTEGRATION_COMPLETE.md
```

---

## Common Issues & Fixes

### ❌ 401 Unauthorized
```
Check: Is user logged in as admin?
Fix: Log out and log in with admin account
```

### ❌ 403 Forbidden  
```
Check: User.role === 'ADMIN'?
Fix: Create admin user or update role in DB
```

### ❌ No data displayed
```
Check: Is there test data in MongoDB?
Fix: Insert test farmers and products first
```

### ❌ Pricing config 404
```
Check: Does PricingConfig document exist?
Fix: Make a PATCH request first to create it
```

---

## Next Features (Optional)

- [ ] Bulk approve/reject farmers
- [ ] CSV export for analytics
- [ ] Real-time WebSocket updates
- [ ] Audit log viewer
- [ ] Admin activity dashboard
- [ ] Alert thresholds (low stock, high demand)

---

**Last Updated:** 2026-04-21  
**Version:** 1.0 - Production Ready  
✅ All endpoints tested and documented
