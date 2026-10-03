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
      </div>

      {/* Everything about the piece sits here in the text; nothing covers the photo. */}
      <div className="mt-3">
        <h3 className="font-display text-base text-graphite group-hover:text-champagne">{product.name}</h3>

        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="text-champagne">{formatPrice(product.price)}</span>
          {onSale && (
            <>
              <span className="text-xs text-steel line-through">{formatPrice(product.compareAtPrice!)}</span>
              <span className="whitespace-nowrap text-xs font-medium text-rust">
                Save {formatPrice(product.compareAtPrice! - product.price)}
              </span>
            </>
          )}
        </p>

        <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-steel">
          <span className="capitalize">{product.category.replace("-", " ")}</span>
          {product.bestSeller && (
            <span className="flex items-center gap-1 whitespace-nowrap text-champagne">
              <span aria-hidden className="h-1 w-1 rounded-full bg-champagne" />
              Best seller
            </span>
          )}
          {product.newArrival && (
            <span className="flex items-center gap-1 whitespace-nowrap text-graphite">
              <span aria-hidden className="h-1 w-1 rounded-full bg-graphite" />
              New
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
