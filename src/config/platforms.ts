import type { Platform, PlatformConfig } from "@/types";

export const PLATFORMS: Record<Platform, PlatformConfig> = {
  general: {
    name: "General",
    characterLimit: 200,
    guidance:
      "Write a balanced, versatile bio that works across multiple platforms. Focus on clarity and personality.",
    icon: "Globe",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  twitter: {
    name: "Twitter / X",
    characterLimit: 160,
    guidance:
      "Write a punchy, attention-grabbing bio. Short sentences. Strong first line. Personality over credentials. No hashtags.",
    icon: "Twitter",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  },
  linkedin: {
    name: "LinkedIn",
    characterLimit: 220,
    guidance:
      "Write a professional, achievement-focused bio. Highlight expertise, industry keywords, and value proposition. Suitable for third-person or first-person.",
    icon: "Linkedin",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  instagram: {
    name: "Instagram",
    characterLimit: 150,
    guidance:
      "Write a personality-forward bio. Lifestyle language. Can use emojis naturally if requested. Show who you are, not just what you do.",
    icon: "Instagram",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  },
  github: {
    name: "GitHub",
    characterLimit: 160,
    guidance:
      "Write a concise technical bio. Highlight programming languages, frameworks, open-source interests, and current projects. Developer-audience tone.",
    icon: "Github",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
};

export const PLATFORM_ORDER: Platform[] = [
  "general",
  "twitter",
  "linkedin",
  "instagram",
  "github",
];
