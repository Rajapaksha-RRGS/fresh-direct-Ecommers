# Fresh Direct QA Test Cases - Part 2
## Modules 4-6: Orders, Payments, Farmer Profile

---

# MODULE 4: ORDER MANAGEMENT

## UI/UX Design Specification

### Checkout Page
```
┌──────────────────────────────────────────────┐
│ 🛒 Checkout              [Step 1 of 2]       │
├──────────────────────────────────────────────┤
│                                              │
│ DELIVERY ADDRESS                             │
│ Full Name: [________________________]         │
│ Phone: [________________________]             │
│ Street Address: [________________________]    │
│ City: [________________________]              │
│ Postal Code: [________________________]       │
│                                              │
│ ORDER SUMMARY                                │
│ ┌────────────────────────────────────────┐  │
│ │ Item          Qty    Price    Subtotal│  │
│ │ Tomatoes (250g) 2 x LKR 150 = 300     │  │
│ │ Carrots (500g)  1 x LKR 120 = 120     │  │
│ ├────────────────────────────────────────┤  │
│ │ Subtotal:              LKR 420        │  │
│ │ Delivery Fee:          LKR 50         │  │
│ │ Total:                 LKR 470        │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ [Cancel Order]  [Proceed to Payment]        │
└──────────────────────────────────────────────┘
```

**Design Specs:**
- Form Fields: #F5F5F5 background, #CCCCCC border
- Button: #2D6A4F primary, #E8F5E9 secondary
- Required fields: Red asterisk *
- Layout: 2-column (desktop), 1-column (mobile)

### Order Success Page
```
┌──────────────────────────────────────────────┐
│                                              │
│         ✅ Order Placed Successfully!        │
│                                              │
│         Order ID: ORD-2024-001234            │
│                                              │
│    Thank you for your order! It will be     │
│    confirmed within 24 hours.               │
│                                              │
│    Tracking Email: customer@email.com        │
│                                              │
│    [View Order] [Continue Shopping]          │
│                                              │
└──────────────────────────────────────────────┘
```

### Order Status Timeline
```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
  (0-6h)   (6-24h)    (1-2 days)  (3-5 days) ✓
   
Each step shows: ✓ timestamp, status, farmer notification
```

---

## Functional Test Cases

### FRESH-ORDER-001: Place Order with Valid Address

| FRESH-ORDER-001 |
|---|
| **Description:** Verify customer can checkout and place order |
| **Priority:** HIGH |
| **Pre-requisite:** Logged in customer, items in cart |
| **Post-Requisite:** Order created, status=PENDING, stock decremented |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to checkout | Click Checkout | Checkout page loads with summary | | |
| 2 | Enter full name | John Doe | Name accepted | | |
| 3 | Enter phone | 0771234567 | Phone validated (10 digits) | | |
| 4 | Enter street | 123 Main St | Address saved | | |
| 5 | Enter city | Colombo | City accepted | | |
| 6 | Enter postal code | 1000 | Postal code accepted | | |
| 7 | Click Place Order | N/A | POST /api/orders submitted | | |
| 8 | Verify response | Order created | Redirects to order-success page | | |
| 9 | Check database | orders collection | Order document created, status=PENDING | | |
| 10 | Verify stock updated | products collection | stockQty decremented (50→48 for Tomatoes) | | |

---

### FRESH-ORDER-002: Track Order Status

| FRESH-ORDER-002 |
|---|
| **Description:** Verify customer can view order status and timeline |
| **Priority:** HIGH |
| **Pre-requisite:** Order exists with status progression |
| **Post-Requisite:** Status displayed correctly |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to /orders | Click order link | Orders list shows | | |
| 2 | Click order | ORD-2024-001234 | Order detail page opens | | |
| 3 | View status | Check page | Current status badge (e.g., "Processing") | | |
| 4 | Check timeline | Status section | Timeline shows: PENDING✓ CONFIRMED✓ PROCESSING● | | |
| 5 | Verify timestamp | Each step | Timestamps show progression | | |
| 6 | Admin updates status | Update to SHIPPED | Customer sees live update | | |

