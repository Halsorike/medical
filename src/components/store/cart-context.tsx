"use client";
import * as React from "react";
import type { CartItem, Product } from "@/types";

type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};
const Ctx = React.createContext<CartCtx | null>(null);
const CART_KEY = "medical-cart";

function readLocalCart() {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(CART_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function mergeCartItems(localItems: CartItem[], apiItems: CartItem[]) {
  const merged = new Map<string, CartItem>();

  for (const item of apiItems) {
    merged.set(item.product.id, item);
  }

  for (const item of localItems) {
    merged.set(item.product.id, item);
  }

  return Array.from(merged.values());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>(readLocalCart);

  const commit = React.useCallback((updater: (cur: CartItem[]) => CartItem[]) => {
    setItems((cur) => {
      const next = updater(cur);
      writeLocalCart(next);
      return next;
    });
  }, []);

  React.useEffect(() => {
    let active = true;

    fetch("/api/cart")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: CartItem[] }) => {
        if (!active) return;
        const merged = mergeCartItems(readLocalCart(), payload.data);
        setItems(merged);
        writeLocalCart(merged);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const add = (p: Product, qty = 1) => {
    commit((cur) => {
      const ex = cur.find((i) => i.product.id === p.id);
      return ex ? cur.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + qty } : i)) : [...cur, { product: p, qty }];
    });
    void fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: p.id, qty }),
    });
  };
  const remove = (id: string) => {
    commit((cur) => cur.filter((i) => i.product.id !== id));
    void fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });
  };
  const setQty = (id: string, qty: number) => {
    commit((cur) => (qty <= 0 ? cur.filter((i) => i.product.id !== id) : cur.map((i) => (i.product.id === id ? { ...i, qty } : i))));
    void fetch("/api/cart", {
      method: qty <= 0 ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(qty <= 0 ? { productId: id } : { productId: id, qty, mode: "set" }),
    });
  };
  const clear = () => {
    const ids = items.map((item) => item.product.id);
    commit(() => []);
    void Promise.all(
      ids.map((id) =>
        fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        })
      )
    );
  };
  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.qty * i.product.price, 0);
  return <Ctx.Provider value={{ items, add, remove, setQty, clear, count, subtotal }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useCart must be inside CartProvider");
  return v;
}
