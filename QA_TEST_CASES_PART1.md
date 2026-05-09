# Fresh Direct QA Test Cases - Part 1
## Modules 1-3: Authentication, Products, Cart

---

# SETUP & ENVIRONMENT PREPARATION

## Test Environment Configuration
```bash
# Database: MongoDB local/staging
# Base URL: http://localhost:3000
# API Endpoint: http://localhost:3000/api

# Test Users to Create:
# Customer: customer@test.com / password123
# Farmer: farmer@test.com / password123
# Admin: admin@test.com / password123
```

## Database Seed Script (MongoDB)
```javascript
// Create test users
db.users.insertMany([
  {
    _id: ObjectId(),
    email: "customer@test.com",
    passwordHash: "$2b$10$...", // bcrypt hash of "password123"
    name: "Test Customer",
    phone: "0771234567",
    role: "CUSTOMER",
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    email: "farmer@test.com",
    passwordHash: "$2b$10$...",
    name: "Test Farmer",
    phone: "0779876543",
    role: "FARMER",
    createdAt: new Date()
  }
]);

// Create test products
db.products.insertMany([
  {
    _id: ObjectId(),
    name: "Fresh Tomatoes",
    category: "vegetables",
    basePrice: 150,
    currentPrice: 150,
    stockQty: 50,
    demandScore: 0.8,
    totalViews: 100,
    totalSold: 20,
    status: "APPROVED",
    farmerId: ObjectId("farmer_id")
  },
  {
    _id: ObjectId(),
    name: "Organic Carrots",
    category: "vegetables",
    basePrice: 120,
    currentPrice: 120,
    stockQty: 0,
    demandScore: 0.5,
    totalViews: 50,
    totalSold: 30,
    status: "APPROVED",
    farmerId: ObjectId("farmer_id")
  }
]);

// Create farmer profile
db.farmerprofiles.insertOne({
  userId: ObjectId("farmer_id"),
  farmName: "Green Valley Farm",
  location: "Kandy, Sri Lanka",
  status: "APPROVED",
  accountNumber: "1234567890",
  bank: "Bank of Ceylon"
});
```

---

# MODULE 1: AUTHENTICATION & USER MANAGEMENT

## UI/UX Design Specification

### Login Page
```
┌─────────────────────────────────────┐
│         🌿 Fresh Direct             │
├─────────────────────────────────────┤
│                                     │
│    ┌──────────────────────────┐    │
│    │  Sign In to Your Account │    │
│    └──────────────────────────┘    │
│                                     │
│    Role Selection:                  │
│    ○ Customer  ● Farmer  ○ Admin    │
│                                     │
│    Email: [________________]        │
│    Password: [________________]     │
│                                     │
│    ┌─────────────────────────────┐ │
│    │  Sign In (Green #2D6A4F)    │ │
│    └─────────────────────────────┘ │
│                                     │
│    OR                               │
│                                     │
│    ┌─────────────────────────────┐ │
│    │  🔵 Sign in with Google     │ │
│    └─────────────────────────────┘ │
│                                     │
│    Forgot Password? | Create Account│
└─────────────────────────────────────┘
```

**Design Specs:**
- Primary Color: #2D6A4F (Dark Green)
- Secondary: #E8F5E9 (Light Green)
- Accent: #52B788 (Medium Green)
- Font: Poppins (headings), Roboto (body)
- Input Fields: Border-radius 8px, border #CCCCCC
- Buttons: 12px padding, 8px border-radius, white text
- Responsive: Mobile-first, stack elements vertically

---

## Functional Test Cases

### FRESH-AUTH-001: Customer Login via Google OAuth

| FRESH-AUTH-001 |
|---|
| **Description:** Verify customer can successfully login using Google OAuth |
| **Priority:** HIGH |
| **Pre-requisite:** User not logged in, Google OAuth provider configured |
| **Post-Requisite:** Customer logged in, redirected to dashboard, session token stored |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click "Sign in with Google" button | N/A | Google OAuth popup opens | | |
| 2 | Enter valid Google credentials | email@gmail.com, password | OAuth consent screen displays | | |
| 3 | Grant permission to Fresh Direct | Click "Allow" | Redirects to Fresh Direct home/dashboard | | |
| 4 | Verify session token | Check localStorage/cookies | JWT token stored with role: CUSTOMER | | |
| 5 | Check user in database | Query users collection | New user created with Google email, role=CUSTOMER | | |

