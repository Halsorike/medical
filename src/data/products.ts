import type { Product } from "@/types";

const placeholders = [
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
  "https://images.unsplash.com/photo-1583912267550-1b8b29c2c4cd?w=800",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800",
  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800",
];

const names = [
  "Digital Thermometer", "Blood Pressure Monitor", "Pulse Oximeter", "Stethoscope Pro",
  "Surgical Mask Pack (50)", "N95 Respirator (20)", "Vitamin C 1000mg", "Omega-3 Fish Oil",
  "Hand Sanitizer 500ml", "First Aid Kit", "Glucose Test Strips", "Insulin Syringes",
  "Compression Stockings", "Knee Brace Support", "Elastic Bandage Roll", "Cold Pack Gel",
  "Diabetic Test Meter", "Nebulizer Compact", "Wheelchair Lite", "Walking Cane Adjustable",
  "Multivitamin Daily", "Probiotic 60caps", "Calcium + D3", "Magnesium Complex",
  "Eye Drops Soothing", "Antiseptic Cream", "Cough Syrup 200ml", "Pain Relief Tablets",
];

const namesAr = [
  "ميزان حرارة رقمي", "جهاز قياس ضغط الدم", "جهاز قياس الأكسجين", "سماعة طبية احترافية",
  "كمامات جراحية (٥٠)", "كمامة N95 (٢٠)", "فيتامين C 1000مج", "أوميغا-3 زيت السمك",
  "معقّم اليدين ٥٠٠مل", "حقيبة إسعافات أولية", "شرائط فحص الجلوكوز", "حقن الأنسولين",
  "جوارب ضاغطة", "دعامة الركبة", "ضمادة مرنة", "كمادة جل باردة",
  "جهاز قياس السكر", "جهاز بخار مضغوط", "كرسي متحرك خفيف", "عصا مشي قابلة للضبط",
  "فيتامينات متعددة يومية", "بروبيوتيك ٦٠ كبسولة", "كالسيوم + D3", "مركب المغنيسيوم",
  "قطرات عيون مرطبة", "كريم مطهر", "شراب للسعال ٢٠٠مل", "أقراص مسكّنة للألم",
];
const brands = ["Pfizer", "Bayer", "Johnson & Johnson", "Roche", "Novartis", "GSK", "Sanofi", "Merck"];
const categories = ["Devices", "Personal Care", "Vitamins", "First Aid", "Diabetes Care", "Mobility", "OTC Meds"];

function seeded(index: number, salt: number) {
  const value = Math.sin((index + 1) * (salt + 1) * 999) * 10000;
  return value - Math.floor(value);
}

export const products: Product[] = names.map((name, i) => {
  const price = Math.round((10 + seeded(i, 1) * 240) * 100) / 100;
  return {
    id: String(i + 1),
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    nameAr: namesAr[i] ?? name,
    brand: brands[i % brands.length],
    category: categories[i % categories.length],
    price,
    oldPrice: i % 3 === 0 ? Math.round((price * 1.2) * 100) / 100 : undefined,
    rating: Math.round((3.5 + seeded(i, 2) * 1.5) * 10) / 10,
    reviews: Math.floor(20 + seeded(i, 3) * 500),
    stock: Math.floor(seeded(i, 4) * 200),
    image: placeholders[i % placeholders.length],
    images: [placeholders[i % placeholders.length], placeholders[(i + 1) % placeholders.length], placeholders[(i + 2) % placeholders.length]],
    description: `${name} from ${brands[i % brands.length]}. Trusted medical-grade quality.`,
    descriptionAr: `${namesAr[i] ?? name} — جودة طبية موثوقة.`,
    badges: i % 5 === 0 ? ["New"] : i % 4 === 0 ? ["Best Seller"] : i % 7 === 0 ? ["Sale"] : undefined,
  };
});

export function getProduct(query: string) {
  return products.find((p) => p.slug === query || p.id === query);
}
export function getRelated(slug: string, n = 4) {
  const p = getProduct(slug);
  return products.filter((x) => x.slug !== slug && (!p || x.category === p.category)).slice(0, n);
}
export const allCategories = Array.from(new Set(products.map((p) => p.category)));
export const allBrands = Array.from(new Set(products.map((p) => p.brand)));
