# 🌿 Fresh Direct — Development Roadmap

> **Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Prisma · NextAuth · Zustand · Recharts

---This expression is not callable.
  Type 'SaveOptions' has no call signatures.ts(2349)

## 📊 Current Status

| Area | Status |
|------|--------|
| Project Setup (Next.js 16 + Tailwind + TS) | ✅ Done |
| Folder Structure (`(auth)`, `(customer)`) | ✅ Done |
| Login / Register pages (empty) | 🟡 Started |
| Database, Auth, Components | ❌ Not started |

---

## 🗺️ Phase Overview

```
Phase 1 → Foundation & Design System        (Week 1)
Phase 2 → Authentication                    (Week 1-2)
Phase 3 → Customer Features                 (Week 2-3)
Phase 4 → Farmer Dashboard                  (Week 3-4)
Phase 5 → Admin Dashboard + Analytics       (Week 4-5)
Phase 6 → Payment + Notifications           (Week 5-6)
Phase 7 → Testing, Polish & Launch          (Week 6-7)
```

---

## ✅ PHASE 1 — Foundation & Design System
> **Goal:** Project base setup කරලා Design System හදනවා

### 1.1 Install Core Dependencies
```bash
npm install prisma @prisma/client
npm install next-auth@beta
npm install zustand
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react
npm install recharts
npm install bcryptjs
npm install @types/bcryptjs
```

### 1.2 Files to Create / Update

| File | Task |
|------|------|
| `app/globals.css` | Color tokens, fonts, base styles |
| `tailwind.config.ts` | Custom colors, fonts, spacing |
| `prisma/schema.prisma` | DB schema (User, Product, Order, Payment, Review) |
| `.env.local` | Environment variables |
| `lib/db.ts` | Prisma client singleton |
| `lib/utils.ts` | Helper functions (cn, formatPrice, formatDate) |
| `lib/constants.ts` | App constants (categories, order statuses) |
| `types/index.ts` | All TypeScript interfaces |

### 1.3 Design Tokens to Define
- 🎨 **Primary Green:** `#2D6A4F` (Fresh / Nature)
- 🌟 **Accent:** `#F4A261` (Warm Orange)
- 🌑 **Dark BG:** `#0F1A14`
- ✍️ **Font:** Inter / Outfit (Google Fonts)

### 1.4 Base UI Components
```
components/ui/
├── Button.tsx         → variants: primary, secondary, outline, ghost
├── Input.tsx          → with label + error state
├── Card.tsx           → base card wrapper
├── Badge.tsx          → status badges
├── Modal.tsx          → dialog popup
├── Spinner.tsx        → loading spinner
├── Toast.tsx          → success/error notifications
└── Avatar.tsx         → user avatar with fallback
```

---

## ✅ PHASE 2 — Authentication
> **Goal:** Login / Register / Session management

### 2.1 Backend Setup
| File | Task |
|------|------|
| `prisma/schema.prisma` | User model with role (CUSTOMER, FARMER, ADMIN) |
| `lib/auth.ts` | NextAuth config (Credentials Provider) |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth route handler |
| `app/api/auth/register/route.ts` | Register API (bcrypt password hash) |
| `middleware.ts` | Protect routes by role |

### 2.2 Pages to Build
| Page | File |
|------|------|
| Login Page | `app/(auth)/login/page.tsx` |
| Register Page | `app/(auth)/register/page.tsx` |
| Forgot Password | `app/(auth)/forgot-password/page.tsx` |
| Auth Layout | `app/(auth)/layout.tsx` |

### 2.3 Hooks & Store
```
hooks/useAuth.ts         → session, login, logout helpers
store/authStore.ts       → user state (Zustand)
```

### ✔️ Phase 2 Done = Users can Register + Login + Sessions work

---

## ✅ PHASE 3 — Customer Features
> **Goal:** Browse → Cart → Order → Pay → Track

### 3.1 Products
| Page / Component | File |
|------|------|
| Products listing page | `app/(customer)/products/page.tsx` |
| Product detail page | `app/(customer)/products/[id]/page.tsx` |
| Product Card | `components/product/ProductCard.tsx` |
| Product Grid | `components/product/ProductGrid.tsx` |
| Search + Filter | `components/product/ProductSearch.tsx` |
| Products API | `app/api/products/route.ts` |

### 3.2 Farmer Profiles
| Page / Component | File |
|------|------|
| Farmers list | `app/(customer)/farmers/page.tsx` |
| Farmer detail | `app/(customer)/farmers/[id]/page.tsx` |
| Farmer Card | `components/farmer/FarmerCard.tsx` |
| Farmer Profile | `components/farmer/FarmerProfile.tsx` |

### 3.3 Shopping Cart
| Component | File |
|------|------|
| Cart Page | `app/(customer)/cart/page.tsx` |
| Cart Item | `components/cart/CartItem.tsx` |
| Cart Summary | `components/cart/CartSummary.tsx` |
| Cart Drawer | `components/cart/CartDrawer.tsx` |
| Cart Store | `store/cartStore.ts` |
| Cart Hook | `hooks/useCart.ts` |

### 3.4 Orders
| Page / Component | File |
|------|------|
| Checkout Page | `app/(customer)/checkout/page.tsx` |
| Order History | `app/(customer)/orders/page.tsx` |
| Order Detail | `app/(customer)/orders/[id]/page.tsx` |
| Order Timeline | `components/order/OrderTimeline.tsx` |
| Orders API | `app/api/orders/route.ts` |

