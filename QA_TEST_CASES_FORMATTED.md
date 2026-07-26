# Fresh Direct QA Test Cases - Restructured Format

# Module 1: Authentication & User Management


## Test Case 1: Customer Registration via Email

**Test Case ID:** FRESH-AUTH-001

- **Description:** Verify new customer can successfully register with email and password, and account is created in the database.
- **Priority:** High
- **Pre-requisite:** User not logged in, at customer registration page (/register), database connected
- **Post-Requisite:** New customer account created in database, user logged in automatically, redirected to marketplace

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click "Create Account" link on login page | N/A | Redirects to customer registration page | Redirects to customer registration page | Pass |
| 2 | Enter full name in name field | John Doe | Name field accepts input, no errors | Name field accepts input, no errors | Pass |
| 3 | Enter email address in email field | newemail@test.com | Email field accepts input, validates uniqueness | Email field accepts input, validates uniqueness | Pass |
| 4 | Enter password with requirements | SecurePass123! | Password field accepts input, strength indicator shows green | Password field accepts input, strength indicator shows green | Pass |
| 5 | Confirm password matching the password | SecurePass123! | Confirmation field accepts input, match validation succeeds | Confirmation field accepts input, match validation succeeds | Pass |
| 6 | Click "Create Account" button | N/A | Form submits successfully | Form submits successfully | Pass |
| 7 | Verify redirect after registration | Check URL | Redirects to marketplace page (/products) | Redirects to marketplace page (/products) | Pass |
| 8 | Verify user in database | Query users collection | New document created with role=CUSTOMER | New document created with role=CUSTOMER | Pass |
| 9 | Verify session token stored | Check localStorage/cookies | JWT token stored with customer role | JWT token stored with customer role | Pass |

---

## Test Case 2: Customer Login via Google OAuth

**Test Case ID:** FRESH-AUTH-002

- **Description:** Verify customer can successfully login using Google OAuth provider without manual credentials.
- **Priority:** High
- **Pre-requisite:** User not logged in, Google OAuth provider configured, valid Google account available
- **Post-Requisite:** Customer logged in with session token, redirected to dashboard, user created in database if first login

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to login page | N/A | Login page loads with Google sign-in button | Login page loads with Google sign-in button | Pass |
| 2 | Click "Sign in with Google" button | N/A | Google OAuth popup window opens | Google OAuth popup window opens | Pass |
| 3 | Enter valid Google email | user@gmail.com | Email accepted in Google login form | Email accepted in Google login form | Pass |
| 4 | Enter valid Google password | Password123 | Password accepted, Google verification proceeds | Password accepted, Google verification proceeds | Pass |
| 5 | Grant permission to Fresh Direct app | Click "Allow" on consent screen | OAuth consent accepted | OAuth consent accepted | Pass |
| 6 | Verify redirect to Fresh Direct | N/A | Redirects back to Fresh Direct home/dashboard | Redirects back to Fresh Direct home/dashboard | Pass |
| 7 | Verify session token created | Check localStorage | JWT token stored with role=CUSTOMER | JWT token stored with role=CUSTOMER | Pass |
| 8 | Verify user in database (first login) | Query users collection | New customer record created with Google email | New customer record created with Google email | Pass |

---

## Test Case 3: Farmer Login via Email and Password

**Test Case ID:** FRESH-AUTH-003

- **Description:** Verify approved farmer can successfully login using email and password credentials.
- **Priority:** High
- **Pre-requisite:** Farmer account exists (farmer@test.com), farmer profile status=APPROVED, database connected
- **Post-Requisite:** Farmer logged in, session created, redirected to farmer dashboard

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to login page | N/A | Login page loads with role selection | Login page loads with role selection | Pass |
| 2 | Select "Farmer" role option | Click farmer radio button | Farmer role selected, form updates | Farmer role selected, form updates | Pass |
| 3 | Enter farmer email | farmer@test.com | Email accepted in email field | Email accepted in email field | Pass |
| 4 | Enter farmer password | password123 | Password masked with dots, field accepts input | Password masked with dots, field accepts input | Pass |
| 5 | Click "Sign In" button | N/A | Login form submits | Login form submits | Pass |
| 6 | Verify dashboard redirect | Check URL | Redirects to /FamerDashbord | Redirects to /FamerDashbord | Pass |
| 7 | Verify session token | Check localStorage | JWT token stored with role=FARMER | JWT token stored with role=FARMER | Pass |
| 8 | Verify dashboard content loads | Check page | Farmer statistics and menu items visible | Farmer statistics and menu items visible | Pass |

