import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md space-y-6">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          404 — error
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          This is a single-page portfolio — there&apos;s only one page to see.
        </p>
        <div className="pt-2">
          <Button asChild size="default">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to portfolio
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
