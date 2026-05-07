# Fresh Direct QA Test Cases - Restructured Format
## Module 1: Authentication & User Management

---

## Test Case 1: Customer Registration via Email

**Test Case ID:** FRESH-AUTH-001

- **Description:** Verify new customer can successfully register with email and password, and account is created in the database.
- **Priority:** High
- **Pre-requisite:** User not logged in, at customer registration page (/register), database connected
- **Post-Requisite:** New customer account created in database, user logged in automatically, redirected to marketplace

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click "Create Account" link on login page | N/A | Redirects to customer registration page | | |
| 2 | Enter full name in name field | John Doe | Name field accepts input, no errors | | |
| 3 | Enter email address in email field | newemail@test.com | Email field accepts input, validates uniqueness | | |
| 4 | Enter password with requirements | SecurePass123! | Password field accepts input, strength indicator shows green | | |
| 5 | Confirm password matching the password | SecurePass123! | Confirmation field accepts input, match validation succeeds | | |
| 6 | Click "Create Account" button | N/A | Form submits successfully | | |
| 7 | Verify redirect after registration | Check URL | Redirects to marketplace page (/products) | | |
| 8 | Verify user in database | Query users collection | New document created with role=CUSTOMER | | |
| 9 | Verify session token stored | Check localStorage/cookies | JWT token stored with customer role | | |

---

## Test Case 2: Customer Login via Google OAuth

**Test Case ID:** FRESH-AUTH-002

- **Description:** Verify customer can successfully login using Google OAuth provider without manual credentials.
- **Priority:** High
- **Pre-requisite:** User not logged in, Google OAuth provider configured, valid Google account available
- **Post-Requisite:** Customer logged in with session token, redirected to dashboard, user created in database if first login

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to login page | N/A | Login page loads with Google sign-in button | | |
| 2 | Click "Sign in with Google" button | N/A | Google OAuth popup window opens | | |
| 3 | Enter valid Google email | user@gmail.com | Email accepted in Google login form | | |
| 4 | Enter valid Google password | Password123 | Password accepted, Google verification proceeds | | |
| 5 | Grant permission to Fresh Direct app | Click "Allow" on consent screen | OAuth consent accepted | | |
| 6 | Verify redirect to Fresh Direct | N/A | Redirects back to Fresh Direct home/dashboard | | |
| 7 | Verify session token created | Check localStorage | JWT token stored with role=CUSTOMER | | |
| 8 | Verify user in database (first login) | Query users collection | New customer record created with Google email | | |

---

## Test Case 3: Farmer Login via Email and Password

**Test Case ID:** FRESH-AUTH-003

- **Description:** Verify approved farmer can successfully login using email and password credentials.
- **Priority:** High
- **Pre-requisite:** Farmer account exists (farmer@test.com), farmer profile status=APPROVED, database connected
- **Post-Requisite:** Farmer logged in, session created, redirected to farmer dashboard

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to login page | N/A | Login page loads with role selection | | |
| 2 | Select "Farmer" role option | Click farmer radio button | Farmer role selected, form updates | | |
| 3 | Enter farmer email | farmer@test.com | Email accepted in email field | | |
| 4 | Enter farmer password | password123 | Password masked with dots, field accepts input | | |
| 5 | Click "Sign In" button | N/A | Login form submits | | |
| 6 | Verify dashboard redirect | Check URL | Redirects to /FamerDashbord | | |
| 7 | Verify session token | Check localStorage | JWT token stored with role=FARMER | | |
| 8 | Verify dashboard content loads | Check page | Farmer statistics and menu items visible | | |

---

## Test Case 4: Admin Login via Email and Password

**Test Case ID:** FRESH-AUTH-004

- **Description:** Verify admin user can successfully login and access admin dashboard.
- **Priority:** High
- **Pre-requisite:** Admin account exists (admin@test.com), database connected, admin role permissions configured
- **Post-Requisite:** Admin logged in, admin panel accessible, session created

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to login page | N/A | Login page with role selector displays | | |
| 2 | Select "Admin" role option | Click admin radio button | Admin role selected in form | | |
| 3 | Enter admin email | admin@test.com | Email field accepts input | | |
| 4 | Enter admin password | password123 | Password field accepts input, masked display | | |
| 5 | Click "Sign In" button | N/A | Login request submitted | | |
| 6 | Verify admin dashboard redirect | Check URL | Redirects to /admin/dashboard | | |
| 7 | Verify admin menu access | Check sidebar | Farmer approvals, products, analytics menu visible | | |
| 8 | Verify session token | Check localStorage | JWT token stored with role=ADMIN | | |

