"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Pencil, Trash2, Search, Filter } from "lucide-react";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

type ApiEvaluation = {
  id: string;
  patientName: string;
  email: string;
  score: number;
  createdAt: string;
};

type EvaluationDef = { id: string; name: string; submissions: number };

export default function EvaluationsPage() {
  const { labels } = useAdminLocale();
  const [q, setQ] = useState("");
  const [evaluationSubmissions, setEvaluationSubmissions] = useState<ApiEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/evaluations")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: ApiEvaluation[] }) => setEvaluationSubmissions(payload.data))
      .catch(() => toast.error("Evaluations could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  const evaluations = useMemo<EvaluationDef[]>(
    () => [
      {
        id: "EVL-HEARING",
        name: "Hearing Evaluation",
        submissions: evaluationSubmissions.length,
      },
    ],
    [evaluationSubmissions.length]
  );

  const hearingTests = useMemo(
    () =>
      evaluations.map((evaluation) => ({
        ...evaluation,
        id: `HT-${evaluation.id}`,
        name: evaluation.name,
      })),
    [evaluations]
  );

  const filteredEvals = useMemo(
    () => evaluations.filter((e) => q === "" || e.name.toLowerCase().includes(q.toLowerCase())),
    [evaluations, q]
  );
  const filteredHearing = useMemo(
    () => hearingTests.filter((e) => q === "" || e.name.toLowerCase().includes(q.toLowerCase())),
    [hearingTests, q]
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
    { header: "Evaluation ID", accessor: (r: EvaluationDef) => r.id },
    { header: "Evaluation Name", accessor: (r: EvaluationDef) => r.name },
    { header: "# of Submissions", accessor: (r: EvaluationDef) => r.submissions },
    { header: "Action", accessor: (r: EvaluationDef) => actionCell(r.name) },
  ];

  const hearingColumns = [
    { header: "Evaluation ID", accessor: (r: EvaluationDef) => r.id },
    { header: "Evaluation Name", accessor: (r: EvaluationDef) => r.name },
    { header: "# of Submissions", accessor: (r: EvaluationDef) => r.submissions },
    { header: "Action", accessor: (r: EvaluationDef) => actionCell(r.name) },
  ];

  return (
    <>
      <PageHeader
        title={labels.evaluations.title}
        description={labels.evaluations.description}
        action={
          <Button variant="gradient">
            <Plus className="mr-1 h-4 w-4" />
            {labels.common.add}
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
            empty={loading ? labels.common.loading : labels.common.noData}
            rowKey={(r) => r.id}
            columns={[
              { header: labels.common.id, accessor: (r) => r.id },
              { header: labels.evaluations.title, accessor: () => "Hearing Evaluation" },
              { header: labels.patients.email, accessor: (r) => r.email },
              { header: labels.evaluations.score, accessor: (r) => r.score },
              { header: labels.evaluations.results, accessor: (r) => (r.score >= 70 ? "Good" : "Needs Attention") },
              { header: labels.appointments.date, accessor: (r) => new Date(r.createdAt).toLocaleDateString() },
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
