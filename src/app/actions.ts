"use server";

import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const systemPrompt = `You are an AI assistant tasked with generating social media bios based on user input.

Instructions:
1. Analyze the User's Inputs: Carefully review the provided tone, bio type, and additional user details.
2. Generate the Bio:
   - Create a bio that succinctly answers: Who is the user? What do they do? What can others expect?
   - Reflect the given 'Bio Tone' and 'Bio Type' in style and language. Do not explicitly mention them.
3. Bio Requirements:
   - Do not include hashtags or words starting with #.
   - Highlight the most important information about the user.
   - Avoid too many buzzwords or overdoing humor.
   - Ensure bio length is between 120 and 160 characters.
   - Provide exactly four different bio options.
   - If 'Add Emojis' is true, include relevant emojis; if false, do not include any.
   - Each bio should be unique and offer a different perspective.
4. Respond in JSON format only — no markdown, no code blocks.`;

export type GenerateBioErrorCode =
  | "RATE_LIMIT"
  | "AUTH"
  | "MODEL_UNAVAILABLE"
  | "UNKNOWN";

export type GenerateBioResult =
  | { success: true; data: { bio: string }[] }
  | { success: false; error: string; code: GenerateBioErrorCode };

const bioSchema = z.object({
  data: z.array(
    z.object({
      bio: z.string().describe("Generated bio text"),
    })
  ),
});

function classifyError(err: unknown): { error: string; code: GenerateBioErrorCode } {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("429") || message.toLowerCase().includes("rate limit")) {
    return {
      error: "Rate limit reached. Please wait a moment and try again.",
      code: "RATE_LIMIT",
    };
  }
  if (message.includes("401") || message.toLowerCase().includes("unauthorized")) {
    return {
      error: "API authentication failed. Check your GROQ_API_KEY.",
      code: "AUTH",
    };
  }
  if (message.includes("503") || message.toLowerCase().includes("unavailable")) {
    return {
      error: "The selected model is temporarily unavailable. Try a different model.",
      code: "MODEL_UNAVAILABLE",
    };
  }
  return {
    error: "Something went wrong generating your bios. Please try again.",
    code: "UNKNOWN",
  };
}

export async function generateBio(
  input: string,
  temperature: number,
  model: string
): Promise<GenerateBioResult> {
  try {
    const { object } = await generateObject({
      model: groq(model),
      system: systemPrompt,
      prompt: input,
      temperature,
      maxTokens: 1024,
      mode: "json",
      schema: bioSchema,
    });

    return { success: true, data: object.data };
  } catch (err) {
    const { error, code } = classifyError(err);
    return { success: false, error, code };
  }
}
