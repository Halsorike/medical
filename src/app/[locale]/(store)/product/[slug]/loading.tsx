export default function ProductLoading() {
  return (
    <div className="container grid gap-10 py-10 md:grid-cols-2">
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="aspect-square animate-pulse rounded-xl border bg-muted" />
        ))}
      </div>
      <div className="space-y-4">
        <div className="h-7 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-24 animate-pulse rounded bg-muted" />
        <div className="h-11 w-44 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}
