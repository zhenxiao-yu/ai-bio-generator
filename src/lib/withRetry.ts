/**
 * Simple exponential-backoff retry — no external dependencies.
 *
 * Retries on transient network/timeout errors only.
 * Does NOT retry on auth failures (401), bad requests (400), or
 * intentional rate-limit signals — those surface immediately so the
 * caller can fall back to a different model/provider.
 */

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (err: unknown) => boolean;
}

function defaultShouldRetry(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  // Retry on network/timeout errors only
  if (msg.includes("401") || msg.includes("400") || msg.includes("429")) return false;
  if (msg.toLowerCase().includes("unauthorized")) return false;
  if (msg.toLowerCase().includes("rate limit")) return false;
  // Retry on transient network/server errors
  if (msg.includes("fetch failed") || msg.includes("ECONNRESET") || msg.includes("ETIMEDOUT")) return true;
  if (msg.includes("502") || msg.includes("504")) return true;
  return false;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  {
    maxRetries = 2,
    baseDelayMs = 400,
    maxDelayMs = 4000,
    shouldRetry = defaultShouldRetry,
  }: RetryOptions = {}
): Promise<T> {
  let lastErr: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt === maxRetries || !shouldRetry(err)) throw err;

      // Exponential backoff with full jitter
      const cap = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
      const delay = Math.random() * cap;
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastErr;
}
