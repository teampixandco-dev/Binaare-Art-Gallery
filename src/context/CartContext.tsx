"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PRODUCTS, type Product, formatPriceUSD } from "@/data/products";

const STORAGE_KEY = "binaare-cart";

export type CartLine = {
  slug: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  formatSubtotal: () => string;
  getProduct: (slug: string) => Product | undefined;
  lineEntries: { line: CartLine; product: Product }[];
};

const CartContext = createContext<CartContextValue | null>(null);

function loadStored(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is CartLine =>
        row &&
        typeof row === "object" &&
        typeof (row as CartLine).slug === "string" &&
        typeof (row as CartLine).quantity === "number" &&
        (row as CartLine).quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadStored();
    const knownSlugs = new Set(PRODUCTS.map((p) => p.slug));
    const cleaned = loaded.filter((l) => knownSlugs.has(l.slug));
    setLines(cleaned);
    if (typeof window !== "undefined" && cleaned.length !== loaded.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback((slug: string, quantity = 1) => {
    const q = Math.max(1, Math.floor(quantity));
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === slug);
      if (i === -1) return [...prev, { slug, quantity: q }];
      const next = [...prev];
      next[i] = { slug, quantity: next[i].quantity + q };
      return next;
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    const q = Math.floor(quantity);
    if (q < 1) {
      setLines((prev) => prev.filter((l) => l.slug !== slug));
      return;
    }
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === slug);
      if (i === -1) return [...prev, { slug, quantity: q }];
      const next = [...prev];
      next[i] = { slug, quantity: q };
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const value = useMemo((): CartContextValue => {
    const knownSlugs = new Set(PRODUCTS.map((p) => p.slug));
    const cleanLines = lines.filter((l) => knownSlugs.has(l.slug));

    const lineEntries = cleanLines
      .map((line) => {
        const product = PRODUCTS.find((p) => p.slug === line.slug);
        return product ? { line, product } : null;
      })
      .filter((e): e is { line: CartLine; product: Product } => e !== null);

    const itemCount = lineEntries.reduce((n, e) => n + e.line.quantity, 0);
    const subtotal = lineEntries.reduce(
      (sum, e) => sum + e.product.price * e.line.quantity,
      0
    );

    return {
      lines: cleanLines,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      itemCount,
      subtotal,
      formatSubtotal: () => formatPriceUSD(subtotal),
      getProduct: (slug: string) => PRODUCTS.find((p) => p.slug === slug),
      lineEntries,
    };
  }, [lines, addItem, removeItem, setQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
