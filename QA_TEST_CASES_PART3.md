# Fresh Direct QA Test Cases - Part 3
## Modules 7-10: Pricing, Admin, Reviews, Notifications + Summary

---

# MODULE 7: DYNAMIC PRICING ENGINE

## UI/UX Design Specification

### Product Card - Pricing Display
```
┌─────────────────┐
│   Tomatoes      │
│                 │
│ Base: LKR 150   │
│ Now:  LKR 157   │ ⬆️ +5% (High Demand)
│                 │
│ 🔥 Trending     │
│ 📦 Stock: 50    │
│ ⭐ 4.5 (12)     │
│                 │
│ [Add to Cart]   │
└─────────────────┘
```

### Admin Pricing Control Panel
```
┌────────────────────────────────────┐
│ 💰 Pricing Configuration            │
├────────────────────────────────────┤
│                                    │
│ Current Settings:                  │
│                                    │
│ Demand Sensitivity (α):            │
│ [0.01] ─────●───── [0.05]         │
│ Current: 0.01  (adjust pricing    │
│                  based on views)   │
│                                    │
│ Supply Sensitivity (β):            │
│ [0.005] ────●──── [0.05]          │
│ Current: 0.005 (discount for high │
│                  supply)           │
│                                    │
│ Formula Preview:                   │
│ P = Base × (1 + 0.01×Demand       │
│            - 0.005×Supply)        │
│                                    │
│ [Reset to Defaults] [Save Changes]│
│                                    │
└────────────────────────────────────┘
```

---

## Functional Test Cases

### FRESH-PRICE-001: Price Calculation - Demand Impact

| FRESH-PRICE-001 |
|---|
| **Description:** Verify price increases with demand (view count) |
| **Priority:** HIGH |
| **Pre-requisite:** Product with low views, admin config set |
| **Post-Requisite:** Price reflects demand increase |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Check initial price | Tomatoes basePrice=150 | API returns currentPrice=150 | | |
| 2 | Simulate 100 views | Increment demandScore | Product viewed 100 times | | |
| 3 | Recalculate price | API /products | Price = 150 × (1 + 0.01×100 - 0.005×50) | | |
| 4 | Verify new price | Math: 150×(1+1-0.25)=262.5 | currentPrice ≈ 262 LKR | | |
| 5 | Check display | Marketplace | New price shown with 🔥 badge | | |

---

### FRESH-PRICE-002: Price Calculation - Supply Discount

| FRESH-PRICE-002 |
|---|
| **Description:** Verify price decreases with high supply (stock) |
| **Priority:** HIGH |
| **Pre-requisite:** Product with high stock |
| **Post-Requisite:** Price reflects supply discount |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Check product | High stock: 200 units | basePrice = 150 | | |
| 2 | Calculate price | Formula applies | Price = 150×(1 + 0.01×demandScore - 0.005×200) | | |
| 3 | Verify discount | Low demand (5 views) | 150×(1+0.05-1.0) = 15 LKR (capped at base) | | |
| 4 | Verify floor | Final price | Never below basePrice (150) | | |

---

### FRESH-PRICE-003: Base Price Floor (Never Below Base)

| FRESH-PRICE-003 |
|---|
| **Description:** Verify final price never drops below basePrice |
| **Priority:** HIGH |
| **Pre-requisite:** High stock, low demand product |
| **Post-Requisite:** Price floor enforced |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Setup: low demand, high stock | demandScore=0.1, stockQty=500 | basePrice=150 | | |
| 2 | Calculate: negative result | Formula: 150×(1+0.001-2.5) | Math would give negative | | |
| 3 | Apply floor logic | Check code | currentPrice = max(calculated, basePrice) | | |
| 4 | Verify final price | Database/API | currentPrice = 150 (not negative) | | |

---

### FRESH-PRICE-004: Admin Adjust Pricing Sensitivity

| FRESH-PRICE-004 |
|---|
| **Description:** Verify admin can adjust demand/supply sensitivity factors |
| **Priority:** MEDIUM |
| **Pre-requisite:** Logged in as admin, pricing config page |
| **Post-Requisite:** New factors applied to calculations |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to pricing config | Admin panel | Pricing configuration panel loads | | |
| 2 | View current settings | Display | α=0.01, β=0.005 shown | | |
| 3 | Adjust demand sensitivity | Slider to 0.03 | New value accepted | | |
| 4 | Adjust supply sensitivity | Slider to 0.01 | New value accepted | | |
| 5 | Click Save Changes | N/A | POST /api/admin/pricing/config | | |
| 6 | Verify database | PricingConfig table | New values stored | | |
| 7 | Test new calculation | Recalculate prices | New sensitivity applied to all products | | |

