import { adminNav } from "@/data/admin";
import { clinicNav } from "@/data/clinic";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  icon: string;
  children: AdminNavItem[];
};

export type AdminNavEntry =
  | ({ type: "link" } & AdminNavItem)
  | ({ type: "group" } & AdminNavGroup);

const dashboard = adminNav.find((item) => item.href === "/admin");
const websiteSetup = clinicNav.find((item) => item.href === "/admin/website-setup");
const ecommerceOrder = [
  "/admin/pos",
  "/admin/products",
  "/admin/products/new",
  "/admin/products/in-house",
  "/admin/products/import",
  "/admin/categories",
  "/admin/brands",
  "/admin/attributes",
  "/admin/colors",
  "/admin/orders",
  "/admin/purchase",
  "/admin/refunds",
  "/admin/customers",
  "/admin/sellers",
  "/admin/delivery",
  "/admin/affiliate",
  "/admin/club-points",
  "/admin/marketing",
  "/admin/support",
  "/admin/sales",
  "/admin/reports",
  "/admin/settings",
] as const;
const ecommerceNav = ecommerceOrder
  .map((href) => adminNav.find((item) => item.href === href))
  .filter((item): item is (typeof adminNav)[number] => Boolean(item));

export const adminSidebarNav: AdminNavEntry[] = [
  ...(dashboard ? [{ type: "link" as const, ...dashboard }] : []),
  {
    type: "group",
    id: "ecommerce",
    label: "Ecommerce",
    icon: "ShoppingBag",
    children: ecommerceNav,
  },
  {
    type: "group",
    id: "clinic",
    label: "Clinic / Medical",
    icon: "Stethoscope",
    children: clinicNav.filter((item) => item.href !== "/admin/website-setup"),
  },
  ...(websiteSetup ? [{ type: "link" as const, ...websiteSetup }] : []),
];