---

### FRESH-AUTH-002: Farmer Login via Email/Password

| FRESH-AUTH-002 |
|---|
| **Description:** Verify farmer can login with email and password credentials |
| **Priority:** HIGH |
| **Pre-requisite:** Farmer account exists (farmer@test.com), farmer profile approved |
| **Post-Requisite:** Farmer logged in, redirected to farmer dashboard |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to login page | N/A | Login page loads | | |
| 2 | Select "Farmer" role | Click farmer radio button | Role field highlighted with green border | | |
| 3 | Enter email | farmer@test.com | Email accepted in field | | |
| 4 | Enter password | password123 | Password masked with dots | | |
| 5 | Click Sign In button | N/A | Redirects to /FamerDashbord with farmer stats | | |

---

### FRESH-AUTH-003: Admin Login

| FRESH-AUTH-003 |
|---|
| **Description:** Verify admin can login and access admin dashboard |
| **Priority:** HIGH |
| **Pre-requisite:** Admin account exists (admin@test.com) |
| **Post-Requisite:** Admin logged in, admin panel accessible |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to login | N/A | Login page displays with role selector | | |
| 2 | Select Admin role | Click admin radio button | Admin role selected | | |
| 3 | Enter credentials | admin@test.com, password123 | Credentials entered | | |
| 4 | Click Sign In | N/A | Redirects to /admin/dashboard | | |
| 5 | Verify admin menu | Check sidebar | Farmer approvals, product oversight, analytics visible | | |

---

### FRESH-AUTH-004: Customer Registration via Email

| FRESH-AUTH-004 |
|---|
| **Description:** Verify new customer can register with email and password |
| **Priority:** HIGH |
| **Pre-requisite:** User not logged in, at registration page |
| **Post-Requisite:** New customer account created, user logged in |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click "Create Account" link | N/A | Redirects to registration page | | |
| 2 | Enter full name | John Doe | Name accepted | | |
| 3 | Enter email | newemail@test.com | Email validated (unique) | | |
| 4 | Enter password | SecurePass123! | Password accepted, strength indicator shows | | |
| 5 | Confirm password | SecurePass123! | Match confirmation succeeds | | |
| 6 | Click Create Account | N/A | Account created, redirected to marketplace | | |
| 7 | Verify in database | Query users.email | New customer document created | | |

---

### FRESH-AUTH-005: User Logout

| FRESH-AUTH-005 |
|---|
| **Description:** Verify user can logout and session is cleared |
| **Priority:** MEDIUM |
| **Pre-requisite:** User logged in (any role) |
| **Post-Requisite:** User logged out, session cleared, redirected to login |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click user menu (top right) | N/A | Dropdown menu appears with Logout option | | |
| 2 | Click Logout | N/A | Confirms logout action | | |
| 3 | Verify session cleared | Check localStorage | JWT token removed from storage | | |
| 4 | Verify redirect | Check URL | Redirected to /login page | | |
| 5 | Try accessing protected route | Navigate to /FamerDashbord | Redirected back to login | | |

---

## Negative/Edge Case Tests

### FRESH-AUTH-NEG-001: Invalid Email Format

| FRESH-AUTH-NEG-001 |
|---|
| **Description:** Verify system rejects invalid email format |
| **Priority:** MEDIUM |
| **Pre-requisite:** At login/registration page |
| **Post-Requisite:** Error message displayed, form not submitted |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter invalid email | notanemail | Error: "Invalid email format" appears | | |
| 2 | Try email without @ | user.test.com | Error message displayed in red | | |
| 3 | Click Sign In | N/A | Form not submitted, stays on page | | |

---

### FRESH-AUTH-NEG-002: Incorrect Password

