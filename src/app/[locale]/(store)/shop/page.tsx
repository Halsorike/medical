"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import type { Product } from "@/types";
import { ProductCard } from "@/components/store/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const PAGE_SIZE = 9;

function ShopInner() {
  const t = useTranslations("shop");
  const sp = useSearchParams();
  const initial = sp.get("category") ?? "all";
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [appliedQ, setAppliedQ] = useState(sp.get("q") ?? "");
  const [cat, setCat] = useState(initial);
  const [sort, setSort] = useState("popular");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedQ(q);
      setVisible(PAGE_SIZE);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: Product[] }) => setAllProducts(payload.data))
      .catch(() => setAllProducts([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();

    if (appliedQ) params.set("q", appliedQ);
    if (cat && cat !== "all") params.set("category", cat);

    setLoading(true);
    fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: Product[] }) => setProducts(payload.data))
      .catch(() => {
        if (!controller.signal.aborted) {
          setProducts([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [appliedQ, cat]);

  const allCategories = useMemo(() => {
    const s = new Set(allProducts.map((p) => p.category));
    return Array.from(s);
  }, [allProducts]);

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    const r = products.filter((product) => {
      if (min !== null && product.price < min) return false;
      if (max !== null && product.price > max) return false;
      return true;
    });
    if (sort === "price-asc") r.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r.sort((a, b) => b.price - a.price);
    if (sort === "rating") r.sort((a, b) => b.rating - a.rating);
    return r;
  }, [maxPrice, minPrice, products, sort]);

  function applySearch() {
    setAppliedQ(q);
    setVisible(PAGE_SIZE);
  }

  function resetFilters() {
    setQ("");
    setAppliedQ("");
    setCat("all");
    setSort("popular");
    setMinPrice("");
    setMaxPrice("");
    setVisible(PAGE_SIZE);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient pb-16 pt-12 text-white">
        <div className="container relative z-10 grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="gradient-text text-[38px] font-semibold">{t("heading")}</h1>
            <p className="mt-3 max-w-md text-white/85 leading-relaxed">
              Explore our curated shop with hearing devices, accessories, and clinical care essentials.
            </p>
            <Link href="#products" className="mt-6 inline-block">
              <Button className="rounded-full bg-white px-8 font-semibold text-[#ca79c6] hover:bg-white/90">
                {t("shopNow")}
              </Button>
            </Link>
          </div>
          <div className="hidden md:flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=350&fit=crop"
              alt="Shop hero"
              className="h-56 w-56 rounded-full object-cover shadow-2xl border-4 border-white/30"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 60" className="w-full fill-white">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Search / filter bar */}
      <section id="products" className="container py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-[20px] border-l-4 border-[#ca79c6] bg-white p-4 shadow-[0_11px_26px_rgba(6,28,61,0.1)]">
          <div className="relative flex-1 min-w-48">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={q}
              onChange={(e) => { setQ(e.target.value); setVisible(PAGE_SIZE); }}
              className="pl-9 rounded-lg"
            />
          </div>
          <Input
            type="number"
            min="0"
            placeholder={t("minPrice")}
            value={minPrice}
            onChange={(event) => { setMinPrice(event.target.value); setVisible(PAGE_SIZE); }}
            className="w-32 rounded-lg"
          />
          <Input
            type="number"
            min="0"
            placeholder={t("maxPrice")}
            value={maxPrice}
            onChange={(event) => { setMaxPrice(event.target.value); setVisible(PAGE_SIZE); }}
            className="w-32 rounded-lg"
          />
          <Select value={cat} onValueChange={(v) => { setCat(v); setVisible(PAGE_SIZE); }}>
            <SelectTrigger className="w-44 rounded-lg">
              <SelectValue placeholder={t("allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              {allCategories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-44 rounded-lg">
              <SelectValue placeholder={t("sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">{t("popular")}</SelectItem>
              <SelectItem value="price-asc">{t("priceLow")}</SelectItem>
              <SelectItem value="price-desc">{t("priceHigh")}</SelectItem>
              <SelectItem value="rating">{t("topRated")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="gradient" className="px-6" onClick={applySearch}>{t("searchButton")}</Button>
          <Button variant="outline" className="rounded-full px-5" onClick={resetFilters}>{t("resetFilters")}</Button>
        </div>

        <p className="mb-6 font-semibold text-gray-800">{t("allProduct")}</p>

        {loading ? (
          <div className="rounded-xl border bg-white p-12 text-center text-muted-foreground">
            {t("loadingProducts")}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center text-muted-foreground">
            {t("noProducts")}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {filtered.slice(0, visible).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}

        {visible < filtered.length && (
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              className="rounded-full border-purple-300 px-10 text-purple-700 hover:bg-purple-50"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              {t("loadMore")}
            </Button>
          </div>
        )}
      </section>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-muted-foreground">Loading...</div>}>
      <ShopInner />
    </Suspense>
  );
}
