"use client";
import { Link } from "@/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
export default function Register() {
  return (
    <div className="container grid min-h-[70vh] place-items-center py-10">
      <form className="w-full max-w-md space-y-3 rounded-lg border bg-white p-6">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <div><Label>Full name</Label><Input required /></div>
        <div><Label>Email</Label><Input type="email" required /></div>
        <div><Label>Password</Label><Input type="password" required /></div>
        <Button variant="gradient" className="w-full">Create account</Button>
        <p className="text-center text-sm text-muted-foreground">Already have one? <Link href="/login" className="text-primary">Sign in</Link></p>
      </form>
    </div>
  );
}