---

## Test Case 5: User Logout

**Test Case ID:** FRESH-AUTH-005

- **Description:** Verify logged-in user can successfully logout and session is cleared.
- **Priority:** Medium
- **Pre-requisite:** User logged in with valid session (any role: customer, farmer, admin)
- **Post-Requisite:** User logged out, session cleared, redirected to login page

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to any logged-in page | N/A | Logged-in user page loads | | |
| 2 | Click user menu in top-right corner | N/A | Dropdown menu appears with Logout option | | |
| 3 | Click "Logout" button | N/A | Logout action triggered | | |
| 4 | Verify session token removed | Check localStorage | JWT token deleted from storage | | |
| 5 | Verify redirect to login | Check URL | Redirects to /login page | | |
| 6 | Try accessing protected route | Navigate to /FamerDashbord | Redirected back to login (unauthorized) | | |

---

## Test Case 6: Invalid Email Format - Registration (Negative)

**Test Case ID:** FRESH-AUTH-NEG-001

- **Description:** Verify system rejects invalid email formats during registration.
- **Priority:** Medium
- **Pre-requisite:** At customer registration page, form ready to validate
- **Post-Requisite:** Error message displayed, form not submitted

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter invalid email format (missing @) | notanemail.com | Error message displays | | |
| 2 | Check error text | N/A | "Invalid email format" or similar error shown in red | | |
| 3 | Enter email without domain | user@ | Error message displays | | |
| 4 | Enter valid email format | user@example.com | Error clears, field validated | | |
| 5 | Attempt form submission with invalid | notanemail | Submit button click has no effect | | |

---

## Test Case 7: Incorrect Password - Login (Negative)

**Test Case ID:** FRESH-AUTH-NEG-002

- **Description:** Verify system rejects incorrect password and prevents login.
- **Priority:** High
- **Pre-requisite:** Farmer account exists with known correct password, at login page
- **Post-Requisite:** Login fails, error message shown, no session created

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter correct email | farmer@test.com | Email accepted | | |
| 2 | Enter incorrect password | wrongpassword123 | Password field accepts input | | |
| 3 | Click "Sign In" button | N/A | Login attempt submitted | | |
| 4 | Verify error message | Check response | "Invalid email or password" error displayed | | |
| 5 | Verify no session created | Check localStorage | No JWT token stored | | |
| 6 | Verify user stays on login page | Check URL | Still on /login page | | |

---

## Test Case 8: Duplicate Email Registration (Negative)

**Test Case ID:** FRESH-AUTH-NEG-003

- **Description:** Verify system prevents duplicate email registration.
- **Priority:** Medium
- **Pre-requisite:** Customer account with email already exists in database, at registration page
- **Post-Requisite:** Error shown, registration fails, only one record in database

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter existing customer email | customer@test.com | Email field accepts input | | |
| 2 | Complete registration form | Name, password, confirmation | Form fully filled out | | |
| 3 | Click "Create Account" button | N/A | Form submits | | |
| 4 | Verify error message | Check response | "Email already registered" error displayed | | |
| 5 | Verify no duplicate in database | Query users collection | Only one record for this email exists | | |
| 6 | Verify user not logged in | Check localStorage | No session token created | | |

---

## Test Case 9: Weak Password Validation (Negative)

**Test Case ID:** FRESH-AUTH-NEG-004

- **Description:** Verify password strength requirements are enforced.
- **Priority:** Medium
- **Pre-requisite:** At registration page with password field ready
- **Post-Requisite:** Weak passwords rejected, strong passwords accepted

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter weak password (too short) | pass | Error message displays | | |
| 2 | Check error text | N/A | "Password must be at least 8 characters" shown | | |
| 3 | Enter password without uppercase | password123 | Error: "Must contain uppercase letter" shown | | |
| 4 | Enter password without number | Password! | Error: "Must contain number" shown | | |
| 5 | Enter strong password | StrongPass123! | No error, field validated successfully | | |

---

## Test Case 10: SQL Injection Attempt (Negative - Security)

**Test Case ID:** FRESH-AUTH-NEG-005

