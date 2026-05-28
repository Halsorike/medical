"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

type ApiBlogCategory = {
  id: string;
  name: string;
  _count?: { posts: number };
};

export default function BlogCategoriesPage() {
  const { labels } = useAdminLocale();
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
    if (!window.confirm(labels.common.confirmDelete)) return;

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
      <PageHeader title={labels.blogCategories.title} description={labels.blogCategories.description} action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />{labels.blogCategories.newCategory}</Button>} />
      <DataTable
        rows={blogCategories}
        empty={loading ? labels.common.loading : labels.common.noData}
        rowKey={(r) => r.id}
        columns={[
          { header: labels.common.id, accessor: (r) => r.id },
          { header: labels.blogCategories.title, accessor: (r) => r.name },
          { header: labels.blogCategories.blogsCount, accessor: (r) => r._count?.posts ?? 0 },
          { header: labels.common.actions, accessor: (r) => (
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
