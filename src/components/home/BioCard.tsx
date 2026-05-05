"use client";

import React, { useState, useRef } from "react";
import { Copy, Check, Edit2, Download, RefreshCw, X, Save, LayoutTemplate, Linkedin } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Textarea } from "@/components/shadcn-ui/textarea";
import CharacterCounter from "./CharacterCounter";
import BioScorePanel from "./BioScorePanel";
import BioAnalysisPanel from "./BioAnalysisPanel";
import PlatformPreview from "./PlatformPreview";
import { ShareBioButton } from "./ShareBioButton";
import { XIcon } from "@/components/icons/XIcon";
import { cn } from "@/lib/utils";
import { useBioStore } from "@/store/bioStore";
import { useBioExport } from "@/hooks/useBioExport";
import { track } from "@vercel/analytics";
import type { BioScore, Platform } from "@/types";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/siteConfig";

const BIOLOOM_URL = SITE_URL;

function buildXShareUrl(text: string): string {
  const tweet = `${text.slice(0, 200)}\n\nGenerated with BioLoom — ${BIOLOOM_URL}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
}

function buildLinkedInShareUrl(): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(BIOLOOM_URL)}`;
}

interface BioCardProps {
  text: string;
  index: number;
  edited: boolean;
  platform: Platform;
  characterLimit: number;
  score?: BioScore;
  isStreaming?: boolean;
  style?: React.CSSProperties;
}

const BioCard = ({ text, index, edited, platform, characterLimit, score, isStreaming, style }: BioCardProps) => {
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(text);
  const [regenerating, setRegenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const { editBio } = useBioStore();
  const { exportSingleBio } = useBioExport();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      track("bio_copied", { platform });

      // Lazy-load confetti and fire from button position
      const confetti = (await import("canvas-confetti")).default;
      const btn = copyButtonRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        confetti({
          particleCount: 60,
          spread: 55,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
          colors: ["#ffaa40", "#9c40ff", "#40c4ff", "#ff4081"],
          scalar: 0.85,
          ticks: 80,
          gravity: 1.2,
          startVelocity: 22,
          zIndex: 9999,
        });
      }
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  const handleEditStart = () => {
    setEditText(text);
    setEditMode(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleEditSave = () => {
    editBio(index, editText);
    setEditMode(false);
  };

  const handleEditCancel = () => {
    setEditText(text);
    setEditMode(false);
  };

  const handleRegenerate = async () => {
    const { lastPayload } = useBioStore.getState();
    if (!lastPayload) {
      toast.error("No generation context available. Generate bios first.");
      return;
    }
    setRegenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lastPayload, platform }),
      });
      if (res.ok) {
        const json = (await res.json()) as { data: { bio: string }[] };
        if (json.data?.[0]) editBio(index, json.data[0].bio);
      } else {
        toast.error("Failed to regenerate. Please try again.");
      }
    } catch {
      toast.error("Failed to regenerate. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <li
      style={style}
      className={cn(
        "group w-full rounded-xl p-4 relative",
        "bg-card border border-border/60",
        "border-l-[3px] border-l-primary/35 hover:border-l-primary/75",
        "shadow-sm hover:shadow-md hover:shadow-primary/8",
        "hover:-translate-y-0.5",
        "transition-all duration-200 animate-fade-up [animation-fill-mode:both]"
      )}
    >
      {/* Bio text or edit area */}
      {editMode ? (
        <Textarea
          ref={textareaRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="text-sm min-h-[5rem] resize-none mb-2"
          aria-label={`Edit bio ${index + 1}`}
        />
      ) : (
        <p className="text-sm xs:text-base leading-relaxed pr-2">
          {text}
          {isStreaming && <span className="inline-block w-0.5 h-4 ml-0.5 bg-foreground/60 animate-pulse align-middle" aria-hidden />}
        </p>
      )}

      {/* Footer: badges + actions */}
      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {edited && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              edited
            </span>
          )}
          <CharacterCounter count={text.length} limit={characterLimit} />
          <BioScorePanel text={text} index={index} platform={platform} score={score} />
        </div>

        {/* Action buttons */}
        <div className={cn("flex items-center gap-1 flex-wrap", "opacity-100 slg:opacity-0 slg:group-hover:opacity-100 transition-opacity")}>
          {editMode ? (
            <>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleEditSave} aria-label="Save edit">
                <Save className="w-3.5 h-3.5 text-green-600" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleEditCancel} aria-label="Cancel edit">
                <X className="w-3.5 h-3.5" />
              </Button>
            </>
          ) : (
            <>
              {/* Primary actions */}
              <Button ref={copyButtonRef} size="icon" variant="ghost" className="h-7 w-7" onClick={handleCopy} aria-label={`Copy bio ${index + 1}`}>
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleEditStart} aria-label={`Edit bio ${index + 1}`}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={cn("h-7 w-7", showPreview && "bg-muted")}
                onClick={() => setShowPreview((v) => !v)}
                aria-label={showPreview ? "Hide preview" : "Show platform preview"}
                aria-pressed={showPreview}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleRegenerate} disabled={regenerating} aria-label={`Regenerate bio ${index + 1}`}>
                <RefreshCw className={cn("w-3.5 h-3.5", regenerating && "animate-spin")} />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => exportSingleBio(text, index)} aria-label={`Download bio ${index + 1}`}>
                <Download className="w-3.5 h-3.5" />
              </Button>

              {/* Divider before share actions */}
              <span className="w-px h-4 bg-border mx-0.5 shrink-0" aria-hidden="true" />

              {/* Share actions */}
              <ShareBioButton text={text} />
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => window.open(buildXShareUrl(text), "_blank", "noopener,noreferrer")}
                aria-label="Share on X / Twitter"
              >
                <XIcon className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => window.open(buildLinkedInShareUrl(), "_blank", "noopener,noreferrer")}
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Inline analysis panels */}
      <BioAnalysisPanel text={text} />

      {/* Platform preview — toggled */}
      {showPreview && (
        <div className="mt-3 pt-3 border-t border-border">
          <PlatformPreview bio={text} platform={platform} characterLimit={characterLimit} />
        </div>
      )}
    </li>
  );
};

export default React.memo(BioCard);
