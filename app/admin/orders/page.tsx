import { listOrders, OrderRow } from "@/lib/orders";
import { formatPrice } from "@/lib/currency";

// Admin-only (see middleware.ts). Always shows the latest orders.
export const dynamic = "force-dynamic";
export const metadata = { title: "Orders", robots: { index: false } };

const STATUS: Record<OrderRow["status"], string> = {
  "cod-pending": "Cash on Delivery, to collect",
  "awaiting-payment": "JazzCash, not paid yet",
  paid: "JazzCash, paid",
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
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-mist text-steel">
              <tr>
                {["Order", "Customer", "Deliver to", "Items", "Total", "Payment"].map((h) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
