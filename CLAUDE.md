# CLAUDE.md

This file guides Claude (or any AI coding agent) working in this repository.
Read this before making changes. Two scoped companion files go deeper on
the two flagship features:

- `components/CLAUDE.md` — UI/component conventions
- `lib/CLAUDE.md` — Try-On + Video Studio engine internals

## What this project is

**SANWARNA** is a luxury men's cufflinks & tie-pen e-commerce storefront
with two client-side "studio" features that are the product's unique
selling point:

1. **Virtual Try-On Studio** (`/try-on`) — public. Canvas-based photo
   compositing with automatic wrist detection (MediaPipe hand landmarks,
   see `lib/handDetection.ts`), plus manual drag/scale/rotate as a
   fallback/override.
2. **Viral Video Studio** (`/video-studio`) — **admin-only**. Canvas +
   MediaRecorder video generation from reusable templates. Gated by
   `middleware.ts` behind a signed admin session cookie (see
   `lib/adminAuth.ts`) — this is a content-creation tool for the brand's
   team, not something a shopper should ever reach. Don't add a link to it
   anywhere in public navigation (`Navbar.tsx`, `Footer.tsx`,
   `CTASection.tsx`, product pages) without being asked — it was
   deliberately removed from all of those.

Both studios do their actual image/video work 100% browser-side by design.
**Do not** introduce a server-side dependency, a paid API, or a mandatory
external service for either studio's core processing without being
explicitly asked — the brief this app was built against requires zero paid
APIs and zero mandatory recurring costs. Wrist detection is the one
exception worth understanding: it downloads a model file and WASM runtime
from public CDNs (jsdelivr, Google's storage bucket for MediaPipe models)
at first use, but runs entirely client-side afterward — no API key, no
per-call cost, no server round trip. If a task seems to need a paid or
server-side dependency, propose it as an optional, clearly-labeled upgrade
path (see the pattern already used in `.env.example`) rather than wiring it
in as a hard dependency.

## Stack

- Next.js 14, App Router, TypeScript, Tailwind CSS.
- Optional database: MotherDuck (managed DuckDB, free tier), accessed via
  the Postgres wire protocol with the standard `pg` driver — see
  `lib/motherduck.ts` and `lib/getProducts.ts`. Falls back automatically to
  the static catalog in `data/products.ts` if unconfigured or unreachable.
- Auth: no third-party provider. A single admin role, gated by a
  password-derived, HMAC-signed session cookie (`lib/adminAuth.ts`) — no
  user accounts, no OAuth, no database-backed sessions.
- No component library beyond what's in `package.json`. Don't add a UI kit
  (shadcn, MUI, Chakra, etc.) without being asked — the design system is
  hand-built to match the brand's specific palette and typography.

## Design system (don't drift from this without being asked)

- **Theme: light, Apple-inspired.** Base surfaces are white/near-white
  (`paper` `#FFFFFF`, `mist` `#F5F5F7`, `cloud` `#FBFBFD`), text is
  `graphite` `#1D1D1F` / `steel` `#6E6E73`, and structure comes from
  `hairline` `#D2D2D7` borders rather than heavy dark panels or dividers.
  **This is a deliberate rebrand from an earlier all-dark version** — if
  you see stray dark-theme tokens (`obsidian`, `ink`, `charcoal`,
  `ivory`-as-text-color) anywhere, that's leftover drift to fix, not a
  pattern to extend.
- **Accent:** `champagne` `#B8874E` (plus `champagne-light` /
  `champagne-soft`) is the one warm accent carried over from the original
  dark palette — used for CTAs, prices, small emphasis, and the selection/
  focus-ring color. It should read as an accent against white, not as a
  background field the way it might have in a dark design.
- **Exception — the Video Studio's rendered video output is intentionally
  still cinematic/dark** (`lib/videoRenderer.ts`). That's a considered
  choice (see `lib/CLAUDE.md`), not a rebrand miss — don't "fix" it to
  match the site's light UI chrome.
- All defined as Tailwind tokens in `tailwind.config.ts` — use the token
  names (`bg-paper`, `text-graphite`, `border-hairline`, etc.), not raw hex
  values, in new components.
- **Type:** `font-display` (Fraunces, serif) for headlines and anything
  that should feel editorial/luxury; `font-body` (Manrope, sans) for UI
  copy, labels, and body text. Don't introduce a third typeface.
- **Motion:** sparse and deliberate. One page-load reveal (`animate-reveal`
  on the hero), hover transitions on interactive elements, and functional
  motion inside the two studios (drag, zoom, fade, and the Try-On's
  detection status messages). Avoid adding fade-in-on-scroll to every
  section — that reads as generic.
- **Structural devices:** the gold hairline divider (`.hairline` /
  `.hairline-solid` in `globals.css`) and plain `border-hairline` borders
  are used to mark real section/card boundaries — don't sprinkle them
  decoratively. Avoid adding tracked-out ALL-CAPS eyebrow labels beyond
  what's already established (the existing `tracking-wider2` labels are
  the one place this pattern is used intentionally).

