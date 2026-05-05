/**
 * In-memory LRU cache for bio score responses.
 *
 * Same bio on the same platform returns the cached score instantly —
 * no API call, no latency, no free-tier quota used. Cache lives for
 * 30 minutes per entry and holds up to 200 entries.
 *
 * This is a module-level singleton so it persists across requests
 * within the same serverless function instance.
 */

import { LRUCache } from "lru-cache";
import type { BioScore } from "@/types";

const cache = new LRUCache<string, BioScore>({
  max: 200,
  ttl: 1000 * 60 * 30, // 30 minutes
});

function makeKey(bio: string, platform: string): string {
  // Simple hash: we don't need crypto-strength, just collision resistance
  let h = 0;
  const s = `${platform}:${bio}`;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
    h |= 0;
  }
  return `${platform}:${(h >>> 0).toString(36)}`;
}

export function getCachedScore(bio: string, platform: string): BioScore | undefined {
  return cache.get(makeKey(bio, platform));
}

export function setCachedScore(bio: string, platform: string, score: BioScore): void {
  cache.set(makeKey(bio, platform), score);
}
