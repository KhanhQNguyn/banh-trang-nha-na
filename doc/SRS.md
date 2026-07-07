# Software Requirements Specification (SRS)
## Project: Bánh Tráng Nhà Na

| | |
|---|---|
| **Date Created** | 07/02/2026 |
| **Product Owner** | Trần Hoàng Minh |
| **Project Type** | Independent E-commerce Web App |

---

## 1. Purpose and Project Scope

### 1.1. Business Goals
Build an independent e-commerce web app to:
- Reduce dependency on Shopee
- Build an owned brand
- Collect first-party customer data

### 1.2. System Scope
The web app consists of 2 main parts:
1. **Customer Storefront** – shopping-facing site for customers
2. **Admin Dashboard** – management site for the shop owner

> ⚠️ **Implementation note (from Claude):** The Admin Dashboard is proposed for a later phase (Phase 2), after the Customer Storefront MVP is complete and real usage data is available to refine admin requirements.

---

## 2. User Roles

### 2.1. Customer
- Browse and search products
- Add to cart, purchase
- Track orders
- Review products

### 2.2. Admin (Shop Owner)
- Manage products, orders, inventory, customers
- Update product images, titles, descriptions

---

## 3. Functional Requirements

### 3.1. Customer Storefront

#### Product Display & Search
- **Homepage:** banner, featured products, new arrivals, categories
- **Filter & Search:** search by name; filter by price, category, size/color; suggested-item cards for quick selection
- **Product Detail Page:** multiple images, price, description, stock quantity, variant selection

#### Cart & Checkout
- Add / Edit / Remove items in cart
- Apply discount codes (Vouchers)
- Delivery info form: name, phone, email, address, date of birth (optional)
- Payment methods: **COD** and **bank transfer**

#### Personal Account Management
- View order history and current status: *Pending Confirmation → Shipping → Completed*

#### Chat with Shop Owner
- Widget/placeholder linking to Facebook, TikTok, Instagram, Zalo phone number

---

### 3.2. Admin Dashboard

#### Product & Inventory Management
- Add, edit, delete products (supports multiple variants: color, size)
- Set original price and promotional price
- Update stock quantity *(optional)*

#### Order Management
- Receive new order notifications
- Update order status: Confirmed / Handed to shipping carrier / Cancelled
- View full customer details submitted in the order form

#### Marketing & Promotions *(Optional)*
- Create discount codes (percentage or fixed amount, with usage limits)

#### Customer Contact
- Contact customers via phone number or email from the order form

---

## 4. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Page load under 3 seconds; handle ~1000 concurrent visits during sales events (similar to Shopee's double-date sales) |
| **Compatibility** | Responsive, works smoothly on Mobile and Desktop, **Mobile-first** priority (most customers shop via phone) |

---

## 5. Development Approach

> **Advice from the Product Owner:** Don't build an overly large system from the start. Begin with an **MVP** covering only the core features:
>
> Browse products → Place order → Pay (COD/bank transfer) → Manage orders
>
> After running the MVP, integrate additional features: e-wallets, shipping carrier APIs, loyalty points system.

**Initial estimated budget:** 2,500,000 – 5,000,000 VND (excluding server and domain hosting fees)

*Note: requirements may be further updated based on real customer feedback.*

---

## 6. Technical Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Zustand, Tailwind CSS |
| **Backend** | Node.js, Express.js, Mongoose |
| **Architecture** | Modular Monolith, N-Tier (Route → Controller → Service → Repository → Model) |
| **Database** | MongoDB |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## 7. Notes for AI Coding Assistant (Claude Code)

- **Code language:** Comments in code should be written in **English**.
- **Current phase:** Phase 1 — Customer Storefront MVP (7 core flows: home, search/filter, product detail, cart, checkout, order tracking, chat/Zalo widget placeholder).
- **Not yet implemented:** Admin Dashboard (Phase 2).
- **Principle:** Prioritize simplicity, maintainability, and adherence to the chosen N-Tier architecture; avoid over-engineering at the MVP stage.