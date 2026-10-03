"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { formatPrice, shippingCostFor } from "@/lib/currency";
import { WhatsAppLink } from "@/components/WhatsApp";

export default function CartPage() {
  const { lines, removeLine, setQuantity, subtotal } = useCart();
  const products = useProducts();
  const shipping = shippingCostFor(subtotal);

  // The order as a WhatsApp message, so a shopper can send it in one tap.
  const orderMessage = [
    "Assalam o Alaikum, I'd like to place this order:",
    ...lines.flatMap((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return [];
      const variant = product.variants.find((v) => v.id === line.variantId);
      const price = (product.price + (variant?.priceModifier ?? 0)) * line.quantity;
      return [`${line.quantity} x ${product.name}${variant ? ` (${variant.label})` : ""} - ${formatPrice(price)}`];
    }),
    `Total: ${formatPrice(subtotal + shipping)} (free delivery)`,
    "",
    "Name:",
    "Delivery address:",
  ].join("\n");

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-graphite">Your bag is empty</h1>
        <p className="mt-3 text-graphite/55">
          Find the piece that finishes your look.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-champagne px-7 py-3 text-sm font-medium text-graphite hover:bg-champagne-light"
        >
          Browse the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-3xl text-graphite">Your Bag</h1>

      <div className="mt-10 grid gap-12 md:grid-cols-[1.6fr_1fr]">
        <ul className="divide-y divide-champagne/10">
          {lines.map((line) => {
            const product = products.find((p) => p.id === line.productId);
            if (!product) return null;
            const variant = product.variants.find((v) => v.id === line.variantId);
            const price = product.price + (variant?.priceModifier ?? 0);
            return (
              <li key={`${line.productId}-${line.variantId}`} className="flex gap-5 py-6">
                <div className="h-24 w-24 shrink-0 rounded-xl border border-hairline bg-cloud p-3">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link href={`/shop/${product.slug}`} className="font-display text-lg text-graphite hover:text-champagne">
                        {product.name}
                      </Link>
                      {variant && <p className="text-sm text-graphite/50">{variant.label}</p>}
                    </div>
                    <p className="text-champagne">{formatPrice(price * line.quantity)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded border border-champagne/25">
                      <button
                        className="px-3 py-1.5 text-graphite/70 hover:text-champagne"
                        onClick={() => setQuantity(line.productId, line.variantId, line.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-graphite">{line.quantity}</span>
                      <button
                        className="px-3 py-1.5 text-graphite/70 hover:text-champagne"
                        onClick={() => setQuantity(line.productId, line.variantId, line.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeLine(line.productId, line.variantId)}
                      className="text-sm text-graphite/40 hover:text-rust"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="h-fit rounded-xl border border-champagne/20 bg-mist p-6">
          <h2 className="font-display text-xl text-graphite">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-graphite/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-graphite/70">
              <span>Delivery</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="hairline-solid my-3" />
            <div className="flex justify-between text-base text-champagne">
              <span>Total</span>
              <span>{formatPrice(subtotal + shipping)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-full bg-champagne py-3 text-center text-sm font-medium text-graphite hover:bg-champagne-light"
          >
            Proceed to Checkout
          </Link>
          <WhatsAppLink message={orderMessage} className="mt-3 w-full">
            Order on WhatsApp
          </WhatsAppLink>
          <p className="mt-3 text-center text-xs text-graphite/40">
            Free delivery across Pakistan. Cash on Delivery available.
          </p>
        </div>
      </div>
    </div>
  );
}
