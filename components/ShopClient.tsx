"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import ShopFilters from "./ShopFilters";

export default function ShopClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  function updateCategory(value: string) {
    setCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("category");
    else params.set("category", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [products, category, search, sort]);

  return (
    <div>
      <ShopFilters
        available={Array.from(new Set(products.map((p) => p.category)))}
        category={category}
        onCategoryChange={updateCategory}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-champagne/15 py-24 text-center">
          <p className="font-display text-xl text-graphite">Nothing matches yet.</p>
          <p className="mt-2 max-w-sm text-sm text-graphite/50">
            Try a different search term, or clear your filters to see the
            full collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