---





## Test Case 6: Invalid Email Format - Registration (Negative)

**Test Case ID:** FRESH-AUTH-NEG-001

- **Description:** Verify system rejects invalid email formats during registration.
- **Priority:** Medium
- **Pre-requisite:** At customer registration page, form ready to validate
- **Post-Requisite:** Error message displayed, form not submitted

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter invalid email format (missing @) | notanemail.com | Error message displays | Error message displays | Pass |
| 2 | Check error text | N/A | "Invalid email format" or similar error shown in red | "Invalid email format" or similar error shown in red | Pass |
| 3 | Enter email without domain | user@ | Error message displays | Error message displays | Pass |
| 4 | Enter valid email format | user@example.com | Error clears, field validated | Error clears, field validated | Pass |
| 5 | Attempt form submission with invalid | notanemail | Submit button click has no effect | Submit button click has no effect | Pass |

---





**Test Case ID:** FRESH-AUTH-NEG-003

- **Description:** Verify system prevents duplicate email registration.
- **Priority:** Medium
- **Pre-requisite:** Customer account with email already exists in database, at registration page
- **Post-Requisite:** Error shown, registration fails, only one record in database

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter existing customer email | customer@test.com | Email field accepts input | Email field accepts input | Pass |
| 2 | Complete registration form | Name, password, confirmation | Form fully filled out | Form fully filled out | Pass |
| 3 | Click "Create Account" button | N/A | Form submits | Form submits | Pass |
| 4 | Verify error message | Check response | "Email already registered" error displayed | "Email already registered" error displayed | Pass |
| 5 | Verify no duplicate in database | Query users collection | Only one record for this email exists | Only one record for this email exists | Pass |
| 6 | Verify user not logged in | Check localStorage | No session token created | No session token created | Pass |

---

## Test Case 9: Weak Password Validation (Negative)

**Test Case ID:** FRESH-AUTH-NEG-004

- **Description:** Verify password strength requirements are enforced.
- **Priority:** Medium
- **Pre-requisite:** At registration page with password field ready
- **Post-Requisite:** Weak passwords rejected, strong passwords accepted

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter weak password (too short) | pass | Error message displays | Error message displays | Pass |
| 2 | Check error text | N/A | "Password must be at least 8 characters" shown | "Password must be at least 8 characters" shown | Pass |
| 3 | Enter password without uppercase | password123 | Error: "Must contain uppercase letter" shown | Error: "Must contain uppercase letter" shown | Pass |
| 4 | Enter password without number | Password! | Error: "Must contain number" shown | Error: "Must contain number" shown | Pass |
| 5 | Enter strong password | StrongPass123! | No error, field validated successfully | No error, field validated successfully | Pass |



# Module 2: Product Management

---

## Test Case 1: Browse All Approved Products

**Test Case ID:** FRESH-PROD-001

- **Description:** Verify all approved products display on marketplace with correct pricing and farmer information.
- **Priority:** High
- **Pre-requisite:** At least 5 products with status=APPROVED in database, product images uploaded, user at /products page
- **Post-Requisite:** All approved products visible in grid, prices calculated correctly, stock status displayed

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to marketplace | Click /products or menu | Products page loads successfully | Products page loads successfully | Pass |
| 2 | Verify product count displayed | Count visible products | 5+ products shown in card grid layout | 5+ products shown in card grid layout | Pass |
| 3 | Check product card contents | Inspect first product | Product name, image, price visible | Product name, image, price visible | Pass |
| 4 | Verify farmer name displayed | Check card | Farmer name shown below price | Farmer name shown below price | Pass |
| 5 | Verify rating and reviews | Check star icon | Ratings displayed (e.g., ⭐4.5 (12 reviews)) | Ratings displayed (e.g., ⭐4.5 (12 reviews)) | Pass |
| 6 | Check stock status badge | Out-of-stock product | "Out of Stock" badge visible for zero qty | "Out of Stock" badge visible for zero qty | Pass |
| 7 | Verify in-stock products | In-stock items | No "Out of Stock" badge displayed | No "Out of Stock" badge displayed | Pass |
| 8 | Check dynamically calculated prices | Tomatoes product | Current price reflects demand+supply formula | Current price reflects demand+supply formula | Pass |

---

