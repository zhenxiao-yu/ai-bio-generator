import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { PLATFORMS } from "@/config/platforms";
import type { Platform } from "@/types";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const requestSchema = z.object({
  bio: z.string().min(1).max(500),
  platform: z.enum(["general", "twitter", "linkedin", "instagram", "github"]).default("general"),
});

const scoreSchema = z.object({
  scores: z.object({
    clarity: z
      .number()
      .min(0)
      .max(25)
      .describe("How clearly the bio communicates identity and unique value (0-25)"),
    platformFit: z
      .number()
      .min(0)
      .max(25)
      .describe("How well-suited the tone and style are for the target platform (0-25)"),
    keywords: z
      .number()
      .min(0)
      .max(25)
      .describe("Strength and relevance of professional keywords and phrases (0-25)"),
    brevity: z
      .number()
      .min(0)
      .max(25)
      .describe("Conciseness and efficient use of available character space (0-25)"),
  }),
  tip: z.string().describe("One specific, actionable improvement to raise the score"),
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
  const platformConfig = PLATFORMS[platform as Platform];

  const systemPrompt = `You are an expert bio coach evaluating social media bios for ${platformConfig.name}.
Platform character limit: ${platformConfig.characterLimit} characters.
Platform guidance: ${platformConfig.guidance}

Score the provided bio on 4 dimensions (0-25 each):
- clarity: Does it clearly communicate who this person is and their unique value?
- platformFit: Does the tone, style, and content match ${platformConfig.name}'s culture?
- keywords: Are the professional keywords strong and relevant?
- brevity: Is it concise and making good use of the ${platformConfig.characterLimit}-char limit?

Also provide ONE specific, actionable tip to raise the lowest-scoring dimension.
The tip must name exactly what to change or add, not vague advice like "be more specific."
Respond in JSON only.`;

  try {
    const { object } = await generateObject({
      model: groq("llama-3.1-8b-instant"),
      system: systemPrompt,
      prompt: `Bio to score: "${bio}"`,
      temperature: 0.3,
      maxTokens: 256,
      mode: "json",
      schema: scoreSchema,
    });

    const overall =
      object.scores.clarity +
      object.scores.platformFit +
      object.scores.keywords +
      object.scores.brevity;

    return NextResponse.json({
      overall,
      scores: object.scores,
      tip: object.tip,
    });
  } catch {
    return NextResponse.json({ error: "Scoring failed. Please try again." }, { status: 500 });
  }
}
