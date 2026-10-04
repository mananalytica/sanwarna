import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/getProducts";
import ShopClient from "@/components/ShopClient";

export const metadata: Metadata = {
  title: "Shop the Collection",
  description:
    "Browse the SANWARNA collection. Crystal cufflinks in four colours, boxed and ready to gift. Free delivery across Pakistan, Cash on Delivery.",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <div className="mb-10">
        <h1 className="font-display text-4xl text-graphite">The Crystal Collection</h1>
        <p className="mt-3 max-w-md text-steel">One bold setting in several colours. Each pair arrives in a velvet box.</p>
      </div>
      <Suspense fallback={<div className="py-24 text-center text-graphite/50">Loading collection…</div>}>
        <ShopClient products={products} />
      </Suspense>
    </div>
  );
}
