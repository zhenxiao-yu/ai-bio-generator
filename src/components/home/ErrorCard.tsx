"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { useBioStore } from "@/store/bioStore";

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

const ErrorCard = ({ message, onRetry }: ErrorCardProps) => {
  const { errorCode, retryAfter } = useBioStore();
  const isRateLimit = errorCode === "RATE_LIMIT";

  const [secondsLeft, setSecondsLeft] = useState<number | null>(
    isRateLimit && retryAfter ? retryAfter : null
  );

  useEffect(() => {
    if (!isRateLimit || !retryAfter) {
      setSecondsLeft(null);
      return;
    }
    setSecondsLeft(retryAfter);
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s === null || s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRateLimit, retryAfter]);

  const canRetry = !isRateLimit || secondsLeft === 0;

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <AlertCircle className="w-10 h-10 text-destructive" aria-hidden="true" />
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>

      {isRateLimit && secondsLeft !== null && secondsLeft > 0 && (
        <div
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>
            Try again in <strong className="tabular-nums">{secondsLeft}s</strong>
          </span>
        </div>
      )}

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={!canRetry}
          aria-label={canRetry ? "Retry generation" : `Retry available in ${secondsLeft} seconds`}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {canRetry ? "Try again" : `Wait ${secondsLeft}s`}
        </Button>
      )}
    </div>
  );
};

export default ErrorCard;
