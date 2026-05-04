"use client";

import { cn } from "@/lib/utils";
import { PLATFORMS, PLATFORM_ORDER } from "@/config/platforms";
import type { Platform } from "@/types";
import {
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  Github,
} from "lucide-react";

const ICONS: Record<Platform, React.ElementType> = {
  general: Globe,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  github: Github,
};

interface PlatformSelectorProps {
  value: Platform;
  onChange: (platform: Platform) => void;
}

const PlatformSelector = ({ value, onChange }: PlatformSelectorProps) => {
  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-hide" role="group" aria-label="Target platform">
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
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap flex-shrink-0",
              isActive
                ? "bg-foreground text-background border-foreground shadow-sm scale-[1.02]"
                : "bg-background text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
            )}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{config.name}</span>
            {isActive && (
              <span className="opacity-70 text-[10px]">{config.characterLimit}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;