---

## Negative/Edge Case Tests

### FRESH-PRICE-NEG-001: Invalid Sensitivity Factor

| FRESH-PRICE-NEG-001 |
|---|
| **Description:** Verify invalid sensitivity values rejected |
| **Priority:** MEDIUM |
| **Pre-requisite:** Admin pricing config |
| **Post-Requisite:** Validation error shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Try negative value | Demand=-0.05 | Error: "Must be between 0-1" | | |
| 2 | Try value >1 | Supply=1.5 | Error: "Must be between 0-1" | | |
| 3 | Enter valid range | 0.01 to 0.05 | Accepted | | |

---

### FRESH-PRICE-NEG-002: Rounding Precision

| FRESH-PRICE-NEG-002 |
|---|
| **Description:** Verify prices rounded to 2 decimals |
| **Priority:** LOW |
| **Pre-requisite:** Product with calculation result |
| **Post-Requisite:** Price rounded correctly |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Calculate complex price | All factors | Result: 157.3456... | | |
| 2 | Check rounding | Database value | Stored as 157.35 (2 decimals) | | |

---

# MODULE 8: ADMIN DASHBOARD & OPERATIONS

## UI/UX Design Specification

### Admin Dashboard Overview
```
┌──────────────────────────────────────────────┐
│ 📊 Admin Dashboard  [Logout ↗]               │
├──────────────────────────────────────────────┤
│                                              │
│ QUICK STATS                                  │
│ ┌─────────────┐ ┌─────────────┐             │
│ │ 45          │ │ 8           │             │
│ │ Active Farm │ │ Pending     │             │
│ │ -ers        │ │ Approvals   │             │
│ └─────────────┘ └─────────────┘             │
│                                              │
│ ┌─────────────┐ ┌─────────────┐             │
│ │ 2,500 units │ │ LKR 850,000 │             │
│ │ Market      │ │ Est Revenue │             │
│ │ Liquidity   │ │             │             │
│ └─────────────┘ └─────────────┘             │
│                                              │
│ PENDING ACTIONS                              │
│ [5 Farmers Pending] [12 Products Pending]   │
│ [3 Orders On Hold]                          │
│                                              │
│ NAVIGATION MENU                              │
│ └─ Farmer Management                        │
│    └─ Farmer Approvals                      │
│    └─ View All Farmers                      │
│ └─ Product Management                       │
│    └─ Pending Products                      │
│    └─ All Products                          │
│ └─ Analytics & Reports                      │
│    └─ Sales Analytics                       │
│    └─ Farmer Performance                    │
│ └─ Settings                                 │
│    └─ Pricing Configuration                 │
│    └─ System Settings                       │
│                                              │
└──────────────────────────────────────────────┘
```

