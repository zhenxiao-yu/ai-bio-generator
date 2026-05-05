"use client";

import { cn } from "@/lib/utils";
import { PLATFORMS, PLATFORM_ORDER } from "@/config/platforms";
import type { Platform } from "@/types";
import { Globe, Twitter, Linkedin, Instagram, Github } from "lucide-react";

const ICONS: Record<Platform, React.ElementType> = {
  general:   Globe,
  twitter:   Twitter,
  linkedin:  Linkedin,
  instagram: Instagram,
  github:    Github,
};

interface PlatformSelectorProps {
  value: Platform;
  onChange: (platform: Platform) => void;
}

const PlatformSelector = ({ value, onChange }: PlatformSelectorProps) => {
  return (
    <div
      className="flex flex-nowrap gap-1 overflow-x-auto scrollbar-hide rounded-xl bg-muted/60 p-1"
      role="group"
      aria-label="Target platform"
    >
      {PLATFORM_ORDER.map((platform) => {
        const config = PLATFORMS[platform];
        const Icon = ICONS[platform];
        const isActive = value === platform;

        return (
          <button
            key={platform}
            type="button"
            onClick={() => onChange(platform)}
            aria-pressed={isActive}
            aria-label={`${config.name} (${config.characterLimit} char limit)`}
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
              "transition-all duration-200 whitespace-nowrap flex-shrink-0",
              isActive
                ? "bg-card text-foreground shadow-sm border border-border/60 glow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Icon
              className={cn("w-3.5 h-3.5 transition-colors duration-200", isActive && "text-primary")}
              aria-hidden="true"
            />
            <span>{config.name}</span>
            {isActive && (
              <span className="text-[10px] font-semibold text-primary/70 ml-0.5">
                {config.characterLimit}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;
