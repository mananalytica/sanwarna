import { Pool } from "pg";

// SANWARNA's product catalog can optionally live in MotherDuck (a managed
// DuckDB-in-the-cloud service with a free tier) instead of the static
// TypeScript file in /data/products.ts. This connects over MotherDuck's
// Postgres wire-protocol endpoint using the standard `pg` driver — no
// DuckDB binary is bundled, so this works fine in a Vercel serverless
// function. See: https://motherduck.com/docs/cookbook/vercel-nextjs
//
// If MOTHERDUCK_TOKEN isn't set, the app just uses the static catalog —
// this integration is entirely optional. See .env.example.

let pool: Pool | null = null;

export function isMotherDuckConfigured(): boolean {
  return Boolean(process.env.MOTHERDUCK_TOKEN);
}

/**
 * Returns a shared connection pool, created once per server instance (warm
 * lambda / long-running server) and reused across requests. Throws if
 * MOTHERDUCK_TOKEN isn't set — callers should check isMotherDuckConfigured()
 * first, or catch the error and fall back to the static catalog.
 */
export function getMotherDuckPool(): Pool {
  const token = process.env.MOTHERDUCK_TOKEN;
  if (!token) {
    throw new Error(
      "MOTHERDUCK_TOKEN is not set. Set it in your environment to use MotherDuck as the product database — see .env.example. The app falls back to the static catalog when it isn't set."
    );
  }

  if (pool) return pool;

  pool = new Pool({
    host: process.env.MOTHERDUCK_HOST || "pg.us-east-1-aws.motherduck.com",
    port: 5432,
    user: "postgres",
    password: token,
    database: process.env.MOTHERDUCK_DATABASE || "sanwarna",
    ssl: { rejectUnauthorized: true },
    max: 10,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    query_timeout: 15_000,
  });

  pool.on("error", (err) => {
    // A background/idle client error shouldn't crash the server — log and
    // let the next query attempt (which will fall back to the static
    // catalog on failure) handle it.
    console.error("MotherDuck pool error:", err);
  });

  // On Vercel, this lets the platform drain idle connections cleanly when a
  // Fluid Compute instance is about to be suspended, instead of leaking
  // connections. It's a no-op (safe to skip) outside of Vercel — wrapped in
  // a dynamic import + try/catch so this file doesn't hard-require the
  // `@vercel/functions` package in non-Vercel environments.
  import("@vercel/functions")
    .then(({ attachDatabasePool }) => attachDatabasePool(pool!))
    .catch(() => {
      /* not running on Vercel, or package unavailable — safe to ignore */
    });

  return pool;
}
