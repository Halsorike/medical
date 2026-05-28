import type { Order } from "@/types";
const customers = ["Alice Walker","Brian Chen","Carla Diaz","David Park","Emma Stone","Felix Hart","Grace Kim","Henry Lopez","Ivy Brown","Jack Murphy"];
const statuses: Order["status"][] = ["pending","confirmed","shipped","delivered","cancelled","refunded"];
const payments: Order["payment"][] = ["paid","unpaid","refunded"];
const baseTime = new Date("2026-01-15T12:00:00.000Z").getTime();

function seeded(index: number, salt: number) {
  const value = Math.sin((index + 1) * (salt + 1) * 997) * 10000;
  return value - Math.floor(value);
}

export const orders: Order[] = Array.from({ length: 28 }).map((_, i) => {
  const name = customers[i % customers.length];
  return {
    id: String(i + 1),
    code: `#ORD-${10240 + i}`,
    customer: name,
    email: name.toLowerCase().replace(" ", ".") + "@example.com",
    date: new Date(baseTime - i * 36e5 * 18).toISOString(),
    total: Math.round((25 + seeded(i, 1) * 470) * 100) / 100,
    status: statuses[i % statuses.length],
    payment: payments[i % payments.length],
    items: 1 + Math.floor(seeded(i, 2) * 6),
  };
});
