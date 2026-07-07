# ENDPOINTS.md

All available API endpoints. Base URL: `http://localhost:5000/api/v1`

## Authentication

The storefront is guest-first: browsing the catalog, placing orders, and looking
up orders require **no authentication**. Admin management endpoints require a
valid **admin** access token.

- **Login** (`POST /auth/login`) returns a short-lived `accessToken` in the
  response body and sets a long-lived `refresh_token` as an `httpOnly` cookie.
- **Protected endpoints** expect the access token in the header:
  `Authorization: Bearer <accessToken>`. Missing/invalid token → `401`; valid
  token but non-admin role → `403`.
- **Refresh** (`POST /auth/refresh-token`) reads the `refresh_token` cookie and
  returns a fresh `accessToken` — the client does not send the refresh token in
  the body.

Each endpoint below is tagged **Public** or **Admin**.

All responses follow the envelope:
```json
{ "success": true, "message": "...", "data": ..., "meta": ... }
{ "success": false, "error": { "statusCode": 400, "message": "..." } }
```

---

## Auth

### `POST /auth/login` — Public
Authenticate an admin account.

**Request body:**
```json
{ "email": "string", "password": "string" }
```

**Response `data`:**
```json
{
  "accessToken": "string (JWT)",
  "user": { "id": "string", "email": "string", "role": "admin" }
}
```
Also sets the `refresh_token` httpOnly cookie.

Returns `400` if email/password are missing, `401` on invalid credentials, `403`
if the account is deactivated.

---

### `POST /auth/refresh-token` — Public
Exchange the `refresh_token` cookie for a new access token.

**Request body:** none (reads the `refresh_token` cookie).

**Response `data`:** `{ "accessToken": "string (JWT)" }`

Returns `401` if the cookie is missing, invalid, or the account is deactivated.

---

### `POST /auth/logout` — Public
Clear the `refresh_token` cookie. Always succeeds.

**Response `data`:** none.

---

## Catalog

### `GET /products` — Public
List products with optional filtering and pagination. Only active products are returned.

**Query params:**

| Param | Type | Description |
|---|---|---|
| `search` | string | Full-text search on product name and description |
| `category` | string | Filter by category slug |
| `minPrice` | number | Filter by minimum base price |
| `maxPrice` | number | Filter by maximum base price |
| `page` | number | Page number (default `1`) |
| `limit` | number | Items per page (default `10`) |

> **Not yet implemented:** `isFeatured` and `isNewArrival` are **not** honored by
> the query layer. Passing them has no effect — the full active product list is
> returned. Filtering by these flags requires a backend change.

**Response `data`:** array of product objects
**Response `meta`:** `{ total, page, limit, totalPages, hasNextPage, hasPrevPage }`

---

### `GET /products/:slug` — Public
Get a single product by its slug, including all variants.

**Params:** `slug` — the product's URL-friendly identifier

**Response `data`:** single product object with full `variants` array

Returns `404` if the product does not exist or `isActive` is `false`.

---

### `GET /categories` — Public
List categories, sorted by `sortOrder` then `name`. Public callers see only
active categories; an authenticated admin also sees inactive ones.

**Response `data`:** array of category objects

---

### `POST /products` — Admin
Create a product.

