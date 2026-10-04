"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { formatPrice, shippingCostFor } from "@/lib/currency";

export default function CheckoutPage() {
  const { lines, subtotal } = useCart();
  const products = useProducts();
  const router = useRouter();
  const [payment, setPayment] = useState<"cod" | "jazzcash">("cod");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shipping = shippingCostFor(subtotal);

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-graphite">Nothing to check out yet</h1>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-champagne px-7 py-3 text-sm font-medium text-graphite hover:bg-champagne-light"
        >
          Browse the Collection
        </Link>
      </div>
    );
  }

  async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const customer = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch(`/api/checkout/${payment}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, customer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "The order could not be placed. Please try again.");

      if (payment === "cod") {
        router.push(`/checkout/result?status=cod&ref=${data.ref}`);
        return;
      }
      // JazzCash: hand the shopper over to JazzCash's own payment page.
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.action;
      for (const [name, value] of Object.entries(data.fields as Record<string, string>)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The order could not be placed. Please try again.");
      setBusy(false);
    }
  }

  const option = (value: "cod" | "jazzcash") =>
    `flex cursor-pointer items-start gap-3 rounded-xl border bg-cloud px-4 py-3 text-sm text-graphite ${
      payment === value ? "border-champagne" : "border-hairline"
    }`;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-3xl text-graphite">Checkout</h1>
      <p className="mt-2 text-sm text-steel">Free delivery across Pakistan.</p>

      <form onSubmit={placeOrder} className="mt-10 grid gap-12 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          <fieldset>
            <legend className="font-display text-xl text-graphite">Contact</legend>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input required name="email" type="email" autoComplete="email" placeholder="Email address" aria-label="Email address" className="input-field" />
              <input required name="phone" type="tel" autoComplete="tel" placeholder="Mobile number, e.g. 03001234567" aria-label="Mobile number" className="input-field" />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl text-graphite">Delivery address</legend>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input required name="firstName" autoComplete="given-name" placeholder="First name" aria-label="First name" className="input-field" />
                <input required name="lastName" autoComplete="family-name" placeholder="Last name" aria-label="Last name" className="input-field" />
              </div>
              <input required name="address" autoComplete="street-address" placeholder="House, street, area" aria-label="Address" className="input-field" />
              <div className="grid gap-4 md:grid-cols-3">
                <input required name="city" autoComplete="address-level2" placeholder="City" aria-label="City" className="input-field" />
                <input required name="province" autoComplete="address-level1" placeholder="Province" aria-label="Province" className="input-field" />
                <input name="postalCode" autoComplete="postal-code" placeholder="Postal code (optional)" aria-label="Postal code (optional)" className="input-field" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl text-graphite">Payment</legend>
            <div className="mt-4 space-y-3">
              <label className={option("cod")}>
                <input type="radio" name="payment" checked={payment === "cod"} onChange={() => setPayment("cod")} className="mt-0.5 accent-champagne" />
                <span>
                  Cash on Delivery
                  <span className="block text-xs text-steel">Pay the courier in cash when your order arrives.</span>
                </span>
              </label>
              <label className={option("jazzcash")}>
                <input type="radio" name="payment" checked={payment === "jazzcash"} onChange={() => setPayment("jazzcash")} className="mt-0.5 accent-champagne" />
                <span>
                  JazzCash
                  <span className="block text-xs text-steel">
                    Pay now with your JazzCash mobile wallet or a debit/credit card. You finish the payment on JazzCash&apos;s secure page.
                  </span>
                </span>
              </label>
            </div>
            <p className="mt-4 text-sm text-steel">
              We confirm every order by call or WhatsApp before it ships, and tell you the expected delivery date.
            </p>
          </fieldset>
        </div>

        <div className="h-fit rounded-xl border border-champagne/20 bg-mist p-6">
          <h2 className="font-display text-xl text-graphite">Order Summary</h2>
          <ul className="mt-5 space-y-3 text-sm text-graphite/70">
            {lines.map((line) => {
              const product = products.find((p) => p.id === line.productId);
              if (!product) return null;
              const variant = product.variants.find((v) => v.id === line.variantId);
              const price = product.price + (variant?.priceModifier ?? 0);
              return (
                <li key={`${line.productId}-${line.variantId}`} className="flex justify-between">
                  <span>
                    {product.name} × {line.quantity}
                  </span>
                  <span>{formatPrice(price * line.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <div className="hairline-solid my-4" />
          <div className="space-y-2 text-sm text-graphite/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
          </div>
          <div className="hairline-solid my-4" />
          <div className="flex justify-between text-base text-champagne">
            <span>Total</span>
            <span>{formatPrice(subtotal + shipping)}</span>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-full bg-champagne py-3 text-sm font-medium text-graphite hover:bg-champagne-light disabled:opacity-60"
          >
            {busy ? "Placing your order…" : payment === "jazzcash" ? "Pay with JazzCash" : "Place order"}
          </button>
          {error && (
            <p role="alert" className="mt-3 text-sm text-rust">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
