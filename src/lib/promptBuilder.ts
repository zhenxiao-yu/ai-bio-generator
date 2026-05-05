import { PLATFORMS } from "@/config/platforms";
import type { Platform } from "@/types";

const PLATFORM_PSYCHOLOGY: Record<Platform, string> = {
  twitter: `Twitter users make a judgment in under 2 seconds. Your bio competes with thousands scrolled past daily. The first 5 words determine everything. Twitter culture rewards wit, specificity, and personality over job titles. A great Twitter bio makes you seem like someone worth knowing — not just someone impressive. Think: what would make a stranger click "Follow" before reading your tweets?
Anti-patterns: generic job titles, "tweets are my own", motivational quotes, hashtags, buzzword stacks.`,

  linkedin: `LinkedIn visitors are recruiters or potential collaborators evaluating professional value in 8 seconds. They scan for: credibility signals, keywords, and a reason to connect. The bio must answer "who is this, why does it matter, and why should I reach out?" in that order. Professional warmth beats cold authority.
Anti-patterns: "results-driven", "seasoned professional", "passionate about", "synergy", "leverage", "guru", "ninja", "thought leader", third-person when written by the person.`,

  instagram: `Instagram bios are aesthetic declarations. Profile visitors make vibe judgments instantly — lifestyle, personality, and identity matter more than credentials. Short punchy phrases outperform sentences. A great Instagram bio makes someone think "this is my kind of person." Brand voice and self-awareness win.
Anti-patterns: corporate-speak, wall-of-text, resume-style lists, anything that sounds like it was written by HR.`,

  github: `GitHub bios are read by developers evaluating technical credibility and intellectual curiosity. Specificity earns respect (languages, frameworks, open-source projects). The best GitHub bios signal: "here's what I build and what I'm currently obsessed with." Personality shows you're not a code robot.
Anti-patterns: "passionate about coding", "love technology", "full-stack developer" (too generic), overpromising skills.`,

  general: `This bio must work across all platforms. Prioritize a clear identity + value proposition + personality hook that resonates with any reader. It should answer "who is this and why do I care?" in one pass. Versatility over platform-specific optimization.
Anti-patterns: jargon, clichés, vague claims, anything that could describe any person in any field.`,
};

const AUDIENCE_CONTEXT: Record<string, string> = {
  general: "anyone who views the profile — calibrate for broad appeal and immediate clarity",
  recruiters: "hiring managers and recruiters scanning for fit in under 10 seconds — lead with credibility, specificity, and role clarity",
  clients: "potential clients evaluating whether to trust and hire this person — lead with outcomes, expertise, and confidence",
  peers: "industry peers and collaborators — assume domain knowledge, show distinct point of view and work philosophy",
  community: "followers and community members — lead with personality, shared values, and what makes this person worth following",
};

const LENGTH_TARGETS: Record<string, (limit: number) => string> = {
  short: (limit) => `${Math.round(limit * 0.35)}–${Math.round(limit * 0.60)} characters (punchy, leave them wanting more)`,
  balanced: (limit) => `${Math.round(limit * 0.62)}–${Math.round(limit * 0.88)} characters (complete but not padded)`,
  full: (limit) => `${Math.round(limit * 0.85)}–${limit} characters (maximize the space, earn every word)`,
};

const FOCUS_DESCRIPTIONS: Record<string, string> = {
  achievements: "specific accomplishments, metrics, awards, and career milestones — make it concrete and verifiable",
  skills: "technical expertise, tools, methodologies, and domain mastery — show the depth",
  personality: "character, values, humor, and the human behind the work — make them feel real",
  mission: "purpose, conviction, and what drives them — why they do this, not just what they do",
  creativity: "unconventional thinking, artistic sensibility, and originality — stand out from the professional crowd",
  leadership: "influence, team impact, vision, and ability to move people and ideas forward",
};

