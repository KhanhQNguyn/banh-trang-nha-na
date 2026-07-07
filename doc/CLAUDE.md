# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce platform for "Bánh Tráng Nhà Na" (Vietnamese rice paper snack brand). npm workspaces monorepo with three packages:

- `server/` — Express.js REST API (Node.js ESM, MongoDB/Mongoose)
- `client/storefront/` — Customer-facing React storefront (Vite, Tailwind, Zustand)
- `client/admin/` — Admin panel, same stack (scaffolded, not yet built out)

Guest checkout (no customer accounts) is the storefront model. Admin-only JWT authentication is currently being added for the admin panel — see "Auth" below; `doc/CLAUDE.md` and `doc/ENDPOINTS.md` predate this work and still describe catalog/order/voucher admin routes as fully public. Treat those two docs as reference for the public-facing endpoints and model shapes (still accurate), not for auth state.

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

# Seed the initial admin account (uses ADMIN_EMAIL / ADMIN_PASSWORD from server/.env)
npm run seed:admin --workspace=server
```

There is no test suite configured in any workspace yet.

## Environment Setup

`server/.env` — required vars:
```
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=    # set to "mock" to skip real uploads
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
PORT=5000
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

`client/storefront/.env` and `client/admin/.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

`server/src/config/env.js` warns (does not crash) on missing `JWT_*` and Cloudinary vars, falling back to insecure defaults — fine for local dev, must be set for anything beyond it. `media.service.js` falls back to a mock URL when `cloud_name === 'mock'`. `MONGODB_URI` will crash the server if missing/unreachable.

## Server Architecture

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

**Modules:** `auth` (admin login/refresh/logout), `catalog` (products + categories), `order`, `voucher`

### Auth

- JWT access + refresh tokens, issued in `auth.service.js`. Access token embeds `{ id, email, role }`; refresh token embeds only `{ id }`.
- `verifyToken` (`server/src/middlewares/verifyToken.js`) reads `Authorization: Bearer <token>`, verifies against `env.jwtAccessSecret`, sets `req.user`.
- `requireRole(...roles)` (`server/src/middlewares/requireRole.js`) gates by `req.user.role`; only `'admin'` role exists currently.
- Route convention: public storefront reads/writes stay unguarded; every admin mutation/list route chains `verifyToken, requireRole('admin')` in front of the controller (see `catalog.routes.js`, `order.routes.js`, `voucher.routes.js`). Follow this exact chain order for any new admin route.
- `User.model.js` hashes passwords via `comparePassword` (bcryptjs); seed the first admin with `npm run seed:admin --workspace=server`.
- No customer-facing auth — `Order.userId` is always `null`, orders are always guest checkouts regardless of admin auth state.

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

See `doc/ENDPOINTS.md` for the full public API surface and `doc/MODELS.md` for all Mongoose schema field tables.

## Storefront Architecture

### State (Zustand stores in `src/stores/`)

- `cartStore.js` — guest-only cart; persisted to localStorage via `zustand/middleware persist` under key `btnn-cart`. Has `addItem`, `removeItem`, `updateQuantity`, `clearCart`.
- `uiStore.js` — toast queue and global loading flags.
- `authStore.js` — scaffolded but unused by the storefront; auth is admin-panel-only.

### HTTP

`src/services/httpHelper.js` — Axios instance pointing at `VITE_API_BASE_URL`. Response interceptor surfaces API error messages as toasts via `uiStore`. All API endpoints are defined as constants in `src/config/apiConfig.js`.

### Routing

React Router v6. `ProtectedRoute` exists but is unused in the storefront — no storefront pages require auth. Pages currently scaffolded as stubs in `src/pages/<PageName>/index.jsx`.

### Styling

Tailwind CSS. `src/utils/cn.js` exports `cn()` (clsx + tailwind-merge). Follow the anti-slop design rules in `.agents/skills/anti-slop-skil/SKILL.md` for all UI work — key constraints: no Inter as default font, no AI-purple gradients, no em-dashes, no three-equal-column feature cards, `min-h-[100dvh]` not `h-screen`.

## Data Notes

- Every `Product` always has at least one variant (auto-created as default in `pre('validate')`). Never assume `variants` can be empty.
- `Order.customerSnapshot` captures name/phone/email/address at order time — immutable. Do not read from a user profile.
- `Order.userId` is always `null` — orders are always guest checkouts.
- Voucher discount is capped by `maxDiscount` for `percentage` type. Per-user limits are tracked in `usedByUsers[]` but `userId` is always `null` on orders, so per-user enforcement is effectively bypassed.
