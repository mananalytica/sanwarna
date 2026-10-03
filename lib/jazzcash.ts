import { createHmac, timingSafeEqual } from "node:crypto";
import { Order } from "./orders";
import { SITE_URL } from "./site";

// JazzCash "Page Redirection" (hosted checkout), API v1.1.
// The shopper is sent to JazzCash's own page to pay with their mobile
// wallet or card, then JazzCash posts the result back to our return URL.
// Credentials come from the JazzCash merchant portal — see .env.example.

const ENDPOINTS = {
  sandbox: "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/",
  live: "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/",
};

function config() {
  const merchantId = process.env.JAZZCASH_MERCHANT_ID;
  const password = process.env.JAZZCASH_PASSWORD;
  const salt = process.env.JAZZCASH_INTEGRITY_SALT;
  if (!merchantId || !password || !salt) return null;
  const live = process.env.JAZZCASH_ENV === "live";
  return { merchantId, password, salt, endpoint: live ? ENDPOINTS.live : ENDPOINTS.sandbox };
}

export const isJazzCashConfigured = () => config() !== null;

/** HMAC-SHA256 over salt + every non-empty pp_/ppmpf_ value, in key order. */
function secureHash(fields: Record<string, string>, salt: string): string {
  const values = Object.keys(fields)
    .filter((k) => k !== "pp_SecureHash" && /^pp/i.test(k) && fields[k] !== "")
    .sort()
    .map((k) => fields[k]);
  return createHmac("sha256", salt).update([salt, ...values].join("&")).digest("hex").toUpperCase();
}

/** yyyyMMddHHmmss in Pakistan time, which is what JazzCash expects. */
function pkTime(d: Date): string {
  return new Date(d.getTime() + 5 * 3600_000).toISOString().replace(/[-:T]/g, "").slice(0, 14);
}

const clip = (s: string, n = 255) => s.replace(/[<>*=%\/:'"|{}]/g, " ").slice(0, n);

export function jazzCashRequest(order: Order): { action: string; fields: Record<string, string> } | null {
  const c = config();
  if (!c) return null;
  const now = new Date();
  const { customer } = order;
  const fields: Record<string, string> = {
    pp_Version: "1.1",
    pp_TxnType: "", // blank lets the shopper choose wallet or card on JazzCash's page
    pp_Language: "EN",
    pp_MerchantID: c.merchantId,
    pp_SubMerchantID: "",
    pp_Password: c.password,
    pp_BankID: "",
    pp_ProductID: "",
    pp_TxnRefNo: order.ref,
    pp_Amount: String(Math.round(order.total * 100)), // in paisa
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: pkTime(now),
    pp_BillReference: order.ref,
    pp_Description: clip(order.items.map((i) => `${i.quantity}x ${i.name}`).join(", "), 200),
    pp_TxnExpiryDateTime: pkTime(new Date(now.getTime() + 60 * 60_000)),
    pp_ReturnURL: `${SITE_URL}/api/checkout/jazzcash/return`,
    // Custom fields: these show up beside the payment in the JazzCash portal.
    ppmpf_1: clip(`${customer.firstName} ${customer.lastName}`),
    ppmpf_2: clip(customer.phone),
    ppmpf_3: clip(customer.email),
    ppmpf_4: clip(customer.address),
    ppmpf_5: clip(`${customer.city} ${customer.province} ${customer.postalCode ?? ""}`.trim()),
  };
  fields.pp_SecureHash = secureHash(fields, c.salt);
  return { action: c.endpoint, fields };
}

/** Checks that a response really came from JazzCash, and whether it was paid. */
export function verifyJazzCashResponse(fields: Record<string, string>): { genuine: boolean; paid: boolean } {
  const c = config();
  const given = (fields.pp_SecureHash ?? "").toUpperCase();
  if (!c || !given) return { genuine: false, paid: false };
  const expected = secureHash(fields, c.salt);
  const genuine = expected.length === given.length && timingSafeEqual(Buffer.from(expected), Buffer.from(given));
  return { genuine, paid: genuine && fields.pp_ResponseCode === "000" };
}