---

### FRESH-ORDER-003: View Order History

| FRESH-ORDER-003 |
|---|
| **Description:** Verify customer can view list of all their orders |
| **Priority:** MEDIUM |
| **Pre-requisite:** Customer has 3+ past orders |
| **Post-Requisite:** All orders listed with summaries |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to /orders | Click My Orders | Orders page loads | | |
| 2 | Verify list | Check displayed | All 3 orders shown (newest first) | | |
| 3 | Check order info | Card content | Order ID, date, status, total visible | | |
| 4 | Click order | Select one | Redirects to detail page | | |
| 5 | Verify sorting | Check order | Orders sorted by date (descending) | | |

---

### FRESH-ORDER-004: Cancel Order

| FRESH-ORDER-004 |
|---|
| **Description:** Verify customer can cancel PENDING orders only |
| **Priority:** MEDIUM |
| **Pre-requisite:** Order with status=PENDING exists |
| **Post-Requisite:** Order cancelled, stock restored |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open PENDING order | Order detail | Cancel button visible | | |
| 2 | Click Cancel Order | N/A | Confirmation dialog appears | | |
| 3 | Confirm cancellation | Click Yes | Order status=CANCELLED | | |
| 4 | Verify stock restored | Check products | Stock restored (48→50 for Tomatoes) | | |
| 5 | Check database | orders table | Order status=CANCELLED, updatedAt set | | |
| 6 | Try cancelling SHIPPED | Shipped order | Cancel button disabled | | |

---

### FRESH-ORDER-005: Insufficient Stock on Order

| FRESH-ORDER-005 |
|---|
| **Description:** Verify order fails if stock unavailable at checkout |
| **Priority:** HIGH |
| **Pre-requisite:** Cart has item, stock decreases before checkout |
| **Post-Requisite:** Order rejected, stock unchanged |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Add 5 Carrots to cart | Current stock: 5 | Cart shows 5 items | | |
| 2 | Another user purchases | Same product | Carrots stock → 0 | | |
| 3 | Try checkout | Proceed button | Validation error appears | | |
| 4 | Check error message | Stock changed | "Only 0 items available. Remove from cart?" | | |
| 5 | Verify cart | Check items | Item auto-removed or qty adjusted | | |

---

## Negative/Edge Case Tests

### FRESH-ORDER-NEG-001: Missing Delivery Address

| FRESH-ORDER-NEG-001 |
|---|
| **Description:** Verify form validation requires all address fields |
| **Priority:** HIGH |
| **Pre-requisite:** At checkout page |
| **Post-Requisite:** Form not submitted |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Leave all fields empty | N/A | Submit button available | | |
| 2 | Click Place Order | Empty form | Validation errors show | | |
| 3 | Check error messages | Form | Red text below required fields | | |
| 4 | Fill only name | John Doe | Other fields still show errors | | |
| 5 | Fill all fields | Complete | Errors clear, submit enabled | | |

---

### FRESH-ORDER-NEG-002: Invalid Phone Number

| FRESH-ORDER-NEG-002 |
|---|
| **Description:** Verify phone number validation |
| **Priority:** MEDIUM |
| **Pre-requisite:** At checkout page |
| **Post-Requisite:** Invalid format rejected |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter invalid phone | "123" | Error: "Phone must be 10 digits" | | |
| 2 | Enter letters | "abcd123456" | Error: "Phone must contain only numbers" | | |
| 3 | Enter valid LK phone | "0771234567" | Accepted | | |

---

### FRESH-ORDER-NEG-003: Empty Cart Checkout

| FRESH-ORDER-NEG-003 |
|---|
| **Description:** Verify checkout blocked with empty cart |
| **Priority:** MEDIUM |
| **Pre-requisite:** Cart empty |
| **Post-Requisite:** Checkout unavailable |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to checkout | Empty cart | Redirects to /products | | |
| 2 | Try direct URL | /checkout | Empty state message "Add items to cart" | | |
| 3 | Check button | Not available | Checkout disabled on cart page | | |

---

