export const salesByMonth = [
  { month: "Jan", revenue: 18400 }, { month: "Feb", revenue: 22300 },
  { month: "Mar", revenue: 26100 }, { month: "Apr", revenue: 24800 },
  { month: "May", revenue: 29400 }, { month: "Jun", revenue: 31900 },
  { month: "Jul", revenue: 35200 }, { month: "Aug", revenue: 33700 },
  { month: "Sep", revenue: 38900 }, { month: "Oct", revenue: 41250 },
  { month: "Nov", revenue: 44600 }, { month: "Dec", revenue: 49800 },
];
export const topCategories = [
  { name: "Devices", value: 32 }, { name: "Vitamins", value: 21 },
  { name: "OTC Meds", value: 18 }, { name: "Personal Care", value: 15 },
  { name: "First Aid", value: 8 }, { name: "Other", value: 6 },
];
export const recentActivity = [
  { type: "order", title: "New order #ORD-10268", time: "2m ago" },
  { type: "refund", title: "Refund request #ORD-10254", time: "20m ago" },
  { type: "stock", title: "Low stock: Pulse Oximeter", time: "1h ago" },
  { type: "review", title: "5★ review on Vitamin C 1000mg", time: "3h ago" },
  { type: "support", title: "New support ticket #TCK-2031", time: "4h ago" },
];
export const adminNav = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "POS System", href: "/admin/pos", icon: "ScanLine" },
  { label: "All Products", href: "/admin/products", icon: "Package" },
  { label: "New Product", href: "/admin/products/new", icon: "PlusSquare" },
  { label: "In-House Products", href: "/admin/products/in-house", icon: "Warehouse" },
  { label: "Bulk Import / Upload", href: "/admin/products/import", icon: "Upload" },
  { label: "Categories", href: "/admin/categories", icon: "FolderTree" },
  { label: "Brands", href: "/admin/brands", icon: "Tag" },
  { label: "Attributes", href: "/admin/attributes", icon: "ListChecks" },
  { label: "Colors", href: "/admin/colors", icon: "Palette" },
  { label: "Orders", href: "/admin/orders", icon: "ShoppingBag" },
  { label: "Refunds", href: "/admin/refunds", icon: "Undo2" },
  { label: "Customers", href: "/admin/customers", icon: "Users" },
  { label: "Sellers", href: "/admin/sellers", icon: "Store" },
  { label: "Delivery Boys", href: "/admin/delivery", icon: "Truck" },
  { label: "Affiliate", href: "/admin/affiliate", icon: "Share2" },
  { label: "Club Points", href: "/admin/club-points", icon: "Coins" },
  { label: "Marketing", href: "/admin/marketing", icon: "Megaphone" },
  { label: "Support", href: "/admin/support", icon: "LifeBuoy" },
  { label: "Sales", href: "/admin/sales", icon: "BarChart3" },
  { label: "Purchase Orders", href: "/admin/purchase", icon: "ClipboardList" },
  { label: "Reports", href: "/admin/reports", icon: "FileBarChart" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

// Sidebar groupings shown between the ecommerce and clinic nav blocks.
export const sidebarSections = [
  { id: "ecommerce", label: "Ecommerce" },
  { id: "clinic", label: "Clinic" },
] as const;
