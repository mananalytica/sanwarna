"use client";

import { useState } from "react";
import Image from "next/image";

/** Photos fill the frame; the drawn SVG placeholders sit inside it with padding. */
export function isPhoto(src: string) {
  return !src.endsWith(".svg");
}

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const src = images[index] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-hairline bg-cloud">
        <Image
          key={src}
          src={src}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={isPhoto(src) ? "object-cover" : "object-contain p-16"}
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              aria-pressed={i === index}
              className={`relative aspect-square overflow-hidden rounded-xl border bg-cloud transition-colors ${
                i === index ? "border-champagne" : "border-hairline hover:border-graphite/40"
              }`}
            >
              <Image src={img} alt="" fill sizes="120px" className={isPhoto(img) ? "object-cover" : "object-contain p-3"} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
