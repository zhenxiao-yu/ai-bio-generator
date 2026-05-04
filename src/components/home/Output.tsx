"use client";
import React, { useRef, useEffect } from "react";
import { Badge } from "../shadcn-ui/badge";
import { BorderBeam } from "../magicui/border-beam";
import { useBioStore, PLATFORMS } from "@/store/bioStore";
import { BioCardSkeletons } from "./BioCardSkeleton";
import ErrorCard from "./ErrorCard";
import BioCard from "./BioCard";
import { useBioExport } from "@/hooks/useBioExport";
import { FileText, Sparkles, Download } from "lucide-react";
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
  const { bios, loading, error, clearError, platform } = useBioStore();
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
    <div
      ref={outputRef}
      className="relative flex min-h-[50vh] mt-2 flex-col rounded-xl bg-muted/50 backdrop-blur-sm overflow-hidden border border-primary/5 shadow-lg"
    >
      {loading && (
        <BorderBeam size={1200} borderWidth={1.5} duration={4} className="z-10" aria-hidden="true" />
      )}
      <Badge variant="outline" className="absolute top-3 right-3 z-50">
        Output
      </Badge>

      {loading ? (
        <BioCardSkeletons />
      ) : error ? (
        <ErrorCard message={error} onRetry={clearError} />
      ) : bios.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {bios.length} bio{bios.length !== 1 ? "s" : ""} generated
            </p>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs h-7"
              onClick={() => exportAllBios(bios.map((b) => b.text))}
              aria-label="Export all bios as text file"
            >
              <Download className="w-3 h-3" aria-hidden="true" />
              Export All
            </Button>
          </div>
          <ul
            aria-live="polite"
            aria-atomic="false"
            aria-label="Generated bios"
            className="flex flex-col gap-3"
          >
            {bios.map((bio, index) => (
              <BioCard
                key={index}
                text={bio.text}
                index={index}
                edited={bio.edited}
                platform={platform as Platform}
                characterLimit={characterLimit}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Output;
