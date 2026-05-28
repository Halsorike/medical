export default function BlogLoading() {
  return (
    <div className="container grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border bg-white">
          <div className="h-44 animate-pulse bg-muted" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-5 animate-pulse rounded bg-muted" />
            <div className="h-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
