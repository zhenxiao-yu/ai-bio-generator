"use client";

import { cn } from "@/lib/utils";

interface CharacterCounterProps {
  count: number;
  limit: number;
  className?: string;
}

const CharacterCounter = ({ count, limit, className }: CharacterCounterProps) => {
  const pct = (count / limit) * 100;
  const isOver = count > limit;
  const isWarning = pct >= 80 && !isOver;

  return (
    <span
      className={cn(
        "text-xs font-mono tabular-nums transition-colors duration-200",
        isOver && "text-destructive font-semibold",
        isWarning && "text-yellow-600 dark:text-yellow-400",
        !isOver && !isWarning && "text-muted-foreground",
        className
      )}
      aria-live="polite"
      aria-label={`${count} of ${limit} characters`}
    >
      {count}/{limit}
      {isOver && <span className="ml-1 text-destructive">(+{count - limit})</span>}
    </span>
  );
};

export default CharacterCounter;