### Farmer Approval Queue
```
┌──────────────────────────────────────────────┐
│ 👥 Farmer Approvals (8 Pending)              │
├──────────────────────────────────────────────┤
│                                              │
│ ┌─────────────────────────────────────────┐ │
│ │ John Farmer | john@farm.com             │ │
│ │ NIC: 123456789V | Mobile: 0771234567   │ │
│ │ Farm: Green Valley | Kandy              │ │
│ │ Registered: 2024-01-10                  │ │
│ │                                         │ │
│ │ [View Details] [✓ Approve] [✗ Reject] │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ ┌─────────────────────────────────────────┐ │
│ │ Sarah Crops | sarah@eco.com             │ │
│ │ ...                                     │ │
│ └─────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Functional Test Cases

### FRESH-ADMIN-001: View Pending Farmer Approvals

| FRESH-ADMIN-001 |
|---|
| **Description:** Verify admin sees list of pending farmers |
| **Priority:** HIGH |
| **Pre-requisite:** 3+ farmers with status=PENDING |
| **Post-Requisite:** All pending farmers listed |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to farmer approvals | Admin menu | Farmer approvals page loads | | |
| 2 | Check pending count | Display | Shows "8 Pending Approvals" | | |
| 3 | Verify list | Farmers displayed | All 3+ pending farmers shown | | |
| 4 | Check farmer info | Card content | Name, email, NIC, location visible | | |
| 5 | Verify filter | Status=PENDING | Only pending shown, approved hidden | | |

---

### FRESH-ADMIN-002: Approve Farmer

| FRESH-ADMIN-002 |
|---|
| **Description:** Verify admin can approve pending farmer |
| **Priority:** HIGH |
| **Pre-requisite:** Pending farmer in queue |
| **Post-Requisite:** Farmer status=APPROVED, can access dashboard |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click Approve button | John Farmer | Confirmation: "Approve farmer?" | | |
| 2 | Confirm action | Click Yes | PATCH /api/admin/farmers/id submitted | | |
| 3 | Check response | Success message | "Farmer approved successfully" | | |
| 4 | Verify database | farmerprofiles table | Status changed to APPROVED | | |
| 5 | Check approvedBy | Record metadata | Admin ID stored in approvedBy | | |
| 6 | Test farmer access | Farmer logs in | Can now access dashboard | | |

---

### FRESH-ADMIN-003: Reject Farmer Application

| FRESH-ADMIN-003 |
|---|
| **Description:** Verify admin can reject farmer application |
| **Priority:** MEDIUM |
| **Pre-requisite:** Pending farmer exists |
| **Post-Requisite:** Farmer status=REJECTED |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click Reject button | Sarah Crops | Rejection reason form appears | | |
| 2 | Enter reason | "Incomplete bank details" | Reason accepted | | |
| 3 | Confirm rejection | Click Submit | PATCH request with reason | | |
| 4 | Check status | Database | FarmerProfile.status = REJECTED | | |
| 5 | Verify farmer notification | Check notification | Farmer receives rejection email | | |

---

### FRESH-ADMIN-004: View All Products & Approve

| FRESH-ADMIN-004 |
|---|
| **Description:** Verify admin can manage product listings |
| **Priority:** HIGH |
| **Pre-requisite:** Products with status=PENDING |
| **Post-Requisite:** Products approved or rejected |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to product management | Admin menu | Products page loads | | |
| 2 | Filter by status | PENDING | Shows 5+ pending products | | |
| 3 | Check product info | Card details | Name, price, farmer, status visible | | |
| 4 | Click Approve | Product item | Product status=APPROVED | | |
| 5 | Verify visibility | Marketplace | Product now shows to customers | | |
| 6 | Reject another | Click Reject | Product status=REJECTED | | |
| 7 | Verify hidden | Direct link | Product returns 404 or "Not available" | | |

---

### FRESH-ADMIN-005: View Sales Analytics Dashboard

| FRESH-ADMIN-005 |
|---|
| **Description:** Verify admin can view market analytics |
| **Priority:** MEDIUM |
| **Pre-requisite:** Orders and transactions exist |
| **Post-Requisite:** Analytics displayed with accurate totals |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to analytics | Admin menu | Analytics page loads | | |
| 2 | View active farmers | Dashboard | Shows count of approved farmers | | |
| 3 | View pending approvals | Card | Shows pending farmer count | | |
| 4 | Check market liquidity | Dashboard | Total stockQty of approved products | | |
| 5 | View revenue estimates | Card | Sum of basePrice × totalSold | | |
| 6 | Check top products | Section | Top 5 products by demandScore | | |

---

## Negative/Edge Case Tests

### FRESH-ADMIN-NEG-001: Non-Admin Access Blocked

| FRESH-ADMIN-NEG-001 |
|---|
| **Description:** Verify non-admin users can't access admin panel |
| **Priority:** HIGH |
| **Pre-requisite:** Logged in as customer/farmer |
| **Post-Requisite:** Access denied |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Try admin URL | Customer user | Redirected to login or dashboard | | |
| 2 | Try direct API call | /api/admin/farmers | 403 Forbidden response | | |
| 3 | Check error | Response | "Unauthorized: Admin access required" | | |

---

### FRESH-ADMIN-NEG-002: Approve Non-Existent Farmer

| FRESH-ADMIN-NEG-002 |
|---|
| **Description:** Verify graceful error for invalid farmer ID |
| **Priority:** MEDIUM |
| **Pre-requisite:** Admin panel open |
| **Post-Requisite:** Error shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Try API call | invalid-id | 404 Farmer not found error | | |
| 2 | Check response | Error message | "Farmer ID not found" displayed | | |

---

# MODULE 9: REVIEW & RATING SYSTEM

## UI/UX Design Specification

### Product Reviews Section
```
┌──────────────────────────────────────────────┐
│ ⭐ REVIEWS (12 Total) [Average 4.5★]         │
├──────────────────────────────────────────────┤
│                                              │
│ Rating Breakdown:                            │
│ ⭐⭐⭐⭐⭐ (8 reviews)  ████████░░ 67%        │
│ ⭐⭐⭐⭐  (3 reviews)  ███░░░░░░░ 25%        │
│ ⭐⭐⭐   (1 reviews)  ░░░░░░░░░░ 8%         │
│                                              │
│ [Leave a Review] (if purchased)              │
│                                              │
│ REVIEWS:                                     │
│ ┌────────────────────────────────────────┐  │
│ │ ⭐⭐⭐⭐⭐ "Excellent quality!"         │  │
│ │ John Doe • 2 days ago                 │  │
│ │ "Fresh tomatoes arrived in perfect   │  │
│ │ condition. Will order again soon."   │  │
│ │ [Helpful(5)] [Report]                │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ ⭐⭐⭐⭐ "Good, but pricey"          │  │
│ │ Sarah Smith • 1 week ago              │  │
│ │ "Good quality but a bit expensive   │  │
│ │ for the quantity."                  │  │
│ │ [Helpful(2)] [Report]                │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ [Load More Reviews]                         │
│                                              │
└──────────────────────────────────────────────┘
```

### Add Review Modal
```
┌──────────────────────────────────────────────┐
│ ✏️  Add Your Review    [X]                   │
├──────────────────────────────────────────────┤
│                                              │
│ Rating: ☆☆☆☆☆ (click to rate)              │
│                                              │
│ Your Review:                                 │
│ [________________________________]          │
│ [________________________________]          │
│ [________________________________]          │
│ (max 1000 characters)                        │
│                                              │
│ [Cancel] [Submit Review]                    │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Functional Test Cases