**Request body:**
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "categoryId": "string ObjectId (required)",
  "basePrice": 25000,
  "promoPrice": null,
  "images": [],
  "variants": [],
  "tags": [],
  "isFeatured": false,
  "isNewArrival": false
}
```
`slug`, `searchName`, and a default variant (when `variants` is empty) are
generated automatically.

**Response `data`:** created product object. Status `201`.

Returns `400` if `name`, `description`, `categoryId`, or a non-negative numeric
`basePrice` is missing.

---

### `PATCH /products/:id` — Admin
Partially update a product. Any product field may be supplied; only `basePrice`
and `promoPrice` are format-validated (must be non-negative numbers; `promoPrice`
may be `null`).

**Response `data`:** updated product object.

Returns `404` if the product does not exist, `400` on invalid price values.

---

### `DELETE /products/:id` — Admin
Hard-delete a product by id.

**Response `data`:** none. Returns `404` if not found.

---

### `POST /categories` — Admin
Create a category.

**Request body:**
```json
{ "name": "string (required)", "description": "string", "image": "string", "sortOrder": 0, "isActive": true }
```
`slug` is generated from `name`.

**Response `data`:** created category object. Status `201`. Returns `400` if
`name` is missing.

---

### `PATCH /categories/:id` — Admin
Partially update a category.

**Response `data`:** updated category object. Returns `404` if not found.

---

### `DELETE /categories/:id` — Admin
Hard-delete a category by id.

**Response `data`:** none. Returns `404` if not found.

---

## Orders

### `POST /orders` — Public
Place a guest order. Atomically decrements stock and consumes voucher within a MongoDB transaction.

**Request body:**
```json
{
  "items": [
    {
      "productId": "string (ObjectId)",
      "variantId": "string (ObjectId)",
      "quantity": 1
    }
  ],
  "customerInfo": {
    "fullName": "string (required)",
    "phone": "string (required)",
    "email": "string (optional)",
    "address": "string (required)"
  },
  "paymentMethod": "cod | bank_transfer",
  "voucherCode": "string (optional)",
  "note": "string (optional)"
}
```

Prices are computed server-side from the product/variant; the client cannot set
`unitPrice`.

**Response `data`:** created order object with generated `orderNumber`. Status `201`.

Returns `400` if validation fails, stock is insufficient, or voucher is invalid.

---

### `POST /orders/lookup` — Public
Look up an existing order by order number and customer phone. Used for guest order tracking.

**Request body:**
```json
{ "orderNumber": "string", "phone": "string" }
```

**Response `data`:** order object with status history and item snapshots

Returns `400` if either field is missing, `404` if no match found.

---

### `GET /orders/admin/list` — Admin
List all orders with pagination.

**Query params:** `status` (optional, filters by order status), `page`, `limit`.

**Response `data`:** array of order objects
**Response `meta`:** `{ total, page, limit, totalPages, hasNextPage, hasPrevPage }`

---

### `PATCH /orders/admin/status/:id` — Admin
Transition an order's status. The change is recorded in `statusHistory` with the
acting admin's id.

**Request body:**
```json
{ "status": "confirmed | shipping | completed | cancelled", "cancelReason": "string (required when cancelling)" }
```

**Response `data`:** updated order object.

Returns `400` if `status` is missing or the transition is not allowed.

---

### `GET /orders/admin/stats` — Admin
Dashboard summary.

**Response `data`:**
```json
{
  "todayOrderCount": 0,
  "recentOrders": [ /* up to 5 most-recent order objects */ ]
}
```

---

## Vouchers

### `POST /vouchers/validate` — Public
Validate a voucher code against a cart total before checkout. Does not consume the voucher — only checks eligibility and returns the discount amount.

**Request body:**
```json
{ "code": "string", "orderTotal": 150000 }
```

**Response `data`:**
```json
{ "discountAmount": 15000, "finalTotal": 135000 }
```

Returns `400` if the code/`orderTotal` is missing or invalid, expired, inactive,
below minimum order value, or usage limit is reached.

---

### `GET /vouchers` — Admin
List vouchers. Admins also see inactive vouchers.

**Response `data`:** array of voucher objects.

---

### `POST /vouchers` — Admin
Create a voucher.

**Request body:**
```json
{
  "code": "string (required)",
  "type": "percentage | fixed (required)",
  "value": 15,
  "minOrderValue": 0,
  "maxDiscount": null,
  "usageLimit": null,
  "perUserLimit": 1,
  "validFrom": "ISO date (required)",
  "validUntil": "ISO date (required)"
}
```
`code` is stored uppercase. For `percentage`, `value` must be `1–100`.
`validUntil` must be after `validFrom`.

**Response `data`:** created voucher object.

> **Known bug:** this endpoint returns HTTP `211` (an invalid status code) instead
> of `201`. Treat any 2xx as success until fixed in `voucher.controller.js`.

Returns `400` on validation failure.

---

### `PATCH /vouchers/:id` — Admin
Partially update a voucher.

**Response `data`:** updated voucher object. Returns `404` if not found.

---

### `DELETE /vouchers/:id` — Admin
Hard-delete a voucher by id.

**Response `data`:** none. Returns `404` if not found.

---

## Health Check

### `GET /status` — Public
Server liveness check. No base path prefix.

**URL:** `http://localhost:5000/status`

**Response:**
```json
{ "status": "ok", "time": "2026-07-07T..." }
```
