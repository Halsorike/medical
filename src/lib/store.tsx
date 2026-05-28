"use client";

/**
 * Global in-memory admin store.
 * Wraps the admin layout. All CRUD changes are reflected immediately in the UI.
 * Data resets on page refresh (mock-only — no persistence layer).
 */

import { createContext, useContext, useReducer, type ReactNode } from "react";
import { products as initialProducts } from "@/data/products";
import { orders as initialOrders } from "@/data/orders";
import { customers as initialCustomers } from "@/data/customers";
import type { Product, Order, Customer } from "@/types";

// ─── State ────────────────────────────────────────────────────────────────────

type State = {
  products: Product[];
  orders: Order[];
  customers: Customer[];
};

const initial: State = {
  products: initialProducts,
  orders: initialOrders,
  customers: initialCustomers,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; id: string }
  | { type: "UPDATE_ORDER_STATUS"; id: string; status: Order["status"] }
  | { type: "UPDATE_ORDER_PAYMENT"; id: string; payment: Order["payment"] }
  | { type: "UPDATE_CUSTOMER"; payload: Customer }
  | { type: "DELETE_CUSTOMER"; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_PRODUCT":
      return { ...state, products: [action.payload, ...state.products] };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.id),
      };
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.id ? { ...o, status: action.status } : o
        ),
      };
    case "UPDATE_ORDER_PAYMENT":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.id ? { ...o, payment: action.payment } : o
        ),
      };
    case "UPDATE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case "DELETE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.filter((c) => c.id !== action.id),
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

type StoreCtx = {
  state: State;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  updateOrderPayment: (id: string, payment: Order["payment"]) => void;
  updateCustomer: (c: Customer) => void;
  deleteCustomer: (id: string) => void;
};

const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const ctx: StoreCtx = {
    state,
    addProduct: (p) => dispatch({ type: "ADD_PRODUCT", payload: p }),
    updateProduct: (p) => dispatch({ type: "UPDATE_PRODUCT", payload: p }),
    deleteProduct: (id) => dispatch({ type: "DELETE_PRODUCT", id }),
    updateOrderStatus: (id, status) =>
      dispatch({ type: "UPDATE_ORDER_STATUS", id, status }),
    updateOrderPayment: (id, payment) =>
      dispatch({ type: "UPDATE_ORDER_PAYMENT", id, payment }),
    updateCustomer: (c) => dispatch({ type: "UPDATE_CUSTOMER", payload: c }),
    deleteCustomer: (id) => dispatch({ type: "DELETE_CUSTOMER", id }),
  };

  return <StoreContext.Provider value={ctx}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

/** Total revenue from all paid orders */
export function totalRevenue(orders: Order[]): number {
  return orders
    .filter((o) => o.payment === "paid")
    .reduce((sum, o) => sum + o.total, 0);
}

/** Orders grouped by month label (Jan–Dec) for charts */
export function ordersByMonth(orders: Order[]): { month: string; revenue: number; count: number }[] {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const map = new Map<string, { revenue: number; count: number }>();
  months.forEach((m) => map.set(m, { revenue: 0, count: 0 }));
  orders.forEach((o) => {
    const m = months[new Date(o.date).getMonth()];
    const entry = map.get(m)!;
    if (o.payment === "paid") entry.revenue += o.total;
    entry.count += 1;
  });
  return months.map((m) => ({ month: m, ...map.get(m)! }));
}

/** Category distribution from products for pie chart */
export function categoryDistribution(products: Product[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  products.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/** Products with stock below threshold */
export function lowStockProducts(products: Product[], threshold = 10): Product[] {
  return products.filter((p) => p.stock <= threshold);
}
