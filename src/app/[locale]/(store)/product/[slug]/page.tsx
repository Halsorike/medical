import { Link } from "@/navigation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Product } from "@/types";
import { products as mockProducts } from "@/data/products";
import { getApiData } from "@/lib/server-api";
import { ProductDetailClient } from "./product-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const product = await getApiData<Product>(`/api/products/${params.slug}`);

  if (!product) {
    return {
      title: "Product",
    };
  }

  const productName = params.locale === "ar" && product.nameAr ? product.nameAr : product.name;
  const productDescription = params.locale === "ar" && product.descriptionAr ? product.descriptionAr : product.description;

  return {
    title: productName,
    description: productDescription ?? `${productName} from Echo Wellness Center.`,
    openGraph: {
      title: productName,
      description: productDescription ?? `${productName} from Echo Wellness Center.`,
      images: [product.image],
    },
    alternates: {
      canonical: `/product/${product.slug}`,
    },
  };
}

export default async function PDP({ params }: { params: { locale: string; slug: string } }) {
  const p = await getApiData<Product>(`/api/products/${params.slug}`);
  if (!p) notFound();
  const displayName = params.locale === "ar" && p.nameAr ? p.nameAr : p.name;
  const relatedProducts = mockProducts.filter((product) => {
    const isCurrentProduct = product.slug === p.slug;
    const isGeneratedTestProduct = /^(test product|new product)\b/i.test(product.name);
    return product.category === p.category && !isCurrentProduct && !isGeneratedTestProduct && Boolean(product.image);
  });
  const related = relatedProducts.length >= 3 ? relatedProducts.slice(0, 3) : [];
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://echowellness.me" },
      { "@type": "ListItem", position: 2, name: "Shop", item: "https://echowellness.me/shop" },
      { "@type": "ListItem", position: 3, name: displayName, item: `https://echowellness.me/product/${p.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Page title hero */}
      <div className="relative overflow-hidden bg-brand-50 pb-8 pt-6">
        <div className="container">
          <nav className="mb-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            {" / "}
            <Link href="/shop" className="hover:text-brand-blue">Shop</Link>
            {" / "}
            <span className="text-brand-blue">{displayName}</span>
          </nav>
          <h1 className="text-2xl font-bold">
            Product <span className="text-brand-teal">Details</span>
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 30" className="w-full fill-white">
            <path d="M0,15 C360,30 1080,0 1440,15 L1440,30 L0,30 Z" />
          </svg>
        </div>
      </div>

      <ProductDetailClient product={p} related={related} />
    </>
  );
}
