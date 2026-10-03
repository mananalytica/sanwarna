import { cache } from "react";
import { Product } from "@/types";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import { imageUrl } from "./cloudinary";
import { DB_SCHEMA, getMotherDuckPool, isMotherDuckConfigured } from "./motherduck";

// This is the ONE place the app should fetch product data from. Server
// Components and Route Handlers import from here (and `await` the result);
// client components get products handed down via ProductsContext instead
// (see context/ProductsContext.tsx) rather than calling this directly,
// since MotherDuck can only be queried server-side.
//
// Data source priority:
//   1. MotherDuck, if MOTHERDUCK_TOKEN is set and the query succeeds.
//   2. The static catalog in /data/products.ts, otherwise.
// This means the app always works, even with zero configuration, and a
// misconfigured or unreachable database degrades gracefully instead of
// taking the site down.

async function queryProductsFromMotherDuck(): Promise<Product[] | null> {
  if (!isMotherDuckConfigured()) return null;

  try {
    const pool = getMotherDuckPool();
    const { rows } = await pool.query<{ data: string }>(
      `SELECT data FROM ${DB_SCHEMA}.products ORDER BY sort_order ASC`
    );
    if (rows.length === 0) return null;
    return rows.map((row) => JSON.parse(row.data) as Product);
  } catch (err) {
    console.error(
      "MotherDuck product query failed — falling back to the static catalog:",
      err
    );
    return null;
  }
}

// React's `cache()` de-dupes this within a single request/render pass (so
// multiple components on the same page don't each trigger their own
// database round trip), without persisting stale data across requests the
// way a module-level variable would.
export const getAllProducts = cache(async (): Promise<Product[]> => {
  const dbProducts = await queryProductsFromMotherDuck();
  const products = dbProducts ?? STATIC_PRODUCTS;
  // Point product photos at Cloudinary when it's configured (lib/cloudinary.ts).
  return products.map((p) => ({
    ...p,
    images: p.images.map(imageUrl),
    heroImages: p.heroImages?.map(imageUrl),
  }));
});

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.featured);
}

export async function getBestSellers(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.bestSeller);
}

export async function getNewArrivals(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.newArrival);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getAllProducts();
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}
