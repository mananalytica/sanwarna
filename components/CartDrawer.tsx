"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { formatPrice } from "@/lib/currency";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, removeLine, setQuantity, subtotal } = useCart();
  const products = useProducts();

  return (
    <div
      className={`fixed inset-0 z-[60] transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-60" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Shopping bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-mist shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-champagne/15 px-6 py-5">
          <h2 className="font-display text-lg text-graphite">Your Bag</h2>
          <button onClick={closeCart} aria-label="Close bag" className="text-graphite/60 hover:text-champagne">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-graphite/60">Your bag is empty.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-4 rounded-xl border border-champagne/50 px-5 py-2 text-sm text-champagne hover:bg-champagne hover:text-graphite"
              >
                Browse the collection
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {lines.map((line) => {
                const product = products.find((p) => p.id === line.productId);
                if (!product) return null;
                const variant = product.variants.find((v) => v.id === line.variantId);
                const price = product.price + (variant?.priceModifier ?? 0);
                return (
                  <li key={`${line.productId}-${line.variantId}`} className="flex gap-4">
                    <div className="h-20 w-20 shrink-0 rounded-xl border border-hairline bg-cloud p-2">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-graphite">{product.name}</p>
                          {variant && <p className="text-xs text-graphite/50">{variant.label}</p>}
                        </div>
                        <p className="whitespace-nowrap text-sm text-champagne">{formatPrice(price)}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded border border-champagne/25">
                          <button
                            className="px-2 py-1 text-graphite/70 hover:text-champagne"
                            onClick={() => setQuantity(line.productId, line.variantId, line.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm text-graphite">{line.quantity}</span>
                          <button
                            className="px-2 py-1 text-graphite/70 hover:text-champagne"
                            onClick={() => setQuantity(line.productId, line.variantId, line.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="text-xs text-graphite/40 hover:text-rust"
                          onClick={() => removeLine(line.productId, line.variantId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-champagne/15 px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-graphite/60">Subtotal</span>
              <span className="text-lg text-champagne">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full rounded-full bg-champagne py-3 text-center text-sm font-medium tracking-wide text-graphite transition-colors hover:bg-champagne-light"
            >
              Proceed to Checkout
            </Link>
            <p className="mt-3 text-center text-xs text-graphite/35">
              Free delivery across Pakistan. Cash on Delivery available.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