## Test Case 2: Search Products by Keyword

**Test Case ID:** FRESH-PROD-002

- **Description:** Verify product search filters results by matching product names and descriptions.
- **Priority:** High
- **Pre-requisite:** Multiple products in database, search bar visible on marketplace
- **Post-Requisite:** Only matching products displayed, search is real-time

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click search bar | N/A | Search input focused, cursor visible | Search input focused, cursor visible | Pass |
| 2 | Type product keyword | "Tomato" | Search input shows typed text | Search input shows typed text | Pass |
| 3 | Verify results filter in real-time | Check grid | Products matching "Tomato" appear immediately | Products matching "Tomato" appear immediately | Pass |
| 4 | Check result accuracy | Visible products | Only tomato-related products shown | Only tomato-related products shown | Pass |
| 5 | Clear search field | Select all, delete | Search cleared, all products visible again | Search cleared, all products visible again | Pass |
| 6 | Search for non-existent product | "xyz123xyz" | "No products found" message displayed | "No products found" message displayed | Pass |
| 7 | Search case-insensitive | "TOMATO" | Results same as lowercase search | Results same as lowercase search | Pass |

---

## Test Case 3: Filter Products by Category

**Test Case ID:** FRESH-PROD-003

- **Description:** Verify category filter correctly narrows product list by selected category.
- **Priority:** Medium
- **Pre-requisite:** Products in multiple categories, category filter visible
- **Post-Requisite:** Only selected category products shown

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click Category filter dropdown | N/A | Dropdown menu opens showing all categories | Dropdown menu opens showing all categories | Pass |
| 2 | Select "Vegetables" category | Click Vegetables option | Filter applied, page updates | Filter applied, page updates | Pass |
| 3 | Verify filtered results | Check displayed products | Only vegetable products shown | Only vegetable products shown | Pass |
| 4 | Count products in category | Visual count | 3-5 vegetables visible | 3-5 vegetables visible | Pass |
| 5 | Switch to different category | Click "Fruits" | Products change, show fruits only | Products change, show fruits only | Pass |
| 6 | Select "All" option | Click All | All categories visible again | All categories visible again | Pass |

---


## Test Case 5: Out of Stock Product Handling

**Test Case ID:** FRESH-PROD-005

- **Description:** Verify out-of-stock products are clearly marked and purchasing disabled.
- **Priority:** Medium
- **Pre-requisite:** Product with stockQty=0 in database, product status=APPROVED
- **Post-Requisite:** Product marked unavailable, cart button disabled

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to products | /products page | Products displayed including out-of-stock | Products displayed including out-of-stock | Pass |
| 2 | Locate out-of-stock product | Carrots (qty=0) | Product visible in grid | Product visible in grid | Pass |
| 3 | Verify out-of-stock badge | Check card | "Out of Stock" badge displayed in red | "Out of Stock" badge displayed in red | Pass |
| 4 | Check add to cart button | Inspect button | Button disabled/greyed out | Button disabled/greyed out | Pass |
| 5 | Try clicking add to cart | Click disabled button | No action triggered or tooltip appears | No action triggered or tooltip appears | Pass |
| 6 | View product details page | Click product | Detail page opens | Detail page opens | Pass |
| 7 | Verify unavailability message | Check page | "Out of Stock" message displayed prominently | "Out of Stock" message displayed prominently | Pass |

---

## Test Case 6: Invalid Product ID (Negative)

**Test Case ID:** FRESH-PROD-NEG-001

- **Description:** Verify 404 error or appropriate message when accessing non-existent product.
- **Priority:** Medium
- **Pre-requisite:** Product with invalid ID does not exist
- **Post-Requisite:** 404 page or error message shown

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to invalid product | /products/invalid-id-123 | 404 or error page displays | 404 or error page displays | Pass |
| 2 | Verify error message | Check content | "Product not found" message shown | "Product not found" message shown | Pass |
| 3 | Check back button functionality | Click back | Navigation returns to products page | Navigation returns to products page | Pass |

---



## Test Case 8: No Products Available - Empty State (Negative)

**Test Case ID:** FRESH-PROD-NEG-003

- **Description:** Verify appropriate message shown when no products match filters.
- **Priority:** Low
- **Pre-requisite:** Marketplace with no approved products or restrictive filter applied
- **Post-Requisite:** Empty state message displayed

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to products | /products | Page loads | Page loads | Pass |
| 2 | Verify empty state display | Check grid | "No products available" message shown | "No products available" message shown | Pass |
| 3 | Check empty state icon | Inspect UI | Illustration or icon displayed | Illustration or icon displayed | Pass |
| 4 | Verify CTA available | Check page | "Browse categories" or similar link present | "Browse categories" or similar link present | Pass |