### 3.5 Reviews
| Component | File |
|------|------|
| Review Form | `components/review/ReviewForm.tsx` |
| Review Card | `components/review/ReviewCard.tsx` |
| Star Rating | `components/review/StarRating.tsx` |
| Reviews API | `app/api/reviews/route.ts` |

### ✔️ Phase 3 Done = Customer can browse, add to cart, place orders, and review

---

## ✅ PHASE 4 — Farmer Dashboard
> **Goal:** Farmer can manage products, inventory, and orders

### 4.1 Farmer Layout
| File | Task |
|------|------|
| `app/(farmer)/layout.tsx` | Sidebar layout for farmer |
| `components/layout/Sidebar.tsx` | Dashboard sidebar nav |
| `components/layout/DashboardHeader.tsx` | Header with user info |

### 4.2 Farmer Pages
| Page | File |
|------|------|
| Farmer Dashboard Overview | `app/(farmer)/dashboard/page.tsx` |
| Manage Products | `app/(farmer)/dashboard/products/page.tsx` |
| Add New Product | `app/(farmer)/dashboard/products/new/page.tsx` |
| Edit Product | `app/(farmer)/dashboard/products/[id]/edit/page.tsx` |
| Update Inventory | `app/(farmer)/dashboard/inventory/page.tsx` |
| View Orders | `app/(farmer)/dashboard/orders/page.tsx` |
| Farmer Profile | `app/(farmer)/dashboard/profile/page.tsx` |

### 4.3 Components
```
components/product/ProductForm.tsx         → Add/Edit form
components/product/ProductImageUpload.tsx  → Cloudinary upload
components/farmer/InventoryTable.tsx       → Stock management table
```

### ✔️ Phase 4 Done = Farmer can list products, update stock, manage orders

---

## ✅ PHASE 5 — Admin Dashboard + Analytics
> **Goal:** Admin can moderate everything + view analytics

### 5.1 Admin Pages
| Page | File |
|------|------|
| Admin Overview | `app/(admin)/dashboard/page.tsx` |
| Manage Users | `app/(admin)/dashboard/users/page.tsx` |
| Approve Listings | `app/(admin)/dashboard/products/page.tsx` |
| Manage Orders | `app/(admin)/dashboard/orders/page.tsx` |
| Sales Analytics | `app/(admin)/dashboard/analytics/page.tsx` |

### 5.2 Analytics Components (Recharts)
```
components/analytics/
├── SalesChart.tsx           → Line chart — revenue over time
├── RevenueCard.tsx          → KPI stat card
├── TopProductsChart.tsx     → Bar chart — best sellers
└── OrdersOverviewChart.tsx  → Pie chart — order status breakdown
```

### ✔️ Phase 5 Done = Admin has full platform control + visual analytics

---

## ✅ PHASE 6 — Payment + Notifications
> **Goal:** Real payments + real-time order tracking alerts

### 6.1 Payment Integration
| Service | File |
|------|------|
| Payment UI | `components/payment/PaymentMethodSelector.tsx` |
| LANKAQR | `components/payment/LankaQRPayment.tsx` |
| Card Form | `components/payment/CardPaymentForm.tsx` |
| COD Option | Built into PaymentMethodSelector |
| Payment API | `app/api/payments/route.ts` |
| Payment Service | `services/paymentService.ts` |

### 6.2 Notifications (WhatsApp / SMS)
| Service | File |
|------|------|
| Twilio Setup | `services/notificationService.ts` |
| Notification API | `app/api/notifications/route.ts` |
| Triggers | Order placed → SMS, Order shipped → WhatsApp |

### ✔️ Phase 6 Done = Full payment flow + real-time tracking notifications

---

## ✅ PHASE 7 — Testing, Polish & Launch
> **Goal:** Production ready!

### 7.1 Polish
- [ ] Responsive design (mobile-first) සියලු pages
- [ ] Loading states (`loading.tsx` per route)
- [ ] Error states (`error.tsx` per route)
- [ ] Empty states (no products, no orders)
- [ ] SEO metadata per page
- [ ] 404 `not-found.tsx` page

### 7.2 Performance
- [ ] Next.js Image optimization (`<Image />`)
- [ ] API response caching
- [ ] Skeleton loaders for product cards

### 7.3 Security
- [ ] Route protection via `middleware.ts`
- [ ] API input validation (Zod)
- [ ] CORS config
- [ ] Environment variables audit

### 7.4 Deployment (Vercel)
```bash
# 1. Push to GitHub
git add . && git commit -m "🚀 Fresh Direct v1.0"
git push origin main

# 2. Connect to Vercel
# vercel.com → Import GitHub repo

# 3. Set env variables on Vercel dashboard

# 4. Deploy!
```

### ✔️ Phase 7 Done = 🎉 Live on production!

---

## 📅 Weekly Timeline

| Week | Focus |
|------|-------|
| **Week 1** | Phase 1 (Foundation) + Phase 2 (Auth) |
| **Week 2** | Phase 3 — Products, Farmers, Cart |
| **Week 3** | Phase 3 — Orders, Checkout, Reviews |
| **Week 4** | Phase 4 — Farmer Dashboard |
| **Week 5** | Phase 5 — Admin + Analytics |
| **Week 6** | Phase 6 — Payment + Notifications |
| **Week 7** | Phase 7 — Polish + Launch 🚀 |

---

## 🏁 Start NOW — Phase 1 First Step

```bash
# 1. Install packages
npm install prisma @prisma/client next-auth@beta zustand zod react-hook-form @hookform/resolvers lucide-react recharts bcryptjs @types/bcryptjs

# 2. Init Prisma
npx prisma init

# 3. Start dev server
npm run dev
```
