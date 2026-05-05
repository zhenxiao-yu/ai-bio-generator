export type Platform = "twitter" | "linkedin" | "instagram" | "github" | "general";

export type BioTone =
  | "professional"
  | "passionate"
  | "thoughtful"
  | "casual"
  | "sarcastic"
  | "funny";

export type BioType = "personal" | "brand";

export type FocusArea =
  | "achievements"
  | "skills"
  | "personality"
  | "mission"
  | "creativity"
  | "leadership";

export type Audience = "general" | "recruiters" | "clients" | "peers" | "community";

export type BioLength = "short" | "balanced" | "full";

export interface PlatformConfig {
  name: string;
  characterLimit: number;
  guidance: string;
  icon: string;
  color: string;
}

export interface FormValues {
  model: string;
  temperature: number;
  content: string;
  type: BioType;
  tone: BioTone;
  emojis: boolean;
  platform: Platform;
  focusAreas: FocusArea[];
  audience: Audience;
  length: BioLength;
}

export interface BioScore {
  overall: number;
  scores: {
    hook: number;
    clarity: number;
    platformFit: number;
    impact: number;
    originality: number;
  };
  tips: string[];
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  platform: Platform;
  bios: string[];
  snippet: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  formValues: Partial<FormValues>;
}
