# BioLoom — AI bio generator

Generate four unique, platform-optimized professional bios in seconds. BioLoom streams results from eight AI models with automatic fallback, tailors the writing to each social platform, and needs no signup.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

**Author:** Zhenxiao (Mark) Yu
**Live demo:** [ai-bio-generator-steel.vercel.app](https://ai-bio-generator-steel.vercel.app)

---

## What it is

BioLoom takes a short description of you or your brand and writes four bios at once, optimized for the platform you choose. Output streams in token by token. If a model is rate limited or unavailable, the request falls back to the next model automatically, including a cross-provider fallback to Google Gemini. You can score any bio, edit it inline, regenerate a single card, generate for every platform at once, and copy a shareable link. There is no account, email, or login.

---

## Screenshots

> No screenshots are committed to the repository yet. See the [live demo](https://ai-bio-generator-steel.vercel.app) for the current UI. To add images later, place them under `public/` (for example `public/screenshots/`) and reference them here.

---

## Features

- **Streaming output** — bios appear as they generate, using the Vercel AI SDK `streamObject` API.
- **Eight AI models with automatic fallback** — seven Groq-hosted open models plus Google Gemini 2.0 Flash. When the chosen model fails, the request works down a fallback chain (`llama-3.1-8b-instant` → `gemma2-9b-it` → `gemini-2.0-flash`) and crosses to Gemini's separate free quota if Groq is exhausted.
- **Four bios per generation** — every run returns four distinct variations.
- **Five platform presets** — General, Twitter / X, LinkedIn, Instagram, and GitHub, each with its own character limit and tone guidance.
- **Six tone options** — Professional, Casual, Passionate, Thoughtful, Sarcastic, and Funny.
- **Tunable controls** — focus areas, target audience, length, temperature, and an emoji toggle.
- **Bio scoring** — a separate endpoint rates a bio on hook, clarity, platform fit, impact, and originality (0–20 each, 100 total) and returns three actionable tips.
- **Edit and regenerate** — edit any bio inline or regenerate an individual card.
- **All-platform batch** — generate bios for all five platforms in one pass.
- **Shareable links** — copy a URL that encodes a generated bio so others can open it.
- **Export** — download all bios as a `.txt` file.
- **Command palette** — open with `Cmd/Ctrl + K`.
- **Generate shortcut** — `Cmd/Ctrl + Enter`.
- **Local history** — recent sessions are saved in your browser via Zustand + localStorage.
- **Light and dark mode** — with system preference detection.
- **Platform preview** — see how a bio renders in each platform's UI.
- **Rate limiting** — 12 generate and 30 score requests per minute per IP.
- **No signup** — no account, email, or login.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Turbopack) |
| Language | TypeScript 5, React 19 |
| AI SDK | Vercel AI SDK v4 (`ai`, `streamObject` / `generateObject`) |
| Primary provider | Groq, via the OpenAI-compatible provider (`@ai-sdk/openai`) pointed at `api.groq.com` |
| Fallback provider | Google Gemini 2.0 Flash (`@ai-sdk/google`) |
| Models | Llama 3.1 8B/70B, Llama 3.3 70B, Gemma 2 9B, Mistral Saba 24B, DeepSeek R1 Distill 70B, Qwen QwQ 32B, Gemini 2.0 Flash |
| Styling | Tailwind CSS v3, shadcn/ui, Magic UI |
| State | Zustand with localStorage persistence |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion, canvas-confetti |
| Analytics | Vercel Analytics + Speed Insights |
| Testing | Vitest, Testing Library, Playwright |
| Deployment | Vercel |

Groq is reached through the OpenAI-compatible provider rather than a dedicated Groq package, so the model registry routes each model id to either Groq or Gemini at request time.

---

## Run locally

### Prerequisites

- Node.js 18.18 or newer
- A [Groq API key](https://console.groq.com/keys) (free tier available)
- Optionally a [Google AI Studio key](https://aistudio.google.com/app/apikey) for the Gemini fallback

### Install

```bash
git clone https://github.com/zhenxiao-yu/ai-bio-generator.git
cd ai-bio-generator
npm install
```

### Configure environment

Copy the example file and add your keys:

```bash
cp .env.local.example .env.local
```

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | Yes | Primary provider for generation and scoring. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Optional | Enables the Gemini fallback and the Gemini 2.0 Flash model. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical site URL for metadata. Defaults to the live demo URL. |

The app runs with `GROQ_API_KEY` alone. Without the Google key, the Gemini model and Gemini fallback are simply unavailable. Never commit `.env.local` or real keys.

### Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev           # start the dev server
npm run build         # production build (Turbopack, via scripts/build.cjs)
npm run start         # serve the production build
npm run lint          # eslint
npm run type-check    # tsc --noEmit
npm run test          # unit tests (Vitest)
npm run test:e2e      # end-to-end tests (Playwright)
npm run format        # prettier --write on src
npm run analyze       # bundle analysis
```

The `build` script runs through `scripts/build.cjs`, a wrapper that adds `--preserve-symlinks` to work around a Node.js readlink issue on Windows; it calls `next build --turbopack`. On Vercel, the build command in `vercel.json` runs `next build --turbopack` directly.

### Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zhenxiao-yu/ai-bio-generator)

Set `GROQ_API_KEY` in your Vercel project environment variables. Add `GOOGLE_GENERATIVE_AI_API_KEY` to enable the Gemini fallback.

---

## API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/generate?stream=true` | POST | Generate four bios; streams partial objects line by line. |
| `/api/score` | POST | Score a single bio across five dimensions and return tips. |
| `/api/health` (also `/health`) | GET | Report whether each provider key is configured. |

`/api/generate` and `/api/score` are rate limited per IP by `src/middleware.ts` (12/min and 30/min respectively).

---

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/     # streaming bio generation endpoint
│   │   ├── score/        # bio scoring endpoint
│   │   └── health/       # provider health check
│   ├── about/            # about page
│   ├── privacy/          # privacy policy
│   └── terms/            # terms of service
├── components/
│   ├── home/             # main UI components
│   ├── layout/           # header, footer
│   ├── magicui/          # Magic UI components
│   └── shadcn-ui/        # shadcn/ui components
├── config/               # platform and template definitions
├── hooks/                # custom React hooks
├── lib/                  # modelRegistry, promptBuilder, utils, siteConfig
├── store/                # Zustand store
└── types/                # shared TypeScript types
```

---

## Status

Live and deployed on Vercel. Free to use, no signup. The feature set above reflects the current `main` branch.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide. In short:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-feature`).
3. Run `npm run lint` and `npm run type-check` before committing.
4. Commit your changes (`git commit -m 'Add my feature'`).
5. Push to the branch (`git push origin feature/my-feature`).
6. Open a pull request.

---

## License

Released under the [MIT License](LICENSE).

---

## Acknowledgments

- [Next.js](https://nextjs.org) — React framework
- [Vercel AI SDK](https://sdk.vercel.ai) — streaming AI primitives
- [Groq](https://console.groq.com) — fast LLM inference
- [Google AI Studio](https://aistudio.google.com) — Gemini fallback
- [shadcn/ui](https://ui.shadcn.com) — component system
- [Magic UI](https://magicui.design) — animated components
- [Lucide](https://lucide.dev) — icon library
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