- **Description:** Verify system prevents SQL injection attacks in login fields.
- **Priority:** High
- **Pre-requisite:** At login page with input fields
- **Post-Requisite:** Injection attempt blocked, treated as invalid input

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Enter SQL injection in email field | ' OR '1'='1 | Input accepted but treated as literal | | |
| 2 | Enter any password | test | Password field accepts | | |
| 3 | Click login | N/A | Login fails (invalid email format) | | |
| 4 | Verify no unauthorized access | Check system logs | Attack attempt logged, no unauthorized access | | |

---

**End of Module 1 Test Cases**

---

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
| 1 | Navigate to marketplace | Click /products or menu | Products page loads successfully | | |
| 2 | Verify product count displayed | Count visible products | 5+ products shown in card grid layout | | |
| 3 | Check product card contents | Inspect first product | Product name, image, price visible | | |
| 4 | Verify farmer name displayed | Check card | Farmer name shown below price | | |
| 5 | Verify rating and reviews | Check star icon | Ratings displayed (e.g., ⭐4.5 (12 reviews)) | | |
| 6 | Check stock status badge | Out-of-stock product | "Out of Stock" badge visible for zero qty | | |
| 7 | Verify in-stock products | In-stock items | No "Out of Stock" badge displayed | | |
| 8 | Check dynamically calculated prices | Tomatoes product | Current price reflects demand+supply formula | | |

---

## Test Case 2: Search Products by Keyword

**Test Case ID:** FRESH-PROD-002

- **Description:** Verify product search filters results by matching product names and descriptions.
- **Priority:** High
- **Pre-requisite:** Multiple products in database, search bar visible on marketplace
- **Post-Requisite:** Only matching products displayed, search is real-time

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click search bar | N/A | Search input focused, cursor visible | | |
| 2 | Type product keyword | "Tomato" | Search input shows typed text | | |
| 3 | Verify results filter in real-time | Check grid | Products matching "Tomato" appear immediately | | |
| 4 | Check result accuracy | Visible products | Only tomato-related products shown | | |
| 5 | Clear search field | Select all, delete | Search cleared, all products visible again | | |
| 6 | Search for non-existent product | "xyz123xyz" | "No products found" message displayed | | |
| 7 | Search case-insensitive | "TOMATO" | Results same as lowercase search | | |

---

## Test Case 3: Filter Products by Category

**Test Case ID:** FRESH-PROD-003

- **Description:** Verify category filter correctly narrows product list by selected category.
- **Priority:** Medium
- **Pre-requisite:** Products in multiple categories, category filter visible
- **Post-Requisite:** Only selected category products shown

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click Category filter dropdown | N/A | Dropdown menu opens showing all categories | | |
| 2 | Select "Vegetables" category | Click Vegetables option | Filter applied, page updates | | |
| 3 | Verify filtered results | Check displayed products | Only vegetable products shown | | |
| 4 | Count products in category | Visual count | 3-5 vegetables visible | | |
| 5 | Switch to different category | Click "Fruits" | Products change, show fruits only | | |
| 6 | Select "All" option | Click All | All categories visible again | | |

---

## Test Case 4: View Product Details and Track Views

**Test Case ID:** FRESH-PROD-004

- **Description:** Verify product detail page loads correctly and increments view counter for demand tracking.
- **Priority:** High
- **Pre-requisite:** Product exists in database, detail page accessible via product ID
- **Post-Requisite:** Detail page displayed, view counter incremented in database

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Click on product card | Fresh Tomatoes | Product detail page loads | | |
| 2 | Verify page content loads | Check elements | Product name, description, image visible | | |
| 3 | Check farmer profile section | Farmer card | Farm name, location, ratings shown | | |
| 4 | Verify reviews section | Reviews area | Customer reviews and ratings displayed | | |
| 5 | Verify database view increment | Query product.totalViews | totalViews incremented by 1 | | |
| 6 | View product again | Click back and reopen | View count increments again | | |
| 7 | Click farmer profile link | Farmer name | Redirects to farmer detail page | | |

---

## Test Case 5: Out of Stock Product Handling

**Test Case ID:** FRESH-PROD-005

- **Description:** Verify out-of-stock products are clearly marked and purchasing disabled.
- **Priority:** Medium
- **Pre-requisite:** Product with stockQty=0 in database, product status=APPROVED
- **Post-Requisite:** Product marked unavailable, cart button disabled

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to products | /products page | Products displayed including out-of-stock | | |
| 2 | Locate out-of-stock product | Carrots (qty=0) | Product visible in grid | | |
| 3 | Verify out-of-stock badge | Check card | "Out of Stock" badge displayed in red | | |
| 4 | Check add to cart button | Inspect button | Button disabled/greyed out | | |
| 5 | Try clicking add to cart | Click disabled button | No action triggered or tooltip appears | | |
| 6 | View product details page | Click product | Detail page opens | | |
| 7 | Verify unavailability message | Check page | "Out of Stock" message displayed prominently | | |

