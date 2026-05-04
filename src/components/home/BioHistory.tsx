"use client";

import { useState } from "react";
import { useBioStore } from "@/store/bioStore";
import { History, Trash2, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { cn } from "@/lib/utils";
import { PLATFORMS } from "@/config/platforms";
import { formatDistanceToNow } from "date-fns";
import type { Platform } from "@/types";

const BioHistory = () => {
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const { history, restoreFromHistory, deleteHistoryEntry, clearHistory } = useBioStore();

  if (history.length === 0 && !open) return null;

  return (
    <div className="w-full border border-border rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
        aria-expanded={open}
        aria-controls="history-panel"
      >
        <span className="flex items-center gap-2">
          <History className="w-4 h-4" aria-hidden="true" />
          History
          {history.length > 0 && (
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
              {history.length}
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div id="history-panel" className="border-t border-border">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No generation history yet.
            </p>
          ) : (
            <>
              <ul className="divide-y divide-border max-h-72 overflow-y-auto">
                {history.map((entry) => {
                  const platformConfig = PLATFORMS[entry.platform as Platform];
                  return (
                    <li
                      key={entry.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{entry.snippet}…</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {platformConfig?.name ?? entry.platform} ·{" "}
                          {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => restoreFromHistory(entry.id)}
                          aria-label="Restore this generation"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => deleteHistoryEntry(entry.id)}
                          aria-label="Delete this entry"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  History is stored locally on your device.
                </p>
                {confirmClear ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 text-xs"
                      onClick={() => {
                        clearHistory();
                        setConfirmClear(false);
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => setConfirmClear(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-destructive hover:text-destructive"
                    onClick={() => setConfirmClear(true)}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BioHistory;
