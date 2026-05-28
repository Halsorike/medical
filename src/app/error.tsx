"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <html lang="en">
      <body>
        <main className="container grid min-h-screen place-items-center py-20 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Something went wrong</p>
            <h1 className="mt-2 text-2xl font-bold">We could not load this page.</h1>
            <p className="mt-2 text-muted-foreground">Please try again in a moment.</p>
            <Button variant="gradient" className="mt-6" onClick={reset}>
              Try again
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