---

## Test Case 6: Invalid Product ID (Negative)

**Test Case ID:** FRESH-PROD-NEG-001

- **Description:** Verify 404 error or appropriate message when accessing non-existent product.
- **Priority:** Medium
- **Pre-requisite:** Product with invalid ID does not exist
- **Post-Requisite:** 404 page or error message shown

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to invalid product | /products/invalid-id-123 | 404 or error page displays | | |
| 2 | Verify error message | Check content | "Product not found" message shown | | |
| 3 | Check back button functionality | Click back | Navigation returns to products page | | |

---

## Test Case 7: Pending Products Hidden from Customers (Negative)

**Test Case ID:** FRESH-PROD-NEG-002

- **Description:** Verify unapproved/pending products don't display to customers.
- **Priority:** High
- **Pre-requisite:** Product with status=PENDING exists in database
- **Post-Requisite:** Pending product not visible to customers

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Query database for pending | Find status=PENDING | 2-3 pending products exist | | |
| 2 | Browse marketplace as customer | /products page | Pending products NOT listed | | |
| 3 | Try direct URL access | /products/pending-product-id | 404 or "Not available" shown | | |
| 4 | Try API call | GET /api/products/pending-id | 404 response from API | | |

---

## Test Case 8: No Products Available - Empty State (Negative)

**Test Case ID:** FRESH-PROD-NEG-003

- **Description:** Verify appropriate message shown when no products match filters.
- **Priority:** Low
- **Pre-requisite:** Marketplace with no approved products or restrictive filter applied
- **Post-Requisite:** Empty state message displayed

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to products | /products | Page loads | | |
| 2 | Verify empty state display | Check grid | "No products available" message shown | | |
| 3 | Check empty state icon | Inspect UI | Illustration or icon displayed | | |
| 4 | Verify CTA available | Check page | "Browse categories" or similar link present | | |

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
| 1 | Browse marketplace | /products page | Products displayed in grid | | |
| 2 | Click "Add to Cart" button | Tomatoes product | Add to cart action triggered | | |
| 3 | Verify cart drawer opens | Check UI | Cart drawer/sidebar appears (mobile/web) | | |
| 4 | Verify item added | Check cart contents | Tomatoes visible in cart list | | |
| 5 | Check quantity default | Inspect item | Default quantity = 1 | | |
| 6 | Verify price snapshot | Check cart item | Unit price LKR 150 captured | | |
| 7 | Check cart badge count | Top navigation | Cart count shows "1" | | |
| 8 | Verify database persistence | Query cart collection | Cart document updated with new item | | |

---

## Test Case 2: Update Item Quantity in Cart

**Test Case ID:** FRESH-CART-002

- **Description:** Verify customer can increase/decrease item quantity in cart and totals recalculate.
- **Priority:** High
- **Pre-requisite:** Item in cart with quantity 1, quantity controls visible
- **Post-Requisite:** Quantity updated, cart total recalculated

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | Click cart icon | Cart displays with items | | |
| 2 | Click + button | Increase quantity | Quantity changes from 1 to 2 | | |
| 3 | Verify subtotal updated | Check item total | 150 × 2 = 300 LKR displayed | | |
| 4 | Check cart total updated | Cart summary | Grand total recalculated | | |
| 5 | Click - button | Decrease quantity | Quantity changes from 2 to 1 | | |
| 6 | Verify subtotal recalculates | Item total | 150 × 1 = 150 LKR shown | | |
| 7 | Verify cart total updates | Grand total | Total reflects new amount | | |

---

## Test Case 3: Remove Item from Cart

**Test Case ID:** FRESH-CART-003

- **Description:** Verify customer can remove an item from cart completely.
- **Priority:** High
- **Pre-requisite:** Multiple items in cart, remove button visible
- **Post-Requisite:** Item removed, cart updated, total recalculated

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | Click cart icon | Cart shows multiple items | | |
| 2 | Click Remove button | Tomatoes item | Confirmation dialog may appear | | |
| 3 | Confirm removal | Click OK/Yes | Item removed from cart | | |
| 4 | Verify item gone | Check cart list | Tomatoes no longer visible | | |
| 5 | Check cart count | Navigation badge | Count decremented (3 → 2) | | |
| 6 | Verify total recalculated | Cart total | Total reflects remaining items only | | |
| 7 | Verify database updated | Query cart collection | Cart item removed from database | | |

