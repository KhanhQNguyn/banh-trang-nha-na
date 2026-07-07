# ENDPOINTS.md

All available API endpoints. Base URL: `http://localhost:5000/api/v1`

All endpoints are public — no authentication required in Phase 1.

All responses follow the envelope:
```json
{ "success": true, "message": "...", "data": ..., "meta": ... }
{ "success": false, "error": { "statusCode": 400, "message": "..." } }
```

---

## Catalog

### `GET /products`
List products with optional filtering and pagination.

**Query params:**

| Param | Type | Description |
|---|---|---|
| `search` | string | Full-text search on product name and description |
| `category` | string | Filter by category slug |
| `minPrice` | number | Filter by minimum base price |
| `maxPrice` | number | Filter by maximum base price |
| `isFeatured` | boolean | Filter featured products |
| `isNewArrival` | boolean | Filter new arrivals |
| `page` | number | Page number (default `1`) |
| `limit` | number | Items per page (default `10`) |

**Response `data`:** array of product objects
**Response `meta`:** `{ page, limit, total, totalPages }`

---

### `GET /products/:slug`
Get a single product by its slug, including all variants.

**Params:** `slug` — the product's URL-friendly identifier

**Response `data`:** single product object with full `variants` array

Returns `404` if the product does not exist or `isActive` is `false`.

---

### `GET /categories`
List all active categories.

**Response `data`:** array of category objects sorted by `sortOrder`

---

## Orders

### `POST /orders`
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

**Response `data`:** created order object with generated `orderNumber`

Returns `400` if validation fails, stock is insufficient, or voucher is invalid.

---

### `POST /orders/lookup`
Look up an existing order by order number and customer phone. Used for guest order tracking.

**Request body:**
```json
{
  "orderNumber": "string",
  "phone": "string"
}
```

**Response `data`:** order object with status history and item snapshots

Returns `404` if no match found.

---

## Vouchers

### `POST /vouchers/validate`
Validate a voucher code against a cart total before checkout. Does not consume the voucher — only checks eligibility and returns the discount amount.

**Request body:**
```json
{
  "code": "string",
  "orderTotal": 150000
}
```

**Response `data`:**
```json
{
  "discountAmount": 15000,
  "finalTotal": 135000
}
```

Returns `400` if the code is invalid, expired, inactive, below minimum order value, or usage limit is reached.

---

## Health Check

### `GET /status`
Server liveness check. No base path prefix.

**URL:** `http://localhost:5000/status`

**Response:**
```json
{ "status": "ok", "time": "2026-07-07T..." }
```
