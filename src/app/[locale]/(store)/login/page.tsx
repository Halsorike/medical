"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const response = await fetch("/api/auth/patient/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);

    if (!response.ok) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Welcome back");
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="container grid min-h-[70vh] place-items-center py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-2xl border border-brand-100 bg-white p-7 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your Echo Wellness account</p>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
        </div>
        <Button type="submit" variant="gradient" className="w-full" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New here? <Link href="/register" className="text-primary">Create account</Link>
        </p>
      </form>
    </div>
  );
}
