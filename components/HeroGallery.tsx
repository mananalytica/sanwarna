"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import imageLoader from "@/lib/imageLoader";
import { formatPrice } from "@/lib/currency";

/**
 * Homepage hero: a gallery that rotates through real product photos.
 * Every slide links to its product and carries a Buy now button.
 *
 * Only products with real photos appear (drawn SVG placeholders are left
 * out). A product's `heroImages` (wide shots) are used when it has them,
 * otherwise its normal `images`. Styles: ".hero-slide" in globals.css.
 */

const INTERVAL_MS = 5000;
const isPhoto = (src: string) => !src.endsWith(".svg");

type Slide = { product: Product; src: string };

export default function HeroGallery({ products }: { products: Product[] }) {
  const slides = useMemo<Slide[]>(() => {
    const withPhotos = products
      .map((p) => ({ product: p, photos: (p.heroImages ?? p.images).filter(isPhoto) }))
      .filter((x) => x.photos.length > 0);
    // Few products: show several photos of each. Many: two each.
    const perProduct = withPhotos.length <= 2 ? 4 : 2;
    // Take turns between products: A1, B1, A2, B2…
    const out: Slide[] = [];
    for (let i = 0; i < perProduct; i++) {
      for (const { product, photos } of withPhotos) {
        if (photos[i]) out.push({ product, src: photos[i] });
      }
    }
    return out;
  }, [products]);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  // People who ask for reduced motion get a still gallery they step through.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || hovered || slides.length < 2) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [index, playing, hovered, slides.length]);

  if (slides.length === 0) return null;
  const { product } = slides[index];
  const variant = product.variants.find((v) => v.inStock) ?? product.variants[0];
  const go = (step: number) => setIndex((i) => (i + step + slides.length) % slides.length);

  function buyNow() {
    addToCart(product.id, variant.id, 1);
    router.push("/checkout");
  }

  const roundBtn =
    "flex h-10 w-10 items-center justify-center rounded-full bg-paper/15 text-paper backdrop-blur transition-colors hover:bg-paper/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-paper";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Our cufflinks"
      className="relative bg-graphite"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="relative h-[78vh] min-h-[460px] max-h-[760px] w-full overflow-hidden">
        {slides.map((s, i) => (
          <Link
            key={s.src}
            href={`/shop/${s.product.slug}`}
            className="hero-slide absolute inset-0"
            data-active={i === index}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            aria-label={`${s.product.name}, see details`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageLoader({ src: s.src, width: 1280 })}
              srcSet={imageLoader.srcSet(s.src)}
              // the photo is cropped to fill a tall frame on phones, so it is
              // drawn wider than the screen: ask for a file to match
              sizes="max(100vw, 139vh)"
              alt=""
              className="h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </Link>
        ))}

        {/* darkens the lower part so the text reads on any photo */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 pb-8 md:flex-row md:items-end md:justify-between md:px-8 md:pb-12">
            <div className="max-w-xl text-paper">
              <h1 className="font-display text-3xl leading-tight md:text-5xl">
                Luxury cufflinks, delivered free across Pakistan.
              </h1>
              <p key={product.id} className="mt-4 text-base text-paper/85 md:text-lg">
                {product.name}, {formatPrice(product.price + (variant.priceModifier ?? 0))}
              </p>
              <div className="pointer-events-auto mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={buyNow}
                  className="rounded-full bg-champagne px-7 py-3 text-sm font-medium text-graphite transition-colors hover:bg-champagne-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
                >
                  Buy now
                </button>
                <Link
                  href={`/shop/${product.slug}`}
                  className="rounded-full border border-paper/60 px-7 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-graphite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
                >
                  See details
                </Link>
              </div>
            </div>

            {slides.length > 1 && (
              <div className="pointer-events-auto flex items-center gap-2">
                <button type="button" className={roundBtn} onClick={() => go(-1)} aria-label="Previous photo">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M10 3 5 8l5 5" /></svg>
                </button>
                <button
                  type="button"
                  className={roundBtn}
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause the gallery" : "Play the gallery"}
                >
                  {playing ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden><rect x="2" y="1" width="3.5" height="12" /><rect x="8.5" y="1" width="3.5" height="12" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden><path d="M3 1v12l10-6z" /></svg>
                  )}
                </button>
                <button type="button" className={roundBtn} onClick={() => go(1)} aria-label="Next photo">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="m6 3 5 5-5 5" /></svg>
                </button>
                <span className="ml-2 text-sm tabular-nums text-paper/80" aria-live="polite">
                  {index + 1} / {slides.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
