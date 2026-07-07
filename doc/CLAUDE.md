# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce platform for "Bánh Tráng Nhà Na" (Vietnamese rice paper snack brand). npm workspaces monorepo with three packages:

- `server/` — Express.js REST API (Node.js ESM, MongoDB/Mongoose)
- `client/storefront/` — Customer-facing React storefront (Vite, Tailwind, Zustand)
- `client/admin/` — Admin panel, same stack (Phase 2 — not yet built)

**Current phase:** Phase 1 — Customer Storefront MVP. No user authentication. All orders are guest checkouts.

See `doc/SPRINTS.md` for the full sprint plan and `server/MODELS.md` for all Mongoose schema details.

## Commands

```bash
# Run all three workspaces in parallel
npm run dev

# Individual workspaces
npm run dev --workspace=server                   # nodemon on port 5000
npm run dev --workspace=client/storefront        # Vite on port 5173
npm run dev --workspace=client/admin             # Vite on port 5174

npm run build --workspace=client/storefront
npm run lint --workspace=client/storefront
```

## Environment Setup

`server/.env` — required vars:
```
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=    # set to "mock" to skip real uploads
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
PORT=5000
```

`client/storefront/.env` and `client/admin/.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Cloudinary fields warn but don't crash on startup — `media.service.js` falls back to a mock URL when `cloud_name === 'mock'`. MongoDB URI will crash the server if missing.

## Server Architecture

### Active API routes (`/api/v1`)

| Method | Path | Description |
|---|---|---|
| GET | `/products` | List products; query params: `search`, `categorySlug`, `minPrice`, `maxPrice`, `isFeatured`, `isNewArrival` |
| GET | `/products/:slug` | Single product with variants |
| GET | `/categories` | All active categories |
| POST | `/orders` | Place a guest order |
| POST | `/orders/lookup` | Look up order by `{ orderNumber, phone }` |
| POST | `/vouchers/validate` | Validate a voucher code against a subtotal |

No auth middleware exists in Phase 1. All routes are public.

### Module structure

Each domain in `server/src/modules/<domain>/` follows this layer pattern:

```
*.model.js        — Mongoose schema
*.repository.js   — DB queries only (no business logic)
*.service.js      — business logic; calls repository and emits events
*.controller.js   — thin HTTP layer; uses catchAsync wrapper
*.routes.js       — Express router
*.validators.js   — input validation (called in service or controller)
*.dto.js          — shapes the response object
*.events.js       — event listeners registered at app startup
*.interfaces.js   — cross-module interface functions (called by other modules)
```

**Active modules:** `catalog` (products + categories), `order`, `voucher`

### Event system

`server/src/utils/eventBus.js` is a singleton `EventEmitter`. Services emit events; each module's `*.events.js` listens. All listeners are registered in `server/src/app.js` at startup.

Active events: `ORDER_PLACED`, `ORDER_CONFIRMED`, `ORDER_SHIPPING`, `ORDER_COMPLETED`, `ORDER_CANCELLED`, `STOCK_LOW`

When an order is cancelled, `catalog.events.js` restocks inventory and `voucher.events.js` releases the voucher usage — both via the `ORDER_CANCELLED` event.

### Key patterns

**API response envelope** — always use `sendSuccess` / error handler:
```json
{ "success": true, "message": "...", "data": ..., "meta": ... }
{ "success": false, "error": { "statusCode": 400, "message": "..." } }
```

**Cross-module calls** — modules call each other through `*.interfaces.js` files, not by importing services directly. Example: `order.service.js` calls `catalogInterfaces.getProductSnapshot()` and `voucherInterfaces.validateVoucher()`.

**Transactions** — `order.service.js` wraps the entire order placement (stock decrement + voucher consume + order create) in a MongoDB session transaction.

**Text search** — `Product` has a compound text index on `searchName` + `description`. `searchName` is a diacritic-stripped lowercase copy of `name`, generated in the `pre('validate')` hook.

## Storefront Architecture

### State (Zustand stores in `src/stores/`)

- `cartStore.js` — guest-only cart; persisted to localStorage via `zustand/middleware persist` under key `btnn-cart`. Has `addItem`, `removeItem`, `updateQuantity`, `clearCart`.
- `uiStore.js` — toast queue and global loading flags.
- `authStore.js` — scaffolded but unused in Phase 1; do not wire it up until Phase 2.

### HTTP

`src/services/httpHelper.js` — Axios instance pointing at `VITE_API_BASE_URL`. Response interceptor surfaces API error messages as toasts via `uiStore`. All API endpoints are defined as constants in `src/config/apiConfig.js`.

### Routing

React Router v6. `ProtectedRoute` exists but is unused in Phase 1 — no pages require auth. Pages currently scaffolded as stubs in `src/pages/<PageName>/index.jsx`.

### Styling

Tailwind CSS. `src/utils/cn.js` exports `cn()` (clsx + tailwind-merge). Follow the anti-slop design rules in `.agents/skills/anti-slop-skil/SKILL.md` for all UI work — key constraints: no Inter as default font, no AI-purple gradients, no em-dashes, no three-equal-column feature cards, `min-h-[100dvh]` not `h-screen`.

## Data Notes

- Every `Product` always has at least one variant (auto-created as default in `pre('validate')`). Never assume `variants` can be empty.
- `Order.customerSnapshot` captures name/phone/email/address at order time — immutable. Do not read from a user profile.
- `Order.userId` is always `null` in Phase 1.
- Voucher discount is capped by `maxDiscount` for `percentage` type. Per-user limits are tracked in `usedByUsers[]` but `userId` is `null` in Phase 1 so per-user enforcement is effectively bypassed.
