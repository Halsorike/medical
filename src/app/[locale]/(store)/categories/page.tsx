import { Link } from "@/navigation";
import { Activity, Droplets, FlaskConical, Heart, HeartPulse, Pill, Stethoscope, type LucideIcon } from "lucide-react";
import type { Product } from "@/types";
import { getApiData } from "@/lib/server-api";

export const dynamic = "force-dynamic";

const categoryIcons: Record<string, LucideIcon> = {
  Devices: Stethoscope,
  "Personal Care": Heart,
  Vitamins: Pill,
  "First Aid": HeartPulse,
  "Diabetes Care": Droplets,
  Mobility: Activity,
  "OTC Meds": FlaskConical,
};

const categoryColors: Record<string, string> = {
  Devices: "bg-blue-100 text-blue-600",
  "Personal Care": "bg-pink-100 text-pink-600",
  Vitamins: "bg-yellow-100 text-yellow-700",
  "First Aid": "bg-red-100 text-red-600",
  "Diabetes Care": "bg-teal-100 text-teal-600",
  Mobility: "bg-brand-100 text-brand-teal",
  "OTC Meds": "bg-green-100 text-green-700",
};

export default async function Categories() {
  const products = await getApiData<Product[]>("/api/products") ?? [];
  const allCategories = Array.from(new Set(products.map((product) => product.category)));

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Shop by Category</h1>
        <p className="mt-2 text-muted-foreground">Find exactly what you need</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allCategories.map((category) => {
          const Icon = categoryIcons[category] ?? FlaskConical;
          const count = products.filter((product) => product.category === category).length;

          return (
            <Link
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border bg-white p-6 text-center transition-all hover:border-primary hover:shadow-md"
            >
              <div className={`rounded-full p-4 ${categoryColors[category] ?? "bg-slate-100 text-slate-600"}`}>
                <Icon className="h-8 w-8" />
              </div>
              <h2 className="text-base font-semibold">{category}</h2>
              <p className="text-sm text-muted-foreground">{count} products</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
