# SANWARNA

**Sanwarna** — to make yourself beautiful.

A premium, blazing-fast storefront for a luxury men's cufflinks & tie-pen
brand built for the Pakistani market (prices in **PKR**, Cash on Delivery,
nationwide shipping copy throughout), with three built-in features that
double as growth engines:

- **Interactive 3D Product Showcase** (homepage) — a real, drag-to-rotate
  3D crystal cufflink model (Three.js/WebGL, free & open-source), built
  next to the actual product photography, with Add to Bag / Buy Now right
  on the homepage. See "The 3D Homepage Showcase" below for what this is
  (and isn't).
- **Virtual Try-On Studio** — upload a photo or use your camera. A
  free, in-browser hand-detection model finds your wrist automatically and
  places the selected cufflink there, with drag/scale/rotate controls to
  fine-tune. 100% client-side; no photo ever leaves the browser.
- **Viral Video Studio** — pick a product and a reusable short-form video
  template, and render a cinematic 9:16 clip (hook → macro shot → optional
  "as worn" photo → CTA card) entirely in-browser, ready to download or
  share to TikTok / Reels / Shorts. **Admin-only** — this is an internal
  content-creation tool for the brand's team, not a customer-facing page.

Built with **Next.js 14 (App Router) + React 18 + TypeScript + Tailwind
CSS**, deployable on **Vercel's free tier**, with an optional **MotherDuck**
database, **zero paid APIs, zero mandatory recurring costs**, and an
architecture designed so paid services (payments, a real CMS, cloud AI) can
be dropped in later without a rebuild.

There are no customer reviews or testimonials shown anywhere on the site —
SANWARNA doesn't have real ones yet. See "Reviews" below.

---

## Design

A light, Apple-inspired visual language: white/off-white surfaces
(`paper`, `mist`, `cloud`), graphite text, hairline borders instead of heavy
dividers, generous whitespace, and champagne gold as the one accent color
carried over from the brand's original dark palette — used sparingly, for
CTAs, prices, and small emphasis, rather than as a background color. Large
serif display type (Fraunces) for headlines paired with a clean sans
(Manrope) for everything else. Motion stays minimal and functional — no
scroll-triggered fade-ins on every section.

All colors are semantic Tailwind tokens defined in `tailwind.config.ts`
(`paper`, `mist`, `cloud`, `hairline`, `graphite`, `steel`, `champagne`,
`champagne-light`, `brass`, `rust`) — never raw hex classes in components.

---

## Why it's fast

- The product catalog is served from a single async data layer
  (`/lib/getProducts.ts`) that reads from MotherDuck when configured and
  falls back to static TypeScript (`/data/products.ts`) otherwise — so the
  site works, and is fast, with zero database setup.
- The catalog is fetched once per request in the root layout (React's
  `cache()` de-dupes repeated calls within a render pass) and handed to
  client components via `ProductsContext`, so there's exactly one
  server-side fetch per page view no matter how many components need
  product data.
- Product imagery is hand-built inline SVG (`/public/images/products/*.svg`)
  — tiny file sizes, crisp at any resolution, zero network dependency on a
  third-party image host. Swap these for real photography any time (see
  "Swapping in real photography" below).
- Fonts are self-hosted at build time via `next/font/google` (Fraunces +
  Manrope) — no runtime font request, no layout shift.
- Virtual Try-On and Video Studio do all image/video processing on-device
  via `<canvas>`, `MediaRecorder`, WebAssembly (MediaPipe), and the
  File/Camera APIs — no server round trip, no per-render cost, and it
  works offline once loaded.

---

## Getting started

### Prerequisites
- Node.js 18.18 or newer
- npm (or pnpm/yarn if you prefer — just adjust the commands below)

### Install & run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

### Environment variables

**None are required** to run the shopping experience and Virtual Try-On —
the catalog falls back to static data, and wrist detection needs no
configuration. See `.env.example` for the full list; the two that unlock
real functionality are:

```bash
cp .env.example .env.local
```

- `ADMIN_PASSWORD` — set this to use the Video Studio at all (it's gated
  behind a login at `/admin/login`; see "Admin access" below).
- `MOTHERDUCK_TOKEN` — set this (plus `npm run db:seed`) to serve the
  catalog from a real, editable database instead of static data; see
  "Product database (MotherDuck)" below.

### Build for production

```bash
npm run build
npm start
```

---

## Admin access (Viral Video Studio)

The Video Studio is a tool for the brand's own team to produce marketing
clips — it is not something a customer should stumble into, so it's gated:

1. Set `ADMIN_PASSWORD` (and optionally a separate `ADMIN_SESSION_SECRET`)
   in your environment — see `.env.example`.
2. Visit `/admin/login` and sign in. This issues a signed, expiring
   (7-day) httpOnly cookie — no database, no third-party auth provider.
3. `middleware.ts` gates every `/video-studio` route behind that cookie;
   an unauthenticated visit redirects to `/admin/login`.

There's no public link to the Video Studio anywhere in the site's
navigation — the only way in is knowing the URL and signing in.

---

## Product database (MotherDuck) — optional

By default, the catalog lives in `/data/products.ts`. Set
`MOTHERDUCK_TOKEN` to instead serve it from
[MotherDuck](https://motherduck.com) — a managed DuckDB-in-the-cloud
service with a free tier — so the catalog can be edited without a
redeploy.

**Setup:**

```bash
# 1. Create a free MotherDuck account and database at motherduck.com
# 2. Generate an access token (Settings -> Tokens)
# 3. Add to .env.local:
#      MOTHERDUCK_TOKEN="..."
#      MOTHERDUCK_DATABASE="sanwarna"
# 4. Create the table and load it from data/products.ts:
npm run db:seed
```

This connects over MotherDuck's Postgres wire-protocol endpoint using the
standard `pg` driver (see `lib/motherduck.ts`) — no DuckDB binary is
bundled, so it works fine in a Vercel serverless function. If the query
fails for any reason (unset token, network issue, empty table), the app
falls back to the static catalog automatically — a MotherDuck outage never
takes the storefront down. See `sql/schema.sql` for the table shape.

MotherDuck is also available as a one-click **Vercel Marketplace**
integration, which sets `MOTHERDUCK_TOKEN` for your deployment
automatically.

---

## Deploying to Vercel (free tier)

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Framework preset: **Next.js** (auto-detected). No build settings need
   to change.
4. Add environment variables in the Vercel project settings if you want
   the Video Studio or MotherDuck (see `.env.example` for the full list) —
   otherwise leave them empty for the default free build.
5. Deploy. That's it — no mandatory paid add-ons required.

The app is designed to fit comfortably inside Vercel's Hobby (free) plan:
mostly static/edge-cached rendering, a small middleware function for admin
gating, and no image-optimization billing surprises (see `next.config.js`,
which sets `images.unoptimized: true` since the catalog uses local SVGs —
flip this back on once you're serving real photography that benefits from
`next/image` optimization on a paid plan, or keep it off and self-host
optimized images for zero cost).

---

## Project structure

```
sanwarna/
├── app/                          # Next.js App Router routes
│   ├── page.tsx                  # Homepage (hero, featured, bestsellers, social proof)
│   ├── shop/page.tsx             # Catalog with search/filter/sort
│   ├── shop/[slug]/page.tsx      # Product detail page
│   ├── try-on/page.tsx           # Virtual Try-On Studio
│   ├── video-studio/page.tsx     # Viral Video Studio (admin-only, see middleware.ts)
│   ├── admin/login/page.tsx      # Admin login form
│   ├── api/admin/login|logout/   # Admin session cookie issue/clear
│   ├── cart/page.tsx             # Full cart page
│   ├── checkout/page.tsx         # Checkout-ready page (payment provider stub)
│   ├── sitemap.ts / robots.ts    # SEO
│   └── layout.tsx / globals.css
├── components/                   # UI + feature components (see below)
├── context/
│   ├── CartContext.tsx           # Client cart state (localStorage-persisted)
│   └── ProductsContext.tsx       # Hands the server-fetched catalog to client components
├── data/products.ts              # Static product catalog (fallback / seed source)
├── lib/
│   ├── getProducts.ts            # THE data-access layer — MotherDuck, else static fallback
│   ├── motherduck.ts             # MotherDuck connection pool (pg driver)
│   ├── adminAuth.ts              # Signed admin session cookie (HMAC-SHA256)
│   ├── handDetection.ts          # MediaPipe wrist-detection heuristic for Try-On
│   ├── videoTemplates.ts         # Reusable Viral Video Studio templates
│   └── videoRenderer.ts          # Canvas + MediaRecorder video rendering engine
├── middleware.ts                 # Gates /video-studio behind the admin cookie
├── scripts/seed-motherduck.ts    # `npm run db:seed` — loads data/products.ts into MotherDuck
├── sql/schema.sql                # Reference schema for the MotherDuck `products` table
├── types/index.ts                # Shared TypeScript types
├── public/images/products/       # Inline SVG product art (replace with real photos)
├── CLAUDE.md                     # Guide for AI coding agents working on this repo
└── .env.example                  # All optional environment variables, documented
```

### Key components

| Component | Purpose |
|---|---|
| `TryOnCanvas.tsx` | The Try-On compositing engine — camera/upload capture, automatic wrist detection via `lib/handDetection.ts`, draggable/scalable/rotatable overlay as override, PNG export |
| `VideoStudioClient.tsx` | Video Studio UI (admin-only) — product/template selection, optional personal photo, render + preview + download/share |
| `lib/videoRenderer.ts` | The actual video generation: builds a scene timeline (hook / macro / lifestyle / CTA), draws it frame-by-frame to a canvas, and records it with `MediaRecorder` |
| `ShopClient.tsx` / `ShopFilters.tsx` | Client-side search, category filter, and sort for the catalog |
| `CartContext.tsx` | Cart state, persisted to `localStorage`, no backend required |
| `Product3DShowcase.tsx` / `Product3DScene.tsx` | Homepage's interactive 3D preview + Add to Bag / Buy Now, see below |

---

## Currency & Pakistan localization

All prices are in **PKR** (Pakistani Rupees) — see `lib/currency.ts` for
the single `formatPrice()` used everywhere (product cards, PDP, cart,
checkout, Try-On). Free shipping and the flat courier rate are also
defined there (`FREE_SHIPPING_THRESHOLD`, `FLAT_SHIPPING_RATE`) — change
them in one place to update site-wide.

Checkout includes a **Cash on Delivery (COD)** option, the dominant
payment method for e-commerce in Pakistan — a card option is shown but
disabled until a real payment processor is connected (see "Swapping in a
real backend later").

Site copy throughout (Hero, footer, product descriptions) is written for
a Pakistani male audience shopping for grooming/formalwear accessories —
including wedding-season language (barat, valima, shaadi gifting) on the
Aurora Star Crystal Cufflinks product, which was built from real customer
photos (see "The 3D Homepage Showcase" below).

---

## Reviews

There are **no customer reviews or ratings anywhere on the site** —
`types/index.ts`'s `Product` type has no `rating`/`reviewCount` fields,
and `components/SocialProof.tsx` (testimonials + press logos) is present
in the codebase but **not rendered** on the homepage (see the comment in
`app/page.tsx`). Its content is placeholder text, kept only as a
ready-to-wire template. Once you have real reviews:

1. Replace the `TESTIMONIALS` (and, if applicable, `PRESS`) arrays in
   `components/SocialProof.tsx` with real ones.
2. Re-add `<SocialProof />` to `app/page.tsx`.
3. If you want star ratings back on product cards/PDPs, add
   `rating`/`reviewCount` back to the `Product` type and `data/products.ts`,
   and reinstate the "Top Rated" sort in `ShopFilters.tsx` / `ShopClient.tsx`.

---

## The 3D Homepage Showcase

The homepage's "Interactive 3D Preview" section (`Product3DShowcase.tsx` +
`Product3DScene.tsx`) needs an honest explanation, because "convert this
photo into 3D" doesn't have a free/open-source answer:

**What it is not:** true photogrammetry — reconstructing an accurate 3D
mesh from a handful of flat photos — requires a paid, cloud-based service
(e.g. Luma AI). That's outside this project's "zero paid APIs" constraint,
so this build doesn't attempt it.

**What it is instead:** a genuinely interactive, genuinely 3D model —
built procedurally in [Three.js](https://threejs.org) via
[`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) and
[`@react-three/drei`](https://github.com/pmndrs/drei) (all free,
open-source, MIT-licensed, rendered client-side via WebGL) — shaped and
lit to match the real product: a faceted crystal (an octahedron with
`MeshTransmissionMaterial` for glass-like refraction) held in a four-point
star mount, sitting on a cufflink post. It auto-rotates, and dragging it
hands control to the visitor (`@react-three/drei`'s `OrbitControls`). No
external model or texture files are fetched at runtime — the crystal's
refraction comes from sampling the WebGL scene itself, not an internet
HDRI — so it keeps working offline once the page has loaded, same as the
rest of the site.

**The real photos are still front and center.** A "Photo Angles" toggle
next to the 3D view switches to the actual product photography you
provide (`product.spinFrames` in `data/products.ts`) — drag left/right to
step through them. With only a handful of real angles this is a photo
gallery you can drag through, not a smooth 360° turntable, and it's
labeled that way rather than oversold. If you later shoot a true 24–36
frame turntable of a product, this same component will render it far more
smoothly — no code changes needed, just add more URLs to `spinFrames`.

**Buy right from the homepage:** the showcase reads the featured product
(defaults to `aurora-star-crystal-cufflinks`) and wires `Add to Bag` /
`Buy Now` straight into the existing `CartContext` — no separate cart
logic. To showcase a different product, change the `slug` lookup in
`app/page.tsx`.

**Performance:** `Product3DScene.tsx` is loaded via `next/dynamic(...,
{ ssr: false })`, so the ~large Three.js/WebGL bundle is never part of the
server render or the homepage's initial JS — it downloads only for
visitors who actually scroll to (or whose viewport includes) that
section, same lazy-loading approach already used for the Video Studio and
MediaPipe wrist detection elsewhere in this codebase.

**Adding this to a new product:** give it real photos (ideally 4+ angles)
in `images`, list the same or a curated subset under `spinFrames`, and
point the homepage's showcase lookup at its slug. The 3D crystal model
itself is generic — see `lib/CLAUDE.md` if you want to adapt its geometry
for a very differently-shaped product (e.g. a flat tie bar rather than a
gem).

---

## The Virtual Try-On Studio, in plain terms

1. The user picks a product, then uploads a photo or turns on their camera.
2. The photo is drawn onto a `<canvas>` element.
3. In the background, `lib/handDetection.ts` runs MediaPipe Tasks Vision's
   `HandLandmarker` (a free, open-source, WebAssembly-based model, loaded
   lazily and only on this page) against the photo. If a hand is found, it
   computes a wrist position, size, and rotation from the hand's landmarks
   (wrist, index/middle/pinky knuckles) and uses that as the cufflink's
   initial placement.
4. The selected product's image is drawn on top at that `{x, y, scale,
   rotation}` transform. If no hand is detected, the studio falls back to a
   sensible default and tells the user so — the drag/scale/rotate controls
   are always available, whether detection succeeded or not, so a user can
   always fine-tune (or fully manually place) the result.
5. "Download Preview" exports the canvas as a PNG — nothing is ever
   uploaded to a server; the whole flow, including detection, runs in the
   visitor's browser.

---

## The Viral Video Studio, in plain terms

**Admin-only** — see "Admin access" above.

1. An admin picks a product and one of four reusable templates (Hook &
   Reveal, Cinematic Macro, Before/After Glow-Up, Luxe Unboxing).
2. Optionally, they add a personal photo (e.g. from the Try-On Studio) to
   include an "as worn" scene.
3. `renderVideo()` in `lib/videoRenderer.ts` builds a scene timeline scaled
   to the template's duration, then runs a `requestAnimationFrame` loop
   that draws each scene (hook text, Ken Burns product zoom, optional
   lifestyle photo, CTA card) to an off-screen canvas.
4. `canvas.captureStream()` feeds that canvas into a `MediaRecorder`,
   which records a `.webm` video in real time — again, no server, no
   render farm, no per-video cost.
5. The result plays back immediately and can be downloaded or shared via
   the Web Share API (`navigator.share`) where supported.

**Why `.webm` and not `.mp4`?** Browsers can record `.webm` natively for
free with zero dependencies. Most social apps transcode on upload, so this
works for most people as-is. If you want native `.mp4` output without any
paid service, the free, open-source **ffmpeg.wasm** can transcode
client-side after recording — it's a larger download for the visitor's
browser, so it's left as an opt-in upgrade rather than bundled by default.
See `NEXT_PUBLIC_VIDEO_RENDER_MODE` in `.env.example` for where that would
plug in.

**Adding real royalty-free music:** drop `.mp3` files into `/public/audio`
and reference them in `lib/videoTemplates.ts`; you'd mix the audio into the
recorded stream by connecting an `AudioContext` source to the canvas
stream before passing it to `MediaRecorder`. This is left out of the
default build to keep the repository small and dependency-free — the
Studio ships a "music mood" selector as a placeholder so the UI/UX is
already in place for when you add tracks.

---

## Swapping in real photography

Every product's `images` and `overlayImage` fields in `data/products.ts`
point at local SVGs. To use real cinematic photography instead:

1. Add your photos to `/public/images/products/` (JPG/PNG/WebP).
2. Update each product's `images` array and `overlayImage` (ideally a
   cropped, transparent-background PNG of just the product for clean
   Try-On compositing) to point at the new files. If the catalog lives in
   MotherDuck, edit the row's JSON `data` column instead (or update
   `data/products.ts` and re-run `npm run db:seed`).
3. Flip `images.unoptimized` back to `false` in `next.config.js` if you
   want Next.js's built-in image optimization (free on Vercel for
   reasonable volumes; check current Vercel pricing if your catalog is
   very large).

---

## Swapping in a real backend later

The app is intentionally architected so none of the following require a
rebuild — only a new implementation behind the same shape:

- **Payments:** the checkout page already collects everything a processor
  needs. Add Stripe (or another provider with a free/pay-as-you-go tier)
  behind the "Place Order" submit handler in `app/checkout/page.tsx`.
- **Inventory / CMS:** the catalog already supports a database
  (MotherDuck) as a drop-in replacement for the static file — see
  "Product database" above. To swap in a different backend entirely
  (headless CMS, another database), change only `lib/getProducts.ts`;
  everything downstream (`ProductsContext`, every page) keeps working
  unchanged as long as the returned shape matches `types/index.ts`.
- **Analytics:** Vercel Web Analytics and Speed Insights are free on
  Hobby projects — add the corresponding packages and drop their
  components into `app/layout.tsx`.

---

## Accessibility & performance notes

- Visible keyboard focus rings throughout (`:focus-visible` in
  `globals.css`), tuned for a light background.
- `prefers-reduced-motion` is respected — animations collapse to
  near-instant for users who've asked for reduced motion.
- A "Skip to content" link is included for keyboard/screen-reader users.
- No client-side JavaScript is required to view the shop catalog or a
  product page's core content — interactivity (filters, cart, variant
  selection) progressively enhances a server-rendered page.

---

## License / content notice

Product copy, reviews, and press mentions in this repository are
placeholder content for demonstration purposes — replace them with real
brand copy, real customer reviews, and real press coverage before
launching.

## Delivery

Delivery is free on every order. The rule lives in `lib/currency.ts`
(`FLAT_SHIPPING_RATE` / `shippingCostFor`); change it there to charge again.

## Adding real product photos

Put JPGs/PNGs in `public/images/products/` and list them in the product's
`images` array in `data/products.ts`. Small WebP copies in three widths are
made automatically before every `npm run dev` / `npm run build` (and so on
every Vercel deploy) by `scripts/optimize-images.mjs`; pages load the right
size for the screen via `lib/imageLoader.js`. The original JPG is still
what the Google product feed links to.
## Deploying to Vercel (free tier)

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Framework preset: **Next.js** (auto-detected). No build settings need
   to change.
4. Add environment variables in the Vercel project settings if you want
   the Video Studio or MotherDuck (see `.env.example` for the full list) —
   otherwise leave them empty for the default free build.
5. Deploy. That's it — no mandatory paid add-ons required.

The app is designed to fit comfortably inside Vercel's Hobby (free) plan:
mostly static/edge-cached rendering, a small middleware function for admin
gating, and no image-optimization billing surprises (see `next.config.js`,
which sets `images.unoptimized: true` since the catalog uses local SVGs —
flip this back on once you're serving real photography that benefits from
`next/image` optimization on a paid plan, or keep it off and self-host
optimized images for zero cost).

---

## Project structure

```
sanwarna/
├── app/                          # Next.js App Router routes
│   ├── page.tsx                  # Homepage (hero, featured, bestsellers, social proof)
│   ├── shop/page.tsx             # Catalog with search/filter/sort
│   ├── shop/[slug]/page.tsx      # Product detail page
│   ├── try-on/page.tsx           # Virtual Try-On Studio
│   ├── video-studio/page.tsx     # Viral Video Studio (admin-only, see middleware.ts)
│   ├── admin/login/page.tsx      # Admin login form
│   ├── api/admin/login|logout/   # Admin session cookie issue/clear
│   ├── cart/page.tsx             # Full cart page
│   ├── checkout/page.tsx         # Checkout-ready page (payment provider stub)
│   ├── sitemap.ts / robots.ts    # SEO
│   └── layout.tsx / globals.css
├── components/                   # UI + feature components (see below)
├── context/
│   ├── CartContext.tsx           # Client cart state (localStorage-persisted)
│   └── ProductsContext.tsx       # Hands the server-fetched catalog to client components
├── data/products.ts              # Static product catalog (fallback / seed source)
├── lib/
│   ├── getProducts.ts            # THE data-access layer — MotherDuck, else static fallback
│   ├── motherduck.ts             # MotherDuck connection pool (pg driver)
│   ├── adminAuth.ts              # Signed admin session cookie (HMAC-SHA256)
│   ├── handDetection.ts          # MediaPipe wrist-detection heuristic for Try-On
│   ├── videoTemplates.ts         # Reusable Viral Video Studio templates
│   └── videoRenderer.ts          # Canvas + MediaRecorder video rendering engine
├── middleware.ts                 # Gates /video-studio behind the admin cookie
├── scripts/seed-motherduck.ts    # `npm run db:seed` — loads data/products.ts into MotherDuck
├── sql/schema.sql                # Reference schema for the MotherDuck `products` table
├── types/index.ts                # Shared TypeScript types
├── public/images/products/       # Inline SVG product art (replace with real photos)
├── CLAUDE.md                     # Guide for AI coding agents working on this repo
└── .env.example                  # All optional environment variables, documented
```

### Key components

| Component | Purpose |
|---|---|
| `TryOnCanvas.tsx` | The Try-On compositing engine — camera/upload capture, automatic wrist detection via `lib/handDetection.ts`, draggable/scalable/rotatable overlay as override, PNG export |
| `VideoStudioClient.tsx` | Video Studio UI (admin-only) — product/template selection, optional personal photo, render + preview + download/share |
| `lib/videoRenderer.ts` | The actual video generation: builds a scene timeline (hook / macro / lifestyle / CTA), draws it frame-by-frame to a canvas, and records it with `MediaRecorder` |
| `ShopClient.tsx` / `ShopFilters.tsx` | Client-side search, category filter, and sort for the catalog |
| `CartContext.tsx` | Cart state, persisted to `localStorage`, no backend required |
| `Product3DShowcase.tsx` / `Product3DScene.tsx` | Homepage's interactive 3D preview + Add to Bag / Buy Now, see below |

---

## Currency & Pakistan localization

All prices are in **PKR** (Pakistani Rupees) — see `lib/currency.ts` for
the single `formatPrice()` used everywhere (product cards, PDP, cart,
checkout, Try-On). Free shipping and the flat courier rate are also
defined there (`FREE_SHIPPING_THRESHOLD`, `FLAT_SHIPPING_RATE`) — change
them in one place to update site-wide.

Checkout includes a **Cash on Delivery (COD)** option, the dominant
payment method for e-commerce in Pakistan — a card option is shown but
disabled until a real payment processor is connected (see "Swapping in a
real backend later").

Site copy throughout (Hero, footer, product descriptions) is written for
a Pakistani male audience shopping for grooming/formalwear accessories —
including wedding-season language (barat, valima, shaadi gifting) on the
Aurora Star Crystal Cufflinks product, which was built from real customer
photos (see "The 3D Homepage Showcase" below).

---

## Reviews

There are **no customer reviews or ratings anywhere on the site** —
`types/index.ts`'s `Product` type has no `rating`/`reviewCount` fields,
and `components/SocialProof.tsx` (testimonials + press logos) is present
in the codebase but **not rendered** on the homepage (see the comment in
`app/page.tsx`). Its content is placeholder text, kept only as a
ready-to-wire template. Once you have real reviews:

1. Replace the `TESTIMONIALS` (and, if applicable, `PRESS`) arrays in
   `components/SocialProof.tsx` with real ones.
2. Re-add `<SocialProof />` to `app/page.tsx`.
3. If you want star ratings back on product cards/PDPs, add
   `rating`/`reviewCount` back to the `Product` type and `data/products.ts`,
   and reinstate the "Top Rated" sort in `ShopFilters.tsx` / `ShopClient.tsx`.

---

## The 3D Homepage Showcase

The homepage's "Interactive 3D Preview" section (`Product3DShowcase.tsx` +
`Product3DScene.tsx`) needs an honest explanation, because "convert this
photo into 3D" doesn't have a free/open-source answer:

**What it is not:** true photogrammetry — reconstructing an accurate 3D
mesh from a handful of flat photos — requires a paid, cloud-based service
(e.g. Luma AI). That's outside this project's "zero paid APIs" constraint,
so this build doesn't attempt it.

**What it is instead:** a genuinely interactive, genuinely 3D model —
built procedurally in [Three.js](https://threejs.org) via
[`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) and
[`@react-three/drei`](https://github.com/pmndrs/drei) (all free,
open-source, MIT-licensed, rendered client-side via WebGL) — shaped and
lit to match the real product: a faceted crystal (an octahedron with
`MeshTransmissionMaterial` for glass-like refraction) held in a four-point
star mount, sitting on a cufflink post. It auto-rotates, and dragging it
hands control to the visitor (`@react-three/drei`'s `OrbitControls`). No
external model or texture files are fetched at runtime — the crystal's
refraction comes from sampling the WebGL scene itself, not an internet
HDRI — so it keeps working offline once the page has loaded, same as the
rest of the site.

**The real photos are still front and center.** A "Photo Angles" toggle
next to the 3D view switches to the actual product photography you
provide (`product.spinFrames` in `data/products.ts`) — drag left/right to
step through them. With only a handful of real angles this is a photo
gallery you can drag through, not a smooth 360° turntable, and it's
labeled that way rather than oversold. If you later shoot a true 24–36
frame turntable of a product, this same component will render it far more
smoothly — no code changes needed, just add more URLs to `spinFrames`.

**Buy right from the homepage:** the showcase reads the featured product
(defaults to `aurora-star-crystal-cufflinks`) and wires `Add to Bag` /
`Buy Now` straight into the existing `CartContext` — no separate cart
logic. To showcase a different product, change the `slug` lookup in
`app/page.tsx`.

**Performance:** `Product3DScene.tsx` is loaded via `next/dynamic(...,
{ ssr: false })`, so the ~large Three.js/WebGL bundle is never part of the
server render or the homepage's initial JS — it downloads only for
visitors who actually scroll to (or whose viewport includes) that
section, same lazy-loading approach already used for the Video Studio and
MediaPipe wrist detection elsewhere in this codebase.

**Adding this to a new product:** give it real photos (ideally 4+ angles)
in `images`, list the same or a curated subset under `spinFrames`, and
point the homepage's showcase lookup at its slug. The 3D crystal model
itself is generic — see `lib/CLAUDE.md` if you want to adapt its geometry
for a very differently-shaped product (e.g. a flat tie bar rather than a
gem).

---

## The Virtual Try-On Studio, in plain terms

1. The user picks a product, then uploads a photo or turns on their camera.
2. The photo is drawn onto a `<canvas>` element.
3. In the background, `lib/handDetection.ts` runs MediaPipe Tasks Vision's
   `HandLandmarker` (a free, open-source, WebAssembly-based model, loaded
   lazily and only on this page) against the photo. If a hand is found, it
   computes a wrist position, size, and rotation from the hand's landmarks
   (wrist, index/middle/pinky knuckles) and uses that as the cufflink's
   initial placement.
4. The selected product's image is drawn on top at that `{x, y, scale,
   rotation}` transform. If no hand is detected, the studio falls back to a
   sensible default and tells the user so — the drag/scale/rotate controls
   are always available, whether detection succeeded or not, so a user can
   always fine-tune (or fully manually place) the result.
5. "Download Preview" exports the canvas as a PNG — nothing is ever
   uploaded to a server; the whole flow, including detection, runs in the
   visitor's browser.

---

## The Viral Video Studio, in plain terms

**Admin-only** — see "Admin access" above.

1. An admin picks a product and one of four reusable templates (Hook &
   Reveal, Cinematic Macro, Before/After Glow-Up, Luxe Unboxing).
2. Optionally, they add a personal photo (e.g. from the Try-On Studio) to
   include an "as worn" scene.
3. `renderVideo()` in `lib/videoRenderer.ts` builds a scene timeline scaled
   to the template's duration, then runs a `requestAnimationFrame` loop
   that draws each scene (hook text, Ken Burns product zoom, optional
   lifestyle photo, CTA card) to an off-screen canvas.
4. `canvas.captureStream()` feeds that canvas into a `MediaRecorder`,
   which records a `.webm` video in real time — again, no server, no
   render farm, no per-video cost.
5. The result plays back immediately and can be downloaded or shared via
   the Web Share API (`navigator.share`) where supported.

**Why `.webm` and not `.mp4`?** Browsers can record `.webm` natively for
free with zero dependencies. Most social apps transcode on upload, so this
works for most people as-is. If you want native `.mp4` output without any
paid service, the free, open-source **ffmpeg.wasm** can transcode
client-side after recording — it's a larger download for the visitor's
browser, so it's left as an opt-in upgrade rather than bundled by default.
See `NEXT_PUBLIC_VIDEO_RENDER_MODE` in `.env.example` for where that would
plug in.

**Adding real royalty-free music:** drop `.mp3` files into `/public/audio`
and reference them in `lib/videoTemplates.ts`; you'd mix the audio into the
recorded stream by connecting an `AudioContext` source to the canvas
stream before passing it to `MediaRecorder`. This is left out of the
default build to keep the repository small and dependency-free — the
Studio ships a "music mood" selector as a placeholder so the UI/UX is
already in place for when you add tracks.

---

## Swapping in real photography

Every product's `images` and `overlayImage` fields in `data/products.ts`
point at local SVGs. To use real cinematic photography instead:

1. Add your photos to `/public/images/products/` (JPG/PNG/WebP).
2. Update each product's `images` array and `overlayImage` (ideally a
   cropped, transparent-background PNG of just the product for clean
   Try-On compositing) to point at the new files. If the catalog lives in
   MotherDuck, edit the row's JSON `data` column instead (or update
   `data/products.ts` and re-run `npm run db:seed`).
3. Flip `images.unoptimized` back to `false` in `next.config.js` if you
   want Next.js's built-in image optimization (free on Vercel for
   reasonable volumes; check current Vercel pricing if your catalog is
   very large).

---

## Swapping in a real backend later

The app is intentionally architected so none of the following require a
rebuild — only a new implementation behind the same shape:

- **Payments:** the checkout page already collects everything a processor
  needs. Add Stripe (or another provider with a free/pay-as-you-go tier)
  behind the "Place Order" submit handler in `app/checkout/page.tsx`.
- **Inventory / CMS:** the catalog already supports a database
  (MotherDuck) as a drop-in replacement for the static file — see
  "Product database" above. To swap in a different backend entirely
  (headless CMS, another database), change only `lib/getProducts.ts`;
  everything downstream (`ProductsContext`, every page) keeps working
  unchanged as long as the returned shape matches `types/index.ts`.
- **Analytics:** Vercel Web Analytics and Speed Insights are free on
  Hobby projects — add the corresponding packages and drop their
  components into `app/layout.tsx`.

---

## Accessibility & performance notes

- Visible keyboard focus rings throughout (`:focus-visible` in
  `globals.css`), tuned for a light background.
- `prefers-reduced-motion` is respected — animations collapse to
  near-instant for users who've asked for reduced motion.
- A "Skip to content" link is included for keyboard/screen-reader users.
- No client-side JavaScript is required to view the shop catalog or a
  product page's core content — interactivity (filters, cart, variant
  selection) progressively enhances a server-rendered page.

---

## License / content notice

Product copy, reviews, and press mentions in this repository are
placeholder content for demonstration purposes — replace them with real
brand copy, real customer reviews, and real press coverage before
launching.

## Delivery

Delivery is free on every order. The rule lives in `lib/currency.ts`
(`FLAT_SHIPPING_RATE` / `shippingCostFor`); change it there to charge again.

## Adding real product photos

Put square JPGs in `public/images/products/` and list them in the product's
`images` array in `data/products.ts`. The first one is used on cards; the
product page shows all of them as a gallery (`components/ProductGallery.tsx`).

## Deploying: GitHub + Vercel

1. Create an empty repository on GitHub (no README), then in this folder:
   ```bash
   git init && git add . && git commit -m "SANWARNA storefront"
   git branch -M main
   git remote add origin https://github.com/<you>/sanwarna.git
   git push -u origin main
   ```
2. On https://vercel.com choose Add New → Project, import the repository
   and press Deploy. No build settings need changing.
3. In the Vercel project, Settings → Environment Variables, add the values
   from `.env.example` that you use (at minimum `NEXT_PUBLIC_SITE_URL`,
   `ADMIN_PASSWORD`, the Cloudinary cloud name, the three JazzCash values
   and `ORDER_WEBHOOK_URL`), then redeploy.
Every later `git push` redeploys the site automatically.

## Product photos on Cloudinary

Set the Cloudinary values in `.env.local`, run `npm run images:upload`,
and the site loads every product photo from Cloudinary. New photo: drop it
in `public/images/products/`, list it in `data/products.ts`, run the upload
again. You can also paste a full Cloudinary URL into `data/products.ts`.

## Product feed (Google Merchant Center / Meta catalogue)

`/api/products/feed.xml` is an RSS 2.0 feed with Google `g:` fields. Give
that URL to Merchant Center as a scheduled fetch. Products that only have
drawn placeholder art are left out, because Google rejects such images.

## Payments

Checkout offers Cash on Delivery and JazzCash (`lib/jazzcash.ts`, hosted
"page redirection" checkout). Totals are recalculated on the server. See
`.env.example` for the JazzCash credentials and the return URL to register.

## Orders

Orders are saved to the `orders` table in MotherDuck (`lib/orders.ts`); the
table is created automatically on the first order. See them at
`/admin/orders` (same password as the Video Studio), or query the table in
the MotherDuck UI. Without `MOTHERDUCK_TOKEN`, orders are only written to
the server log. `ORDER_WEBHOOK_URL` is optional and additionally POSTs each
order as JSON to a URL of your choice.

After changing `data/products.ts`, run `npm run db:seed` so the catalogue
in MotherDuck matches; the site reads products from MotherDuck first.
# sanwarna
