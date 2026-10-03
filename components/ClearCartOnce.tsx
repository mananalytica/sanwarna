"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/** Empties the bag once an order has gone through. Renders nothing. */
export default function ClearCartOnce() {
  const { lines, clearCart } = useCart();
  useEffect(() => {
    if (lines.length > 0) clearCart();
  }, [lines.length, clearCart]);
  return null;
}
