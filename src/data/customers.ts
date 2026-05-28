import type { Customer } from "@/types";
const names = ["Alice Walker","Brian Chen","Carla Diaz","David Park","Emma Stone","Felix Hart","Grace Kim","Henry Lopez","Ivy Brown","Jack Murphy","Kara Lee","Liam Patel"];
const baseTime = new Date("2026-01-15T12:00:00.000Z").getTime();

function seeded(index: number, salt: number) {
  const value = Math.sin((index + 1) * (salt + 1) * 991) * 10000;
  return value - Math.floor(value);
}

export const customers: Customer[] = names.map((name, i) => ({
  id: String(i + 1),
  name,
  email: name.toLowerCase().replace(" ", ".") + "@example.com",
  phone: "+1 555 0" + (100 + i).toString(),
  orders: Math.floor(1 + seeded(i, 1) * 30),
  spent: Math.round((50 + seeded(i, 2) * 4500) * 100) / 100,
  joined: new Date(baseTime - (i + 1) * 36e5 * 24 * 30).toISOString(),
  status: i % 6 === 0 ? "inactive" : "active",
}));
