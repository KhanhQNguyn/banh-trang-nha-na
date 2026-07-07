# THEME.md

Visual identity for the Bánh Tráng Nhà Na storefront. Source brief: a
promo poster for **bánh tráng mắm ruốc** (rice paper cracker mixed with
fermented shrimp-paste sauce), branded "Nhà Na", positioned as **đặc sản
Đơn Dương, Đà Lạt** (a specialty of Đơn Dương, Đà Lạt) and sold in three
spice levels: **Vừa** (medium), **Mặn** (salty), **Cay** (spicy).

Read this before touching homepage styling or adding new product-facing
UI. It documents *why* the tokens below were chosen, not just their
values, so future changes can stay consistent instead of drifting.

## Product identity

- **Product:** bánh tráng mắm ruốc — not bánh tráng phơi sương. Copy,
  imagery, and metaphors should reference mắm ruốc (fermented shrimp
  paste), nướng giòn (roasted crisp), and the Đơn Dương / Đà Lạt
  highlands, not Tây Ninh or "phơi sương" (dew-dried) framing used in
  earlier drafts of this site.
- **Three flavor levels are a core selling point**, not an incidental
  variant attribute. Any surface that lists a product should surface
  its flavor level when known (`variant.attributes.flavor`).

## Color palette

Defined in `tailwind.config.js`. One accent per flavor level, all warm
and food-appetite-coded (no cool tones, no purple/blue — this is a
warm-snack brand, not a tech brand).

| Token | Hex (500) | Represents | Used for |
|---|---|---|---|
| `brand` (amber/gold) | `#f59e0b` | Vị **Vừa** (medium) | Primary CTAs, links, page background (`brand-50`), the "Vừa" flavor badge |
| `terracotta` (muted rust) | `#a45b45` | Vị **Mặn** (salty) | The "Mặn" flavor badge, the specialty/locale pill ("Đặc sản Đơn Dương, Đà Lạt") |
| `chili` (red-orange) | `#e8571c` | Vị **Cay** (spicy) | The "Cay" flavor badge (paired with a `Fire` icon), sale/promo badges |

Full shade ramps live in `tailwind.config.js` under `theme.extend.colors`.
`brand` keeps its original 50–900 ramp (already close to the poster's
gold); `terracotta` and `chili` are new, minimal ramps (50/100/200/500/
600/700 — enough for backgrounds, borders, and text-on-tint, not a full
Tailwind-length scale).

**Rules:**
- Page background is warm cream (`bg-brand-50` on `<body>`, set in
  `index.html`), not neutral gray/stone. Cards and panels sit on
  `bg-white` to contrast against it.
- Body/heading text stays neutral (`stone-900`/`stone-600`) — the warm
  accents are for brand moments (badges, CTAs, prices), not paragraph
  text. Don't tint body copy orange.
- One accent per component. Don't mix `terracotta` and `chili` in the
  same badge or button.

## Flavor badge component

`src/components/product/FlavorBadge.jsx` is the canonical way to render
a flavor level anywhere in the app (product cards, product detail, cart
rows). It normalizes the raw `attributes.flavor` string (diacritics,
case) and maps it to the right accent + optional icon:

| Flavor (raw value) | Badge tone | Icon |
|---|---|---|
| Vừa / vua | `brand` (gold) | — |
| Mặn / man | `terracotta` (rust) | — |
| Cay / cay | `chili` (red-orange) | `Fire` (Phosphor, filled) |

Unrecognized flavor strings fall back to a neutral `stone` badge rather
than guessing a color — don't hardcode a flavor-to-color mapping
anywhere else; extend `FLAVOR_TONES` in that file instead.

`src/components/product/FlavorShowcase.jsx` is the hero-panel version:
a large "3 Vị" graphic (not a photo) with all three flavor pills, used
on the homepage hero. Reach for this pattern (bold numeral + labeled
pills on a gradient panel) when you need a brand moment that doesn't
depend on real product photography being available yet.

## Imagery

**No real product photography exists in this repo yet.** Until it does:
- The homepage hero uses `FlavorShowcase` (a CSS/gradient graphic), not
  a stock photo — a mismatched stock photo (e.g. a random object or
  scene unrelated to food) is worse than a clean graphic.
- Product thumbnails fall back to `picsum.photos/seed/{slug}/...` only
  when a product has no uploaded image. This is a neutral placeholder,
  not a themed choice — swap in real Cloudinary product photography
  (bag shots, flavor close-ups, Đơn Dương/Đà Lạt production imagery) as
  soon as it's available, and remove the picsum fallback for the hero
  and any other brand-moment surface first.

## Voice & copy

- Vietnamese copy, no em-dash (`—`) or en-dash-as-separator anywhere,
  per the project's anti-slop rules (`.claude/skills/SKILL.md` §9.G).
  Use a period, comma, or line break instead.
- Lead with the product and origin ("Đặc sản Đơn Dương, Đà Lạt"), not
  generic snack-brand language.
- When referencing flavor levels in prose, use "vị vừa / mặn / cay"
  (lowercase, descriptive) — reserve capitalized "Vừa / Mặn / Cay" for
  badges and labels.

## Layout notes specific to this theme

- The hero is a **left copy / right graphic split** (see Section 4.3 of
  the anti-slop skill — this reads as an asymmetric split, not a banned
  centered hero).
- The specialty/locale pill ("Đặc sản Đơn Dương, Đà Lạt") appears at
  most once per section it's attached to (hero, showcase panel) — don't
  repeat it as a decorative strip elsewhere on the page (see the
  anti-slop skill's eyebrow-restraint rule, §9.F).
- Single light theme. This site does not implement dark mode; don't add
  a partial/inconsistent dark variant to only the homepage.