### FRESH-REV-001: Add Review to Purchased Product

| FRESH-REV-001 |
|---|
| **Description:** Verify customer can add review after purchase |
| **Priority:** HIGH |
| **Pre-requisite:** Customer has delivered order containing product |
| **Post-Requisite:** Review created in database |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to product | Product from order | Product detail page loads | | |
| 2 | Scroll to reviews | Reviews section | "Leave a Review" button visible | | |
| 3 | Click Add Review | Button | Review modal opens | | |
| 4 | Rate product | Click 4 stars | 4-star rating selected | | |
| 5 | Write comment | "Great quality!" | Text accepted (max 1000 chars) | | |
| 6 | Click Submit | N/A | POST /api/reviews submitted | | |
| 7 | Verify review created | Database | Review document in reviews table | | |
| 8 | Check display | Product page | New review appears in list | | |

---

### FRESH-REV-002: Prevent Duplicate Reviews

| FRESH-REV-002 |
|---|
| **Description:** Verify each customer can review product only once |
| **Priority:** HIGH |
| **Pre-requisite:** Customer already reviewed product |
| **Post-Requisite:** Duplicate prevented |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to product | Previous reviewed product | Product page loads | | |
| 2 | Check review button | Reviews section | No "Add Review" button for this product | | |
| 3 | Try API call | POST /api/reviews (duplicate) | 409 Conflict error | | |
| 4 | Check error | Response message | "You have already reviewed this product" | | |
| 5 | Check database | reviews table | Only 1 review per (customerId, productId) | | |

---

### FRESH-REV-003: Edit Review

| FRESH-REV-003 |
|---|
| **Description:** Verify customer can edit their review |
| **Priority:** MEDIUM |
| **Pre-requisite:** Customer has review on product |
| **Post-Requisite:** Review updated |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to product | Product page | Product reviews shown | | |
| 2 | Find own review | Look for edit option | [Edit] button visible on own review | | |
| 3 | Click Edit | Button | Review modal opens with current values | | |
| 4 | Change rating | Update to 5 stars | New rating selected | | |
| 5 | Update comment | Change text | New comment entered | | |
| 6 | Click Save | N/A | PATCH /api/reviews/id submitted | | |
| 7 | Verify update | Product page | Updated review displayed | | |

