# BioLoom — Sprint Roadmap

**Current state**: Production-ready, deployed at [bioloom.is-a.dev](https://bioloom.is-a.dev)  
**Stack**: Next.js 15, Vercel AI SDK v4, Groq + Gemini, Zustand, Tailwind CSS

---

## Sprint 16 — System Robustness + Web Discoverability *(current)*

**Goal**: Close every remaining gap before public launch announcement.

| # | Feature | Impact |
|---|---------|--------|
| 16A | Dynamic `sitemap.ts` — auto-indexes all pages | SEO |
| 16B | `global-error.tsx` — root-level React error boundary | Stability |
| 16C | Input trim + sanitisation in generate API | Security |
| 16D | `useOnline` hook + offline banner | UX |
| 16E | Rate-limit countdown UI (read `Retry-After` header) | UX |
| 16F | PWA `manifest.ts` — installable on mobile/desktop | Reach |
| 16G | Remove unused boilerplate assets from `public/` | Hygiene |

---

## Sprint 17 — Content SEO & Keyword Targeting

**Goal**: Give search engines real content to index so organic users find BioLoom.

| # | Feature | Impact |
|---|---------|--------|
| 17A | `/changelog` page — public release history | SEO + Trust |
| 17B | `/features` page — long-form feature showcase with screenshots | SEO |
| 17C | Per-page dynamic OG images (about, features, changelog) | Social sharing |
| 17D | `hreflang` + `alternates` metadata for future i18n | SEO prep |
| 17E | Blog skeleton — MDX-based `/blog/[slug]` with 2 seed posts | SEO |
| 17F | Internal linking strategy — cross-link from features → generator | SEO |

---

## Sprint 18 — Advanced Error Handling & Resilience

**Goal**: Ensure the app degrades gracefully under every failure mode.

| # | Feature | Impact |
|---|---------|--------|
| 18A | React `ErrorBoundary` wrapper component for BioCard grid | Stability |
| 18B | Retry button on streaming failures (mid-stream disconnect) | UX |
| 18C | Partial result preservation — show streamed bios even if stream dies | UX |
| 18D | Provider status page integration (Groq status API) | Transparency |
| 18E | Client-side session rate limit tracker (localStorage) | UX |
| 18F | Toast queuing — prevent stacked toasts on rapid errors | Polish |

---

## Sprint 19 — Performance & Core Web Vitals

**Goal**: Score 95+ on Lighthouse. Keep bundle lean as features accumulate.

| # | Feature | Impact |
|---|---------|--------|
| 19A | Automated bundle size CI check (`bundlesize` or `size-limit`) | Dev hygiene |
| 19B | Code-split CommandPalette + BatchOutputTabs (lazy load) | LCP |
| 19C | Preload Groq DNS on hover of Generate button | TTFB |
| 19D | Optimise OG image route — add `Cache-Control: s-maxage=86400` | CDN efficiency |
| 19E | Replace `canvas-confetti` dynamic import with preconnect hint | Bundle |
| 19F | `@next/font` subsets for Geist — only latin chars | Bundle |

---

## Sprint 20 — Accessibility (WCAG AA)

**Goal**: Full keyboard navigation, screen reader support, contrast compliance.

| # | Feature | Impact |
|---|---------|--------|
| 20A | Automated a11y CI — `axe-core` in Playwright E2E | Compliance |
| 20B | Focus trap in CommandPalette and TemplatesModal | Keyboard |
| 20C | Announce streaming bio updates via `aria-live` regions | Screen reader |
| 20D | Primary colour contrast check — darken if < 4.5:1 on white | WCAG AA |
| 20E | `prefers-reduced-motion` audit — disable all CSS animations | Accessibility |
| 20F | Tab order audit — logical reading order on mobile layout | Keyboard |

---

## Sprint 21 — Bio Quality & AI Improvements

**Goal**: Make generated bios measurably better and more personalised.

| # | Feature | Impact |
|---|---------|--------|
| 21A | System prompt A/B testing — 2 variants via env flag | Quality |
| 21B | Few-shot examples in prompt per platform | Quality |
| 21C | Bio improvement suggestions — "Try adding a specific achievement" | UX |
| 21D | Character count-aware generation — prompt includes target length | Quality |
| 21E | "Bio of the Day" — daily curated example (static) | Engagement |
| 21F | User feedback loop — thumbs up/down per bio (localStorage) | Quality data |

---

## Sprint 22 — Social Proof & Community

**Goal**: Turn users into advocates. Give them reasons to share BioLoom.

| # | Feature | Impact |
|---|---------|--------|
| 22A | `/gallery` — curated showcase of user-submitted bios | Trust + SEO |
| 22B | "Made with BioLoom" watermark option (opt-in) | Viral loop |
| 22C | Tweet wall — embed tweets mentioning BioLoom | Social proof |
| 22D | GitHub star count display (live via GitHub API) | Social proof |
| 22E | Testimonials section on home page | Conversion |
| 22F | `CONTRIBUTING.md` with good-first-issue labels | OSS growth |

---

## Sprint 23 — Internationalisation (i18n)

**Goal**: Reach non-English users — largest untapped growth lever.

| # | Feature | Impact |
|---|---------|--------|
| 23A | `next-intl` setup — locale routing (`/en`, `/zh`, `/es`) | Reach |
| 23B | Translate UI strings — EN + ZH (Simplified) as first languages | Reach |
| 23C | Locale-aware prompt templates | Quality |
| 23D | RTL layout support (Arabic/Hebrew groundwork) | Future-proof |
| 23E | `hreflang` tags per locale | SEO |

---

## Sprint 24 — Developer API & Ecosystem

**Goal**: Enable power users and integrations. Make BioLoom a platform.

| # | Feature | Impact |
|---|---------|--------|
| 24A | Public REST API — `POST /api/v1/generate` with API key auth | Ecosystem |
| 24B | `/docs` — OpenAPI spec + interactive playground | Developer UX |
| 24C | Zapier / Make.com integration guide | Distribution |
| 24D | VS Code extension — generate bio from command palette | Distribution |
| 24E | API key management dashboard (simple, no DB — Vercel KV) | Monetisation prep |

---

## Sprint 25 — Monetisation Prep (Optional, Ethical)

**Goal**: Sustainable future for the project without paywall-ing core features.

| # | Feature | Impact |
|---|---------|--------|
| 25A | "BioLoom Pro" concept — what would justify $5/mo? | Strategy |
| 25B | Higher rate limits for signed-in users (Clerk auth) | Fairness |
| 25C | Custom tone training — save your own tone profile | Pro feature |
| 25D | Team sharing — share bio sets with teammates | Pro feature |
| 25E | Remove rate limits for sponsors (GitHub Sponsors) | OSS model |

---

## Implementation Priority Matrix

```
IMPACT
  ↑
  │  S17(Content)    S22(Social)
  │  S16(Robust)     S21(AI Quality)
  │  S19(Perf)       S24(API)
  │  S20(a11y)       S23(i18n)
  │                  S25(Monetise)  S18(Errors)
  └──────────────────────────────────► EFFORT
     Low                             High
```

**Recommended sequence**: 16 → 17 → 19 → 20 → 21 → 22 → 18 → 23 → 24 → 25

---

*Last updated: 2026-05-05*
