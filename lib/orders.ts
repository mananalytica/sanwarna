import { CartLine } from "@/types";
import { getAllProducts } from "./getProducts";
import { shippingCostFor } from "./currency";
import { DB_SCHEMA, getMotherDuckPool, isMotherDuckConfigured } from "./motherduck";

export type Customer = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
};

export type Order = {
  ref: string;
  placedAt: string;
  payment: "cod" | "jazzcash";
  status: "cod-pending" | "awaiting-payment" | "paid" | "payment-failed";
  customer: Customer;
  items: { name: string; variant: string; quantity: number; unitPrice: number }[];
  total: number; // PKR
};

const REQUIRED: (keyof Customer)[] = ["email", "phone", "firstName", "lastName", "address", "city", "province"];

/**
 * Builds an order from what the browser sent. Prices are always looked up
 * again here on the server — the browser's totals are never trusted.
 */
export async function buildOrder(
  body: { lines?: CartLine[]; customer?: Partial<Customer> },
  payment: Order["payment"]
): Promise<Order | { error: string }> {
  const customer = body.customer ?? {};
  for (const f of REQUIRED) {
    if (!customer[f] || String(customer[f]).trim() === "") return { error: `Please fill in ${f}.` };
  }
  const products = await getAllProducts();
  const items: Order["items"] = [];
  for (const line of body.lines ?? []) {
    const product = products.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    const quantity = Math.floor(Number(line.quantity));
    if (!product || !variant || !(quantity > 0 && quantity <= 20)) continue;
    if (!variant.inStock) return { error: `${product.name} (${variant.label}) is out of stock.` };
    items.push({ name: product.name, variant: variant.label, quantity, unitPrice: product.price + (variant.priceModifier ?? 0) });
  }
  if (items.length === 0) return { error: "Your bag is empty." };
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  // e.g. SNW261003064512K7Q — 18 characters, inside for JazzCash's 20-char limit
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:T]/g, "").slice(2, 14);
  const ref = `SNW${stamp}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  return {
    ref,
    placedAt: now.toISOString(),
    payment,
    status: payment === "cod" ? "cod-pending" : "awaiting-payment",
    customer: customer as Customer,
    items,
    total: subtotal + shippingCostFor(subtotal),
  };
}

const ORDERS_TABLE = `
  CREATE TABLE IF NOT EXISTS ${DB_SCHEMA}.orders (
    ref VARCHAR PRIMARY KEY,
    placed_at VARCHAR NOT NULL,   -- ISO time, UTC
    payment VARCHAR NOT NULL,     -- cod | jazzcash
    status VARCHAR NOT NULL,      -- cod-pending | awaiting-payment | paid | payment-failed
    total INTEGER NOT NULL,       -- PKR
    customer_name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    data VARCHAR NOT NULL         -- the whole Order as JSON
  )`;

let tableReady: Promise<unknown> | null = null;
function ordersDb() {
  const pool = getMotherDuckPool();
  // Create the table the first time this server instance touches orders.
  tableReady ??= pool
    .query(`CREATE SCHEMA IF NOT EXISTS ${DB_SCHEMA}`)
    .then(() => pool.query(ORDERS_TABLE))
    .catch((err) => {
    tableReady = null;
    throw err;
  });
  return tableReady.then(() => pool);
}

async function webhook(event: object) {
  const url = process.env.ORDER_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(event) });
  } catch (err) {
    console.error("[order] webhook failed", err);
  }
}

/**
 * Saves a new order to the MotherDuck `orders` table (see /admin/orders).
 * Returns false if a database is configured but the save failed, so the
 * caller can tell the shopper instead of silently losing the order.
 * Also writes it to the server log and, if ORDER_WEBHOOK_URL is set,
 * POSTs it there as JSON.
 */
export async function saveOrder(order: Order): Promise<boolean> {
  console.log("[order]", JSON.stringify(order));
  let saved = true;
  if (isMotherDuckConfigured()) {
    try {
      const db = await ordersDb();
      await db.query(
        `INSERT INTO ${DB_SCHEMA}.orders (ref, placed_at, payment, status, total, customer_name, phone, city, data) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          order.ref,
          order.placedAt,
          order.payment,
          order.status,
          order.total,
          `${order.customer.firstName} ${order.customer.lastName}`,
          order.customer.phone,
          order.customer.city,
          JSON.stringify(order),
        ]
      );
    } catch (err) {
      console.error("[order] could not save to MotherDuck", err);
      saved = false;
    }
  }
  await webhook(order);
  return saved;
}

/** Records a JazzCash result against an order. */
export async function setOrderStatus(ref: string, status: Order["status"]) {
  console.log("[order]", JSON.stringify({ ref, status }));
  if (isMotherDuckConfigured()) {
    try {
      const db = await ordersDb();
      await db.query(`UPDATE ${DB_SCHEMA}.orders SET status = $1 WHERE ref = $2`, [status, ref]);
    } catch (err) {
      console.error("[order] could not update status in MotherDuck", err);
    }
  }
  await webhook({ ref, status });
}

/** The saved total for an order, in PKR — null if unknown. */
export async function getOrderTotal(ref: string): Promise<number | null> {
  if (!isMotherDuckConfigured()) return null;
  try {
    const db = await ordersDb();
    const { rows } = await db.query<{ total: number }>(`SELECT total FROM ${DB_SCHEMA}.orders WHERE ref = $1`, [ref]);
    return rows[0] ? Number(rows[0].total) : null;
  } catch {
    return null;
  }
}

export type OrderRow = Order & { status: Order["status"] };

/** Newest orders first, for the admin page. */
export async function listOrders(limit = 200): Promise<OrderRow[] | null> {
  if (!isMotherDuckConfigured()) return null;
  const db = await ordersDb();
  const { rows } = await db.query<{ status: Order["status"]; data: string }>(
    `SELECT status, data FROM ${DB_SCHEMA}.orders ORDER BY placed_at DESC LIMIT ${Math.floor(limit)}`
  );
  return rows.map((r) => ({ ...(JSON.parse(r.data) as Order), status: r.status }));
}
