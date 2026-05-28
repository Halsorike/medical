export default function ShopLoading() {
  return (
    <div className="container py-8">
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <div className="h-96 rounded-lg border bg-white animate-pulse" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-lg border bg-white animate-pulse" />)}
        </div>
      </div>
    </div>
  );
}
