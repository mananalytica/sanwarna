import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/getProducts";
import ShopClient from "@/components/ShopClient";

export const metadata: Metadata = {
  title: "Shop All Cufflinks & Tie Pens",
  description:
    "Browse SANWARNA's full collection of hand-finished cufflinks, tie pens, tie clips, and gift sets.",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-wider2 text-champagne/70">The Collection</p>
        <h1 className="mt-3 font-display text-4xl text-graphite">Shop All</h1>
      </div>
      <Suspense fallback={<div className="py-24 text-center text-graphite/50">Loading collection…</div>}>
        <ShopClient products={products} />
      </Suspense>
    </div>
  );
}
