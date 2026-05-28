"use client";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BulkImport() {
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");
  return (
    <>
      <PageHeader title="Bulk import & upload" description="Import products in bulk via CSV/XLSX" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <p className="mb-4 font-semibold">Upload file</p>
          <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary">
            <Upload className="h-8 w-8" /><span>Click to select CSV or XLSX</span>
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={() => { setStatus("uploading"); setTimeout(() => setStatus("done"), 1000); }} />
          </label>
          {status === "uploading" && <p className="mt-3 text-sm text-muted-foreground">Uploading…</p>}
          {status === "done" && <p className="mt-3 flex items-center gap-2 text-sm text-green-700"><CheckCircle2 className="h-4 w-4" />Imported 128 products successfully.</p>}
        </div>
        <div className="rounded-lg border bg-white p-6">
          <p className="mb-4 font-semibold">Template</p>
          <p className="mb-4 text-sm text-muted-foreground">Download our template, fill it in, and upload.</p>
          <Button variant="outline"><FileText className="mr-2 h-4 w-4" />Download CSV template</Button>
        </div>
      </div>
    </>
  );
}
