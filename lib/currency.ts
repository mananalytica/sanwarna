// SANWARNA prices in Pakistani Rupees (PKR) — the storefront's only
// currency. Centralized here so every price display (product cards, PDP,
// cart, checkout, Try-On) formats the same way and a future multi-currency
// upgrade only touches this one file.

const formatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

/** Formats a PKR amount as "Rs 24,500" (no decimals — PKR isn't quoted in paisa here). */
export function formatPrice(amount: number): string {
  // Intl's PKR narrowSymbol renders as "Rs" in Node/browsers that support
  // it; fall back to a manual "Rs " prefix for environments that don't.
  try {
    const formatted = formatter.format(amount);
    return /Rs/.test(formatted) ? formatted : `Rs ${formatted.replace(/[^\d,]/g, "")}`;
  } catch {
    return `Rs ${Math.round(amount).toLocaleString("en-PK")}`;
  }
}

// Delivery is free on every order, anywhere in Pakistan. To charge for
// delivery again, set FLAT_SHIPPING_RATE and return it from shippingCostFor.
export const FLAT_SHIPPING_RATE = 0;

export function shippingCostFor(_subtotal: number): number {
  return FLAT_SHIPPING_RATE;
}
