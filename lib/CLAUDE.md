# CLAUDE.md — lib/

This folder holds the non-UI engine code: product data access, the
optional database, admin auth, and the two flagship studios' internals.
Read the root `CLAUDE.md` first.

## `getProducts.ts` — the data-access layer

This is the **only** place server code should fetch product data from.

- Every export is `async` and must be `await`ed. `getAllProducts` is
  wrapped in React's `cache()`, which de-dupes calls within a single
  request/render pass (so multiple components on one page don't each
  trigger a separate database round trip) without persisting stale data
  across requests the way a module-level variable would.
- Data source priority: MotherDuck (if `MOTHERDUCK_TOKEN` is set and the
  query succeeds) → the static catalog in `data/products.ts` otherwise.
  `queryProductsFromMotherDuck()` catches and logs any failure and returns
  `null` rather than throwing, so a database outage degrades gracefully
  instead of taking the storefront down.
- If you add a new derived query (e.g. `getProductsByTag`), add it here
  following the existing pattern (`await getAllProducts()`, then
  filter/map) rather than writing a new MotherDuck query — the goal is one
  round trip per request, with all filtering done in memory against the
  already-fetched list, since the catalog is small.

## `motherduck.ts`

Thin wrapper around a `pg.Pool` connected to MotherDuck's Postgres
wire-protocol endpoint. Notes for anyone touching this:

- The pool is a module-level singleton (`let pool: Pool | null`), reused
  across requests on a warm server instance — don't create a new `Pool`
  per request.
- `isMotherDuckConfigured()` is the cheap check callers use before trying
  to query; `getMotherDuckPool()` throws if `MOTHERDUCK_TOKEN` is unset,
  so always guard with the former or catch the latter.
- The `attachDatabasePool` dynamic import is Vercel-specific connection
  draining and is wrapped in `.catch()` so this file works unchanged
  outside of Vercel (e.g. local dev, another host).

## `adminAuth.ts` — Video Studio gating

Deliberately minimal: no user table, no third-party auth provider. A
session is just `<expiryTimestamp>.<hmacSignature>`, signed with
`crypto.subtle` (Web Crypto API) so the exact same code runs in both a
Node.js Route Handler (`app/api/admin/login/route.ts`) and Edge
middleware (`middleware.ts`).

- The signing secret is `ADMIN_SESSION_SECRET` if set, else
  `ADMIN_PASSWORD`. Don't add a second secret-resolution path — keep
  `getSecret()` the one place this is decided.
- `passwordMatches()` does a manual constant-time-ish comparison rather
  than `===`, to avoid trivial timing attacks against the login endpoint.
  Keep that pattern if you touch this function.
- There's exactly one admin "account" (one shared password) by design —
  this isn't meant to scale to multiple named admin users. If that's ever
  needed, it's a real auth provider, not an extension of this file.

## `handDetection.ts` — Try-On wrist detection

Wraps MediaPipe Tasks Vision's `HandLandmarker` for the Try-On Studio's
automatic wrist-placement feature (`TryOnCanvas.tsx` is the caller).

- **Loaded lazily.** The `@mediapipe/tasks-vision` import, and the model +
  WASM fetch it triggers, only happen inside `getLandmarker()`, called the
  first time `detectWristPlacement()` runs — i.e., only on `/try-on`, only
  after the user has actually provided a photo. Don't hoist this import to
  module scope or call it eagerly; that would add real weight to pages
  that never use it.
- **Model/WASM are fetched from public CDNs at runtime** (jsdelivr for the
  WASM fileset, a Google Cloud Storage bucket for the `.task` model file)
  — not bundled. This keeps the repo and initial JS bundle small, at the
  cost of a first-use download (a few MB) and requiring the visitor to be
  online. If you need this to work fully offline, the alternative is
  self-hosting the model/WASM under `/public` — that's a valid follow-up
  but changes the deployment size tradeoff, so don't do it silently.
- **The placement heuristic is geometric, not a separate "cufflink
  detector" model** — there's no free, pretrained model that specifically
  finds "where a cufflink goes." Instead, it derives a placement from
  general hand landmarks: the wrist (0), index/middle/pinky knuckles
  (5/9/17). See the comments in the file for the exact geometry (forearm
  axis, hand-width-based scale, rotation from the forearm angle). If
  results look off for a class of photos (e.g. very rotated wrists,
  partial hands), tune the constants there (`t`, the scale multiplier)
  rather than reaching for a different model — the existing constants
  were chosen empirically and may need iteration, but the approach itself
  is intentional given the "free/open-source only" constraint.