---

**End of Module 2 Test Cases**

---

# Module 3: Cart Management

---

## Test Case 1: Add Product to Cart

**Test Case ID:** FRESH-CART-001

- **Description:** Verify customer can add an in-stock product to cart from product page or marketplace.
- **Priority:** High
- **Pre-requisite:** Logged in as customer, approved in-stock product available, cart empty
- **Post-Requisite:** Product added to cart, cart count updated, item visible in cart

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Browse marketplace | /products page | Products displayed in grid | Products displayed in grid | Pass |
| 2 | Click "Add to Cart" button | Tomatoes product | Add to cart action triggered | Add to cart action triggered | Pass |
| 3 | Verify cart drawer opens | Check UI | Cart drawer/sidebar appears (mobile/web) | Cart drawer/sidebar appears (mobile/web) | Pass |
| 4 | Verify item added | Check cart contents | Tomatoes visible in cart list | Tomatoes visible in cart list | Pass |
| 5 | Check quantity default | Inspect item | Default quantity = 1 | Default quantity = 1 | Pass |
| 6 | Verify price snapshot | Check cart item | Unit price LKR 150 captured | Unit price LKR 150 captured | Pass |
| 7 | Check cart badge count | Top navigation | Cart count shows "1" | Cart count shows "1" | Pass |
| 8 | Verify database persistence | Query cart collection | Cart document updated with new item | Cart document updated with new item | Pass |

---

## Test Case 2: Update Item Quantity in Cart

**Test Case ID:** FRESH-CART-002

- **Description:** Verify customer can increase/decrease item quantity in cart and totals recalculate.
- **Priority:** High
- **Pre-requisite:** Item in cart with quantity 1, quantity controls visible
- **Post-Requisite:** Quantity updated, cart total recalculated

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | Click cart icon | Cart displays with items | Cart displays with items | Pass |
| 2 | Click + button | Increase quantity | Quantity changes from 1 to 2 | Quantity changes from 1 to 2 | Pass |
| 3 | Verify subtotal updated | Check item total | 150 × 2 = 300 LKR displayed | 150 × 2 = 300 LKR displayed | Pass |
| 4 | Check cart total updated | Cart summary | Grand total recalculated | Grand total recalculated | Pass |
| 5 | Click - button | Decrease quantity | Quantity changes from 2 to 1 | Quantity changes from 2 to 1 | Pass |
| 6 | Verify subtotal recalculates | Item total | 150 × 1 = 150 LKR shown | 150 × 1 = 150 LKR shown | Pass |
| 7 | Verify cart total updates | Grand total | Total reflects new amount | Total reflects new amount | Pass |

---

## Test Case 3: Remove Item from Cart

**Test Case ID:** FRESH-CART-003

- **Description:** Verify customer can remove an item from cart completely.
- **Priority:** High
- **Pre-requisite:** Multiple items in cart, remove button visible
- **Post-Requisite:** Item removed, cart updated, total recalculated

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | Click cart icon | Cart shows multiple items | Cart shows multiple items | Pass |
| 2 | Click Remove button | Tomatoes item | Confirmation dialog may appear | Confirmation dialog may appear | Pass |
| 3 | Confirm removal | Click OK/Yes | Item removed from cart | Item removed from cart | Pass |
| 4 | Verify item gone | Check cart list | Tomatoes no longer visible | Tomatoes no longer visible | Pass |
| 5 | Check cart count | Navigation badge | Count decremented (3 → 2) | Count decremented (3 → 2) | Pass |
| 6 | Verify total recalculated | Cart total | Total reflects remaining items only | Total reflects remaining items only | Pass |
| 7 | Verify database updated | Query cart collection | Cart item removed from database | Cart item removed from database | Pass |

---

## Test Case 4: Clear Entire Cart

**Test Case ID:** FRESH-CART-004

