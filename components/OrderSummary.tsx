"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/currency";
import type { Order } from "@/lib/orders";

/**
 * Shows what was just ordered on the thank-you page. The order is the
 * server's own record, saved in this browser tab by the checkout page, so
 * nobody else can look it up by guessing a reference number.
 */
export default function OrderSummary({ orderRef }: { orderRef: string }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.sessionStorage.getItem("sanwarna-last-order") ?? "null") as Order | null;
      if (saved && saved.ref === orderRef) setOrder(saved);
    } catch {
      /* nothing saved */
    }
  }, [orderRef]);

  if (!order) return null;
  const c = order.customer;

  return (
    <div className="mt-8 w-full rounded-xl border border-hairline bg-cloud p-6 text-left">
      <h2 className="font-display text-xl text-graphite">Your order</h2>
      <ul className="mt-4 divide-y divide-hairline text-sm">
        {order.items.map((i) => (
          <li key={i.name + i.variant} className="flex items-start justify-between gap-4 py-3">
            <span className="text-graphite">
              {i.quantity} × {i.name}
              <span className="block text-xs text-steel">{i.variant}</span>
            </span>
            <span className="whitespace-nowrap text-graphite">{formatPrice(i.unitPrice * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-2 space-y-2 border-t border-hairline pt-4 text-sm">
        <div className="flex justify-between text-steel">
          <dt>Delivery</dt>
          <dd>Free</dd>
        </div>
        <div className="flex justify-between text-base font-medium text-graphite">
          <dt>Total</dt>
          <dd>{formatPrice(order.total)}</dd>
        </div>
        <div className="flex justify-between text-steel">
          <dt>Payment</dt>
          <dd>{order.payment === "cod" ? "Cash on Delivery" : "JazzCash"}</dd>
        </div>
      </dl>
      <div className="mt-5 border-t border-hairline pt-4 text-sm">
        <p className="font-medium text-graphite">Delivering to</p>
        <p className="mt-1 leading-relaxed text-steel">
          {c.firstName} {c.lastName}
          <br />
          {c.address}
          <br />
          {[c.city, c.province, c.postalCode].filter(Boolean).join(", ")}
          <br />
          {c.phone}
        </p>
      </div>
    </div>
  );
}
