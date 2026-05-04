"use client";

import { cn } from "@/lib/utils";
import type { Platform } from "@/types";
import {
  MapPin,
  Link2,
  Users,
  Star,
  GitFork,
  Globe,
  CalendarDays,
} from "lucide-react";

interface PlatformPreviewProps {
  bio: string;
  platform: Platform;
  characterLimit: number;
  className?: string;
}

// Shared placeholder avatar (gray circle with initials)
const Avatar = ({ size = 48, className }: { size?: number; className?: string }) => (
  <div
    className={cn(
      "rounded-full bg-gradient-to-br from-muted to-muted-foreground/30 flex items-center justify-center text-muted-foreground font-semibold shrink-0",
      className
    )}
    style={{ width: size, height: size, fontSize: size * 0.35 }}
    aria-hidden="true"
  >
    YN
  </div>
);

// ─── Twitter / X ────────────────────────────────────────────────────────────
const TwitterPreview = ({ bio }: { bio: string }) => (
  <div className="rounded-xl border border-border bg-background p-4 max-w-sm font-sans">
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-start gap-3">
        <Avatar size={48} />
        <div>
          <p className="font-bold text-sm leading-tight">Your Name</p>
          <p className="text-xs text-muted-foreground">@yourhandle</p>
        </div>
      </div>
      <div className="px-3 py-1 rounded-full border border-border text-xs font-bold">
        Follow
      </div>
    </div>

    {/* Bio */}
    <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{bio}</p>

    {/* Meta */}
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
      <span className="flex items-center gap-1">
        <MapPin className="w-3 h-3" aria-hidden="true" /> Location
      </span>
      <span className="flex items-center gap-1">
        <Link2 className="w-3 h-3" aria-hidden="true" /> website.com
      </span>
      <span className="flex items-center gap-1">
        <CalendarDays className="w-3 h-3" aria-hidden="true" /> Joined Jan 2020
      </span>
    </div>

    <div className="flex gap-4 text-xs">
      <span>
        <strong className="text-foreground">342</strong>
        <span className="text-muted-foreground ml-1">Following</span>
      </span>
      <span>
        <strong className="text-foreground">5.2K</strong>
        <span className="text-muted-foreground ml-1">Followers</span>
      </span>
    </div>
  </div>
);

// ─── LinkedIn ────────────────────────────────────────────────────────────────
const LinkedInPreview = ({ bio }: { bio: string }) => (
  <div className="rounded-xl border border-border bg-background overflow-hidden max-w-sm font-sans">
    {/* Cover */}
    <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-400" aria-hidden="true" />

    {/* Profile area */}
    <div className="px-4 pb-4">
      <div className="-mt-8 mb-2">
        <Avatar
          size={64}
          className="ring-4 ring-background"
        />
      </div>
      <p className="font-bold text-base leading-tight">Your Name</p>
      <p className="text-xs text-muted-foreground mb-2">Professional Title · Company</p>

      {/* Bio */}
      <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{bio}</p>

      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
        <MapPin className="w-3 h-3" aria-hidden="true" /> City, Country
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 text-white text-xs font-semibold py-1.5 rounded-full hover:bg-blue-700 transition-colors">
          Connect
        </button>
        <button className="flex-1 border border-blue-600 text-blue-600 text-xs font-semibold py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
          Message
        </button>
      </div>
    </div>
  </div>
);

