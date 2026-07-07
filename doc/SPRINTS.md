# SPRINTS.md

Sprint plan for Bánh Tráng Nhà Na. 2 weeks per sprint. Start date: 2026-07-07.

---

## Sprint 1 — Foundation & Design System
**2026-07-07 → 2026-07-20**

The server is scaffolded and the client pages are stubs. Before building features, lock in the visual foundation so every page uses consistent tokens, layout, and components.

### Server
- [ ] Seed realistic product + category data into Atlas for dev/test
- [ ] Verify all 3 active API routes work end-to-end: `GET /products`, `GET /categories`, `POST /vouchers/validate`

### Storefront — Design System
- [ ] Configure Tailwind: brand color palette, font (pick from anti-slop allowed list — not Inter), border radius scale
- [ ] `MainLayout` — sticky header with logo + cart icon + nav links; footer with social links + Zalo number
- [ ] Reusable components: `Button`, `Badge`, `ProductCard`, `Spinner`, `Toast` (wire to `uiStore`)
- [ ] Remove stale `LoginPage` and `RegisterPage` — no auth in Phase 1

---

## Sprint 2 — Homepage & Product Discovery
**2026-07-21 → 2026-08-03**

The core browsing experience. Customers land here from social media links — first impression matters.

### Server
- [ ] Confirm `GET /products?isFeatured=true` and `GET /products?isNewArrival=true` filters work

### Storefront
- [ ] **HomePage** — hero banner, featured products strip, new arrivals strip, category grid
- [ ] **CategoryPage** — product grid filtered by category slug
- [ ] **ProductListPage** — full product grid with search (by name) and filter (by category, price range)
- [ ] Search debounce (`useDebounce` hook already exists)
- [ ] Loading skeletons for product grids (match the card layout shape)
- [ ] Empty state when no products match filters

---

## Sprint 3 — Product Detail & Cart
**2026-08-04 → 2026-08-17**

### Server
- [ ] Confirm `GET /products/:slug` returns full variant data including `stockQuantity`

### Storefront
- [ ] **ProductDetailPage** — image gallery, variant selector (size/flavor), price display (`basePrice` + `promoPrice`), stock indicator, add-to-cart button
- [ ] **CartPage** — list items with quantity controls and remove button; subtotal; proceed to checkout CTA
- [ ] Guest cart fully in Zustand (`cartStore`): add, update quantity, remove, persist to localStorage
- [ ] Cart icon in header shows item count badge
- [ ] "Out of stock" guard on add-to-cart

---

## Sprint 4 — Checkout & Order Tracking
**2026-08-18 → 2026-08-31**

The money flow. Keep the form short — name, phone, email (optional), address. No account needed.

### Server
- [ ] Confirm `POST /orders` accepts guest payload and returns order with `orderNumber`
- [ ] Confirm `POST /orders/lookup` returns order by `orderNumber` + `phone`
- [ ] Confirm `POST /vouchers/validate` returns `discountAmount` correctly

### Storefront
- [ ] **CheckoutPage** — customer info form, voucher code input (validate on apply), payment method toggle (COD / bank transfer with bank details shown), order summary sidebar, place order button
- [ ] **OrderSuccessPage** — confirmation with order number, payment instructions for bank transfer, link to order lookup
- [ ] **OrderLookupPage** — form: order number + phone; shows order status and item list on success
- [ ] Clear cart in `cartStore` after successful order
- [ ] Remove stale `OrderHistoryPage` and `OrderDetailPage` — no auth, lookup replaces these

---

## Sprint 5 — Mobile Polish & Chat Widget
**2026-09-01 → 2026-09-14**

Storefront MVP feature-complete. This sprint hardens mobile UX and adds the social contact widget.

### Storefront
- [ ] Full mobile audit: all pages tested at 375px and 430px viewports
- [ ] Bottom sheet cart drawer on mobile (slide-up instead of full cart page)
- [ ] Zalo / Facebook / Instagram floating contact widget (bottom-right corner; links to real accounts)
- [ ] `prefers-reduced-motion` pass on all animations
- [ ] Page `<title>` and meta description for each route
- [ ] 404 page

### Server
- [ ] Add `GET /products/:slug` → include category name in response (join or denormalize)
- [ ] Rate limit `POST /orders` to prevent spam

---

## Sprint 6 — Admin Dashboard: Auth + Products + Categories
**2026-09-15 → 2026-09-28**

Phase 2 begins. Re-introduce auth but only for the admin surface. Storefront stays auth-free.

### Server
- [ ] Re-add `auth` module (admin login only — no customer register)
- [ ] Re-add `verifyToken` + `requireRole('admin')` middlewares
- [ ] Re-add admin mutation routes: `POST/PATCH/DELETE /products`, `POST/PATCH/DELETE /categories`
- [ ] Re-add `POST /media/upload` for Cloudinary image uploads
- [ ] Seed admin user via script

### Admin Client
- [ ] **LoginPage** — email + password form; stores JWT; redirect to dashboard
- [ ] `AdminLayout` — sidebar nav (Products, Categories, Orders, Vouchers), topbar with logout
- [ ] **ProductListPage** — table of products with edit/delete actions; link to form
- [ ] **ProductFormPage** — create/edit: name, description, category, base price, promo price, images (upload), variants (add/remove rows), featured/new arrival toggles
- [ ] **CategoryListPage** — table with sort order controls; inline edit name/active status

---

## Sprint 7 — Admin Dashboard: Orders + Vouchers + Deployment
**2026-09-29 → 2026-10-12**

Finish admin, deploy everything, smoke test in production.

### Admin Client
- [ ] **DashboardPage** — today's order count, recent orders list, low stock alerts
- [ ] **OrderListPage** — filterable by status; sortable by date
- [ ] **OrderDetailPage** — full order view; status transition buttons (Confirm / Mark Shipped / Cancel with reason); customer phone + email displayed for contact
- [ ] **VoucherListPage** — table with active/expired indicator
- [ ] **VoucherFormPage** — create/edit: code, type (percentage/fixed), value, min order, max discount, usage limit, date range

### Server — Admin Routes
- [ ] Re-add `GET /orders/admin/list`, `PATCH /orders/admin/status/:id`, `GET /orders/admin/stats`
- [ ] Re-add admin CRUD for `POST/PATCH/DELETE /vouchers`

### Deployment
- [ ] Deploy storefront to Vercel; configure `VITE_API_BASE_URL` env var
- [ ] Deploy admin to Vercel (separate project)
- [ ] Deploy server to Render; configure all env vars
- [ ] Set MongoDB Atlas IP allowlist to `0.0.0.0/0` (Render uses dynamic IPs)
- [ ] Configure Cloudinary with real credentials
- [ ] End-to-end smoke test: browse → add to cart → checkout → lookup order → admin confirms order

---

## Timeline Summary

| Sprint | Dates | Focus |
|---|---|---|
| 1 | Jul 7 – Jul 20 | Foundation & Design System |
| 2 | Jul 21 – Aug 3 | Homepage & Product Discovery |
| 3 | Aug 4 – Aug 17 | Product Detail & Cart |
| 4 | Aug 18 – Aug 31 | Checkout & Order Tracking |
| 5 | Sep 1 – Sep 14 | Mobile Polish & Chat Widget |
| 6 | Sep 15 – Sep 28 | Admin: Auth, Products, Categories |
| 7 | Sep 29 – Oct 12 | Admin: Orders, Vouchers, Deployment |

**Estimated launch:** mid-October 2026
