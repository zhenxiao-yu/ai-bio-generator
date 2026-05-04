"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import type { BioScore, Platform } from "@/types";
import { useBioStore } from "@/store/bioStore";

interface BioScorePanelProps {
  text: string;
  index: number;
  platform: Platform;
  score?: BioScore;
}

const SCORE_LABELS: Record<keyof BioScore["scores"], string> = {
  clarity: "Clarity",
  platformFit: "Platform Fit",
  keywords: "Keywords",
  brevity: "Brevity",
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 25) * 100;
  const color = pct >= 80 ? "bg-green-500" : pct >= 56 ? "bg-yellow-500" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono tabular-nums text-muted-foreground w-8 text-right">
        {value}/25
      </span>
    </div>
  );
}

function overallColor(score: number) {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 56) return "text-yellow-600 dark:text-yellow-400";
  return "text-destructive";
}

const BioScorePanel = ({ text, index, platform, score }: BioScorePanelProps) => {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { setBioScore } = useBioStore();

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: text, platform }),
      });
      if (res.ok) {
        const data = (await res.json()) as BioScore;
        setBioScore(index, data);
        setExpanded(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!score) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
        onClick={analyze}
        disabled={loading}
        aria-label="Analyze this bio"
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="w-3 h-3" aria-hidden="true" />
        )}
        {loading ? "Analyzing…" : "Analyze"}
      </Button>
    );
  }

  return (
    <div className="mt-2 border-t border-border pt-2">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 w-full text-left group"
        aria-expanded={expanded}
      >
        <Sparkles className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs text-muted-foreground flex-1">Score</span>
        <span className={cn("text-sm font-bold tabular-nums", overallColor(score.overall))}>
          {score.overall}/100
        </span>
        {expanded ? (
          <ChevronUp className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-2 animate-fade-up">
          {(Object.entries(score.scores) as [keyof BioScore["scores"], number][]).map(
            ([key, val]) => (
              <ScoreBar key={key} label={SCORE_LABELS[key]} value={val} />
            )
          )}
          <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
            <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0 text-yellow-500" aria-hidden="true" />
            <p>{score.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BioScorePanel;
