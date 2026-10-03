# CLAUDE.md — components/

Conventions specific to this folder. Read the root `CLAUDE.md` first.

## Server vs. client components

Most files here are client components (`"use client"`) because they hold
interactive state (cart, filters, drag-to-position, wrist detection, video
rendering). A few are plain server components meant to be rendered from a
page without needing interactivity themselves:

- `ProductCard.tsx`, `ProductSection.tsx`, `Hero.tsx`, `SocialProof.tsx`,
  `CTASection.tsx`, `Footer.tsx` — server components. Keep them that way;
  they don't need `"use client"`. If you need to add interactivity to one
  of these, prefer extracting just the interactive part into a small new
  client component rather than converting the whole thing.

Client components that need product data (cart, cart drawer, checkout
summary) read it from `useProducts()` (`context/ProductsContext.tsx`) —
they don't fetch it themselves, since the catalog fetch (which may hit
MotherDuck) only happens server-side, once, in `app/layout.tsx`.

## Where things live

| If you're adding... | It probably goes in... |
|---|---|
| A new page-level layout section (hero, testimonial band, CTA strip) | A new file in `components/`, composed into the relevant `app/**/page.tsx` |
| A control specific to the Try-On Studio | `TryOnCanvas.tsx` if it touches the canvas/transform/detection state, or a new small component imported into `TryOnPageClient.tsx` if it's page-level UI |
| A control specific to the Video Studio | `VideoStudioClient.tsx` for page-level UI, `lib/videoRenderer.ts` for anything about how the video is actually drawn/encoded — remember this page is admin-only, gated by `middleware.ts` |
| Something reused by both studios | Keep it generic and top-level, like `ProductPicker.tsx` already is |

## Patterns already established — follow these

- **Swatches:** variant color swatches are rendered as small circular
  buttons with `style={{ backgroundColor: v.swatch }}` (see
  `ProductPurchasePanel.tsx`). Don't switch to Tailwind background classes
  for these since swatch colors are per-product data, not design tokens.
- **Quantity steppers:** the `− [n] +` pattern appears in `CartDrawer.tsx`,
  `app/cart/page.tsx`, and `ProductPurchasePanel.tsx`. If you need it a
  fourth time, consider extracting a `QuantityStepper` component instead
  of copy-pasting again.
- **Empty states:** every list-like view (cart, shop filters with no
  results) has a centered empty state with a short explanation and one
  clear action link. Match that tone — direct, no apology, one next step.
- **Loading/progress UI:** the Video Studio's render progress (spinner +
  label + thin gold progress bar) is the established pattern for anything
  else that becomes async in the future — reuse its visual language rather
  than inventing a new spinner style.
- **Detection status messaging:** `TryOnCanvas.tsx`'s wrist-detection
  states (`idle` / `detecting` / `found` / `not-found`) each render a
  short, calm status line above the manual controls — informative, never
  blocking. If you add another async, best-effort background process to
  either studio, follow this pattern (a small status line, controls
  remain usable regardless of outcome) rather than a modal or a hard
  error state.

## Public vs. admin-only pages

`Navbar.tsx` and `Footer.tsx` deliberately do **not** link to
`/video-studio` — it's an admin-only tool (see root `CLAUDE.md` and
`middleware.ts`). `Footer.tsx` does link to `/admin/login`, discreetly, in
the bottom bar. When adding new navigation, don't add a Video Studio link
to any customer-facing component without being explicitly asked.

## Accessibility checklist for new interactive components

- Every icon-only button needs `aria-label`.
- Every custom control that isn't a native `<button>`/`<input>` needs a
  role and keyboard handling — prefer native elements first.
- Respect `:focus-visible` (already global, tuned with a champagne ring
  for the light theme) — don't add `outline: none` without a replacement
  focus style.
- Sliders, drag targets, and canvases (Try-On, Video Studio) are
  inherently mouse/touch-first; where feasible, keep a non-drag fallback
  (the size/rotation sliders next to the draggable canvas are that
  fallback for Try-On — preserve this pattern if you rework it, including
  when the initial position comes from automatic wrist detection rather
  than a fixed default).
