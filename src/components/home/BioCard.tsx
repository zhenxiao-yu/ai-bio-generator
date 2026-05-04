"use client";

import { useState, useRef } from "react";
import { Copy, Check, Edit2, Download, RefreshCw, X, Save } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { Textarea } from "@/components/shadcn-ui/textarea";
import CharacterCounter from "./CharacterCounter";
import BioScorePanel from "./BioScorePanel";
import { cn } from "@/lib/utils";
import { useBioStore } from "@/store/bioStore";
import { useBioExport } from "@/hooks/useBioExport";
import type { BioScore, Platform } from "@/types";
import { toast } from "sonner";

interface BioCardProps {
  text: string;
  index: number;
  edited: boolean;
  platform: Platform;
  characterLimit: number;
  score?: BioScore;
}

const BioCard = ({ text, index, edited, platform, characterLimit, score }: BioCardProps) => {
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(text);
  const [regenerating, setRegenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { editBio } = useBioStore();
  const { exportSingleBio } = useBioExport();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    setRegenerating(true);
    // Get the current form state from the last generate call (stored via the store)
    // For a single bio regeneration, we re-run the full generation and swap just this slot
    // This is a simplified approach: full generation + pick one result
    const state = useBioStore.getState();
    if (!state.bios.length) {
      setRegenerating(false);
      return;
    }

    try {
      // Trigger a new single generation with a small fetch
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 1,
          content: "Generate one unique bio variation",
          type: "personal",
          tone: "professional",
          emojis: false,
          platform,
        }),
      });
      if (res.ok) {
        const json = (await res.json()) as { data: { bio: string }[] };
        if (json.data?.[0]) {
          editBio(index, json.data[0].bio);
        }
      }
    } catch {
      toast.error("Failed to regenerate. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <li
      className={cn(
        "group w-full border border-border rounded-xl p-4 relative",
        "bg-gradient-to-br from-background to-muted/30",
        "border-l-4 border-l-foreground/20 hover:border-l-foreground/60",
        "hover:shadow-lg hover:shadow-foreground/5 hover:-translate-y-px",
        "transition-all duration-200 animate-fade-up"
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
        <p className="text-sm xs:text-base leading-relaxed pr-2">{text}</p>
      )}

      {/* Footer: badges + actions */}
      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {edited && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              edited
            </span>
          )}
          <CharacterCounter count={text.length} limit={characterLimit} />
          <BioScorePanel text={text} index={index} platform={platform} score={score} />
        </div>

        {/* Action buttons — always visible on mobile, hover on desktop */}
        <div className={cn("flex items-center gap-1", "opacity-100 slg:opacity-0 slg:group-hover:opacity-100 transition-opacity")}>
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
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={handleCopy}
                aria-label={`Copy bio ${index + 1}`}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={handleEditStart}
                aria-label={`Edit bio ${index + 1}`}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={handleRegenerate}
                disabled={regenerating}
                aria-label={`Regenerate bio ${index + 1}`}
              >
                <RefreshCw className={cn("w-3.5 h-3.5", regenerating && "animate-spin")} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => exportSingleBio(text, index)}
                aria-label={`Download bio ${index + 1}`}
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default BioCard;
