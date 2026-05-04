import { PLATFORMS } from "@/config/platforms";
import type { Platform } from "@/types";

export function buildSystemPrompt(platform: Platform = "general"): string {
  const config = PLATFORMS[platform];
  const limitClause = `Ensure bio length is between ${Math.max(100, config.characterLimit - 60)} and ${config.characterLimit} characters.`;

  return `You are an AI assistant tasked with generating social media bios based on user input.

Platform: ${config.name}
Platform Guidance: ${config.guidance}

Instructions:
1. Analyze the User's Inputs: Carefully review the provided tone, bio type, and additional user details.
2. Generate the Bio:
   - Create a bio that succinctly answers: Who is the user? What do they do? What can others expect?
   - Reflect the given 'Bio Tone' and 'Bio Type' in style and language. Do not explicitly mention them.
3. Bio Requirements:
   - Do not include hashtags or words starting with #.
   - Highlight the most important information about the user.
   - Avoid too many buzzwords or overdoing humor.
   - ${limitClause}
   - Provide exactly four different bio options.
   - If 'Add Emojis' is true, include relevant emojis naturally; if false, do not include any.
   - Each bio should be unique and offer a different perspective or highlight different aspects.
4. Respond in JSON format only — no markdown, no code blocks.`;
}

export function buildUserPrompt(
  content: string,
  tone: string,
  type: string,
  emojis: boolean
): string {
  return `User Input: ${content}, Bio Tone: ${tone}, Bio Type: ${type}, Add Emojis: ${emojis}`;
}
