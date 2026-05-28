"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Pencil, Trash2, Search, Filter } from "lucide-react";
import { evaluations, evaluationSubmissions } from "@/data/clinic";

// Mock hearing test data (same shape as evaluations)
const hearingTests = evaluations.map((e) => ({
  ...e,
  id: `HT-${e.id}`,
  name: e.name.replace("Eval", "Hearing Test"),
}));

export default function EvaluationsPage() {
  const [q, setQ] = useState("");

  const filteredEvals = useMemo(
    () => evaluations.filter((e) => q === "" || e.name.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  const filteredHearing = useMemo(
    () => hearingTests.filter((e) => q === "" || e.name.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  const actionCell = (name: string) => (
    <div className="flex items-center gap-2 text-muted-foreground">
      <button aria-label={`Edit ${name}`} className="hover:text-primary min-h-[44px] min-w-[44px] flex items-center justify-center">
        <Pencil className="h-4 w-4" />
      </button>
      <button aria-label={`Delete ${name}`} className="hover:text-destructive min-h-[44px] min-w-[44px] flex items-center justify-center">
        <Trash2 className="h-4 w-4" />
      </button>
      <button aria-label={`View ${name}`} className="hover:text-primary min-h-[44px] min-w-[44px] flex items-center justify-center">
        <Eye className="h-4 w-4" />
      </button>
    </div>
  );

  const evalColumns = [
    { header: "Evaluation ID", accessor: (r: typeof evaluations[number]) => r.id },
    { header: "Evaluation Name", accessor: (r: typeof evaluations[number]) => r.name },
    { header: "# of Submissions", accessor: (r: typeof evaluations[number]) => r.submissions },
    { header: "Action", accessor: (r: typeof evaluations[number]) => actionCell(r.name) },
  ];

  const hearingColumns = [
    { header: "Evaluation ID", accessor: (r: typeof hearingTests[number]) => r.id },
    { header: "Evaluation Name", accessor: (r: typeof hearingTests[number]) => r.name },
    { header: "# of Submissions", accessor: (r: typeof hearingTests[number]) => r.submissions },
    { header: "Action", accessor: (r: typeof hearingTests[number]) => actionCell(r.name) },
  ];

  return (
    <>
      <PageHeader
        title="Evaluations"
        description="Tests, scoring forms and patient submissions"
        action={
          <Button variant="gradient">
            <Plus className="mr-1 h-4 w-4" />
            New Evaluation
          </Button>
        }
      />

      <Tabs defaultValue="evaluations">
        <TabsList>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
          <TabsTrigger value="hearing-test">Hearing Test</TabsTrigger>
        </TabsList>

        {/* Search bar — shown on Evaluations + Hearing Test tabs */}
        <div className="my-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon" aria-label="Filter">
            <Filter className="h-4 w-4 text-primary" />
          </Button>
        </div>

        <TabsContent value="submissions">
          <DataTable
            rows={evaluationSubmissions}
            rowKey={(r) => r.id}
            columns={[
              { header: "Submissions ID", accessor: (r) => r.id },
              { header: "Evaluation", accessor: (r) => r.evaluationName },
              { header: "Email", accessor: (r) => r.email },
              { header: "Score", accessor: (r) => r.score },
              { header: "Results", accessor: (r) => r.result },
              { header: "Date", accessor: (r) => r.date },
            ]}
          />
          <Pagination total={evaluationSubmissions.length} />
        </TabsContent>

        <TabsContent value="evaluations">
          <DataTable rows={filteredEvals} rowKey={(r) => r.id} columns={evalColumns} />
          <Pagination total={filteredEvals.length} />
        </TabsContent>

        <TabsContent value="hearing-test">
          <DataTable rows={filteredHearing} rowKey={(r) => r.id} columns={hearingColumns} />
          <Pagination total={filteredHearing.length} />
        </TabsContent>
      </Tabs>
    </>
  );
}
