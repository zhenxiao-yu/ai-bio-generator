import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // seconds — allows slow reasoning models to finish
import { generateObject, streamObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/promptBuilder";
import {
  MODEL_PROVIDER,
  getFallbacks,
  classifyError,
  isRetryable,
} from "@/lib/modelRegistry";
import { withRetry } from "@/lib/withRetry";
import type { Platform } from "@/types";

// ── Providers ────────────────────────────────────────────────────────────────

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/openai/v1",
});

function getAIModel(modelId: string) {
  const provider = MODEL_PROVIDER[modelId] ?? "groq";
  return provider === "gemini" ? google(modelId) : groq(modelId);
}

// ── Request schema ────────────────────────────────────────────────────────────

const requestSchema = z.object({
  model: z.string().min(1),
  temperature: z.number().min(0).max(2),
  content: z.string().trim().min(20).max(500),
  type: z.enum(["personal", "brand"]),
  tone: z.enum(["professional", "passionate", "thoughtful", "casual", "sarcastic", "funny"]),
  emojis: z.boolean(),
  platform: z
    .enum(["general", "twitter", "linkedin", "instagram", "github"])
    .optional()
    .default("general"),
  focusAreas: z.array(z.string()).optional().default([]),
  audience: z.string().optional().default("general"),
  length: z.string().optional().default("balanced"),
});

const bioSchema = z.object({
  data: z.array(z.object({ bio: z.string().describe("Generated bio text") })),
});

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const streaming = searchParams.get("stream") === "true";

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

  const { model, temperature, content, type, tone, emojis, platform, focusAreas, audience, length } =
    parsed.data;

  const systemPrompt = buildSystemPrompt(platform as Platform, audience, length, focusAreas);
  const userPrompt = buildUserPrompt(content, tone, type, emojis, audience, focusAreas, length);

  // Models to try in order: [requested, ...fallbacks]
  const modelChain = [model, ...getFallbacks(model)];

  const sharedArgs = { system: systemPrompt, prompt: userPrompt, temperature, maxTokens: 1024 };

  // ── Streaming path ──────────────────────────────────────────────────────────
  if (streaming) {
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        const send = (obj: unknown) =>
          controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

        let succeeded = false;
        let lastErr: unknown;

        for (const modelId of modelChain) {
          try {
            const aiModel = getAIModel(modelId);
            const result = streamObject({
              model: aiModel,
              ...sharedArgs,
              // groq requires explicit json mode; gemini infers from schema
              ...(MODEL_PROVIDER[modelId] !== "gemini" ? { mode: "json" as const } : {}),
              schema: bioSchema,
            });

            for await (const partial of result.partialObjectStream) {
              send(partial);
            }

            succeeded = true;
            break; // done
          } catch (err) {
            lastErr = err;
            const isLast = modelId === modelChain[modelChain.length - 1];
            if (isLast || !isRetryable(err)) {
              send({ __error: classifyError(err) });
              break;
            }
            // Try next model silently
          }
        }

        if (!succeeded && lastErr) {
          // Defensive: all models exhausted without the loop sending an error
          send({ __error: classifyError(lastErr) });
        }

        controller.close();
      },
    });

    return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  // ── Non-streaming path ──────────────────────────────────────────────────────
  for (const modelId of modelChain) {
    try {
      const result = await withRetry(() =>
        generateObject({
          model: getAIModel(modelId),
          ...sharedArgs,
          ...(MODEL_PROVIDER[modelId] !== "gemini" ? { mode: "json" as const } : {}),
          schema: bioSchema,
        })
      );
      return NextResponse.json({ success: true, data: result.object.data });
    } catch (err) {
      const isLast = modelId === modelChain[modelChain.length - 1];
      if (isLast || !isRetryable(err)) {
        const { error, code, status } = classifyError(err);
        return NextResponse.json({ success: false, error, code }, { status });
      }
      // Try next model
    }
  }

  // Should never reach here
  return NextResponse.json(
    { success: false, error: "All models exhausted.", code: "UNKNOWN" },
    { status: 500 }
  );
}
