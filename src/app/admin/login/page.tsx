"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Signed in successfully");
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-brand-gradient p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-xl"
      >
        <div className="text-center">
          <p className="text-3xl font-bold">
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Medical Admin
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to the admin dashboard
          </p>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Admin email"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
            autoComplete="current-password"
          />
        </div>

        <Button variant="gradient" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Use the admin credentials configured in your environment.
        </p>
      </form>
    </div>
  );
}
