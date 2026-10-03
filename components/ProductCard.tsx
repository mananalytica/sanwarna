import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice } from "@/lib/currency";

export default function ProductCard({
  product,
  size = "default",
}: {
  product: Product;
  size?: "default" | "large";
}) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div
        className={`relative overflow-hidden rounded-2xl border border-hairline bg-cloud ${
          size === "large" ? "aspect-[4/5]" : "aspect-square"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={product.images[0].endsWith(".svg") ? "object-contain p-8" : "object-cover"}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-vignette opacity-60" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestSeller && (
            <span className="rounded-xl bg-champagne px-2 py-0.5 text-[10px] font-semibold tracking-wide text-graphite">
              Best Seller
            </span>
          )}
          {product.newArrival && (
            <span className="rounded-xl border border-champagne/60 bg-paper/70 px-2 py-0.5 text-[10px] tracking-wide text-champagne">
              New
            </span>
          )}
          {onSale && (
            <span className="rounded-xl bg-rust px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
              Save {formatPrice(product.compareAtPrice! - product.price)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base text-graphite group-hover:text-champagne">
            {product.name}
          </h3>
          <p className="mt-0.5 text-xs capitalize text-graphite/45">
            {product.category.replace("-", " ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-champagne">{formatPrice(product.price)}</p>
          {onSale && (
            <p className="text-xs text-graphite/35 line-through">
              {formatPrice(product.compareAtPrice!)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
