-- Product catalog schema for the optional MotherDuck backend.
--
-- SANWARNA works with zero database configuration (see lib/getProducts.ts —
-- it falls back to the static catalog in data/products.ts). This schema is
-- only needed if you want the catalog to live in MotherDuck instead, so it
-- can be edited without a redeploy.
--
-- The whole Product object is stored as a single JSON-serialized column
-- (`data`) rather than being fully normalized into columns. That's a
-- deliberate choice: the Product shape (variants, tags, materials, etc.)
-- is nested and still evolving, and this way `types/index.ts` stays the
-- single source of truth for its shape — a schema migration isn't needed
-- every time a field is added to Product.
--
-- Run this once against your MotherDuck database before seeding (the seed
-- script also runs this automatically, so you usually don't need to run it
-- by hand — it's here for reference and for manual setup via the
-- MotherDuck UI's SQL editor).

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR PRIMARY KEY,
  slug VARCHAR UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL,
  data VARCHAR NOT NULL -- JSON-serialized Product object (see types/index.ts)
);

-- Orders placed at checkout (lib/orders.ts). The site creates this table
-- itself on the first order, so you don't need to run it by hand.
CREATE TABLE IF NOT EXISTS orders (
  ref VARCHAR PRIMARY KEY,
  placed_at VARCHAR NOT NULL,   -- ISO time, UTC
  payment VARCHAR NOT NULL,     -- cod | jazzcash
  status VARCHAR NOT NULL,      -- cod-pending | awaiting-payment | paid | payment-failed
  total INTEGER NOT NULL,       -- PKR
  customer_name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  data VARCHAR NOT NULL         -- the whole order as JSON
);
