export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div><h1 className="text-2xl font-bold">{title}</h1>{description && <p className="text-sm text-muted-foreground">{description}</p>}</div>
      {action}
    </div>
  );
}