---

## Test Case 4: Clear Entire Cart

**Test Case ID:** FRESH-CART-004

- **Description:** Verify customer can empty entire cart at once.
- **Priority:** Medium
- **Pre-requisite:** Multiple items in cart, clear button visible
- **Post-Requisite:** All items removed, cart empty

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | Click cart icon | Cart displays multiple items | | |
| 2 | Click "Clear Cart" button | N/A | Confirmation: "Remove all items?" | | |
| 3 | Confirm clearing | Click Yes | All items removed | | |
| 4 | Verify empty state | Check cart | "Your cart is empty" message shown | | |
| 5 | Check cart badge | Navigation | Cart count = 0 or badge hidden | | |
| 6 | Verify database cleared | Query cart collection | Cart items collection cleared | | |

---

## Test Case 5: Cart Persistence After Logout and Login

**Test Case ID:** FRESH-CART-005

- **Description:** Verify cart items persist in localStorage across logout and login sessions.
- **Priority:** Medium
- **Pre-requisite:** Logged in customer with items in cart
- **Post-Requisite:** Same cart items visible after logout/login cycle

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Add items to cart | 2 products | Cart shows 2 items, total = LKR 270 | | |
| 2 | Note current cart state | Inspect items | Tomatoes (qty 2), Carrots (qty 1) recorded | | |
| 3 | Click Logout | N/A | Session cleared, redirected to login | | |
| 4 | Login again | Same credentials | Successfully logged back in | | |
| 5 | Check cart contents | Open cart | Same 2 items visible | | |
| 6 | Verify quantities | Item details | Quantities unchanged (qty 2, qty 1) | | |
| 7 | Verify total | Cart summary | Total = LKR 270 still correct | | |

---

## Test Case 6: Add Out of Stock Item (Negative)

**Test Case ID:** FRESH-CART-NEG-001

- **Description:** Verify out-of-stock products cannot be added to cart.
- **Priority:** High
- **Pre-requisite:** Out-of-stock product on marketplace
- **Post-Requisite:** Item not added, error or message shown

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Navigate to out-of-stock product | Carrots (qty=0) | Product detail page loads | | |
| 2 | Verify "Out of Stock" badge | Check page | Badge clearly visible | | |
| 3 | Try clicking "Add to Cart" | Click button | Button disabled or no action | | |
| 4 | Verify cart unchanged | Check cart contents | Item NOT added | | |

---

## Test Case 7: Quantity Exceeds Stock Limit (Negative)

**Test Case ID:** FRESH-CART-NEG-002

- **Description:** Verify quantity cannot exceed available stock.
- **Priority:** High
- **Pre-requisite:** Product with limited stock (e.g., 50 units)
- **Post-Requisite:** Quantity capped at stock level

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Add product to cart | Tomatoes | Default qty=1 shown | | |
| 2 | Try increasing beyond stock | Click + multiple times | Quantity stops at max available (50) | | |
| 3 | Verify + button disabled at max | Click + at qty 50 | No further increment | | |
| 4 | Try manual input above stock | Type "100" in qty field | Error: "Only 50 available" shown | | |
| 5 | Verify quantity reverts | Check field | Quantity resets to maximum (50) | | |

---

## Test Case 8: Quantity Below 1 (Negative)

**Test Case ID:** FRESH-CART-NEG-003

- **Description:** Verify quantity cannot go below 1.
- **Priority:** Medium
- **Pre-requisite:** Item in cart with quantity 1
- **Post-Requisite:** Quantity stays at 1, item not removed

| S.No | Action | Inputs | Expected Output | Actual Output | Test Result |
|------|--------|--------|-----------------|---------------|-------------|
| 1 | Open cart | Click cart | Item displayed with qty=1 | | |
| 2 | Try decreasing below 1 | Click - button | No action or button disabled | | |
| 3 | Verify quantity | Check field | Still qty=1 | | |
| 4 | Try manual input | Type "0" | Error or field resets to 1 | | |

---

**End of Module 3 Test Cases**

---

*[Continue with remaining modules in similar format...]*

**To be continued in next section with Modules 4-10**