| FRESH-AUTH-NEG-002 |
|---|
| **Description:** Verify system rejects incorrect password |
| **Priority:** HIGH |
| **Pre-requisite:** Farmer account exists with known password |
| **Post-Requisite:** Error message shown, login fails |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter correct email | farmer@test.com | Email accepted | | |
| 2 | Enter wrong password | wrongpass123 | Password field shows input | | |
| 3 | Click Sign In | N/A | Error: "Invalid email or password" | | |
| 4 | Verify no session created | Check localStorage | No token stored | | |

---

### FRESH-AUTH-NEG-003: Duplicate Email Registration

| FRESH-AUTH-NEG-003 |
|---|
| **Description:** Verify system prevents duplicate email registration |
| **Priority:** MEDIUM |
| **Pre-requisite:** Customer account with email already exists |
| **Post-Requisite:** Error shown, registration fails |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to registration | N/A | Registration form loads | | |
| 2 | Enter existing email | customer@test.com | Email field accepts input | | |
| 3 | Complete registration form | Name, password, confirm | Form fully filled | | |
| 4 | Click Create Account | N/A | Error: "Email already registered" | | |
| 5 | Check database | Query users | Only one record exists for email | | |

---

# MODULE 2: PRODUCT MANAGEMENT

## UI/UX Design Specification

### Marketplace/Products Page
```
┌────────────────────────────────────────────┐
│ 🌿 Fresh Direct  [Search] [Filter ▼]      │
├────────────────────────────────────────────┤
│ Filter by Category:                        │
│ [All] [Vegetables] [Fruits] [Herbs]        │
├────────────────────────────────────────────┤
│                                            │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │          │ │          │ │          │   │
│ │  Product │ │  Product │ │  Product │   │
│ │ Tomatoes │ │ Carrots  │ │ Lettuce  │   │
│ │ LKR 150  │ │ LKR 120  │ │ LKR 80   │   │
│ │ ⭐4.5(12)│ │ ⭐5.0(5) │ │ Out Stock│   │
│ │          │ │          │ │          │   │
│ │[Add Cart]│ │[Add Cart]│ │[Disabled]│   │
│ └──────────┘ └──────────┘ └──────────┘   │
│                                            │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │  Product │ │  Product │ │  Product │   │
│ ...
└────────────────────────────────────────────┘
```

**Design Specs:**
- Product Cards: 250px width, shadow on hover
- Colors: Badge "#2D6A4F" for price, "#E8F5E9" for background
- Stock Status: Green for in-stock, Red for out-of-stock
- Rating: ⭐ icon with count (e.g., "⭐4.5 (12 reviews)")
- Responsive: 3-column (desktop), 2-column (tablet), 1-column (mobile)

### Product Detail Page
```
┌──────────────────────────────────────────────┐
│ < Back | 🌿 Fresh Direct                     │
├──────────────────────────────────────────────┤
│  [Large Product Image]    │ Fresh Tomatoes   │
│                           │ Category: Veg    │
│                           │                  │
│                           │ Price: LKR 150   │
│                           │ Stock: 50 units  │
│                           │ Demand: 🔥 High  │
│                           │                  │
│                           │ Qty: [1-50 ▼]   │
│                           │ [Add to Cart]    │
│                           │ [Buy Now]        │
├──────────────────────────────────────────────┤
│ Farmer Profile:                              │
│ 🏡 Green Valley Farm                         │
│ Location: Kandy, Sri Lanka                   │
│ ⭐ 4.8 (45 reviews)                          │
│ [View Farmer Profile]                        │
├──────────────────────────────────────────────┤
│ Reviews (12):                                │
│ ⭐⭐⭐⭐⭐ "Excellent quality!" - John         │
│ ⭐⭐⭐⭐ "Good, fresh produce" - Sarah        │
└──────────────────────────────────────────────┘
```

---

## Functional Test Cases

### FRESH-PROD-001: Browse All Products

