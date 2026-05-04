import { describe, it, expect, beforeEach, vi } from "vitest";
import { useBioStore } from "./bioStore";

beforeEach(() => {
  useBioStore.setState({
    bios: [],
    platform: "general",
    history: [],
    loading: false,
    error: null,
    errorCode: null,
    abortController: null,
    theme: "light",
  });
});

describe("editBio", () => {
  it("updates the bio text at a given index", () => {
    useBioStore.setState({
      bios: [
        { text: "Original bio", edited: false },
        { text: "Second bio", edited: false },
      ],
    });
    useBioStore.getState().editBio(0, "Updated bio");
    const { bios } = useBioStore.getState();
    expect(bios[0].text).toBe("Updated bio");
    expect(bios[0].edited).toBe(true);
    expect(bios[1].text).toBe("Second bio");
  });
});

describe("setPlatform", () => {
  it("updates the platform", () => {
    useBioStore.getState().setPlatform("linkedin");
    expect(useBioStore.getState().platform).toBe("linkedin");
  });
});

describe("clearError", () => {
  it("clears error and errorCode", () => {
    useBioStore.setState({ error: "Some error", errorCode: "UNKNOWN" });
    useBioStore.getState().clearError();
    expect(useBioStore.getState().error).toBeNull();
    expect(useBioStore.getState().errorCode).toBeNull();
  });
});

describe("history FIFO eviction", () => {
  it("keeps at most 20 entries (FIFO)", () => {
    const { addToHistory } = useBioStore.getState();
    for (let i = 0; i < 22; i++) {
      addToHistory({
        timestamp: Date.now() + i,
        platform: "general",
        bios: [`bio ${i}`],
        snippet: `bio ${i}`,
      });
    }
    const { history } = useBioStore.getState();
    expect(history.length).toBe(20);
    expect(history[0].snippet).toBe("bio 21");
  });
});

describe("deleteHistoryEntry", () => {
  it("removes the entry with the given id", () => {
    useBioStore.getState().addToHistory({
      timestamp: Date.now(),
      platform: "general",
      bios: ["bio text"],
      snippet: "bio text",
    });
    const { history } = useBioStore.getState();
    const id = history[0].id;
    useBioStore.getState().deleteHistoryEntry(id);
    expect(useBioStore.getState().history.length).toBe(0);
  });
});

describe("restoreFromHistory", () => {
  it("restores bios and platform from a history entry", () => {
    useBioStore.getState().addToHistory({
      timestamp: Date.now(),
      platform: "linkedin",
      bios: ["restored bio"],
      snippet: "restored bio",
    });
    const { history } = useBioStore.getState();
    useBioStore.getState().restoreFromHistory(history[0].id);
    const state = useBioStore.getState();
    expect(state.bios[0].text).toBe("restored bio");
    expect(state.platform).toBe("linkedin");
  });
});

describe("clearHistory", () => {
  it("empties the history array", () => {
    useBioStore.getState().addToHistory({
      timestamp: Date.now(),
      platform: "general",
      bios: ["bio"],
      snippet: "bio",
    });
    useBioStore.getState().clearHistory();
    expect(useBioStore.getState().history.length).toBe(0);
  });
});

describe("cancelGeneration", () => {
  it("sets loading to false and clears abortController", () => {
    const controller = new AbortController();
    useBioStore.setState({ loading: true, abortController: controller });
    useBioStore.getState().cancelGeneration();
    expect(useBioStore.getState().loading).toBe(false);
    expect(useBioStore.getState().abortController).toBeNull();
  });
});

describe("generateBios", () => {
  it("handles API error response by setting error state", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Rate limit exceeded", code: "RATE_LIMIT" }),
    } as Response);

    await useBioStore.getState().generateBios({
      model: "llama-3.1-8b-instant",
      temperature: 1,
      content: "Test content",
      type: "personal",
      tone: "professional",
      emojis: false,
    });

    const state = useBioStore.getState();
    expect(state.error).toBe("Rate limit exceeded");
    expect(state.errorCode).toBe("RATE_LIMIT");
    expect(state.loading).toBe(false);
  });

  it("populates bios on successful response", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          { bio: "Bio 1" },
          { bio: "Bio 2" },
          { bio: "Bio 3" },
          { bio: "Bio 4" },
        ],
      }),
    } as Response);

    await useBioStore.getState().generateBios({
      model: "llama-3.1-8b-instant",
      temperature: 1,
      content: "Test content",
      type: "personal",
      tone: "professional",
      emojis: false,
    });

    const state = useBioStore.getState();
    expect(state.bios.length).toBe(4);
    expect(state.bios[0].text).toBe("Bio 1");
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
