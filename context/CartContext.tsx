"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartLine, Product } from "@/types";
import { useProducts } from "./ProductsContext";

type CartContextValue = {
  lines: CartLine[];
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  removeLine: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sanwarna-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addToCart = useCallback(
    (productId: string, variantId: string, quantity = 1) => {
      setLines((prev) => {
        const existing = prev.find(
          (l) => l.productId === productId && l.variantId === variantId
        );
        if (existing) {
          return prev.map((l) =>
            l === existing ? { ...l, quantity: l.quantity + quantity } : l
          );
        }
        return [...prev, { productId, variantId, quantity }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeLine = useCallback((productId: string, variantId: string) => {
    setLines((prev) =>
      prev.filter((l) => !(l.productId === productId && l.variantId === variantId))
    );
  }, []);

  const setQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      setLines((prev) =>
        prev.map((l) =>
          l.productId === productId && l.variantId === variantId
            ? { ...l, quantity: Math.max(1, quantity) }
            : l
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => setLines([]), []);

  const products = useProducts();

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const line of lines) {
      const product = products.find((p: Product) => p.id === line.productId);
      if (!product) continue;
      const variant = product.variants.find((v) => v.id === line.variantId);
      const price = product.price + (variant?.priceModifier ?? 0);
      count += line.quantity;
      subtotal += price * line.quantity;
    }
    return { count, subtotal };
  }, [lines, products]);

  const value: CartContextValue = {
    lines,
    addToCart,
    removeLine,
    setQuantity,
    clearCart,
    count,
    subtotal,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