| FRESH-PROD-001 |
|---|
| **Description:** Verify all approved products display on marketplace with dynamic pricing |
| **Priority:** HIGH |
| **Pre-requisite:** At least 5 approved products in database |
| **Post-Requisite:** All products visible, prices calculated |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to /products | N/A | Products page loads | | |
| 2 | Verify product count | Grid view | 5+ products displayed in cards | | |
| 3 | Check product info | Card content | Name, price, rating, farmer name visible | | |
| 4 | Verify pricing | Fresh Tomatoes card | Current price = LKR 150 (calculated price) | | |
| 5 | Check stock status | Carrots card (0 qty) | Out of Stock badge displayed, Add Cart disabled | | |

---

### FRESH-PROD-002: Search Products by Keyword

| FRESH-PROD-002 |
|---|
| **Description:** Verify product search filters results by keyword |
| **Priority:** HIGH |
| **Pre-requisite:** Multiple products in marketplace |
| **Post-Requisite:** Only matching products shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click search bar | N/A | Search input focused, placeholder "Search products..." | | |
| 2 | Type keyword | "Tomato" | Results filter in real-time | | |
| 3 | Verify results | Check displayed products | Only tomato products shown | | |
| 4 | Clear search | Select all, delete | All products visible again | | |
| 5 | Search non-existent | "xyz123product" | "No products found" message displayed | | |

---

### FRESH-PROD-003: Filter by Category

| FRESH-PROD-003 |
|---|
| **Description:** Verify category filter works correctly |
| **Priority:** MEDIUM |
| **Pre-requisite:** Products in multiple categories |
| **Post-Requisite:** Only selected category shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click Category filter | N/A | Dropdown shows categories | | |
| 2 | Select "Vegetables" | Click option | Only vegetables displayed | | |
| 3 | Count results | Visual count | 3-5 vegetables shown | | |
| 4 | Switch to "Fruits" | Click option | Products change to fruits | | |
| 5 | Select "All" | Click option | All categories visible again | | |

---

### FRESH-PROD-004: View Product Detail & Track View

| FRESH-PROD-004 |
|---|
| **Description:** Verify product detail page loads and increments view counter |
| **Priority:** HIGH |
| **Pre-requisite:** Product exists in database |
| **Post-Requisite:** Detail page shown, totalViews incremented |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click product card | Fresh Tomatoes | Product detail page loads | | |
| 2 | Verify content | Page loaded | Name, price, farm info, reviews visible | | |
| 3 | Check database | Query product.totalViews | totalViews incremented by 1 | | |
| 4 | View again | Click another time | totalViews incremented again | | |
| 5 | Verify farmer link | Click farmer profile | Redirects to farmer detail page | | |

---

### FRESH-PROD-005: Out of Stock Handling

| FRESH-PROD-005 |
|---|
| **Description:** Verify out-of-stock products display correctly |
| **Priority:** MEDIUM |
| **Pre-requisite:** Product with stockQty = 0 exists |
| **Post-Requisite:** Product marked unavailable |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to products | N/A | Out-of-stock product visible | | |
| 2 | Verify badge | Carrots product | "Out of Stock" badge shown in red | | |
| 3 | Check Add Cart button | Card action | Button disabled/greyed out | | |
| 4 | Try clicking button | N/A | No action/tooltip "Not available" appears | | |
| 5 | Verify in detail page | Click product | "Out of Stock" message on detail page | | |

---

## Negative/Edge Case Tests

### FRESH-PROD-NEG-001: No Products Available

| FRESH-PROD-NEG-001 |
|---|
| **Description:** Verify correct message shown when no products match filter |
| **Priority:** LOW |
| **Pre-requisite:** Marketplace with no approved products |
| **Post-Requisite:** Empty state message shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to /products | N/A | Page loads | | |
| 2 | Verify state | Empty grid | "No products available" message displayed | | |
| 3 | Check image | Empty state | Icon or illustration shown | | |

---

### FRESH-PROD-NEG-002: Invalid Product ID

| FRESH-PROD-NEG-002 |
|---|
| **Description:** Verify 404 error for non-existent product |
| **Priority:** MEDIUM |
| **Pre-requisite:** At products page |
| **Post-Requisite:** 404 error page shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to product detail | /products/invalid-id | 404 page displays | | |
| 2 | Verify error message | Page content | "Product not found" message | | |
| 3 | Check navigation | Back button | Can return to marketplace | | |