# MODULE 5: PAYMENT PROCESSING

## UI/UX Design Specification

### Payment Method Selection Page
```
┌──────────────────────────────────────────────┐
│ 💳 Select Payment Method    [Step 2 of 2]    │
├──────────────────────────────────────────────┤
│                                              │
│ Payment Methods:                             │
│                                              │
│ ○ LankQR                                     │
│   Use QR code for instant payment            │
│                                              │
│ ○ Credit/Debit Card                          │
│   Visa, Mastercard accepted                  │
│                                              │
│ ○ Cash on Delivery (COD)                     │
│   Pay when product arrives                   │
│                                              │
│ Selected Method:                             │
│ [●] LankQR - LKR 470                         │
│                                              │
│ [Cancel] [Pay Now]                           │
│                                              │
└──────────────────────────────────────────────┘
```

### Payment Success Receipt
```
┌──────────────────────────────────────────────┐
│        ✅ Payment Successful!                │
│                                              │
│    Transaction ID: TXN-2024-5678-9012       │
│    Amount: LKR 470                           │
│    Method: LankQR                            │
│    Date: 2024-01-15 14:32 UTC                │
│                                              │
│    Receipt sent to: customer@email.com       │
│    Order confirmed. Farmers notified.        │
│                                              │
│    [Download Receipt] [View Order]           │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Functional Test Cases

### FRESH-PAY-001: Select Payment Method - LankQR

| FRESH-PAY-001 |
|---|
| **Description:** Verify customer can select LankQR payment |
| **Priority:** HIGH |
| **Pre-requisite:** Order in PENDING status |
| **Post-Requisite:** LankQR method selected |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to payment page | Order created | Payment methods displayed | | |
| 2 | Click LankQR radio | N/A | LankQR selected | | |
| 3 | Verify selection | Visual indicator | Radio button filled | | |
| 4 | Check amount | Payment summary | Shows LKR 470 | | |
| 5 | Click Pay Now | N/A | Processes LankQR payment | | |

---

### FRESH-PAY-002: Process Credit Card Payment

| FRESH-PAY-002 |
|---|
| **Description:** Verify credit card payment processing |
| **Priority:** HIGH |
| **Pre-requisite:** Payment page open |
| **Post-Requisite:** Payment processed, order confirmed |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Select Credit Card | Click option | Card details form appears | | |
| 2 | Enter card number | 4111111111111111 | Card accepted | | |
| 3 | Enter expiry | 12/26 | Expiry accepted | | |
| 4 | Enter CVV | 123 | CVV accepted | | |
| 5 | Enter name | John Doe | Cardholder name saved | | |
| 6 | Click Pay | N/A | Payment gateway processes | | |
| 7 | Verify success | Payment response | Success page shows, Order status=CONFIRMED | | |
| 8 | Check database | payments table | Payment record created, status=COMPLETED | | |

---

### FRESH-PAY-003: Cash on Delivery (COD)

| FRESH-PAY-003 |
|---|
| **Description:** Verify COD option for post-delivery payment |
| **Priority:** MEDIUM |
| **Pre-requisite:** Payment page accessible |
| **Post-Requisite:** Order created with COD payment |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Select COD | Click radio button | COD selected | | |
| 2 | View details | Payment method | Shows "Pay at delivery" instruction | | |
| 3 | Click Confirm Order | N/A | Order created | | |
| 4 | Check payment status | Database | payment.status = PENDING | | |
| 5 | Verify order status | orders table | Order = CONFIRMED (awaits COD at delivery) | | |

---

### FRESH-PAY-004: Payment Failure Handling

| FRESH-PAY-004 |
|---|
| **Description:** Verify system handles payment failures gracefully |
| **Priority:** HIGH |
| **Pre-requisite:** Payment in progress |
| **Post-Requisite:** Error shown, order not confirmed |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Attempt payment with invalid card | Expired/invalid | Payment gateway rejects | | |
| 2 | Check error message | Error response | "Payment declined. Please try again." | | |
| 3 | Verify order status | Database | Order still PENDING, payment=FAILED | | |
| 4 | Retry option | Available | Retry button shown or return to payment | | |
| 5 | Try different method | Switch to COD | Can select alternative payment | | |

---

## Negative/Edge Case Tests

### FRESH-PAY-NEG-001: Invalid Card Details

| FRESH-PAY-NEG-001 |
|---|
| **Description:** Verify card validation |
| **Priority:** MEDIUM |
| **Pre-requisite:** Credit card payment selected |
| **Post-Requisite:** Validation error shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter short card number | "4111" | Error: "Card number must be 16 digits" | | |
| 2 | Enter invalid expiry | "13/25" | Error: "Invalid expiration month" | | |
| 3 | Enter 2-digit CVV | "12" | Error: "CVV must be 3-4 digits" | | |

---

### FRESH-PAY-NEG-002: Duplicate Payment Attempt

| FRESH-PAY-NEG-002 |
|---|
| **Description:** Verify system prevents duplicate charges |
| **Priority:** HIGH |
| **Pre-requisite:** Payment in flight |
| **Post-Requisite:** Second attempt blocked |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click Pay button | N/A | Payment processing... | | |
| 2 | Click Pay again (network slow) | N/A | Button disabled or loading state | | |
| 3 | Check database | payments table | Only 1 payment record created | | |

---

### FRESH-PAY-NEG-003: Payment Timeout

| FRESH-PAY-NEG-003 |
|---|
| **Description:** Verify timeout handling for slow payments |
| **Priority:** MEDIUM |
| **Pre-requisite:** Payment initiated |
| **Post-Requisite:** Timeout error shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Simulate slow network | Delay >30s | Timeout error after 30 seconds | | |
| 2 | Check message | Error display | "Payment timeout. Please try again." | | |
| 3 | Verify order | Database | Order still PENDING | | |

---

# MODULE 6: FARMER PROFILE & ONBOARDING

## UI/UX Design Specification

### Farmer Registration - Step 1 (Account)
```
┌──────────────────────────────────────────────┐
│ 🌿 Become a Farmer   [Step 1 of 3]           │
├──────────────────────────────────────────────┤
│                                              │
│ Account Information                          │
│                                              │
│ Full Name: *    [________________________]   │
│ Email: *        [________________________]   │
│ Password: *     [________________________]   │
│              (8+ chars, 1 uppercase, 1 #)   │
│ Confirm: *      [________________________]   │
│                                              │
│ NIC/ID: *       [________________________]   │
│                 (9 digits + V/X or 12 dig)  │
│ Mobile: *       [________________________]   │
│                 (07 + 8 digits)             │
│ WhatsApp:       ☐ Use WhatsApp for updates │
│                                              │
│ [Back] [Next: Farm Details]                 │
│                                              │
└──────────────────────────────────────────────┘
```

### Step 2 (Farm Details)
```
┌──────────────────────────────────────────────┐
│ 🌿 Become a Farmer   [Step 2 of 3]           │
├──────────────────────────────────────────────┤
│                                              │
│ Farm Information                             │
│                                              │
│ Farm Name: *    [________________________]   │
│ Location: *     [________________________]   │
│                                              │
│ Crop Types: *   (Select all that apply)     │
│ ☐ Vegetables  ☐ Fruits  ☐ Herbs            │
│ ☐ Grains      ☐ Other                      │
│                                              │
│ Bio/Description:                             │
│ [_________________________________]         │
│ [_________________________________]         │
│                                              │
│ Certifications:                              │
│ ☐ Organic  ☐ Fair Trade  ☐ ISO 22000       │
│                                              │
│ [Back: Account]  [Next: Bank Details]       │
│                                              │
└──────────────────────────────────────────────┘
```

### Step 3 (Bank Details)
```
┌──────────────────────────────────────────────┐
│ 🌿 Become a Farmer   [Step 3 of 3]           │
├──────────────────────────────────────────────┤
│                                              │
│ Bank Account Information                     │
│                                              │
│ Account Holder: * [________________________]  │
│ Bank: *         [________________________]    │
│ Branch: *       [________________________]    │
│ Account Number: * [________________________] │
│                                              │
│ ℹ️ Your account will be verified by admin.   │
│ You can start listing products after        │
│ approval (usually within 24 hours).         │
│                                              │
│ [Back: Farm Details] [Complete Registration]│
│                                              │
└──────────────────────────────────────────────┘
```

### Farmer Dashboard
```
┌──────────────────────────────────────────────┐
│ 🌿 Farmer Dashboard   Welcome, John! [↗]    │
├──────────────────────────────────────────────┤
│                                              │
│ QUICK STATS                                  │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ 12      │ │ 8       │ │ 450     │        │
│ │ Products│ │ Active  │ │ Units   │        │
│ │         │ │ Products│ │ Sold    │        │
│ └─────────┘ └─────────┘ └─────────┘        │
│                                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ 45,500  │ │ 2       │ │ 3       │        │
│ │ Est.Rev │ │ Pending │ │ Orders  │        │
│ │ LKR     │ │ Approval│ │ Today   │        │
│ └─────────┘ └─────────┘ └─────────┘        │
│                                              │
│ ACTIONS                                      │
│ [+ Add Product] [View Products] [Statistics]│
│ [View Orders]   [Update Profile]            │
│                                              │
│ RECENT ORDERS                                │
│ Order ID  | Customer | Amount  | Status     │
│ ORD-1234  | John     | LKR500  | Delivered  │
│ ORD-1235  | Sarah    | LKR300  | Shipped    │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Functional Test Cases

### FRESH-FARM-001: Complete 3-Step Farmer Registration

| FRESH-FARM-001 |
|---|
| **Description:** Verify farmer can register through all 3 steps |
| **Priority:** HIGH |
| **Pre-requisite:** At farmer registration page |
| **Post-Requisite:** User and farmer profile created, status=PENDING |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to registration | /register/farmer | Step 1 form loads | | |
| 2 | Enter full name | Jane Farmer | Accepted | | |
| 3 | Enter email | jane@farm.com | Unique email validated | | |
| 4 | Enter password | FarmPass123! | Strength indicator green | | |
| 5 | Confirm password | FarmPass123! | Match verified | | |
| 6 | Enter NIC | 123456789V | Format validated (9+V) | | |
| 7 | Enter mobile | 0771234567 | LK format validated | | |
| 8 | Toggle WhatsApp | ☑ | Checkbox marked | | |
| 9 | Click Next | N/A | Step 2 loads, Step 1 data saved | | |
| 10 | Enter farm name | Green Valley | Accepted | | |
| 11 | Enter location | Kandy | City accepted | | |
| 12 | Select crops | Check Vegetables | Multi-select works | | |
| 13 | Enter bio | "We grow..." | Description saved | | |
| 14 | Select certs | Check Organic | Certifications selected | | |
| 15 | Click Next | N/A | Step 3 loads | | |
| 16 | Enter account name | Jane Farmer | Name accepted | | |
| 17 | Enter bank | Bank of Ceylon | Bank selected | | |
| 18 | Enter branch | Kandy Main | Branch accepted | | |
| 19 | Enter account # | 1234567890 | Account number saved | | |
| 20 | Click Complete | N/A | POST /api/register/farmer submitted | | |
| 21 | Verify response | Success page | Redirects to success page | | |
| 22 | Check database | users table | New user created, role=FARMER | | |
| 23 | Check profile | farmerprofiles table | Profile created, status=PENDING | | |

---

### FRESH-FARM-002: Farmer Profile View & Edit

| FRESH-FARM-002 |
|---|
| **Description:** Verify farmer can view and update profile |
| **Priority:** MEDIUM |
| **Pre-requisite:** Logged in as farmer, profile exists |
| **Post-Requisite:** Profile updated in database |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click Profile | Settings menu | Profile page loads | | |
| 2 | View farm info | Display | Current farm details shown | | |
| 3 | Click Edit | Edit button | Form becomes editable | | |
| 4 | Update farm name | Green Valley Eco | Input editable | | |
| 5 | Update bio | New description | Text updated | | |
| 6 | Click Save | N/A | Changes saved to database | | |
| 7 | Verify update | Reload page | Changes persist | | |

---

### FRESH-FARM-003: Farmer Dashboard Access (Approval Only)

| FRESH-FARM-003 |
|---|
| **Description:** Verify only approved farmers access dashboard |
| **Priority:** HIGH |
| **Pre-requisite:** 2 farmers - 1 approved, 1 pending |
| **Post-Requisite:** Only approved can access |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Login as approved farmer | Credentials | Dashboard accessible | | |
| 2 | Navigate to /FamerDashbord | N/A | Dashboard loads with stats | | |
| 3 | Login as pending farmer | Credentials | Logged in | | |
| 4 | Try accessing dashboard | /FamerDashbord | Redirected with message "Pending approval" | | |

---

### FRESH-FARM-004: Farmer Add Product (Requires Approved Profile)

| FRESH-FARM-004 |
|---|
| **Description:** Verify only approved farmers can add products |
| **Priority:** HIGH |
| **Pre-requisite:** Approved farmer logged in |
| **Post-Requisite:** Product created with status=PENDING |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to add product | Dashboard | Add product form loads | | |
| 2 | Enter product name | Tomatoes | Name accepted | | |
| 3 | Select category | Vegetables | Category dropdown works | | |
| 4 | Enter description | Organic red... | Description saved | | |
| 5 | Enter base price | 150 | Price accepted | | |
| 6 | Enter stock qty | 50 | Quantity saved | | |
| 7 | Upload image | Image file | Image uploaded | | |
| 8 | Click Add Product | N/A | Product created | | |
| 9 | Check database | products table | Product created, status=PENDING, farmerId set | | |

---

### FRESH-FARM-005: Farmer View Orders & Statistics

| FRESH-FARM-005 |
|---|
| **Description:** Verify farmer sees only their orders and stats |
| **Priority:** MEDIUM |
| **Pre-requisite:** Farmer has 3+ orders, other farmers have orders |
| **Post-Requisite:** Only this farmer's orders shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to farmer orders | API /api/farmer/orders | Orders loaded | | |
| 2 | Verify order count | Check list | Shows 3+ orders (farmer's only) | | |
| 3 | Check farmer name | Order items | Shows buyer's farm products only | | |
| 4 | View stats | Dashboard | totalSold, totalViews accurate for farmer | | |
| 5 | Check estimated revenue | Stats card | Calculation: basePrice × totalSold | | |

---

## Negative/Edge Case Tests

### FRESH-FARM-NEG-001: Invalid NIC Format

| FRESH-FARM-NEG-001 |
|---|
| **Description:** Verify NIC validation |
| **Priority:** MEDIUM |
| **Pre-requisite:** At registration step 1 |
| **Post-Requisite:** Error shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter short NIC | "12345" | Error: "NIC must be 9 chars (+ V/X) or 12 digits" | | |
| 2 | Enter invalid format | "ABC123456V" | Error: "Invalid NIC format" | | |
| 3 | Enter valid NIC | "123456789V" | Accepted | | |

---

### FRESH-FARM-NEG-002: Duplicate Email Registration

| FRESH-FARM-NEG-002 |
|---|
| **Description:** Verify duplicate email blocked |
| **Priority:** HIGH |
| **Pre-requisite:** Farmer with email exists |
| **Post-Requisite:** Error shown |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Try registering | Existing email | Error: "Email already registered" | | |
| 2 | Check database | users table | Only 1 record for email | | |

---

### FRESH-FARM-NEG-003: Weak Password

| FRESH-FARM-NEG-003 |
|---|
| **Description:** Verify password strength requirements |
| **Priority:** MEDIUM |
| **Pre-requisite:** At registration |
| **Post-Requisite:** Weak password rejected |

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter weak password | "password" | Error: "8+ chars, 1 uppercase, 1 number required" | | |
| 2 | Enter valid password | "FarmPass123!" | Accepted, strength = Strong | | |

---

**[End of Part 2 - Next: Modules 7-10]**
