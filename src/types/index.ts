export type Platform = "twitter" | "linkedin" | "instagram" | "github" | "general";

export type BioTone =
  | "professional"
  | "passionate"
  | "thoughtful"
  | "casual"
  | "sarcastic"
  | "funny";

export type BioType = "personal" | "brand";

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
