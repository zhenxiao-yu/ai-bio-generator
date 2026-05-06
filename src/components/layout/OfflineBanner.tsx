"use client";

import { useOnline } from "@/hooks/useOnline";
import { WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OfflineBanner() {
  const online = useOnline();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-2 px-4 py-2.5 rounded-full",
        "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900",
        "text-xs font-medium shadow-lg border border-zinc-700 dark:border-zinc-300",
        "transition-all duration-300",
        online
          ? "opacity-0 pointer-events-none translate-y-2"
          : "opacity-100 translate-y-0"
      )}
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      You&apos;re offline — bios can&apos;t be generated until reconnected
    </div>
  );
}