---

### FRESH-PROD-NEG-003: Pending/Rejected Products Hidden

| FRESH-PROD-NEG-003 |
|---|
| **Description:** Verify unapproved products don't show on marketplace |
| **Priority:** HIGH |
| **Pre-requisite:** Product with status=PENDING exists |
| **Post-Requisite:** Pending product not visible to customers |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Query database | Find pending products | 2-3 pending products exist | | |
| 2 | Browse marketplace | /products | Pending products NOT listed | | |
| 3 | Try direct link | /products/pending-id | 404 or "Not available" shown | | |

---

# MODULE 3: CART MANAGEMENT

## UI/UX Design Specification

### Cart Drawer (Mobile Overlay)
```
┌──────────────────────────────┐
│ 🛒 Your Cart        [X Close] │
├──────────────────────────────┤
│ ┌────────────────────────┐   │
│ │ 📦 Tomatoes (250g)     │   │
│ │ LKR 150 x 2 = 300      │   │
│ │ [- 2 +] [Remove]       │   │
│ └────────────────────────┘   │
│                              │
│ ┌────────────────────────┐   │
│ │ 📦 Carrots (500g)      │   │
│ │ LKR 120 x 1 = 120      │   │
│ │ [- 1 +] [Remove]       │   │
│ └────────────────────────┘   │
├──────────────────────────────┤
│ Subtotal:       LKR 420      │
│ Delivery:       LKR 50       │
│ ─────────────────────────────│
│ Total:          LKR 470      │
│                              │
│ [Clear Cart] [Checkout]      │
└──────────────────────────────┘
```

**Design Specs:**
- Background: #E8F5E9 (Light green)
- Item Cards: White background, 8px border-radius
- Primary Button: #2D6A4F (green)
- Quantity: +/- buttons with min=1
- Responsive: Full-width mobile, 350px desktop sidebar

### Cart Page (Desktop)
```
┌──────────────────────────────────────────┐
│ 🛒 Shopping Cart                         │
├──────────────────────────────────────────┤
│ Items: 3                                 │
│                                          │
│ Item | Price | Qty | Subtotal | Action  │
│ ─────────────────────────────────────    │
│ Tom. | 150   | [1] | 150      | Remove  │
│ Car. | 120   | [2] | 240      | Remove  │
│ Let. | 80    | [1] | 80       | Remove  │
│                                          │
│ [Continue Shopping]   [Checkout]        │
│                                          │
│ Cart Summary (Right Sidebar):           │
│ ├─ Subtotal: LKR 470                   │
│ ├─ Tax (10%): LKR 47                   │
│ ├─ Delivery: LKR 50                    │
│ └─ Total: LKR 567                      │
└──────────────────────────────────────────┘
```

---

## Functional Test Cases

### FRESH-CART-001: Add Product to Cart

| FRESH-CART-001 |
|---|
| **Description:** Verify product can be added to cart from marketplace |
| **Priority:** HIGH |
| **Pre-requisite:** Logged in as customer, approved product available |
| **Post-Requisite:** Item added to cart, count updated |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Browse marketplace | /products | Products displayed | | |
| 2 | Click Add to Cart | Tomatoes product | Cart drawer opens (mobile) or sidebar updates | | |
| 3 | Verify item added | Check cart | Tomatoes appears in cart | | |
| 4 | Check cart badge | Top navigation | Cart count shows "1" | | |
| 5 | Verify price snapshot | Cart item | LKR 150 saved as unit price | | |

---

### FRESH-CART-002: Update Item Quantity

| FRESH-CART-002 |
|---|
| **Description:** Verify quantity can be adjusted in cart |
| **Priority:** HIGH |
| **Pre-requisite:** Item in cart |
| **Post-Requisite:** Quantity updated, total recalculated |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | Click cart icon | Cart shows with items | | |
| 2 | Click + button | Increase qty | Quantity changes from 1 to 2 | | |
| 3 | Verify subtotal | Updated price | 150 x 2 = 300 shown | | |
| 4 | Click - button | Decrease qty | Quantity changes from 2 to 1 | | |
| 5 | Verify total updates | Check cart total | Total recalculated correctly | | |

