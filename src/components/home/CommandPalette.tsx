"use client";

import { useEffect, useCallback } from "react";
import { Command } from "cmdk";
import {
  Zap,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  LayoutTemplate,
  Moon,
  Sun,
  Download,
  Trash2,
} from "lucide-react";
import { useBioStore } from "@/store/bioStore";
import { useBioExport } from "@/hooks/useBioExport";
import type { Platform } from "@/types";

const PLATFORM_ITEMS: { value: Platform; label: string; Icon: React.ElementType }[] = [
  { value: "general", label: "General", Icon: Globe },
  { value: "twitter", label: "Twitter / X", Icon: Twitter },
  { value: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { value: "instagram", label: "Instagram", Icon: Instagram },
  { value: "github", label: "GitHub", Icon: Github },
];

export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setTemplatesModalOpen,
    setPlatform,
    toggleTheme,
    clearHistory,
    bios,
    theme,
  } = useBioStore();
  const { exportAllBios } = useBioExport();

  const close = useCallback(() => setCommandPaletteOpen(false), [setCommandPaletteOpen]);

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen, close]);

  if (!commandPaletteOpen) return null;

  const run = (fn: () => void) => {
    fn();
    close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden />

      {/* Palette */}
      <div
        className="relative w-full max-w-md mx-4 rounded-xl border border-border bg-background shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="[&_[cmdk-input-wrapper]]:border-b [&_[cmdk-input-wrapper]]:border-border">
          <div className="flex items-center px-3 border-b border-border">
            <Command.Input
              autoFocus
              placeholder="Type a command..."
              className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
          </div>

          <Command.List className="max-h-[320px] overflow-y-auto p-1">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Actions"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              <CommandItem
                icon={<Zap className="w-4 h-4" />}
                label="Generate Bio"
                onSelect={() =>
                  run(() => window.dispatchEvent(new CustomEvent("bioloom:generate")))
                }
              />
              <CommandItem
                icon={<LayoutTemplate className="w-4 h-4" />}
                label="Open Templates"
                onSelect={() => run(() => setTemplatesModalOpen(true))}
              />
              <CommandItem
                icon={
                  theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )
                }
                label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                onSelect={() => run(toggleTheme)}
              />
              <CommandItem
                icon={<Download className="w-4 h-4" />}
                label="Export All Bios"
                onSelect={() =>
                  run(() => {
                    const texts = bios.map((b) => b.text).filter(Boolean);
                    if (texts.length) exportAllBios(texts);
                  })
                }
              />
              <CommandItem
                icon={<Trash2 className="w-4 h-4" />}
                label="Clear History"
                onSelect={() => run(clearHistory)}
              />
            </Command.Group>

            <Command.Separator className="mx-1 my-1 h-px bg-border" />

            <Command.Group
              heading="Switch Platform"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {PLATFORM_ITEMS.map(({ value, label, Icon }) => (
                <CommandItem
                  key={value}
                  icon={<Icon className="w-4 h-4" />}
                  label={label}
                  onSelect={() => run(() => setPlatform(value))}
                />
              ))}
            </Command.Group>
          </Command.List>

          <div className="border-t border-border px-3 py-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-muted border font-mono">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-muted border font-mono">↵</kbd> select
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-muted border font-mono">Esc</kbd> close
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}

function CommandItem({
  icon,
  label,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer
        data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground
        hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </Command.Item>
  );
}
