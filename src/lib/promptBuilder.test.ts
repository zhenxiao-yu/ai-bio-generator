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

  it("includes character limit guidance for twitter", () => {
    const prompt = buildSystemPrompt("twitter");
    expect(prompt).toContain(String(PLATFORMS.twitter.characterLimit));
  });

  it("includes platform guidance text", () => {
    const prompt = buildSystemPrompt("linkedin");
    expect(prompt).toContain(PLATFORMS.linkedin.guidance);
  });

  it("defaults to general platform", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain(PLATFORMS.general.name);
  });

  it("instructs to respond in JSON only", () => {
    const prompt = buildSystemPrompt("github");
    expect(prompt).toContain("JSON");
  });
});

describe("buildUserPrompt", () => {
  it("includes content, tone, type, and emojis", () => {
    const prompt = buildUserPrompt("Software engineer", "professional", "personal", false);
    expect(prompt).toContain("Software engineer");
    expect(prompt).toContain("professional");
    expect(prompt).toContain("personal");
    expect(prompt).toContain("false");
  });

  it("reflects emoji flag as true when enabled", () => {
    const prompt = buildUserPrompt("Test content", "casual", "brand", true);
    expect(prompt).toContain("true");
  });
});
