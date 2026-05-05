import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { PLATFORMS } from "@/config/platforms";
import { getCachedScore, setCachedScore } from "@/lib/scoreCache";
import { withRetry } from "@/lib/withRetry";
import { classifyError, isRetryable } from "@/lib/modelRegistry";
import type { Platform } from "@/types";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/openai/v1",
});

const requestSchema = z.object({
  bio: z.string().min(1).max(500),
  platform: z.enum(["general", "twitter", "linkedin", "instagram", "github"]).default("general"),
});

const scoreSchema = z.object({
  scores: z.object({
    hook: z
      .number()
      .min(0)
      .max(20)
      .describe("First-impression power: do the opening 8 words make a stranger want to keep reading? (0–20)"),
    clarity: z
      .number()
      .min(0)
      .max(20)
      .describe("Can you describe exactly what this person does and who they are within 5 seconds of reading? (0–20)"),
    platformFit: z
      .number()
      .min(0)
      .max(20)
      .describe("Does the tone, vocabulary, length, and style feel native to this platform's culture? (0–20)"),
    impact: z
      .number()
      .min(0)
      .max(20)
      .describe("After reading, do you feel compelled to follow, connect, or reach out? Does it create desire? (0–20)"),
    originality: z
      .number()
      .min(0)
      .max(20)
      .describe("Does it avoid clichés and buzzwords? Does it have a distinct, memorable voice that stands out? (0–20)"),
  }),
  tips: z
    .array(z.string())
    .length(3)
    .describe("Exactly 3 specific, actionable improvements ordered by priority (highest-impact first). Each tip must name exactly what to change or add — no vague advice."),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
  }

  const { bio, platform } = parsed.data;

  const cached = getCachedScore(bio, platform);
  if (cached) return NextResponse.json(cached);

  const platformConfig = PLATFORMS[platform as Platform];

  const systemPrompt = `You are a world-class bio coach and copywriter who has reviewed thousands of social media profiles. You give brutally honest, highly specific feedback that actually moves the needle.

You are scoring a ${platformConfig.name} bio (${platformConfig.characterLimit} char limit).
Platform culture: ${platformConfig.guidance}

SCORING DIMENSIONS (each 0–20, total 100):

1. HOOK (0–20): Judge the first 8 words only. Do they create immediate curiosity, establish instant credibility, or reveal an irresistible personality? A 20 makes a stranger stop scrolling. A 0 is completely forgettable.

2. CLARITY (0–20): Within 5 seconds, can you state exactly who this person is, what they do, and why it matters? Penalize vague claims, jargon without context, and anything that could describe any professional in any field.

3. PLATFORM FIT (0–20): Does this bio feel like it belongs on ${platformConfig.name}? Judge tone, vocabulary, sentence structure, length usage, and cultural signals. Would a native ${platformConfig.name} user see this as normal or jarring?

4. IMPACT (0–20): After reading, does the profile create desire — to follow, connect, hire, or learn more? A high-impact bio has a clear value proposition and leaves the reader wanting something. A low-impact bio is informative but passive.

5. ORIGINALITY (0–20): Count the clichés, buzzwords, and phrases you've seen a thousand times. Each one costs points. Reward genuine voice, unexpected angles, specific details, and writing that could only describe THIS person.

TIPS — provide exactly 3 improvements, ordered by highest impact first. Each tip must:
- Name the specific word, phrase, or structural issue
- Say exactly what to replace it with or add
- Explain why it raises the score

Be a demanding critic. Most bios deserve 55–70/100. A truly great bio earns 85+.`;

  const baseArgs = {
    system: systemPrompt,
    prompt: `Score this bio:\n\n"${bio}"`,
    temperature: 0.2,
    maxTokens: 512,
    schema: scoreSchema,
  };

  // Primary scorer: llama-3.3-70b for scoring quality; fallback to gemini-2.0-flash
  const scorers = ["llama-3.3-70b-versatile", "gemini-2.0-flash"] as const;

  let lastErr: unknown;

  for (const modelId of scorers) {
    try {
      const isGemini = modelId === "gemini-2.0-flash";
      const model = isGemini ? google(modelId) : groq(modelId);

      const { object } = await withRetry(() =>
        generateObject({
          model,
          ...baseArgs,
          ...(isGemini ? {} : { mode: "json" as const }),
        })
      );

      const overall =
        object.scores.hook +
        object.scores.clarity +
        object.scores.platformFit +
        object.scores.impact +
        object.scores.originality;

      const result = { overall, scores: object.scores, tips: object.tips };
      setCachedScore(bio, platform, result);
      return NextResponse.json(result, {
        headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
      });
    } catch (err) {
      lastErr = err;
      const isLast = modelId === scorers[scorers.length - 1];
      if (isLast || !isRetryable(err)) {
        const { error, code, status } = classifyError(err);
        console.error("[score] scorer failed:", modelId, err);
        return NextResponse.json({ error, code }, { status });
      }
      // Try next scorer
    }
  }

  const { error, code, status } = classifyError(lastErr);
  return NextResponse.json({ error, code }, { status });
}
