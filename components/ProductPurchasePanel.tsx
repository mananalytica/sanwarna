"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { WhatsAppLink } from "./WhatsApp";
import { SITE_URL } from "@/lib/site";
import { formatPrice } from "@/lib/currency";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(
    product.variants.find((v) => v.inStock)?.id ?? product.variants[0].id
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();

  const variant = product.variants.find((v) => v.id === variantId);
  const price = product.price + (variant?.priceModifier ?? 0);
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  function handleAdd() {
    addToCart(product.id, variantId, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-wider2 text-champagne/70 capitalize">
        {product.category.replace("-", " ")}
      </p>
      <h1 className="mt-3 font-display text-4xl text-graphite">{product.name}</h1>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-2xl text-champagne">{formatPrice(price)}</span>
        {onSale && (
          <span className="text-base text-graphite/40 line-through">
            {formatPrice(product.compareAtPrice!)}
          </span>
        )}
      </div>

      <p className="mt-6 max-w-md text-balance text-graphite/70">{product.description}</p>

      <div className="mt-8">
        <p className="mb-3 text-sm text-graphite/70">
          Finish: <span className="text-graphite">{variant?.label}</span>
        </p>
        <div className="flex flex-wrap gap-3">
          {product.variants.map((v) => (
            <button
              key={v.id}
              disabled={!v.inStock}
              onClick={() => setVariantId(v.id)}
              title={v.inStock ? v.label : `${v.label} — out of stock`}
              className={`relative h-10 w-10 rounded-full border-2 transition ${
                variantId === v.id ? "border-champagne" : "border-transparent"
              } ${!v.inStock ? "opacity-30" : ""}`}
              style={{ backgroundColor: v.swatch }}
            >
              {!v.inStock && (
                <span className="absolute inset-0 flex items-center justify-center text-[9px] text-graphite">
                  ✕
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center rounded border border-champagne/25">
          <button
            className="px-3 py-2 text-graphite/70 hover:text-champagne"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-graphite">{quantity}</span>
          <button
            className="px-3 py-2 text-graphite/70 hover:text-champagne"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={!variant?.inStock}
          className="flex-1 rounded-full bg-champagne py-3 text-sm font-medium tracking-wide text-graphite transition-colors hover:bg-champagne-light disabled:opacity-40"
        >
          {justAdded ? "Added to Bag ✓" : variant?.inStock ? "Add to Bag" : "Out of Stock"}
        </button>
      </div>

      <div className="mt-4">
        <WhatsAppLink
          className="w-full"
          message={`Assalam o Alaikum, I'd like to order:\n${quantity} x ${product.name}${variant ? ` (${variant.label})` : ""}\nPrice: ${formatPrice((product.price + (variant?.priceModifier ?? 0)) * quantity)}\n${SITE_URL}/shop/${product.slug}`}
        >
          Order on WhatsApp
        </WhatsAppLink>
      </div>

      <div className="mt-10 space-y-3 text-sm text-graphite/55">
        <p>Free engraving on all cufflinks</p>
        <p>Free delivery on every order, anywhere in Pakistan</p>
        <p>Cash on Delivery available across Pakistan</p>
        <p>7-day exchange, no questions asked</p>
      </div>
    </div>
  );
}
