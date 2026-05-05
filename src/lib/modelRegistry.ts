/**
 * Central model registry — add/remove models here and the whole app
 * (UI selector, API routing, fallback chain) updates automatically.
 *
 * Free-tier sustainable: all models here have zero-cost inference.
 * Groq: ~14,400 req/day free. Gemini: 1M tokens/day free.
 */

export type ModelProvider = "groq" | "gemini";
export type ModelSpeed = "fast" | "balanced" | "slow";
export type ModelQuality = "good" | "better" | "best";

export interface ModelDef {
  id: string;
  name: string;
  tag: string;
  description: string;
  provider: ModelProvider;
  iconType: "meta" | "google" | "deepseek" | "qwen" | "mistral" | "cpu";
  speed: ModelSpeed;
  quality: ModelQuality;
  isReasoning?: boolean;
}

export const MODELS: ModelDef[] = [
  // ── Groq (llama / open-source) ──────────────────────────────────────────
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1",
    tag: "8B · Instant",
    description: "Fastest. Great for quick iterations.",
    provider: "groq",
    iconType: "meta",
    speed: "fast",
    quality: "good",
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma 2",
    tag: "9B · Balanced",
    description: "Google's lightweight open model. Reliable and fast.",
    provider: "groq",
    iconType: "cpu",
    speed: "fast",
    quality: "good",
  },
  {
    id: "llama-3.1-70b-versatile",
    name: "Llama 3.1",
    tag: "70B · Versatile",
    description: "Large Meta model. Strong instruction following.",
    provider: "groq",
    iconType: "meta",
    speed: "balanced",
    quality: "better",
  },
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3",
    tag: "70B · Best",
    description: "Meta's top open model. Highest quality output.",
    provider: "groq",
    iconType: "meta",
    speed: "balanced",
    quality: "best",
  },
  {
    id: "mistral-saba-24b",
    name: "Mistral Saba",
    tag: "24B · Creative",
    description: "Mistral's creative-tuned 24B model. Excellent for writing.",
    provider: "groq",
    iconType: "mistral",
    speed: "balanced",
    quality: "better",
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1",
    tag: "70B · Reasoning",
    description: "Reasoning model — thinks step-by-step before writing. Most unique bios.",
    provider: "groq",
    iconType: "deepseek",
    speed: "slow",
    quality: "best",
    isReasoning: true,
  },
  {
    id: "qwen-qwq-32b",
    name: "Qwen QwQ",
    tag: "32B · Reasoning",
    description: "Alibaba's reasoning model. Thoughtful and creative.",
    provider: "groq",
    iconType: "qwen",
    speed: "balanced",
    quality: "best",
    isReasoning: true,
  },
  // ── Gemini (Google — completely different infra, different free quota) ───
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0",
    tag: "Flash · Google",
    description: "Google's fastest frontier model. Separate free quota from Groq.",
    provider: "gemini",
    iconType: "google",
    speed: "fast",
    quality: "better",
  },
];

/** Fast lookup: modelId → provider */
export const MODEL_PROVIDER: Record<string, ModelProvider> = Object.fromEntries(
  MODELS.map((m) => [m.id, m.provider])
);

/**
 * Fallback chain for streaming and non-streaming generation.
 * When the requested model fails (rate limit or unavailability),
 * the route works through this chain until one succeeds.
 *
 * Design: start with a fast Groq model (different quota bucket than large
 * models), then cross-provider to Gemini (entirely different free-tier).
 */
export const FALLBACK_CHAIN: string[] = [
  "llama-3.1-8b-instant",   // Groq, fastest — usually never rate-limited
  "gemma2-9b-it",           // Groq, second option
  "gemini-2.0-flash",       // Google — completely separate provider
];

/** Returns the fallback chain with the primary model removed */
export function getFallbacks(requestedModel: string): string[] {
  return FALLBACK_CHAIN.filter((id) => id !== requestedModel);
}

/** Error classification helpers */
export function isRateLimitError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("429") || msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("rate_limit");
}

export function isModelUnavailableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("503") ||
    msg.toLowerCase().includes("unavailable") ||
    msg.toLowerCase().includes("model_not_found") ||
    msg.toLowerCase().includes("decommissioned") ||
    msg.toLowerCase().includes("deprecated")
  );
}

export function isRetryable(err: unknown): boolean {
  return isRateLimitError(err) || isModelUnavailableError(err);
}

export function classifyError(err: unknown): { error: string; code: string; status: number } {
  const message = err instanceof Error ? err.message : String(err);
  if (isRateLimitError(err)) {
    return {
      error: "All models are currently busy. Please try again in a moment — or switch to Gemini 2.0 Flash which has a separate free quota.",
      code: "RATE_LIMIT",
      status: 429,
    };
  }
  if (message.includes("401") || message.toLowerCase().includes("unauthorized")) {
    return {
      error: "API key authentication failed. Check your GROQ_API_KEY environment variable.",
      code: "AUTH",
      status: 401,
    };
  }
  if (isModelUnavailableError(err)) {
    return {
      error: "The selected model is temporarily unavailable. The app will try a fallback automatically.",
      code: "MODEL_UNAVAILABLE",
      status: 503,
    };
  }
  return {
    error: "Something went wrong generating your bios. Please try again.",
    code: "UNKNOWN",
    status: 500,
  };
}