export function buildSystemPrompt(
  platform: Platform = "general",
  audience = "general",
  length = "balanced",
  focusAreas: string[] = []
): string {
  const config = PLATFORMS[platform];
  const lengthTarget = (LENGTH_TARGETS[length] ?? LENGTH_TARGETS.balanced)(config.characterLimit);
  const audienceContext = AUDIENCE_CONTEXT[audience] ?? AUDIENCE_CONTEXT.general;
  const platformPsychology = PLATFORM_PSYCHOLOGY[platform];

  const focusGuidance =
    focusAreas.length > 0
      ? `\nFOCUS EMPHASIS (weight these in all 4 bios):\n${focusAreas
          .map((f) => `• ${FOCUS_DESCRIPTIONS[f] ?? f}`)
          .join("\n")}`
      : "";

  return `You are a world-class bio writer who has written profiles for founders, athletes, artists, and executives featured in Forbes, TechCrunch, and Vogue. You understand the psychology of attention and what makes a stranger stop, read, and decide to follow or connect.

PLATFORM: ${config.name}
PLATFORM PSYCHOLOGY:
${platformPsychology}

AUDIENCE: ${audienceContext}
CHARACTER TARGET: ${lengthTarget}
${focusGuidance}

YOUR TASK:
Generate exactly 4 bio variations for the same person. These are NOT variations of the same bio — they are fundamentally different strategic approaches to presenting the same person. Each must feel like it was written by a different skilled writer with a different philosophy.

━━━ STRATEGY 1 — THE IDENTITY HOOK ━━━
Lead with the single most surprising, specific, or counterintuitive thing about this person. NOT their job title. NOT their company. The one thing that makes a stranger think "wait — who IS this?" Earn attention before establishing credibility. The reader should be curious before they know what this person does.

━━━ STRATEGY 2 — THE AUTHORITY OPENER ━━━
Lead with the strongest credibility signal: a specific achievement, recognizable institution, measurable impact, or undeniable authority marker. Hook with proof, then reveal the person behind the credentials. The reader should trust before they like.

━━━ STRATEGY 3 — THE MISSION DECLARATION ━━━
Lead with WHY — the purpose, belief, or conviction that drives everything. Not what they do, but what they are trying to change or create. This bio attracts people who share values, not just professional interests. Make it feel like a calling, not a career.

━━━ STRATEGY 4 — THE VOICE-FIRST ━━━
Write as if you captured exactly how this person would describe themselves at a dinner party with smart people — relaxed, real, self-aware, and memorable. This bio should SOUND like the person, not describe them. Use their natural rhythm, wit, or worldview. The reader should feel like they know them.

ABSOLUTE RULES:
• No two bios may open with the same word
• Never start more than 1 bio with "I"
• Forbidden phrases: "results-driven", "passionate about", "seasoned professional", "dynamic", "guru", "ninja", "rockstar", "thought leader", "leverage", "synergy", "innovative solutions", "game-changer"
• No hashtags (#) ever
• Each bio must be RADICALLY different in structure, energy, and opening gambit
• Precision over puffery — one specific detail beats five vague claims
• Length must hit the target range — not a rough approximation
• Do NOT name or label the strategy in your output

RESPOND IN JSON ONLY — no markdown, no code blocks, no preamble.`;
}

export function buildUserPrompt(
  content: string,
  tone: string,
  type: string,
  emojis: boolean,
  audience = "general",
  focusAreas: string[] = [],
  length = "balanced"
): string {
  const toneMap: Record<string, string> = {
    professional: "polished and authoritative — confident without arrogance, credible without being cold",
    passionate: "conviction-driven and energetic — the reader can feel the enthusiasm without it feeling forced",
    thoughtful: "reflective and deliberate — intellectually curious, shows depth and considered perspective",
    casual: "relaxed and conversational — reads like a smart friend explaining what they do",
    sarcastic: "dry and self-aware — humor that's clever and precise, never tries too hard",
    funny: "genuinely entertaining — the kind of bio someone screenshots and texts to a friend",
  };

  const audienceMap: Record<string, string> = {
    general: "general audience",
    recruiters: "recruiters and hiring managers",
    clients: "potential clients or customers",
    peers: "industry peers and collaborators",
    community: "followers and community members",
  };

  const lengthMap: Record<string, string> = {
    short: "punchy and minimal — every word earns its place",
    balanced: "complete but tightly edited — no filler",
    full: "comprehensive — use the full character allowance, but never pad",
  };

  return `PERSON'S INPUT:
"${content}"

WRITING PARAMETERS:
- Voice: ${type === "personal" ? "First-person (write AS this person)" : "Third-person brand voice (write ABOUT this entity)"}
- Tone: ${toneMap[tone] ?? tone}
- Length style: ${lengthMap[length] ?? length}
- Primary audience: ${audienceMap[audience] ?? audience}
- Emojis: ${emojis ? "Yes — use 1–3 emojis placed with purpose, not as decoration" : "No — zero emojis under any circumstances"}${focusAreas.length > 0 ? `\n- Highlight especially: ${focusAreas.join(", ")}` : ""}

Apply all 4 strategies from the system prompt. Produce output in this exact JSON structure:
{"data":[{"bio":"..."},{"bio":"..."},{"bio":"..."},{"bio":"..."}]}`;
}
