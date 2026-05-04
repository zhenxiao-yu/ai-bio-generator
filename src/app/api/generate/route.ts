import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/promptBuilder";
import type { Platform } from "@/types";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const requestSchema = z.object({
  model: z.string().min(1),
  temperature: z.number().min(0).max(2),
  content: z.string().min(20).max(500),
  type: z.enum(["personal", "brand"]),
  tone: z.enum(["professional", "passionate", "thoughtful", "casual", "sarcastic", "funny"]),
  emojis: z.boolean(),
  platform: z
    .enum(["general", "twitter", "linkedin", "instagram", "github"])
    .optional()
    .default("general"),
});

const bioSchema = z.object({
  data: z.array(
    z.object({
      bio: z.string().describe("Generated bio text"),
    })
  ),
});

function classifyError(err: unknown): { error: string; code: string; status: number } {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("429") || message.toLowerCase().includes("rate limit")) {
    return {
      error: "Rate limit reached. Please wait a moment and try again.",
      code: "RATE_LIMIT",
      status: 429,
    };
  }
  if (message.includes("401") || message.toLowerCase().includes("unauthorized")) {
    return {
      error: "API authentication failed. Check your GROQ_API_KEY.",
      code: "AUTH",
      status: 401,
    };
  }
  if (message.includes("503") || message.toLowerCase().includes("unavailable")) {
    return {
      error: "The selected model is temporarily unavailable. Try a different model.",
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

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body.", code: "UNKNOWN" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request parameters.", code: "UNKNOWN", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { model, temperature, content, type, tone, emojis, platform } = parsed.data;

  const systemPrompt = buildSystemPrompt(platform as Platform);
  const userPrompt = buildUserPrompt(content, tone, type, emojis);

  try {
    const { object } = await generateObject({
      model: groq(model),
      system: systemPrompt,
      prompt: userPrompt,
      temperature,
      maxTokens: 1024,
      mode: "json",
      schema: bioSchema,
    });

    return NextResponse.json({ success: true, data: object.data });
  } catch (err) {
    const { error, code, status } = classifyError(err);
    return NextResponse.json({ success: false, error, code }, { status });
  }
}
