"use client";

import { createContext, useContext } from "react";
import { Product } from "@/types";

// The root layout fetches the product catalog once, server-side (from
// MotherDuck if configured, else the static fallback — see
// lib/getProducts.ts), and passes it down here. Client components that need
// to look up a product by id (cart, cart drawer, checkout summary) read from
// this context instead of importing data/products.ts directly — that keeps
// exactly one code path responsible for "where product data comes from."
const ProductsContext = createContext<Product[]>([]);

export function ProductsProvider({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  return <ProductsContext.Provider value={products}>{children}</ProductsContext.Provider>;
}

export function useProducts(): Product[] {
  return useContext(ProductsContext);
}
