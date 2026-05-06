# BioLoom — AI Bio Generator

**Author:** Zhenxiao (Mark) Yu  
**Live demo:** [ai-bio-generator-steel.vercel.app](https://ai-bio-generator-steel.vercel.app)

Generate 4 unique, platform-optimized professional bios in seconds. 8 AI models, 5 platforms, 6 tones. Free forever — no signup required.

---

## Features

- **Streaming output** — bios appear word-by-word for instant feedback
- **8 AI models** — Llama 3.3 70B, Llama 4 Scout, Llama 4 Maverick, Gemma 2 9B, Mistral Saba, DeepSeek R1, Qwen 2.5 32B, Gemini 2.0 Flash (with automatic fallback chain)
- **5 platform presets** — Twitter/X, LinkedIn, Instagram, GitHub, General
- **6 tone options** — Professional, Casual, Creative, Bold, Friendly, Minimalist
- **Bio quality scoring** — AI-powered readability and engagement scores
- **Edit & regenerate** — edit any bio inline, regenerate individual cards
- **All-platform batch** — generate bios for all 5 platforms at once
- **Share a bio** — copy a shareable URL for any generated bio
- **Export** — download all bios as a `.txt` file
- **Command palette** — `Cmd+K` for keyboard-first power users
- **Keyboard shortcut** — `Cmd+Enter` / `Ctrl+Enter` to generate
- **Bio history** — last 20 sessions saved locally in your browser
- **Dark mode** — full light/dark theme with system preference detection
- **Platform preview** — see how your bio renders in each platform's UI
- **Rate limited** — 12 generate / 30 score requests per minute per IP
- **Zero signup** — no account, no email, no tracking

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Turbopack) |
| AI SDK | Vercel AI SDK v4 (`streamObject`) |
| Primary AI | Groq (Llama 3.3, Llama 4, Gemma 2, Mistral, DeepSeek, Qwen) |
| Fallback AI | Google Gemini 2.0 Flash |
| Styling | Tailwind CSS v3, shadcn/ui, Magic UI |
| State | Zustand with localStorage persistence |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion, canvas-confetti |
| Analytics | Vercel Analytics + Speed Insights |
| Deployment | Vercel Edge Network |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com) (free tier available)
- Optionally a [Google AI Studio key](https://aistudio.google.com) for Gemini fallback

### Clone and run

```bash
git clone https://github.com/zhenxiao-yu/ai-bio-generator.git
cd ai-bio-generator
npm install
```

Copy the example env file and add your API keys:

```bash
cp .env.local.example .env.local
```

```env
# .env.local
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key_here   # optional
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zhenxiao-yu/ai-bio-generator)

Set `GROQ_API_KEY` in your Vercel project environment variables. The app is fully functional with only Groq (Gemini is the fallback).

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/     # Streaming bio generation endpoint
│   │   ├── score/        # Bio quality scoring endpoint
│   │   └── health/       # Provider health check
│   ├── about/            # About page
│   ├── privacy/          # Privacy policy
│   └── terms/            # Terms of service
├── components/
│   ├── home/             # All main UI components
│   ├── layout/           # Header, Footer
│   ├── magicui/          # Magic UI components
│   └── shadcn-ui/        # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # modelRegistry, utils, siteConfig
├── store/                # Zustand store
└── types/                # Shared TypeScript types
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Next.js](https://nextjs.org) — React framework
- [Vercel AI SDK](https://sdk.vercel.ai) — streaming AI primitives
- [Groq](https://console.groq.com) — ultra-fast LLM inference
- [shadcn/ui](https://ui.shadcn.com) — component system
- [Magic UI](https://magicui.design) — animated components
- [Lucide](https://lucide.dev) — icon library
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
