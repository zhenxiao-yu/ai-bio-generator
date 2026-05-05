import { describe, it, expect } from "vitest";
import { buildSystemPrompt, buildUserPrompt } from "./promptBuilder";
import { PLATFORMS } from "@/config/platforms";

describe("buildSystemPrompt", () => {
  it("includes platform name for each platform", () => {
    const platforms = Object.keys(PLATFORMS) as Array<keyof typeof PLATFORMS>;
    for (const platform of platforms) {
      const prompt = buildSystemPrompt(platform);
      expect(prompt).toContain(PLATFORMS[platform].name);
    }
  });

  it("includes character limit range derived from platform limit", () => {
    const prompt = buildSystemPrompt("twitter");
    // New prompt uses derived ranges (e.g. 99–141 for 160-char limit)
    const limit = PLATFORMS.twitter.characterLimit;
    const balanced_min = Math.round(limit * 0.62);
    expect(prompt).toContain(String(balanced_min));
  });

  it("includes platform psychology content for linkedin", () => {
    const prompt = buildSystemPrompt("linkedin");
    // New prompt has custom psychology, not the old guidance text verbatim
    expect(prompt).toContain("LinkedIn");
    expect(prompt).toContain("credibility");
  });

  it("defaults to general platform", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain(PLATFORMS.general.name);
  });

  it("instructs to respond in JSON only", () => {
    const prompt = buildSystemPrompt("github");
    expect(prompt).toContain("JSON");
  });

  it("includes focus area descriptions when provided", () => {
    const prompt = buildSystemPrompt("linkedin", "recruiters", "balanced", ["achievements", "leadership"]);
    // Focus areas are expanded to their descriptions, not the raw key names
    expect(prompt).toContain("accomplishments");
    expect(prompt).toContain("FOCUS EMPHASIS");
  });

  it("includes audience context", () => {
    const prompt = buildSystemPrompt("twitter", "clients");
    expect(prompt).toContain("clients");
  });
});

describe("buildUserPrompt", () => {
  it("includes user content verbatim", () => {
    const prompt = buildUserPrompt("Software engineer", "professional", "personal", false);
    expect(prompt).toContain("Software engineer");
  });

  it("includes first-person voice for personal type", () => {
    const prompt = buildUserPrompt("Test", "professional", "personal", false);
    expect(prompt).toContain("First-person");
  });

  it("includes third-person voice for brand type", () => {
    const prompt = buildUserPrompt("Test", "professional", "brand", false);
    expect(prompt).toContain("Third-person");
  });

  it("signals emoji inclusion when enabled", () => {
    const prompt = buildUserPrompt("Test content", "casual", "brand", true);
    expect(prompt).toContain("Yes");
  });

  it("signals no emojis when disabled", () => {
    const prompt = buildUserPrompt("Test content", "casual", "brand", false);
    expect(prompt).toContain("No");
  });

  it("includes focus areas in output when provided", () => {
    const prompt = buildUserPrompt("Test", "professional", "personal", false, "general", ["skills", "mission"]);
    expect(prompt).toContain("skills");
    expect(prompt).toContain("mission");
  });
});
