import { FULFILMENT, listOrders, OrderRow } from "@/lib/orders";
import { updateOrderAction } from "../actions";
import { formatPrice } from "@/lib/currency";

// Admin-only (see middleware.ts). Always shows the latest orders.
export const dynamic = "force-dynamic";

const STATUS: Record<OrderRow["status"], string> = {
  "cod-pending": "Cash on Delivery, not collected",
  "awaiting-payment": "JazzCash, not paid yet",
  paid: "Paid",
  "payment-failed": "JazzCash, payment failed",
};

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" });

export default async function OrdersPage() {
  let orders: OrderRow[] | null = null;
  let failed = false;
  try {
    orders = await listOrders();
  } catch (err) {
    console.error("[orders] could not load", err);
    failed = true;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <h1 className="font-display text-3xl text-graphite">Orders</h1>

      {failed ? (
        <p className="mt-6 text-rust">The orders could not be loaded from MotherDuck. Check MOTHERDUCK_TOKEN and try again.</p>
      ) : orders === null ? (
        <p className="mt-6 text-steel">
          No database is connected. Set MOTHERDUCK_TOKEN in the site&apos;s environment variables to save and list orders here.
        </p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-steel">No orders yet. New orders appear here as soon as they are placed.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-mist text-steel">
              <tr>
                {["Order", "Customer", "Deliver to", "Items", "Total", "Payment", "Order status"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.ref} className="border-t border-hairline align-top text-graphite">
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.ref}</div>
                    <div className="text-xs text-steel">{when(o.placedAt)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      {o.customer.firstName} {o.customer.lastName}
                    </div>
                    <div className="text-xs text-steel">{o.customer.phone}</div>
                    <div className="text-xs text-steel">{o.customer.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{o.customer.address}</div>
                    <div className="text-xs text-steel">
                      {[o.customer.city, o.customer.province, o.customer.postalCode].filter(Boolean).join(", ")}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {o.items.map((i) => (
                      <div key={i.name + i.variant}>
                        {i.quantity} × {i.name} <span className="text-xs text-steel">({i.variant})</span>
                      </div>
                    ))}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">{STATUS[o.status] ?? o.status}</td>
                  <td className="px-4 py-3">
                    <form action={updateOrderAction} className="flex flex-col gap-2">
                      <input type="hidden" name="ref" value={o.ref} />
                      <select name="fulfilment" defaultValue={o.fulfilment} aria-label={`Status of order ${o.ref}`} className="input-field !py-1.5">
                        {FULFILMENT.map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                      {o.payment === "cod" && <input type="hidden" name="is_cod" value="1" />}
                      {o.payment === "cod" && (
                        <label className="flex items-center gap-2 text-xs text-steel">
                          <input type="checkbox" name="paid" value="yes" defaultChecked={o.status === "paid"} className="accent-champagne" />
                          Cash collected
                        </label>
                      )}
                      <button type="submit" className="rounded-full border border-graphite/25 px-3 py-1 text-xs hover:border-graphite">
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
