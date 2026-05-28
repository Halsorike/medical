"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

type ApiBlogCategory = {
  id: string;
  name: string;
  _count?: { posts: number };
};

export default function BlogCategoriesPage() {
  const [blogCategories, setBlogCategories] = useState<ApiBlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog-categories")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiBlogCategory[] }) => setBlogCategories(payload.data))
      .catch(() => toast.error("Blog categories could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  async function deleteCategory(id: string) {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    const response = await fetch(`/api/blog-categories/${id}`, { method: "DELETE" });

    if (!response.ok) {
      toast.error("Category could not be deleted");
      return;
    }

    setBlogCategories((current) => current.filter((category) => category.id !== id));
    toast.success("Category deleted");
  }

  return (
    <>
      <PageHeader title="Blog categories" description="Group blog posts under categories" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New category</Button>} />
      <DataTable
        rows={blogCategories}
        empty={loading ? "Loading blog categories..." : "No blog categories."}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Category name", accessor: (r) => r.name },
          { header: "# of blogs", accessor: (r) => r._count?.posts ?? 0 },
          { header: "Action", accessor: (r) => (
            <div className="flex gap-2 text-muted-foreground">
              <button className="hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button className="hover:text-red-600" aria-label="Delete" onClick={() => void deleteCategory(r.id)}><Trash2 className="h-4 w-4" /></button>
            </div>
          ) },
        ]}
      />
      <Pagination total={blogCategories.length} />
    </>
  );
}
