"use client";
import { Link } from "@/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
export default function Login() {
  return (
    <div className="container grid min-h-[70vh] place-items-center py-10">
      <form className="w-full max-w-md space-y-3 rounded-lg border bg-white p-6">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your Medical account</p>
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" type="password" required /></div>
        <Button variant="gradient" className="w-full">Sign in</Button>
        <p className="text-center text-sm text-muted-foreground">New here? <Link href="/register" className="text-primary">Create account</Link></p>
      </form>
    </div>
  );
}
