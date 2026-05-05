"use client";
import React, { useRef, useEffect } from "react";
import { Badge } from "../shadcn-ui/badge";
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

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-4 p-12 text-center opacity-60">
    <div className="relative">
      <FileText className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
      <Sparkles
        className="w-5 h-5 text-muted-foreground absolute -top-1 -right-2"
        aria-hidden="true"
      />
    </div>
    <p className="text-sm text-muted-foreground max-w-xs">
      Fill in your details and click <strong>Generate</strong> to create your personalized bios.
    </p>
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
    if (bios.length > 0 && window.innerWidth < 840) {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [bios]);

  return (
    <div ref={outputRef} className="flex flex-col gap-4">
      <div className="relative flex min-h-[50vh] flex-col rounded-xl bg-muted/50 backdrop-blur-sm overflow-hidden border border-primary/5 shadow-lg">
        {loading && (
          <BorderBeam size={1200} borderWidth={1.5} duration={4} className="z-10" aria-hidden="true" />
        )}
        <Badge variant="outline" className="absolute top-3 right-3 z-50">
          Output
        </Badge>

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
