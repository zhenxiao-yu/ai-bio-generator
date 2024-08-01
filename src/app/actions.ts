"use server";

import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import endent from "endent";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? "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",
  baseURL: "https://api.groq.com/openai/v1",
});

const systemPrompt = endent`
You are an AI assistant tasked with generating social media bios based on user input.

Instructions:

1. Analyze the User's Inputs:
   - Carefully review the provided tone, bio type, and any additional user details.
   - Understand the user's core focus, primary activities, key characteristics, and target audience.

2. Generate the Bio:
   - Create a bio that succinctly answers:
     - Who is the user?
     - What does the user do?
     - What can others expect from the user?
   - Reflect the given 'Bio Tone' and 'Bio Type' in the style and language of the bio. Do not explicitly mention the tone or type.
   - Ensure the bio aligns with the platform's culture and expectations (e.g., LinkedIn, Twitter, Instagram).

Bio Requirements:
   - Use an informal and approachable tone.
   - Do not include hashtags or any words starting with #.
   - Highlight the most important information about the user.
   - Avoid using too many buzzwords or overdoing humor.
   - Ensure the bio length is between 120 and 160 characters.
   - Provide at least four different bio options.
   - If 'Add Emojis' is true, include relevant emojis; if false, do not include any emojis.
   - Each bio should be unique and offer a different perspective or highlight different aspects of the user.
   - The response must be in JSON format.

Additional Guidelines:
   - Maintain clarity and coherence in each bio.
   - Ensure the bios are engaging and reflect the user's personality.
   - Avoid any sensitive or potentially controversial content.
   - Consider the target audience and the type of content they expect to see.
   - Use language and phrasing that resonates with the intended audience.
   - If the user has mentioned specific interests, skills, or achievements, incorporate them meaningfully.
   - Emphasize the user's unique selling points or what makes them stand out.
   - Provide response in JSON format only.

Example Bio Structures:
   - Professional: "Software engineer with 5+ years of experience in full-stack development. Passionate about creating innovative solutions and enhancing user experiences."
   - Personal: "Travel enthusiast exploring the world one city at a time. Sharing my adventures and tips along the way!"
   - Brand: "Empowering small businesses with cutting-edge marketing strategies. Follow for tips, trends, and success stories."

Do not include any description, do not include the \`\`\`.
  Code (no \`\`\`):
`;


export async function generateBio(input: string, temperature: number, model: string) {
  const {
    object: data,
    warnings,
    finishReason,
    rawResponse,
  } = await generateObject({
    model: groq(model),
    system: systemPrompt,
    prompt: input,
    temperature: temperature,
    maxTokens: 1024,
    schema: z.object({
      data: z.array(
        z.object({
          bio: z.string().describe("Add generated bio here!"),
        })
      ),
    }),
  });

  return { data };
}