---

### FRESH-REV-004: Delete Review

| FRESH-REV-004 |
|---|
| **Description:** Verify customer can delete their review |
| **Priority:** MEDIUM |
| **Pre-requisite:** Customer has review |
| **Post-Requisite:** Review deleted |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to product | Product page | Own review visible | | |
| 2 | Click Delete | [Delete] button | Confirmation: "Remove review?" | | |
| 3 | Confirm | Click Yes | DELETE /api/reviews/id submitted | | |
| 4 | Verify deleted | Check list | Review no longer visible | | |
| 5 | Check database | reviews table | Record deleted | | |

---

## Negative/Edge Case Tests

### FRESH-REV-NEG-001: Non-Verified Purchase Review Blocked

| FRESH-REV-NEG-001 |
|---|
| **Description:** Verify only verified customers can review |
| **Priority:** HIGH |
| **Pre-requisite:** Customer without order tries to review |
| **Post-Requisite:** Review blocked |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to product | Random product | Product detail shows | | |
| 2 | Try Add Review | Not purchased | Button disabled or hidden | | |
| 3 | Try API call | POST /api/reviews (no order) | 403 Forbidden | | |
| 4 | Check error | Response | "You must have purchased this product to review" | | |

---

# MODULE 10: NOTIFICATION SYSTEM

## UI/UX Design Specification

