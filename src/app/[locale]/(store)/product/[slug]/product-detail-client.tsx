"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/navigation";
import { useLocale } from "next-intl";
import { Facebook, Heart, MessageCircle, Star, Truck, Twitter, Undo2 } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/store/product-card";
import { formatCurrency } from "@/lib/utils";
import { AddToCartBlock } from "./add-to-cart";

type ProductDetailClientProps = {
  product: Product;
  related: Product[];
};

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const locale = useLocale();
  const displayName = locale === "ar" && product.nameAr ? product.nameAr : product.name;
  const displayDescription = locale === "ar" && product.descriptionAr ? product.descriptionAr : product.description;
  const gallery = useMemo(
    () => (product.images?.length ? product.images : [product.image]).filter(Boolean),
    [product.image, product.images]
  );
  const [selectedImage, setSelectedImage] = useState(gallery[0] ?? product.image);
  const [wishlisted, setWishlisted] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setSelectedImage(gallery[0] ?? product.image);
  }, [gallery, product.image]);

  useEffect(() => {
    setShareUrl(window.location.href);
    const stored = JSON.parse(window.localStorage.getItem("wishlist") ?? "[]") as unknown;
    setWishlisted(Array.isArray(stored) && stored.includes(product.slug));
  }, [product.slug]);

  function toggleWishlist() {
    const stored = JSON.parse(window.localStorage.getItem("wishlist") ?? "[]") as unknown;
    const slugs = Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string") : [];
    const next = slugs.includes(product.slug) ? slugs.filter((slug) => slug !== product.slug) : [...slugs, product.slug];
    window.localStorage.setItem("wishlist", JSON.stringify(next));
    setWishlisted(next.includes(product.slug));
  }

  const encodedUrl = encodeURIComponent(shareUrl);
  const rating = 4.5;

  return (
    <div className="container py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage}
            alt={displayName}
            className="aspect-square w-full rounded-[24px] border border-[#ca79c6]/15 bg-[rgba(255,53,245,0.04)] object-cover shadow-[0_11px_26px_rgba(6,28,61,0.1)]"
          />
          <div className="grid grid-cols-4 gap-3">
            {gallery.slice(0, 4).map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`overflow-hidden rounded-xl border transition ${
              selectedImage === image ? "border-[#ca79c6] ring-2 ring-[#ca79c6]/15" : "border-[#ca79c6]/15"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={`${displayName} thumbnail ${index + 1}`} className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#061c3d]">{displayName}</h2>
            <button
              type="button"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="text-gray-400 transition-colors hover:text-red-500"
              onClick={toggleWishlist}
            >
              <Heart className={`h-6 w-6 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className={`h-4 w-4 ${index < 4 ? "fill-current" : ""}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <p className="gradient-text mb-3 text-3xl font-bold">{formatCurrency(product.price)}</p>
          <div className="mb-4 grid gap-2 rounded-[20px] border border-[#ca79c6]/15 bg-[rgba(255,53,245,0.04)] p-4 text-sm sm:grid-cols-2">
            <p><span className="font-medium text-gray-800">Brand:</span> {product.brand}</p>
            <p><span className="font-medium text-gray-800">Category:</span> {product.category}</p>
            <p><span className="font-medium text-gray-800">Stock:</span> {product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
            <p><span className="font-medium text-gray-800">SKU:</span> JHST-{product.id.padStart(4, "0")}</p>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">{displayDescription}</p>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-gray-700">Share</p>
            <div className="flex gap-3 text-muted-foreground">
              <a href={`https://facebook.com/sharer/sharer.php?u=${encodedUrl}`} aria-label="Share on Facebook">
                <Facebook className="h-5 w-5 hover:text-purple-600" />
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}`} aria-label="Share on Twitter">
                <Twitter className="h-5 w-5 hover:text-purple-600" />
              </a>
              <a href={`https://wa.me/?text=${encodedUrl}`} aria-label="Share on WhatsApp">
                <MessageCircle className="h-5 w-5 hover:text-purple-600" />
              </a>
            </div>
          </div>

          <AddToCartBlock product={product} />

          <div className="mt-5 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Free standard shipping</span>
            <span className="flex items-center gap-1"><Undo2 className="h-3.5 w-3.5" /> Free Returns</span>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h3 className="mb-8 text-center text-xl font-bold">
          Related <span className="text-purple-600">Products</span>
        </h3>
        {related.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} p={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-purple-100 bg-white p-8 text-center text-muted-foreground">
            No related products found.
          </div>
        )}
      </section>

      <div className="mt-10 text-center">
        <Link href="/shop" className="text-sm font-medium text-purple-600 hover:underline">
          Back to shop
        </Link>
      </div>
    </div>
  );
}
