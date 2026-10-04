"use client";

import { ProductCategory } from "@/types";

const CATEGORIES: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "cufflinks", label: "Cufflinks" },
  { value: "tie-pens", label: "Tie Pens" },
  { value: "tie-clips", label: "Tie Clips" },
  { value: "sets", label: "Gift Sets" },
];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function ShopFilters({
  category,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  resultCount,
  available,
}: {
  /** Categories that have at least one product; others are not offered. */
  available: string[];
  category: string;
  onCategoryChange: (v: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  resultCount: number;
}) {
  return (
    <div className="mb-10 flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search the collection…"
            aria-label="Search products"
            className="w-full rounded-xl border border-champagne/25 bg-cloud px-4 py-2.5 text-sm text-graphite placeholder:text-graphite/40 focus:border-champagne"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-xs text-graphite/50">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-xl border border-champagne/25 bg-cloud px-3 py-2 text-sm text-graphite focus:border-champagne"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.filter((c) => c.value === "all" || available.includes(c.value)).map((c) => (
          <button
            key={c.value}
            onClick={() => onCategoryChange(c.value)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              category === c.value
                ? "border-champagne bg-champagne text-graphite"
                : "border-champagne/25 text-graphite/70 hover:border-champagne/60 hover:text-champagne"
            }`}
          >
            {c.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-graphite/40">
          {resultCount} {resultCount === 1 ? "piece" : "pieces"}
        </span>
      </div>
    </div>
  );
}
