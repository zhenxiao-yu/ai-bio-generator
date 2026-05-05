"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, HistoryEntry, BioScore } from "@/types";
import { PLATFORMS, PLATFORM_ORDER } from "@/config/platforms";

export interface Bio {
  text: string;
  edited: boolean;
  score?: BioScore;
}

export type Theme = "light" | "dark";

export type GenerateErrorCode = "RATE_LIMIT" | "AUTH" | "MODEL_UNAVAILABLE" | "UNKNOWN";

export type BatchBios = Partial<Record<Platform, Bio[]>>;

interface BioState {
  bios: Bio[];
  platform: Platform;
  history: HistoryEntry[];
  loading: boolean;
  error: string | null;
  errorCode: GenerateErrorCode | null;
  abortController: AbortController | null;
  theme: Theme;
  lastPayload: GeneratePayload | null;
  batchBios: BatchBios;
  batchLoading: boolean;
  commandPaletteOpen: boolean;
  templatesModalOpen: boolean;
}

interface BioActions {
  generateBios: (payload: GeneratePayload) => Promise<void>;
  generateAllPlatforms: () => Promise<void>;
  cancelGeneration: () => void;
  clearError: () => void;
  toggleTheme: () => void;
  setPlatform: (platform: Platform) => void;
  editBio: (index: number, text: string) => void;
  setBios: (bios: Bio[]) => void;
  setBioScore: (index: number, score: BioScore) => void;
  clearBatchBios: () => void;
  addToHistory: (entry: Omit<HistoryEntry, "id">) => void;
  clearHistory: () => void;
  restoreFromHistory: (id: string) => void;
  deleteHistoryEntry: (id: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setTemplatesModalOpen: (open: boolean) => void;
}

export interface GeneratePayload {
  model: string;
  temperature: number;
  content: string;
  type: "personal" | "brand";
  tone: string;
  emojis: boolean;
  platform?: Platform;
}

const MAX_HISTORY = 20;

async function fetchBiosForPlatform(
  payload: GeneratePayload,
  platform: Platform
): Promise<Bio[]> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, platform }),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { data: { bio: string }[] };
  return (json.data ?? []).map((d) => ({ text: d.bio, edited: false }));
}

export const useBioStore = create<BioState & BioActions>()(
  persist(
    (set, get) => ({
      bios: [],
      platform: "general",
      history: [],
      loading: false,
      error: null,
      errorCode: null,
      abortController: null,
      theme: "light",
      lastPayload: null,
      batchBios: {},
      batchLoading: false,
      commandPaletteOpen: false,
      templatesModalOpen: false,

      generateBios: async (payload) => {
        get().cancelGeneration();
        const controller = new AbortController();
        const EMPTY_SLOTS: Bio[] = Array.from({ length: 4 }, () => ({ text: "", edited: false }));
        set({
          loading: true,
          error: null,
          errorCode: null,
          abortController: controller,
          lastPayload: payload,
          batchBios: {},
          bios: EMPTY_SLOTS,
        });

        try {
          const res = await fetch("/api/generate?stream=true", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, platform: payload.platform ?? get().platform }),
            signal: controller.signal,
          });

          if (!res.ok) {
            const json = (await res.json().catch(() => ({}))) as {
              error?: string;
              code?: GenerateErrorCode;
            };
            set({
              loading: false,
              bios: [],
              error: json.error ?? "Generation failed.",
              errorCode: json.code ?? "UNKNOWN",
              abortController: null,
            });
            return;
          }

          const reader = res.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let finalBios: Bio[] = [];

          outer: while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const partial = JSON.parse(line) as {
                  data?: { bio: string }[];
                  __error?: { error: string; code: string };
                };

                if (partial.__error) {
                  set({
                    loading: false,
                    bios: [],
                    error: partial.__error.error,
                    errorCode: (partial.__error.code as GenerateErrorCode) ?? "UNKNOWN",
                    abortController: null,
                  });
                  break outer;
                }

                if (partial.data?.length) {
                  const updated: Bio[] = partial.data.map((d, i) => ({
                    text: d.bio ?? "",
                    edited: false,
                    score: get().bios[i]?.score,
                  }));
                  while (updated.length < 4) updated.push({ text: "", edited: false });
                  finalBios = updated;
                  set({ bios: updated });
                }
              } catch {
                // ignore malformed lines
              }
            }
          }

          const completedBios = finalBios.filter((b) => b.text);
          if (completedBios.length === 0) {
            set({ loading: false, abortController: null });
            return;
          }

          const platform = payload.platform ?? get().platform;
          const entry: HistoryEntry = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            timestamp: Date.now(),
            platform,
            bios: completedBios.map((b) => b.text),
            snippet: completedBios[0]?.text.slice(0, 60) ?? "",
          };
          const history = [entry, ...get().history].slice(0, MAX_HISTORY);
          set({ loading: false, abortController: null, history });
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            set({ loading: false, bios: [], error: null, errorCode: null, abortController: null });
          } else {
            set({
              loading: false,
              bios: [],
              error: "Something went wrong. Please try again.",
              errorCode: "UNKNOWN",
              abortController: null,
            });
          }
        }
      },

      generateAllPlatforms: async () => {
        const { lastPayload } = get();
        if (!lastPayload) return;

        set({ batchLoading: true, batchBios: {} });

        const results = await Promise.allSettled(
          PLATFORM_ORDER.map((p) => fetchBiosForPlatform(lastPayload, p))
        );

        const batchBios: BatchBios = {};
        PLATFORM_ORDER.forEach((p, i) => {
          const r = results[i];
          if (r.status === "fulfilled" && r.value.length > 0) {
            batchBios[p] = r.value;
          }
        });

        set({ batchBios, batchLoading: false });
      },

      clearBatchBios: () => set({ batchBios: {} }),

      cancelGeneration: () => {
        const { abortController } = get();
        abortController?.abort();
        set({ abortController: null, loading: false });
      },

      clearError: () => set({ error: null, errorCode: null }),

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      },

      setPlatform: (platform) => set({ platform }),

      editBio: (index, text) => {
        const bios = get().bios.map((bio, i) =>
          i === index ? { ...bio, text, edited: true } : bio
        );
        set({ bios });
      },

      setBios: (bios) => set({ bios }),

      setBioScore: (index, score) => {
        const bios = get().bios.map((bio, i) => (i === index ? { ...bio, score } : bio));
        set({ bios });
      },

      addToHistory: (entry) => {
        const newEntry: HistoryEntry = {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        };
        const history = [newEntry, ...get().history].slice(0, MAX_HISTORY);
        set({ history });
      },

      clearHistory: () => set({ history: [] }),

      restoreFromHistory: (id) => {
        const entry = get().history.find((h) => h.id === id);
        if (!entry) return;
        const bios: Bio[] = entry.bios.map((text) => ({ text, edited: false }));
        set({ bios, platform: entry.platform });
      },

      deleteHistoryEntry: (id) => {
        const history = get().history.filter((h) => h.id !== id);
        set({ history });
      },

      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setTemplatesModalOpen: (open) => set({ templatesModalOpen: open }),
    }),
    {
      name: "bio-store",
      partialize: (state) => ({
        theme: state.theme,
        history: state.history,
      }),
    }
  )
);

export { PLATFORMS };
