"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, pipe to your error reporting service here
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
        <div className="flex flex-col items-center gap-6 px-4 text-center max-w-sm">
          <div className="text-6xl font-extrabold tracking-tight text-zinc-200 dark:text-zinc-800 select-none">
            500
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              An unexpected error occurred. This has been logged and we&apos;ll look into it.
            </p>
            {error.digest && (
              <p className="text-xs text-zinc-400 font-mono mt-1">ID: {error.digest}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
            <button
              onClick={() => { window.location.href = "/"; }}
              className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Go home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