### Notification Inbox (In-App)
```
┌──────────────────────────────────────────────┐
│ 🔔 Notifications (3 Unread)                  │
├──────────────────────────────────────────────┤
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ ● ORDER_CONFIRMED - 5 mins ago        │  │
│ │ Your order ORD-1234 is confirmed!     │  │
│ │ [Mark as read] [×]                    │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ ● PRODUCT_APPROVED - 2 hours ago      │  │
│ │ Green Valley Farm: Tomatoes approved! │  │
│ │ [Mark as read] [×]                    │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ○ ORDER_SHIPPED - 1 day ago                │  │
│ Your order ORD-1234 shipped!               │  │
│                                              │
│ [Mark all as read] [Clear all]             │  │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Functional Test Cases

### FRESH-NOTIF-001: Send Order Confirmation Notification

| FRESH-NOTIF-001 |
|---|
| **Description:** Verify notification sent on order creation |
| **Priority:** HIGH |
| **Pre-requisite:** Order created |
| **Post-Requisite:** Notification in system |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Place order | Valid checkout | Order created | | |
| 2 | Check notifications | Database | Notification created with type=ORDER_PLACED | | |
| 3 | Verify recipient | Notification.userId | Matches customer ID | | |
| 4 | Check message | Content | Contains order ID and total amount | | |
| 5 | Verify channel | notification.channel | SMS/WhatsApp (if enabled) | | |

---

### FRESH-NOTIF-002: Send Product Approval Notification to Farmer

| FRESH-NOTIF-002 |
|---|
| **Description:** Verify farmer notified when product approved |
| **Priority:** MEDIUM |
| **Pre-requisite:** Product pending approval |
| **Post-Requisite:** Notification sent |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Admin approves product | Click Approve | Product status=APPROVED | | |
| 2 | Check notifications | Database | Notification created, type=PRODUCT_APPROVED | | |
| 3 | Verify recipient | Farmer ID | Notification sent to product farmer | | |
| 4 | Check content | Message | Product name and status included | | |

---

### FRESH-NOTIF-003: Track Notification Read Status

| FRESH-NOTIF-003 |
|---|
| **Description:** Verify notification read status tracking |
| **Priority:** MEDIUM |
| **Pre-requisite:** Notifications in inbox |
| **Post-Requisite:** Read status updated |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | View notification | Unread notification | isRead=false shown with ● badge | | |
| 2 | Click Mark as read | Button | PATCH /api/notifications/id submitted | | |
| 3 | Verify status change | Notification | isRead=true, badge removed | | |
| 4 | Check database | notifications table | isRead field updated | | |

---

## Negative/Edge Case Tests

### FRESH-NOTIF-NEG-001: Notification to Invalid User

| FRESH-NOTIF-NEG-001 |
|---|
| **Description:** Verify system handles invalid user gracefully |
| **Priority:** LOW |
| **Pre-requisite:** N/A |
| **Post-Requisite:** Error logged |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Try sending to deleted user | Invalid userId | Error logged, notification not created | | |
| 2 | Check logs | System logs | Error recorded for admin review | | |

---

---

# SUMMARY & METRICS

## Complete Test Case Coverage

| Module | Functional Tests | Negative Tests | Total | Priority |
|--------|-----------------|----------------|-------|----------|
| Authentication | 5 | 3 | 8 | HIGH |
| Product Management | 5 | 3 | 8 | HIGH |
| Cart Management | 5 | 3 | 8 | HIGH |
| Order Management | 5 | 3 | 8 | HIGH |
| Payment Processing | 4 | 3 | 7 | HIGH |
| Farmer Profile | 5 | 3 | 8 | MEDIUM |
| Dynamic Pricing | 4 | 2 | 6 | MEDIUM |
| Admin Dashboard | 5 | 2 | 7 | MEDIUM |
| Reviews & Ratings | 4 | 1 | 5 | MEDIUM |
| Notifications | 3 | 1 | 4 | LOW |
| **TOTAL** | **45** | **27** | **72** | — |

---

## Test Execution Checklist

### Pre-Testing Setup
- [ ] Database seeded with test data (see seed scripts in Part 1)
- [ ] Test users created (customer, farmer x2, admin)
- [ ] Test environment running on localhost:3000
- [ ] Payment gateway mocked/configured for testing
- [ ] Notification service configured (mock SMS/WhatsApp)

### Phase 1: Authentication & User Management (2 days)
- [ ] FRESH-AUTH-001 through FRESH-AUTH-005
- [ ] FRESH-AUTH-NEG-001 through FRESH-AUTH-NEG-003
- [ ] Expected result: Users can register/login with role-based access

### Phase 2: Product & Cart (3 days)
- [ ] FRESH-PROD-001 through FRESH-PROD-005
- [ ] FRESH-CART-001 through FRESH-CART-005
- [ ] All negative tests
- [ ] Expected result: Product browsing and cart management working

### Phase 3: Checkout & Orders (3 days)
- [ ] FRESH-ORDER-001 through FRESH-ORDER-005
- [ ] FRESH-PAY-001 through FRESH-PAY-004
- [ ] All negative tests
- [ ] Expected result: End-to-end order flow validated

### Phase 4: Farmer & Admin Operations (3 days)
- [ ] FRESH-FARM-001 through FRESH-FARM-005
- [ ] FRESH-ADMIN-001 through FRESH-ADMIN-005
- [ ] All negative tests
- [ ] Expected result: Multi-role workflows validated

### Phase 5: Pricing, Reviews, Notifications (2 days)
- [ ] FRESH-PRICE-001 through FRESH-PRICE-004
- [ ] FRESH-REV-001 through FRESH-REV-004
- [ ] FRESH-NOTIF-001 through FRESH-NOTIF-003
- [ ] All negative tests
- [ ] Expected result: Supporting features validated

---

## Performance Baselines

| Operation | Target | Actual | Status |
|-----------|--------|--------|--------|
| Product listing load | <2s | — | — |
| Cart calculation | <500ms | — | — |
| Checkout submission | <3s | — | — |
| Price recalculation | <1s | — | — |
| Admin dashboard | <2s | — | — |

---

## Known Test Limitations

1. **Payment Gateway**: Using mock provider; real LankQR/card validation skipped
2. **SMS/WhatsApp**: Using mock provider; actual delivery not tested
3. **Email**: Mock email service; actual delivery not verified
4. **Concurrent Orders**: Single-user testing; race conditions not tested
5. **Load Testing**: Not included; focus on functional correctness

---

## Regression Test Suite

Quick 30-minute smoke test for ongoing validation:
- [ ] Login (all roles)
- [ ] Browse products (search + filter)
- [ ] Add to cart + checkout
- [ ] Place order + track status
- [ ] Farmer: add product
- [ ] Admin: approve farmer/product
- [ ] View notifications

---

## Sign-Off

**Test Planning**: ___________________  Date: _________

**Test Execution**: __________________  Date: _________

**Quality Assurance Manager**: ________  Date: _________

---

**End of QA Test Case Documentation**
