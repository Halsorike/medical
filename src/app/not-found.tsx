import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="container grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="bg-brand-gradient bg-clip-text text-7xl font-bold text-transparent">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">The page you’re looking for doesn’t exist or was moved.</p>
        <Link href="/"><Button variant="gradient" className="mt-6">Back home</Button></Link>
      </div>
    </div>
  );
}