## Data flow

- `lib/currency.ts` is the **single place** prices are formatted (PKR,
  `formatPrice()`) and the shipping threshold/rate are defined. Every
  price shown anywhere in the app goes through it.
- `lib/getProducts.ts` is the **single place** that fetches product data.
  It queries MotherDuck if `MOTHERDUCK_TOKEN` is set (falling back
  gracefully on any failure) and otherwise reads the static catalog in
  `data/products.ts`. Every one of its exports (`getAllProducts`,
  `getProductBySlug`, `getFeaturedProducts`, `getBestSellers`,
  `getNewArrivals`, `getRelatedProducts`) is now **async** — Server
  Components that call these must be `async function`s and `await` the
  result (see any `app/**/page.tsx` for the pattern).
- Client components never call `lib/getProducts.ts` directly (MotherDuck
  can only be queried server-side). Instead, the root layout
  (`app/layout.tsx`) fetches the catalog once and passes it down via
  `context/ProductsContext.tsx`'s `useProducts()` hook — see
  `context/CartContext.tsx` for the pattern. If you add a new client
  component that needs to look up a product by id, use `useProducts()`,
  not a new fetch.
- `data/products.ts` remains the source of truth for the *static
  fallback* and for `npm run db:seed` (which loads it into MotherDuck) —
  but nothing should import `PRODUCTS` directly anymore except
  `lib/getProducts.ts` and `scripts/seed-motherduck.ts`.
- `context/CartContext.tsx` is the only cart state. It persists to
  `localStorage` under the key `sanwarna-cart-v1`. If you add checkout
  logic that needs server-side cart validation later, keep this context's
  public API (`addToCart`, `removeLine`, `setQuantity`, `clearCart`,
  `lines`, `subtotal`, `count`) stable so consuming components don't need
  to change.
- `types/index.ts` defines the shapes (`Product`, `ProductVariant`,
  `CartLine`, `VideoTemplate`). Update this file first when changing a
  data shape, then fix the type errors that cascade — that's the fastest
  way to find every place that needs updating. If you change `Product`'s
  shape, remember `sql/schema.sql` stores it as opaque JSON, so no
  migration is needed there — but re-run `npm run db:seed` to refresh any
  MotherDuck data you're using locally.

## Admin gating

- `middleware.ts` matches `/video-studio/:path*` and checks for a valid
  session cookie (`ADMIN_COOKIE_NAME`, verified in `lib/adminAuth.ts`).
  Unauthenticated visits redirect to `/admin/login?from=<path>`.
- `/admin/login` posts to `/api/admin/login`, which checks the submitted
  password against `ADMIN_PASSWORD` and issues the signed cookie.
  `/api/admin/logout` clears it.
- If you add another feature that should be admin-only, add its route
  prefix to `middleware.ts`'s `matcher` rather than duplicating the
  auth check in the page itself.

## Conventions

- Route pages that need `useSearchParams()` must be wrapped in
  `<Suspense>` (see `app/shop/page.tsx`, `app/try-on/page.tsx`,
  `app/video-studio/page.tsx`, `app/admin/login/page.tsx` for the
  pattern) — Next.js will fail the build otherwise.
- Client components that only need interactivity for a small piece of a
  page should stay small and be composed into a server component page
  (see `app/shop/[slug]/page.tsx` importing the client
  `ProductPurchasePanel`) rather than marking the whole page
  `"use client"`. This keeps as much of the app server-rendered/static as
  possible, which is where the site's speed comes from.
- Prefer Tailwind utility classes inline. The only custom CSS classes are
  in `app/globals.css` (`.hairline`, `.hairline-solid`, `.tile-surface`,
  `.input-field`, `.text-balance`, `.shimmer-text`) — reuse those rather
  than writing new bespoke CSS unless a new pattern is genuinely needed in
  more than one place.
- Don't add `next/image` remote patterns for new hosts without checking
  they're actually free to hotlink from (Unsplash, GitHub raw content,
  and your own domain are pre-configured in `next.config.js`).

## Testing changes

There's no test suite yet. At minimum, before considering a change done:

```bash
npm run build
npx next lint
```

