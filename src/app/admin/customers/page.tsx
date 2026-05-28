"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Customer } from "@/types";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/customers")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: Customer[] }) => setCustomers(payload.data))
      .catch(() => toast.error("Customers could not be loaded"));
  }, []);

  const filtered = useMemo(
    () =>
      customers.filter((customer) => {
        const query = q.trim().toLowerCase();
        return (
          query === "" ||
          customer.name.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.toLowerCase().includes(query)
        );
      }),
    [q, customers]
  );

  function toggleAll() {
    setSelected((prev) =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map((c) => c.id))
    );
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleDelete(customer: Customer) {
    const response = await fetch(`/api/customers/${customer.id}`, { method: "DELETE" });

    if (!response.ok) {
      toast.error(`${customer.name} could not be removed`);
      return;
    }

    setCustomers((current) => current.filter((item) => item.id !== customer.id));
    toast.success(`${customer.name} removed`);
  }

  return (
    <>
      <PageHeader title="Customer List" description={`${customers.length} customers total`} />
      <div className="rounded-lg border bg-white">
        <div className="p-4">
          <Input
            placeholder="Search by name, email or phone"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="accent-primary"
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Last Activation Time</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selected.has(c.id)}
                    onChange={() => toggleOne(c.id)}
                    className="accent-primary"
                  />
                </TableCell>
                <TableCell className="text-muted-foreground">{c.id}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell>{formatDate(c.joined)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Link href={`/admin/customers/${c.id}`} aria-label={`Edit ${c.name}`} className="hover:text-primary min-h-[44px] min-w-[44px] flex items-center justify-center">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <Link href={`/admin/customers/${c.id}`} aria-label={`View ${c.name}`} className="hover:text-primary min-h-[44px] min-w-[44px] flex items-center justify-center">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      aria-label={`Delete ${c.name}`}
                      className="hover:text-destructive min-h-[44px] min-w-[44px] flex items-center justify-center"
                      onClick={() => {
                        void handleDelete(c);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
