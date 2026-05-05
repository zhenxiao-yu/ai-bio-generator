import { NextRequest, NextResponse } from "next/server";

// In-memory store — resets per Edge/serverless cold-start, which is fine:
// the goal is burst protection, not an absolute hard cap.
const store = new Map<string, { count: number; resetAt: number }>();

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/generate": { max: 12, windowMs: 60_000 },  // 12 req/min per IP
  "/api/score":    { max: 30, windowMs: 60_000 },  // 30 req/min per IP
};

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}

function checkLimit(ip: string, path: string): { allowed: boolean; remaining: number; resetAt: number } {
  const limit = LIMITS[path];
  if (!limit) return { allowed: true, remaining: 999, resetAt: 0 };

  const key = `${ip}:${path}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + limit.windowMs });
    return { allowed: true, remaining: limit.max - 1, resetAt: now + limit.windowMs };
  }

  entry.count++;
  const remaining = Math.max(0, limit.max - entry.count);
  return { allowed: entry.count <= limit.max, remaining, resetAt: entry.resetAt };
}

// Prune stale entries every ~100 requests to avoid unbounded growth
let pruneCounter = 0;
function maybePrune() {
  if (++pruneCounter % 100 !== 0) return;
  const now = Date.now();
  for (const [key, val] of store) {
    if (now >= val.resetAt) store.delete(key);
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!LIMITS[pathname]) return NextResponse.next();

  const ip = getIP(req);
  const { allowed, remaining, resetAt } = checkLimit(ip, pathname);
  maybePrune();

  const headers = {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
  };

  if (!allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a moment before trying again.",
        code: "RATE_LIMIT",
        retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
      },
      { status: 429, headers: { ...headers, "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) } }
    );
  }

  const response = NextResponse.next();
  Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

export const config = {
  matcher: ["/api/generate", "/api/score"],
};