This catches type errors (including forgetting `await` on the now-async
product functions), missing Suspense boundaries, unescaped JSX entities,
and broken imports — the most common failure modes in this codebase. Also
manually click through `/`, `/shop`, a product page, `/try-on` (upload a
photo, confirm wrist detection runs and places the overlay, then drag to
adjust and download), `/admin/login` (confirm a wrong password is
rejected and a correct one redirects into `/video-studio`), and
`/video-studio` itself (generate a video end-to-end) — these are stateful
browser APIs (camera, canvas, MediaRecorder, WebAssembly model loading)
that don't get meaningfully checked by the TypeScript compiler alone.

If you have `MOTHERDUCK_TOKEN` set locally, also verify the site still
works with it *unset* (comment it out and restart the dev server) — the
static-fallback path is a correctness requirement, not just a nice-to-have,
since production may run without a database configured at all.

## Things not to do

- Payments are Cash on Delivery and JazzCash (`lib/jazzcash.ts`,
  `app/api/checkout/*`). Order totals are always recomputed server-side in
  `lib/orders.ts`; never trust a total sent by the browser. Don't add
  another payment provider without being asked.
- Don't replace the static SVG product art with hotlinked stock photo URLs
  you haven't verified are stable and licensed for use — prefer leaving a
  clear placeholder and a note for the human to add licensed photography.
- Don't add analytics, tracking pixels, or third-party scripts without
  being asked — the brief calls for free/open-source only, and unasked-for
  tracking is also a trust issue for a luxury brand's visitors.
- Don't add a public link to `/video-studio` anywhere, and don't remove
  the `middleware.ts` gate on it, without being explicitly asked — it's
  admin-only by design.
- Don't call `data/products.ts`'s `PRODUCTS` array directly from a page or
  component — go through `lib/getProducts.ts` (server) or
  `useProducts()` (client) so the MotherDuck/static swap stays in one
  place.
- Don't hardcode `$` or reformat a price manually — always go through
  `formatPrice()` in `lib/currency.ts` (PKR, no decimals). All prices in
  `data/products.ts` are PKR integers, not USD.
- Don't reintroduce `rating`/`reviewCount` to `Product` or render
  `components/SocialProof.tsx` without being asked — there are no real
  reviews yet (see the README's "Reviews" section for how to re-enable
  this properly once there are).
- Don't add a `next/dynamic(..., { ssr: false })`-wrapped Three.js scene's
  import to the top of a Server Component or otherwise force it into the
  server bundle — `Product3DScene.tsx` must stay client-only and lazily
  loaded (see `Product3DShowcase.tsx` for the pattern) so its WebGL/Three.js
  weight never lands in a page's initial JS.

## Homepage hero

- The top of the homepage is `components/HeroGallery.tsx`: an
  auto-rotating gallery of real product photos, each slide linking to its
  product with a Buy now button. It only shows products that have real
  photos (not the drawn SVG placeholders), using `heroImages` (wide
  shots) when present and `images` otherwise.
- `Hero.tsx`, `Product3DShowcase.tsx` and `Product3DScene.tsx` are no
  longer rendered anywhere. They are kept only for reference.

## Images, feed, site URL

- Product photo URLs are resolved in `lib/getProducts.ts` through
  `lib/cloudinary.ts` (Cloudinary when configured, `/public` otherwise).
- `app/api/products/feed.xml/route.ts` is the Google/Meta product feed.
- Use `SITE_URL` from `lib/site.ts` for absolute links; don't hardcode a domain.

## Removed: Virtual Try-On; added: WhatsApp

- The Virtual Try-On (`/try-on`, `TryOnCanvas`, `lib/handDetection.ts`,
  MediaPipe) was removed at the owner's request because it didn't work
  well. Ignore older mentions of it in this file and in `components/` and
  `lib/` CLAUDE.md. `tryOnAnchor`/`overlayImage` remain on `Product` only
  because the admin Video Studio and stored data still use them. The old
  Three.js files and dependencies are gone too.
- WhatsApp: number and link helper in `lib/whatsapp.ts`; buttons in
  `components/WhatsApp.tsx` (floating button in the root layout, "Order on
  WhatsApp" on the cart and product pages). WhatsApp orders are not saved
  to the orders table; they arrive only as a chat message.

## Image sizes

- `next/image` uses a custom loader (`lib/imageLoader.js`) that maps local
  product photos to pre-generated WebP copies (`public/images/products/opt/`,
  made by `scripts/optimize-images.mjs` on predev/prebuild, gitignored).
  The older note about `images.unoptimized` no longer applies. If you
  change the widths, change them in both files and in `next.config.js`.
