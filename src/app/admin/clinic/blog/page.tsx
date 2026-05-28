"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Plus, Check, X, Pencil } from "lucide-react";

type ApiBlogPost = {
  id: string;
  title: string;
  category: string;
  date: string;
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<ApiBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiBlogPost[] }) => setBlogs(payload.data))
      .catch(() => toast.error("Blog posts could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Blog" description="Articles published on the clinic site" action={<Button variant="gradient"><Plus className="mr-1 h-4 w-4" />New blog</Button>} />
      <DataTable
        rows={blogs}
        empty={loading ? "Loading blog posts..." : "No blog posts."}
        rowKey={(r) => r.id}
        columns={[
          { header: "ID", accessor: (r) => r.id },
          { header: "Blog title", accessor: (r) => r.title },
          { header: "Creator", accessor: () => "Admin" },
          { header: "Category", accessor: (r) => r.category },
          { header: "Status", accessor: () => <StatusBadge value="approved" /> },
          { header: "Quick action", accessor: () => (
            <div className="flex gap-2 text-muted-foreground">
              <button className="hover:text-green-600" aria-label="Approve"><Check className="h-4 w-4" /></button>
              <button className="hover:text-red-600" aria-label="Decline"><X className="h-4 w-4" /></button>
              <button className="hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
            </div>
          ) },
        ]}
      />
      <Pagination total={blogs.length} />
    </>
  );
}