// ─── Instagram ───────────────────────────────────────────────────────────────
const InstagramPreview = ({ bio }: { bio: string }) => (
  <div className="rounded-xl border border-border bg-background p-4 max-w-sm font-sans">
    {/* Profile row */}
    <div className="flex items-center gap-4 mb-4">
      <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
        <Avatar size={56} className="ring-2 ring-background" />
      </div>
      <div className="flex gap-4 text-center">
        <div>
          <p className="font-bold text-sm">24</p>
          <p className="text-xs text-muted-foreground">posts</p>
        </div>
        <div>
          <p className="font-bold text-sm">1.2K</p>
          <p className="text-xs text-muted-foreground">followers</p>
        </div>
        <div>
          <p className="font-bold text-sm">312</p>
          <p className="text-xs text-muted-foreground">following</p>
        </div>
      </div>
    </div>

    <p className="font-semibold text-sm mb-0.5">Your Name</p>
    <p className="text-xs text-muted-foreground mb-2">Creator · Brand · Artist</p>
    <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2">{bio}</p>
    <p className="text-xs text-blue-500 flex items-center gap-1">
      <Globe className="w-3 h-3" aria-hidden="true" /> yourwebsite.com
    </p>

    {/* Grid placeholder */}
    <div className="mt-4 grid grid-cols-3 gap-0.5" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-muted rounded-sm"
          style={{ opacity: 0.3 + i * 0.1 }}
        />
      ))}
    </div>
  </div>
);

// ─── GitHub ──────────────────────────────────────────────────────────────────
const GitHubPreview = ({ bio }: { bio: string }) => (
  <div className="rounded-xl border border-border bg-background p-4 max-w-xs font-mono">
    <Avatar size={64} className="mb-3 rounded-full" />
    <p className="font-bold text-base mb-0.5">Your Name</p>
    <p className="text-sm text-muted-foreground mb-2">yourhandle</p>
    <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">{bio}</p>

    <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-3">
      <span className="flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5" aria-hidden="true" /> 142 followers · 89 following
      </span>
      <span className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Location
      </span>
    </div>

    {/* Contribution graph placeholder */}
    <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(26, 1fr)" }} aria-hidden="true">
      {Array.from({ length: 104 }).map((_, i) => {
        const intensity = [0, 0, 1, 0, 2, 0, 1, 3, 0, 1][i % 10];
        const colors = [
          "bg-muted",
          "bg-green-200 dark:bg-green-900",
          "bg-green-400 dark:bg-green-700",
          "bg-green-600 dark:bg-green-500",
        ];
        return <div key={i} className={cn("w-full aspect-square rounded-sm", colors[intensity])} />;
      })}
    </div>

    <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5" aria-hidden="true" /> 47
      </span>
      <span className="flex items-center gap-1">
        <GitFork className="w-3.5 h-3.5" aria-hidden="true" /> 12
      </span>
    </div>
  </div>
);

// ─── General ─────────────────────────────────────────────────────────────────
const GeneralPreview = ({ bio }: { bio: string }) => (
  <div className="rounded-xl border border-border bg-background p-4 max-w-sm font-sans">
    <div className="flex items-center gap-3 mb-3">
      <Avatar size={48} />
      <div>
        <p className="font-bold text-sm">Your Name</p>
        <p className="text-xs text-muted-foreground">yourwebsite.com</p>
      </div>
    </div>
    <p className="text-sm leading-relaxed whitespace-pre-wrap">{bio}</p>
  </div>
);

// ─── Dispatcher ──────────────────────────────────────────────────────────────
const PREVIEW_MAP: Record<Platform, React.ComponentType<{ bio: string }>> = {
  twitter: TwitterPreview,
  linkedin: LinkedInPreview,
  instagram: InstagramPreview,
  github: GitHubPreview,
  general: GeneralPreview,
};

const PlatformPreview = ({ bio, platform, characterLimit, className }: PlatformPreviewProps) => {
  const Preview = PREVIEW_MAP[platform];
  const isOver = bio.length > characterLimit;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-0.5">
        Preview
      </p>
      {isOver && (
        <p className="text-xs text-destructive px-0.5">
          ⚠ Bio exceeds {characterLimit}-character limit by {bio.length - characterLimit} characters.
        </p>
      )}
      <div className="animate-fade-up">
        <Preview bio={bio} />
      </div>
    </div>
  );
};

export default PlatformPreview;