---

### FRESH-CART-003: Remove Item from Cart

| FRESH-CART-003 |
|---|
| **Description:** Verify items can be removed from cart |
| **Priority:** HIGH |
| **Pre-requisite:** Multiple items in cart |
| **Post-Requisite:** Item removed, cart updated |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | Click cart | Cart displays items | | |
| 2 | Click Remove button | Tomatoes item | Confirmation dialog may appear | | |
| 3 | Confirm removal | Click OK/Yes | Item removed from cart | | |
| 4 | Check cart count | Navigation badge | Count decremented (3→2) | | |
| 5 | Verify total | Check cart total | Total recalculated without item | | |

---

### FRESH-CART-004: Clear Entire Cart

| FRESH-CART-004 |
|---|
| **Description:** Verify Clear Cart empties all items |
| **Priority:** MEDIUM |
| **Pre-requisite:** Multiple items in cart |
| **Post-Requisite:** Cart empty |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | Click cart icon | Multiple items visible | | |
| 2 | Click Clear Cart button | N/A | Confirmation: "Remove all items?" | | |
| 3 | Confirm action | Click Yes | All items removed | | |
| 4 | Verify empty state | Check cart | "Your cart is empty" message shown | | |
| 5 | Check badge | Navigation | Cart count = 0 or hidden | | |

---

### FRESH-CART-005: Cart Persistence After Logout/Login

| FRESH-CART-005 |
|---|
| **Description:** Verify cart persists in localStorage across sessions |
| **Priority:** MEDIUM |
| **Pre-requisite:** Logged in customer with cart items |
| **Post-Requisite:** Cart same after logout/login |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Add items to cart | 2 products | Cart shows 2 items, total LKR 270 | | |
| 2 | Logout | Click logout | Session cleared, redirected to login | | |
| 3 | Login again | Same credentials | Logged back in | | |
| 4 | Check cart | Open cart | Same 2 items visible | | |
| 5 | Verify total | Cart summary | Total LKR 270 still correct | | |

---

## Negative/Edge Case Tests

### FRESH-CART-NEG-001: Add Out-of-Stock Item

| FRESH-CART-NEG-001 |
|---|
| **Description:** Verify out-of-stock products can't be added to cart |
| **Priority:** HIGH |
| **Pre-requisite:** Out-of-stock product on marketplace |
| **Post-Requisite:** Item not added, error shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to out-of-stock product | Carrots (qty=0) | Product detail shows "Out of Stock" | | |
| 2 | Try Add to Cart button | Click button | Button disabled, no action | | |
| 3 | Verify cart unchanged | Check cart | Item not added | | |

---

### FRESH-CART-NEG-002: Quantity Exceeds Stock

| FRESH-CART-NEG-002 |
|---|
| **Description:** Verify quantity can't exceed available stock |
| **Priority:** HIGH |
| **Pre-requisite:** Product with stockQty=5 in cart |
| **Post-Requisite:** Qty capped at stock level |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Add product to cart | Tomatoes | Default qty=1 shown | | |
| 2 | Try to increase beyond stock | Click + multiple times | Max qty = stock quantity (50) | | |
| 3 | Verify + button disabled | At max qty | Button no longer increases qty | | |
| 4 | Check error message | Try manual input "100" | Error: "Only 50 available" | | |

---

### FRESH-CART-NEG-003: Quantity Below 1

| FRESH-CART-NEG-003 |
|---|
| **Description:** Verify quantity can't go below 1 |
| **Priority:** MEDIUM |
| **Pre-requisite:** Item in cart with qty=1 |
| **Post-Requisite:** Qty stays at 1 |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | View item | Item shows qty=1 | | |
| 2 | Click - button | Decrease qty | - button disabled or no change | | |
| 3 | Verify qty | Check field | Still qty=1 | | |

---

**[End of Part 1 - Next: Modules 4-6]**
