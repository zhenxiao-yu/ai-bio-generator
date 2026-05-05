"use client";
import React, { useRef, useEffect } from "react";
import { BorderBeam } from "../magicui/border-beam";
import { useBioStore, PLATFORMS } from "@/store/bioStore";
import BioCardSkeleton, { BioCardSkeletons } from "./BioCardSkeleton";
import ErrorCard from "./ErrorCard";
import BioCard from "./BioCard";
import BatchOutputTabs from "./BatchOutputTabs";
import { useBioExport } from "@/hooks/useBioExport";
import { FileText, Sparkles, Download, Layers, Loader2 } from "lucide-react";
import { Button } from "../shadcn-ui/button";
import type { Platform } from "@/types";

// Stable objects so React.memo on BioCard doesn't break on style prop identity
const CARD_STYLES: React.CSSProperties[] = [0, 1, 2, 3].map((i) => ({ animationDelay: `${i * 90}ms` }));

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-5 p-10 sm:p-14 text-center">
    <div className="relative animate-float-y">
      <div className="w-16 h-16 rounded-2xl bg-muted/80 border border-border/70 flex items-center justify-center shadow-sm">
        <FileText className="w-7 h-7 text-muted-foreground/50" aria-hidden="true" />
      </div>
      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Sparkles className="w-3 h-3 text-primary/60" aria-hidden="true" />
      </div>
    </div>
    <div className="space-y-1.5">
      <p className="text-sm font-semibold text-foreground/75">Ready to generate</p>
      <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
        Fill in your details and click{" "}
        <strong className="font-semibold text-foreground/60">Generate</strong>{" "}
        to create 4 personalised bios.
      </p>
    </div>
  </div>
);

const Output = () => {
  const {
    bios,
    loading,
    error,
    clearError,
    platform,
    lastPayload,
    batchLoading,
    generateAllPlatforms,
  } = useBioStore();
  const { exportAllBios } = useBioExport();
  const outputRef = useRef<HTMLDivElement>(null);

  const platformConfig = PLATFORMS[platform as Platform];
  const characterLimit = platformConfig?.characterLimit ?? 200;

  useEffect(() => {
    if (bios.length > 0) {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [bios]);

  return (
    <div ref={outputRef} className="flex flex-col gap-4">
      <div className="relative flex min-h-[50vh] flex-col rounded-xl bg-card/90 backdrop-blur-sm overflow-hidden border border-border/60 shadow-sm">
        {loading && (
          <BorderBeam size={1200} borderWidth={1.5} duration={4} className="z-10" aria-hidden="true" />
        )}

        {loading && bios.every((b) => !b.text) ? (
          <BioCardSkeletons />
        ) : error ? (
          <ErrorCard message={error} onRetry={clearError} />
        ) : bios.length === 0 || bios.every((b) => !b.text) ? (
          <EmptyState />
        ) : (
          <div className="p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-xs text-muted-foreground">
                {bios.filter((b) => b.text).length} bio{bios.filter((b) => b.text).length !== 1 ? "s" : ""} · {PLATFORMS[platform as Platform]?.name}
                {loading && <span className="ml-1 animate-pulse">·</span>}
              </p>
              <div className="flex items-center gap-2">
                {!loading && lastPayload && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs h-7"
                    onClick={generateAllPlatforms}
                    disabled={batchLoading}
                    aria-label="Generate bios for all 5 platforms"
                  >
                    {batchLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                    ) : (
                      <Layers className="w-3 h-3" aria-hidden="true" />
                    )}
                    All Platforms
                  </Button>
                )}
                {!loading && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs h-7"
                    onClick={() => exportAllBios(bios.map((b) => b.text).filter(Boolean))}
                    aria-label="Export all bios as text file"
                  >
                    <Download className="w-3 h-3" aria-hidden="true" />
                    Export
                  </Button>
                )}
              </div>
            </div>
            <ul
              aria-live="polite"
              aria-atomic="false"
              aria-label="Generated bios"
              className="flex flex-col gap-3"
            >
              {bios.map((bio, index) =>
                bio.text ? (
                  <BioCard
                    key={index}
                    text={bio.text}
                    index={index}
                    edited={bio.edited}
                    platform={platform as Platform}
                    characterLimit={characterLimit}
                    score={bio.score}
                    isStreaming={loading}
                    style={CARD_STYLES[index]}
                  />
                ) : loading ? (
                  <BioCardSkeleton key={index} />
                ) : null
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Batch all-platform results */}
      <BatchOutputTabs />
    </div>
  );
};

export default Output;
