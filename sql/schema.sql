-- SANWARNA tables, in the `sanwarna` database (its default `main` schema).
-- Run once in the MotherDuck SQL editor. Safe to run again.

-- Optional catalogue. While this table is empty the site uses the
-- catalogue in data/products.ts; `npm run db:seed` fills it from that file.
CREATE TABLE IF NOT EXISTS sanwarna.main.products (
  id VARCHAR PRIMARY KEY,
  slug VARCHAR UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL,
  data VARCHAR NOT NULL          -- the whole product as JSON
);

-- Orders placed at checkout.
CREATE TABLE IF NOT EXISTS sanwarna.main.orders (
  ref VARCHAR PRIMARY KEY,
  placed_at VARCHAR NOT NULL,    -- ISO time, UTC
  payment VARCHAR NOT NULL,      -- cod | jazzcash
  status VARCHAR NOT NULL,       -- cod-pending | awaiting-payment | paid | payment-failed
  total INTEGER NOT NULL,        -- PKR
  customer_name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  data VARCHAR NOT NULL          -- the whole order as JSON
);
