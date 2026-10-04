import Link from "next/link";
import ClearCartOnce from "@/components/ClearCartOnce";
import OrderSummary from "@/components/OrderSummary";

export const metadata = { title: "Your order" };

const COPY = {
  cod: {
    title: "Thank you. Your order is placed.",
    body: "You pay in cash when your cufflinks arrive. Delivery is free.",
  },
  paid: {
    title: "Thank you. Your payment is received.",
    body: "JazzCash confirmed your payment. Delivery is free.",
  },
  failed: {
    title: "Payment didn't go through",
    body: "JazzCash did not complete the payment and you have not been charged by us. Your bag is still saved, so you can try again or choose Cash on Delivery.",
  },
} as const;

export default function ResultPage({ searchParams }: { searchParams: { status?: string; ref?: string } }) {
  const status = (searchParams.status ?? "") in COPY ? (searchParams.status as keyof typeof COPY) : "failed";
  const ok = status !== "failed";
  const ref = (searchParams.ref ?? "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 24);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-16 text-center md:py-20">
      {ok && <ClearCartOnce />}
      <h1 className="font-display text-3xl text-graphite">{COPY[status].title}</h1>
      <p className="mt-3 max-w-md text-balance text-steel">{COPY[status].body}</p>
      {ref && (
        <p className="mt-6 rounded-xl border border-hairline bg-cloud px-5 py-3 text-sm text-graphite">
          Order reference <span className="font-semibold">{ref}</span>
        </p>
      )}
      {ok && ref && <OrderSummary orderRef={ref} />}
      {ok && (
        <ol className="mt-10 w-full max-w-md space-y-4 text-left text-sm text-graphite/75">
          <li className="flex gap-3"><span className="font-medium text-graphite">1.</span>We call or WhatsApp you to confirm the order and give you the expected delivery date.</li>
          <li className="flex gap-3"><span className="font-medium text-graphite">2.</span>We pack your pair in its velvet box and hand it to the courier.</li>
          <li className="flex gap-3"><span className="font-medium text-graphite">3.</span>It arrives at your door. Delivery is free.</li>
        </ol>
      )}
      <Link
        href={ok ? "/shop" : "/checkout"}
        className="mt-8 rounded-full bg-graphite px-7 py-3 text-sm font-medium text-paper hover:bg-champagne"
      >
        {ok ? "Continue shopping" : "Back to checkout"}
      </Link>
    </div>
  );
}
