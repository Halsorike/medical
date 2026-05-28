"use client";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { blogCategories } from "@/data/clinic";

export default function BlogCategoriesPage() {
  return (
    <>
      <PageHeader title="Blog categories" description="Group blog posts under categories" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New category</Button>} />
      <DataTable
        rows={blogCategories}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Category name", accessor: (r) => r.name },
          { header: "# of blogs", accessor: (r) => r.blogs },
          { header: "Action", accessor: () => (
            <div className="flex gap-2 text-muted-foreground">
              <button className="hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button className="hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          ) },
        ]}
      />
      <Pagination total={blogCategories.length} />
    </>
  );
}
