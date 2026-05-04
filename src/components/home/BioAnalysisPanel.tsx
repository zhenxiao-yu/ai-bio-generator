"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Zap, AlertTriangle, BookOpen, CheckCircle2 } from "lucide-react";
import { analyzeBio } from "@/lib/bioAnalysis";

interface BioAnalysisPanelProps {
  text: string;
}

const BioAnalysisPanel = ({ text }: BioAnalysisPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  const analysis = useMemo(() => analyzeBio(text), [text]);

  const hasBuzzwords = analysis.buzzwords.length > 0;
  const powerStrength =
    analysis.powerWordCount === 0
      ? "weak"
      : analysis.powerWordCount < 2
        ? "ok"
        : "strong";

  const gradeColor =
    analysis.readingGrade <= 9
      ? "text-green-600 dark:text-green-400"
      : analysis.readingGrade <= 12
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-destructive";

  return (
    <div className="mt-2 border-t border-border pt-2">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 w-full text-left group"
        aria-expanded={expanded}
        aria-label="Toggle copy analysis"
      >
        <Zap className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs text-muted-foreground flex-1">Copy Analysis</span>
        <span className="flex items-center gap-1.5">
          {hasBuzzwords && (
            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
              {analysis.buzzwords.length} buzzword{analysis.buzzwords.length !== 1 ? "s" : ""}
            </span>
          )}
          <span className={cn("text-xs font-medium", gradeColor)}>
            Grade {analysis.readingGrade}
          </span>
        </span>
        {expanded ? (
          <ChevronUp className="w-3 h-3 text-muted-foreground ml-1" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-3 h-3 text-muted-foreground ml-1" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-2.5 animate-fade-up">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="Words" value={String(analysis.wordCount)} />
            <Stat label="Reading" value={analysis.readingLabel} />
            <Stat
              label="Power words"
              value={String(analysis.powerWordCount)}
              valueClass={
                powerStrength === "strong"
                  ? "text-green-600 dark:text-green-400"
                  : powerStrength === "weak"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }
            />
          </div>

          {/* Buzzword warnings */}
          {hasBuzzwords && (
            <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-2 text-xs">
              <AlertTriangle
                className="w-3.5 h-3.5 mt-0.5 shrink-0 text-yellow-600 dark:text-yellow-400"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-yellow-700 dark:text-yellow-300 mb-0.5">
                  Overused phrases detected
                </p>
                <p className="text-yellow-600 dark:text-yellow-400">
                  {analysis.buzzwords.map((b, i) => (
                    <span key={b}>
                      <span className="font-mono">&quot;{b}&quot;</span>
                      {i < analysis.buzzwords.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}

          {/* Reading level */}
          <div className="flex items-start gap-2 bg-muted/40 rounded-lg p-2 text-xs">
            <BookOpen
              className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <span className="font-medium text-foreground">
                Grade {analysis.readingGrade} ({analysis.readingLabel})
              </span>
              <span className="text-muted-foreground ml-1">
                — {analysis.readingGrade <= 9 ? "Great for social bios." : analysis.readingGrade <= 12 ? "Consider simplifying." : "Too complex — aim for grade 8-10."}
              </span>
            </div>
          </div>

          {/* CTA check */}
          {analysis.hasCallToAction && (
            <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Has a call to action — good for engagement.</span>
            </div>
          )}

          {/* Power word nudge */}
          {powerStrength === "weak" && (
            <p className="text-xs text-muted-foreground pl-1">
              Tip: Add action verbs like <span className="font-mono text-foreground">built</span>,{" "}
              <span className="font-mono text-foreground">launched</span>, or{" "}
              <span className="font-mono text-foreground">led</span> to strengthen impact.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

function Stat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 bg-muted/40 rounded-lg py-1.5 px-2">
      <span className={cn("text-sm font-semibold tabular-nums", valueClass ?? "text-foreground")}>
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default BioAnalysisPanel;
