import { Product } from "@/types";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import { DB_SCHEMA, getMotherDuckPool, isMotherDuckConfigured } from "./motherduck";

// Reading and writing products for the admin pages (app/admin/products).
// The shop itself reads through lib/getProducts.ts.
//
// Until the first edit, the products table is empty and the site shows the
// catalogue from data/products.ts. The first save copies that catalogue
// into the table, so editing one product never makes the others vanish.

const T = `${DB_SCHEMA}.products`;

export const canEditProducts = isMotherDuckConfigured;

type Row = { id: string; sort_order: number; data: string };

async function rows(): Promise<Row[]> {
  const { rows } = await getMotherDuckPool().query<Row>(
    `SELECT id, sort_order, data FROM ${T} ORDER BY sort_order ASC`
  );
  return rows;
}

/** Products exactly as stored (no image URL rewriting), for the admin. */
export async function listProductsForAdmin(): Promise<Product[]> {
  if (!isMotherDuckConfigured()) return STATIC_PRODUCTS;
  const r = await rows();
  return r.length ? r.map((x) => JSON.parse(x.data) as Product) : STATIC_PRODUCTS;
}

async function seedIfEmpty() {
  const pool = getMotherDuckPool();
  const { rows: c } = await pool.query<{ n: number }>(`SELECT count(*) AS n FROM ${T}`);
  if (Number(c[0].n) > 0) return;
  for (let i = 0; i < STATIC_PRODUCTS.length; i++) {
    const p = STATIC_PRODUCTS[i];
    await pool.query(`INSERT INTO ${T} (id, slug, sort_order, data) VALUES ($1,$2,$3,$4)`, [
      p.id,
      p.slug,
      (i + 1) * 10,
      JSON.stringify(p),
    ]);
  }
}

/** Adds a product, or replaces the one with the same id. New ones go first. */
export async function saveProduct(product: Product): Promise<void> {
  await seedIfEmpty();
  const pool = getMotherDuckPool();
  const all = await rows();
  const existing = all.find((r) => r.id === product.id);
  const clash = all.find((r) => r.id !== product.id && (JSON.parse(r.data) as Product).slug === product.slug);
  if (clash) throw new Error(`Another product already uses the web address "${product.slug}".`);
  const order = existing ? existing.sort_order : Math.min(0, ...all.map((r) => r.sort_order)) - 10;
  if (existing) await pool.query(`DELETE FROM ${T} WHERE id = $1`, [product.id]);
  await pool.query(`INSERT INTO ${T} (id, slug, sort_order, data) VALUES ($1,$2,$3,$4)`, [
    product.id,
    product.slug,
    order,
    JSON.stringify(product),
  ]);
}

export async function deleteProduct(id: string): Promise<void> {
  await seedIfEmpty();
  await getMotherDuckPool().query(`DELETE FROM ${T} WHERE id = $1`, [id]);
}
