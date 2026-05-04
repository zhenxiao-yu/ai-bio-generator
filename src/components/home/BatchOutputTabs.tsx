"use client";

import { useState } from "react";
import { useBioStore, PLATFORMS } from "@/store/bioStore";
import { PLATFORM_ORDER } from "@/config/platforms";
import { cn } from "@/lib/utils";
import BioCard from "./BioCard";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import type { Platform } from "@/types";

const BatchOutputTabs = () => {
  const { batchBios, batchLoading, clearBatchBios } = useBioStore();
  const [activeTab, setActiveTab] = useState<Platform>("general");

  const availablePlatforms = PLATFORM_ORDER.filter(
    (p) => batchBios[p] && (batchBios[p]?.length ?? 0) > 0
  );

  if (!batchLoading && availablePlatforms.length === 0) return null;

  // Default to first available platform
  const currentTab = availablePlatforms.includes(activeTab)
    ? activeTab
    : availablePlatforms[0] ?? "general";
  const currentBios = batchBios[currentTab] ?? [];
  const currentLimit = PLATFORMS[currentTab]?.characterLimit ?? 200;

  return (
    <div className="mt-4 border border-border rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <p className="text-sm font-semibold">All Platforms</p>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={clearBatchBios}
          aria-label="Close all-platform results"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {batchLoading ? (
        <div
          className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground"
          role="status"
          aria-label="Generating for all platforms"
        >
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          Generating for all 5 platforms…
        </div>
      ) : (
        <>
          {/* Platform tabs */}
          <div className="flex overflow-x-auto border-b border-border px-1 pt-1 gap-0.5 scrollbar-none">
            {availablePlatforms.map((p) => (
              <button
                key={p}
                onClick={() => setActiveTab(p)}
                className={cn(
                  "flex-shrink-0 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors",
                  currentTab === p
                    ? "bg-background border border-b-0 border-border text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                aria-selected={currentTab === p}
                role="tab"
              >
                {PLATFORMS[p].name}
              </button>
            ))}
          </div>

          {/* Bio list */}
          <ul
            aria-live="polite"
            aria-label={`Generated bios for ${PLATFORMS[currentTab]?.name}`}
            className="flex flex-col gap-3 p-4"
            role="tabpanel"
          >
            {currentBios.map((bio, index) => (
              <BioCard
                key={`${currentTab}-${index}`}
                text={bio.text}
                index={index}
                edited={bio.edited}
                platform={currentTab}
                characterLimit={currentLimit}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default BatchOutputTabs;
