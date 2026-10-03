// Seeds (or re-seeds) the MotherDuck `products` table from the static
// catalog in data/products.ts. Run with:
//
//   npm run db:seed
//
// Requires MOTHERDUCK_TOKEN (and optionally MOTHERDUCK_HOST /
// MOTHERDUCK_DATABASE) to be set in the environment — see .env.example.
// This is entirely optional: the site works fine without ever running
// this script, using the static catalog instead (see lib/getProducts.ts).
//
// Re-running this script is safe — it drops and recreates the table each
// time, so it's meant for "reset the DB to match the static catalog"
// during setup, not for preserving hand-edited rows made directly in
// MotherDuck. If you've started editing products via SQL in MotherDuck
// directly, don't re-run this without exporting your changes first.

import { Pool } from "pg";
import { PRODUCTS } from "../data/products";

const SCHEMA = (process.env.MOTHERDUCK_SCHEMA || "sanwarna").replace(/[^A-Za-z0-9_]/g, "");

async function main() {
  const token = process.env.MOTHERDUCK_TOKEN;
  if (!token) {
    console.error(
      "MOTHERDUCK_TOKEN is not set. Set it in your environment (see .env.example) before running `npm run db:seed`."
    );
    process.exit(1);
  }

  const pool = new Pool({
    host: process.env.MOTHERDUCK_HOST || "pg.us-east-1-aws.motherduck.com",
    port: 5432,
    user: "postgres",
    password: token,
    database: process.env.MOTHERDUCK_DATABASE || "sanwarna",
    ssl: { rejectUnauthorized: true },
  });

  try {
    console.log("Connecting to MotherDuck…");
    const client = await pool.connect();

    try {
      console.log("Creating `products` table if it doesn't exist…");
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA}`);
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${SCHEMA}.products (
          id VARCHAR PRIMARY KEY,
          slug VARCHAR UNIQUE NOT NULL,
          sort_order INTEGER NOT NULL,
          data VARCHAR NOT NULL
        )
      `);

      console.log(`Seeding ${PRODUCTS.length} products…`);
      await client.query("BEGIN");
      await client.query(`DELETE FROM ${SCHEMA}.products`);
      for (let i = 0; i < PRODUCTS.length; i++) {
        const product = PRODUCTS[i];
        await client.query(
          `INSERT INTO ${SCHEMA}.products (id, slug, sort_order, data) VALUES ($1, $2, $3, $4)`,
          [product.id, product.slug, i, JSON.stringify(product)]
        );
      }
      await client.query("COMMIT");

      console.log(`Done — ${PRODUCTS.length} products seeded into MotherDuck.`);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
