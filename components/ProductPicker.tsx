"use client";

import Image from "next/image";
import { Product } from "@/types";

export default function ProductPicker({
  products,
  selectedId,
  onSelect,
  label = "1. Choose a piece",
}: {
  products: Product[];
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
}) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-wider2 text-champagne/70">{label}</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelect(product.id)}
            className={`flex w-24 shrink-0 flex-col items-center gap-2 rounded-xl border p-2 text-center transition ${
              selectedId === product.id
                ? "border-champagne bg-cloud"
                : "border-champagne/15 hover:border-champagne/40"
            }`}
          >
            <div className="relative h-14 w-14">
              <Image src={product.images[0]} alt={product.name} fill className="object-contain" />
            </div>
            <span className="line-clamp-2 text-[11px] leading-tight text-graphite/75">
              {product.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