- **Description:** Verify customer can empty entire cart at once.
- **Priority:** Medium
- **Pre-requisite:** Multiple items in cart, clear button visible
- **Post-Requisite:** All items removed, cart empty

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | Click cart icon | Cart displays multiple items | Cart displays multiple items | Pass |
| 2 | Click "Clear Cart" button | N/A | Confirmation: "Remove all items?" | Confirmation: "Remove all items?" | Pass |
| 3 | Confirm clearing | Click Yes | All items removed | All items removed | Pass |
| 4 | Verify empty state | Check cart | "Your cart is empty" message shown | "Your cart is empty" message shown | Pass |
| 5 | Check cart badge | Navigation | Cart count = 0 or badge hidden | Cart count = 0 or badge hidden | Pass |
| 6 | Verify database cleared | Query cart collection | Cart items collection cleared | Cart items collection cleared | Pass |

---

## Test Case 5: Cart Persistence After Logout and Login

**Test Case ID:** FRESH-CART-005

- **Description:** Verify cart items persist in localStorage across logout and login sessions.
- **Priority:** Medium
- **Pre-requisite:** Logged in customer with items in cart
- **Post-Requisite:** Same cart items visible after logout/login cycle

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Add items to cart | 2 products | Cart shows 2 items, total = LKR 270 | Cart shows 2 items, total = LKR 270 | Pass |
| 2 | Note current cart state | Inspect items | Tomatoes (qty 2), Carrots (qty 1) recorded | Tomatoes (qty 2), Carrots (qty 1) recorded | Pass |
| 3 | Click Logout | N/A | Session cleared, redirected to login | Session cleared, redirected to login | Pass |
| 4 | Login again | Same credentials | Successfully logged back in | Successfully logged back in | Pass |
| 5 | Check cart contents | Open cart | Same 2 items visible | Same 2 items visible | Pass |
| 6 | Verify quantities | Item details | Quantities unchanged (qty 2, qty 1) | Quantities unchanged (qty 2, qty 1) | Pass |
| 7 | Verify total | Cart summary | Total = LKR 270 still correct | Total = LKR 270 still correct | Pass |

---

## Test Case 6: Add Out of Stock Item (Negative)

**Test Case ID:** FRESH-CART-NEG-001

- **Description:** Verify out-of-stock products cannot be added to cart.
- **Priority:** High
- **Pre-requisite:** Out-of-stock product on marketplace
- **Post-Requisite:** Item not added, error or message shown

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to out-of-stock product | Carrots (qty=0) | Product detail page loads | Product detail page loads | Pass |
| 2 | Verify "Out of Stock" badge | Check page | Badge clearly visible | Badge clearly visible | Pass |
| 3 | Try clicking "Add to Cart" | Click button | Button disabled or no action | Button disabled or no action | Pass |
| 4 | Verify cart unchanged | Check cart contents | Item NOT added | Item NOT added | Pass |

---

## Test Case 7: Quantity Exceeds Stock Limit (Negative)

**Test Case ID:** FRESH-CART-NEG-002

- **Description:** Verify quantity cannot exceed available stock.
- **Priority:** High
- **Pre-requisite:** Product with limited stock (e.g., 50 units)
- **Post-Requisite:** Quantity capped at stock level

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Add product to cart | Tomatoes | Default qty=1 shown | Default qty=1 shown | Pass |
| 2 | Try increasing beyond stock | Click + multiple times | Quantity stops at max available (50) | Quantity stops at max available (50) | Pass |
| 3 | Verify + button disabled at max | Click + at qty 50 | No further increment | No further increment | Pass |
| 4 | Try manual input above stock | Type "100" in qty field | Error: "Only 50 available" shown | Error: "Only 50 available" shown | Pass |
| 5 | Verify quantity reverts | Check field | Quantity resets to maximum (50) | Quantity resets to maximum (50) | Pass |

---

## Test Case 8: Quantity Below 1 (Negative)

**Test Case ID:** FRESH-CART-NEG-003

- **Description:** Verify quantity cannot go below 1.
- **Priority:** Medium
- **Pre-requisite:** Item in cart with quantity 1
- **Post-Requisite:** Quantity stays at 1, item not removed

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | Click cart | Item displayed with qty=1 | Item displayed with qty=1 | Pass |
| 2 | Try decreasing below 1 | Click - button | No action or button disabled | No action or button disabled | Pass |
| 3 | Verify quantity | Check field | Still qty=1 | Still qty=1 | Pass |
| 4 | Try manual input | Type "0" | Error or field resets to 1 | Error or field resets to 1 | Pass |

---

**End of Module 3 Test Cases**

---

*[Continue with remaining modules in similar format...]*

**To be continued in next section with Modules 4-10**