- Returns `null` (not a thrown error, except where caught internally) when
  no hand is found or the model fails to load — callers must handle that
  by falling back to a manual/default placement, never by leaving the
  overlay undrawn.

## `videoTemplates.ts`

Plain data. A `VideoTemplate` is a config object, not a component — it
defines timing proportions and copy, and `videoRenderer.ts` interprets it.

**Adding a new template:**
1. Add a new `VideoTemplateId` union member in `types/index.ts`.
2. Add the corresponding entry to `VIDEO_TEMPLATES` here.
3. That's it — `VideoStudioClient.tsx` and `TemplateSelector.tsx` both
   render from this array automatically, and `videoRenderer.ts`'s
   `buildScenes()` uses `template.durationSeconds` to compute scene
   timing proportionally, so no renderer changes are needed for a
   same-shape template (hook → macro → optional lifestyle → CTA).

If a new template needs a genuinely different scene structure (not just
different durations/copy/mood), that's a `videoRenderer.ts` change — see
below.

## `videoRenderer.ts`

This is the core of the Viral Video Studio (admin-only — see root
`CLAUDE.md`). Understand this before editing:

- **Everything is drawn to an off-screen `<canvas>`**, not the DOM. There
  is no React re-render involved in the video itself — `renderVideo()` runs
  a `requestAnimationFrame` loop that calls each scene's `draw(ctx, t,
  localProgress)` function once per frame for the scene's duration.
- **Scenes are plain objects** with `start`, `end` (in seconds), and a
  `draw` function. `buildScenes()` computes a scene list proportional to
  `template.durationSeconds` — hook (~22%), macro product shot (~40–75%
  depending on whether a personal photo was provided), optional lifestyle
  photo scene, then a CTA end card.
- **Recording** happens via `canvas.captureStream(FPS)` piped into a
  `MediaRecorder`. The recorder starts before the draw loop begins and
  stops right after it ends — the video's actual duration is determined by
  wall-clock time during the `requestAnimationFrame` loop, not by a fixed
  frame count, so keep per-frame draw work cheap (it already is — no image
  reprocessing inside the loop, just `ctx.drawImage` with precomputed
  transforms).
- **Output format is `.webm`** (`video/webm;codecs=vp9` preferred, with
  fallbacks). See the README's "Why .webm and not .mp4?" section before
  changing this — adding real `.mp4` output means bundling ffmpeg.wasm,
  which is a meaningful bundle-size tradeoff and should be an opt-in, not
  silently swapped in.
- **This renderer's visual style is intentionally still dark/cinematic**
  — black backgrounds, gold accents, dramatic lighting — even though the
  site's UI chrome around it is now a light, Apple-inspired theme. That
  contrast is deliberate: the *studio interface* (buttons, panels) should
  match the site; the *video output itself* should look like a luxury
  product ad, which reads better dark. Don't "fix" `videoRenderer.ts`'s
  color choices to match `tailwind.config.ts`'s light tokens — they're
  serving different jobs.

**If you add a new scene type:**
- Keep `draw()` pure with respect to React state — it should only read
  from its closure arguments (`product`, `template`, loaded `Image`
  objects) that were resolved *before* `renderVideo()` started the
  recording loop. Don't reach into React state or trigger re-renders from
  inside the draw loop.
- Keep expensive work (image decoding, layout calculation) outside the
  loop. `loadImage()` is already awaited before scenes are built for
  exactly this reason.
- Respect the fade-in/fade-out pattern used in every existing scene
  (`Math.min(1, progress / X)`) so transitions stay visually consistent —
  don't hard-cut a new scene in or out.

**Testing a renderer change:** there's no automated test for this — you
must log in at `/admin/login`, run `npm run dev`, go to `/video-studio`,
generate a video, and watch the output. Check it in an actual `<video>`
element (the Studio's preview pane does this), not just by inspecting the
canvas mid-render, since `MediaRecorder` timing/encoding issues only show
up in the final file.
