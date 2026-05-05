import Link from "next/link";
import { Button } from "@/components/shadcn-ui/button";
import { Home, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-center gap-6">
      <div className="space-y-2">
        <p className="text-7xl font-extrabold tracking-tight text-muted-foreground/30">404</p>
        <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          This page doesn&apos;t exist. Head back to the generator and create something great.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Open generator
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
