"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, UserX } from "lucide-react";
import { toast } from "sonner";
import type { Customer, Order } from "@/types";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusVariant: Record<string, BadgeProps["variant"]> = {
  delivered: "success",
  shipped: "info",
  pending: "warning",
  cancelled: "destructive",
  refunded: "secondary",
  confirmed: "default",
};

export default function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [relatedOrders, setRelatedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(customer?.status ?? "active");

  useEffect(() => {
    fetch(`/api/customers/${params.id}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { data: Customer & { orderHistory?: Order[] } }) => {
        setCustomer(payload.data);
        setCurrentStatus(payload.data.status);
        setRelatedOrders(payload.data.orderHistory ?? []);
      })
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="rounded-lg border bg-white p-8 text-sm text-muted-foreground">Loading customer...</div>;
  }

  if (!customer) {
    return (
      <>
        <PageHeader
          title="Customer not found"
          description="The requested customer does not exist in the mock customer list."
          action={
            <Button asChild variant="outline">
              <Link href="/admin/customers">Back to customers</Link>
            </Button>
          }
        />
        <div className="rounded-lg border bg-white p-8 text-sm text-muted-foreground">
          No customer matched ID {params.id}.
        </div>
      </>
    );
  }

  const activity = [
    `${customer.name} updated profile details.`,
    `${customer.name} opened the storefront account area.`,
    `${customer.name} last completed checkout review.`,
    `${customer.name} opted in to health newsletter emails.`,
  ];

  const initials = customer.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <PageHeader
        title={`Customer: ${customer.name}`}
        description="Account profile, recent orders, and activity"
        action={
          <Button asChild variant="outline">
            <Link href="/admin/customers">Back to customers</Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order code</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                        No order history linked to this customer in the mock dataset.
                      </TableCell>
                    </TableRow>
                  ) : (
                    relatedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.code}</TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.map((item, index) => (
                <div key={item} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm">{item}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(new Date(Date.now() - index * 86400000))}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Joined</span>
                  <span>{formatDate(customer.joined)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={currentStatus === "active" ? "success" : "secondary"}>{currentStatus}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <Card>
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total orders</p>
                <p className="mt-2 text-2xl font-bold">{customer.orders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total spent</p>
                <p className="mt-2 text-2xl font-bold">{formatCurrency(customer.spent)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Current status</p>
                <p className="mt-2 text-2xl font-bold capitalize">{currentStatus}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  const newStatus = currentStatus === "active" ? "inactive" : "active";
                  setCurrentStatus(newStatus);
                  toast.success(`Customer ${newStatus === "inactive" ? "deactivated" : "activated"}`);
                }}
              >
                <UserX className="mr-2 h-4 w-4" />
                {currentStatus === "active" ? "Deactivate" : "Activate"}
              </Button>
              <Button
                className="w-full"
                variant="gradient"
                onClick={() => toast.success("Customer email queued")}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
