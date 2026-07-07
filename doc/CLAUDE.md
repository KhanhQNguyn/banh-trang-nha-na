# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce platform for "Bánh Tráng Nhà Na" (a Vietnamese rice paper snack brand). The repo is a monorepo with three workspaces:

- `server/` — Express.js REST API (Node.js ESM, MongoDB/Mongoose)
- `client/storefront/` — Customer-facing React storefront (Vite, Tailwind, Zustand)
- `client/admin/` — Internal admin panel (same stack as storefront)

## Commands

### Root (runs all three concurrently)
```
npm run dev          # Start all three in parallel
npm install          # Install root deps
```

### Per workspace
```
# Server
npm run dev --workspace=server          # nodemon server.js
npm run seed:admin --workspace=server   # Seed the initial admin user

# Storefront
npm run dev --workspace=client/storefront
npm run build --workspace=client/storefront
npm run lint --workspace=client/storefront

# Admin
npm run dev --workspace=client/admin
npm run build --workspace=client/admin
npm run lint --workspace=client/admin
```

### Ports (defaults)
- API server: `http://localhost:5000`
- Storefront: `http://localhost:5173`
- Admin: `http://localhost:5174`

## Environment Setup

Copy `.env.example` in each workspace and fill in values:

- `server/.env` — MongoDB URI, JWT secrets, Cloudinary keys, CORS origins
- `client/storefront/.env` — `VITE_API_BASE_URL=http://localhost:5000/api/v1`
- `client/admin/.env` — same `VITE_API_BASE_URL`

## Architecture

### Server

**Module structure** — each domain lives in `server/src/modules/<domain>/` with these files:
- `*.model.js` — Mongoose schema
- `*.repository.js` — DB queries (called by service)
- `*.service.js` — business logic
- `*.controller.js` — request/response handling (uses `catchAsync`)
- `*.routes.js` — Express router with validators
- `*.validators.js` — input validation middleware
- `*.dto.js` — output shaping
- `*.events.js` — event listeners registered at startup
- `*.interfaces.js` — JSDoc type definitions

**Domains:** `auth`, `customer`, `catalog` (products + categories), `cart`, `order`, `voucher`, `media`

**Event system** — `server/src/utils/eventBus.js` is a singleton `EventEmitter`. Events are emitted in services (e.g., `ORDER_PLACED`, `USER_REGISTERED`) and handled in each module's `*.events.js`, which are registered in `server/src/app.js`.

**Auth** — JWT with access token (short-lived) + refresh token (long-lived, stored in httpOnly cookie). Access token is sent in the `Authorization` header. The `/auth/refresh-token` endpoint issues a new access token.

**API response envelope:**
```json
{ "success": true, "message": "...", "data": ..., "meta": ... }
```
Errors: `{ "success": false, "error": { "message": "..." } }`

**Route structure** — all routes mounted at `/api/v1`. The catalog module's router handles both `/products` and `/categories`. Auth middleware: `verifyToken` (checks JWT), `requireRole('admin')` (role gate).

### Clients (storefront & admin)

Both use the same stack and patterns:

**State management** — Zustand stores in `src/stores/`:
- `authStore.js` — user session, `checkAuth()` (called on app mount to restore session via refresh token)
- `cartStore.js` — supports guest cart (local state) and authenticated cart (synced with server); `mergeGuestCart()` called after login
- `uiStore.js` — toast notifications, loading states

**HTTP** — `src/services/httpHelper.js` is an Axios instance with `withCredentials: true`. The response interceptor handles 401s (auto-logout + redirect) and surfaces API error messages as toasts via `uiStore`.

**API endpoints** — centrally defined in `src/config/apiConfig.js` as the `API` constant.

**Routing** — React Router v6; `ProtectedRoute` component guards authenticated pages.

**Styling** — Tailwind CSS; `src/utils/cn.js` exports a `cn()` helper combining `clsx` + `tailwind-merge`.

### Key Data Relationships

- `User` (auth) → `Customer` (profile with addresses); created via event after registration
- `Product` has embedded `variants` (size/flavor attributes, priceModifier, stockQuantity); every product always has at least one default variant
- `Order` stores `customerSnapshot` and `productSnapshot`/`variantSnapshot` at time of purchase (immutable history)
- Orders support guest checkout (`userId` is nullable)
- Order statuses: `pending_confirmation` → `confirmed` → `shipping` → `completed` (or `cancelled`)
- Payment methods: `cod` (cash on delivery) or `bank_transfer`
