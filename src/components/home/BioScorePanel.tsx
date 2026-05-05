"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, ChevronDown, ChevronUp, Zap, Eye, Monitor, Flame, Star } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import type { BioScore, Platform } from "@/types";
import { useBioStore } from "@/store/bioStore";

interface BioScorePanelProps {
  text: string;
  index: number;
  platform: Platform;
  score?: BioScore;
}

const SCORE_DIMS: {
  key: keyof BioScore["scores"];
  label: string;
  icon: React.ElementType;
  tip: string;
}[] = [
  { key: "hook", label: "Hook", icon: Zap, tip: "First-impression power" },
  { key: "clarity", label: "Clarity", icon: Eye, tip: "How fast it communicates who you are" },
  { key: "platformFit", label: "Platform Fit", icon: Monitor, tip: "Tone & style match" },
  { key: "impact", label: "Impact", icon: Flame, tip: "Desire to follow or connect" },
  { key: "originality", label: "Originality", icon: Star, tip: "Distinct voice, zero clichés" },
];

function gradeColor(pct: number) {
  if (pct >= 0.8) return "bg-emerald-500";
  if (pct >= 0.6) return "bg-amber-500";
  return "bg-rose-500";
}

function overallColor(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-rose-500";
}

function gradeLetter(score: number) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function ScoreBar({ label, value, icon: Icon, tip }: { label: string; value: number; icon: React.ElementType; tip: string }) {
  const pct = value / 20;
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3 h-3 text-muted-foreground shrink-0" aria-hidden />
      <span className="text-xs text-muted-foreground w-20 shrink-0" title={tip}>{label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", gradeColor(pct))}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <span className="text-xs font-mono tabular-nums text-muted-foreground w-7 text-right">{value}/20</span>
    </div>
  );
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
          <Loader2 className="w-3 h-3 animate-spin" aria-hidden />
        ) : (
          <Sparkles className="w-3 h-3" aria-hidden />
        )}
        {loading ? "Analyzing…" : "Analyze"}
      </Button>
    );
  }

  const grade = gradeLetter(score.overall);

  return (
    <div className="mt-2 border-t border-border pt-2">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 w-full text-left group"
        aria-expanded={expanded}
      >
        <Sparkles className="w-3 h-3 text-muted-foreground" aria-hidden />
        <span className="text-xs text-muted-foreground flex-1">Bio Score</span>
        <span className={cn("text-xs font-mono font-bold px-1.5 py-0.5 rounded", overallColor(score.overall))}>
          {grade}
        </span>
        <span className={cn("text-sm font-bold tabular-nums", overallColor(score.overall))}>
          {score.overall}/100
        </span>
        {expanded ? (
          <ChevronUp className="w-3 h-3 text-muted-foreground" aria-hidden />
        ) : (
          <ChevronDown className="w-3 h-3 text-muted-foreground" aria-hidden />
        )}
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-2 animate-fade-up">
          {SCORE_DIMS.map(({ key, label, icon, tip }) => (
            <ScoreBar key={key} label={label} value={score.scores[key]} icon={icon} tip={tip} />
          ))}

          {/* 3 ordered tips */}
          <div className="mt-1 flex flex-col gap-1.5">
            {score.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                <div className={cn(
                  "shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5",
                  i === 0 ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400" :
                  i === 1 ? "bg-muted text-muted-foreground" : "bg-muted text-muted-foreground/60"
                )}>
                  {i + 1}
                </div>
                <p className="leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>

          <button
            onClick={analyze}
            disabled={loading}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mt-1"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            Re-analyze
          </button>
        </div>
      )}
    </div>
  );
};

export default BioScorePanel;
