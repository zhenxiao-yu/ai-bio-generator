import Link from "next/link";
import { Badge } from "@/components/shadcn-ui/badge";
import { Button } from "@/components/shadcn-ui/button";
import {
  ArrowLeft,
  Github,
  Globe,
  Zap,
  Shield,
  Layers,
  Terminal,
  Rocket,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";

export const metadata = {
  title: `About · ${SITE_NAME}`,
  description:
    "How BioLoom works, the tech behind it, and a step-by-step guide to clone and deploy your own free version.",
};

const TECH_STACK = [
  {
    name: "Next.js 15",
    category: "Framework",
    description: "App Router, Server Components, Turbopack builds, and Edge Runtime for OG images.",
    href: "https://nextjs.org",
    color: "bg-zinc-900 border-zinc-700 text-zinc-100",
    badge: "default",
  },
  {
    name: "TypeScript",
    category: "Language",
    description: "End-to-end type safety across API routes, Zustand store, and all UI components.",
    href: "https://www.typescriptlang.org",
    color: "bg-blue-950 border-blue-800 text-blue-100",
    badge: "default",
  },
  {
    name: "Tailwind CSS v4",
    category: "Styling",
    description: "Utility-first styling with custom animations, HSL design tokens, and responsive breakpoints.",
    href: "https://tailwindcss.com",
    color: "bg-cyan-950 border-cyan-800 text-cyan-100",
    badge: "default",
  },
  {
    name: "shadcn/ui",
    category: "Components",
    description: "Accessible, unstyled Radix primitives with copy-paste Tailwind components.",
    href: "https://ui.shadcn.com",
    color: "bg-zinc-900 border-zinc-700 text-zinc-100",
    badge: "secondary",
  },
  {
    name: "Vercel AI SDK v4",
    category: "AI",
    description: "`streamObject` and `generateObject` with structured Zod schemas, streaming via ReadableStream.",
    href: "https://sdk.vercel.ai",
    color: "bg-violet-950 border-violet-800 text-violet-100",
    badge: "default",
  },
  {
    name: "Groq",
    category: "AI Provider",
    description: "Ultra-fast inference: Llama 3.1, Llama 3.3, Gemma 2, Mistral Saba, DeepSeek R1, Qwen QwQ.",
    href: "https://console.groq.com",
    color: "bg-orange-950 border-orange-800 text-orange-100",
    badge: "default",
  },
  {
    name: "Google Gemini",
    category: "AI Provider",
    description: "Gemini 2.0 Flash as the final fallback — free tier with generous rate limits.",
    href: "https://aistudio.google.com",
    color: "bg-green-950 border-green-800 text-green-100",
    badge: "default",
  },
  {
    name: "Zustand",
    category: "State",
    description: "Minimal global store for generation state, history, UI flags, and persisted preferences.",
    href: "https://zustand-demo.pmnd.rs",
    color: "bg-amber-950 border-amber-800 text-amber-100",
    badge: "secondary",
  },
  {
    name: "Zod",
    category: "Validation",
    description: "Schema validation on both client form inputs and AI-generated structured outputs.",
    href: "https://zod.dev",
    color: "bg-indigo-950 border-indigo-800 text-indigo-100",
    badge: "default",
  },
  {
    name: "Vercel",
    category: "Platform",
    description: "Serverless functions with 60s timeout, Edge OG images, Analytics, Speed Insights.",
    href: "https://vercel.com",
    color: "bg-zinc-900 border-zinc-700 text-zinc-100",
    badge: "default",
  },
] as const;

const FEATURES = [
  { icon: Zap, label: "8 AI Models", detail: "Groq + Gemini with automatic fallback chain" },
  { icon: Layers, label: "5 Platforms", detail: "LinkedIn, Twitter/X, Instagram, GitHub, General" },
  { icon: Shield, label: "Zero data stored", detail: "No database, no accounts, no tracking" },
  { icon: Globe, label: "Free forever", detail: "No signup, no rate limits on the free tier" },
];

const STEPS = [
  {
    step: "01",
    title: "Clone the repository",
    code: `git clone https://github.com/zhenxiao-yu/ai-bio-generator.git
cd ai-bio-generator
npm install`,
  },
  {
    step: "02",
    title: "Get your free API keys",
    description: "You need at least one of the following. Both are free:",
    bullets: [
      { label: "Groq", url: "https://console.groq.com", note: "→ Create account → API Keys → Create key" },
      { label: "Google AI Studio", url: "https://aistudio.google.com", note: "→ Get API key (free, no billing)" },
    ],
  },
  {
    step: "03",
    title: "Create your environment file",
    code: `# .env.local  (never commit this file)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: your custom domain once deployed
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app`,
  },
  {
    step: "04",
    title: "Run locally",
    code: `npm run dev
# Open http://localhost:3000`,
  },
  {
    step: "05",
    title: "Deploy to Vercel (free)",
    description: "Vercel's Hobby plan is permanently free and handles everything automatically.",
    code: `# Option A — Vercel CLI
npm i -g vercel
vercel

# Option B — GitHub integration (recommended)
# 1. Push your fork to GitHub
# 2. Go to vercel.com → New Project → Import your repo
# 3. Add GROQ_API_KEY and GOOGLE_GENERATIVE_AI_API_KEY
#    in Project Settings → Environment Variables
# 4. Click Deploy — done in ~60 seconds`,
  },
  {
    step: "06",
    title: "Optional: custom domain",
    description:
      "In Vercel → Project → Settings → Domains, add your own domain. Point your DNS CNAME to cname.vercel-dns.com and Vercel handles SSL automatically.",
    code: `# Add a custom domain in Vercel:
# 1. Vercel Dashboard → Your Project → Settings → Domains
# 2. Enter your domain (e.g. mybio.com or sub.mybio.com)
# 3. Add a CNAME record at your DNS provider:
#    CNAME  @  cname.vercel-dns.com
# 4. SSL certificate is issued automatically (~60s)`,
  },
];

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-3 rounded-lg bg-zinc-950 border border-zinc-800 p-4 text-sm text-zinc-300 overflow-x-auto leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

function StepCard({
  step,
  title,
  code,
  description,
  bullets,
}: {
  step: string;
  title: string;
  code?: string;
  description?: string;
  bullets?: { label: string; url: string; note: string }[];
}) {
  return (
    <div className="relative flex gap-5">
      {/* Line connector */}
      <div className="flex flex-col items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-bold">
          {step}
        </div>
        <div className="mt-2 w-px flex-1 bg-border" />
      </div>

      <div className="pb-10 flex-1 min-w-0">
        <h3 className="font-semibold text-base leading-tight mb-1">{title}</h3>
        {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
        {bullets && (
          <ul className="mt-2 space-y-1">
            {bullets.map((b) => (
              <li key={b.label} className="text-sm text-muted-foreground flex flex-wrap gap-1 items-baseline">
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-2 hover:text-primary transition-colors"
                >
                  {b.label}
                </a>
                <span>{b.note}</span>
              </li>
            ))}
          </ul>
        )}
        {code && <CodeBlock code={code} />}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 sm:px-8 max-w-5xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            BioLoom
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to app</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/zhenxiao-yu/ai-bio-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-5">
          <AnimatedGradientText className="text-xs gap-1.5 mx-auto">
            <Terminal className="w-3 h-3" aria-hidden="true" />
            Open Source · MIT License
          </AnimatedGradientText>

          <h1 className="font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight">
            Built in the open,{" "}
            <span
              className="bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-clip-text text-transparent bg-[length:300%_100%] animate-gradient"
              style={{ "--bg-size": "300%" } as React.CSSProperties}
            >
              free forever
            </span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            BioLoom is a fully open-source AI bio generator. No accounts, no paywalls, no rate limits.
            Clone it, customise it, deploy your own — takes under 10 minutes.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild>
              <a
                href="https://github.com/zhenxiao-yu/ai-bio-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Try the app
              </Link>
            </Button>
          </div>
        </section>

        {/* Feature highlights */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-muted/30 p-5 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold text-sm">{label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="space-y-6">
          <div>
            <h2 className="font-bold text-2xl sm:text-3xl tracking-tight">Tech Stack</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Every dependency is free, open-source, and production-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TECH_STACK.map((tech) => (
              <a
                key={tech.name}
                href={tech.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:bg-muted/40 transition-all duration-200 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{tech.name}</span>
                    <Badge variant="secondary" className="text-xs py-0">
                      {tech.category}
                    </Badge>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tech.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Architecture overview */}
        <section className="space-y-6">
          <div>
            <h2 className="font-bold text-2xl sm:text-3xl tracking-tight">Architecture</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              No database required. Everything lives in the browser or serverless functions.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-zinc-950 p-6 overflow-x-auto">
            <pre className="text-sm text-zinc-300 leading-7">{`Browser
  └── Next.js App Router (Server Components)
        ├── /                   → Home page (generator)
        ├── /about              → This page
        └── /api
              ├── /generate     → streamObject → Groq / Gemini
              ├── /score        → generateObject → LRU cache → Groq / Gemini
              └── /health       → Provider key check

State (client-only, no DB)
  ├── Zustand store             → generation state, history, UI flags
  └── localStorage              → persisted preferences (model/tone/type)

AI Pipeline
  Request → Model Registry → withRetry → [model, ...fallbacks]
                                            └── streamObject (Vercel AI SDK v4)

Deployment
  Vercel Hobby (free)
    ├── Edge Runtime            → OG image generation
    ├── Serverless Functions    → /api/* (60s timeout)
    └── CDN                     → Cache-Control headers on /api/score`}</pre>
          </div>
        </section>

        {/* Clone guide */}
        <section className="space-y-6">
          <div>
            <h2 className="font-bold text-2xl sm:text-3xl tracking-tight flex items-center gap-2">
              <Rocket className="w-6 h-6 text-primary" />
              Deploy Your Own — Free
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              From zero to a live app at your own URL in under 10 minutes.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">100% free to run.</strong> Vercel Hobby plan has no cost.
              Groq and Google AI Studio both offer free tiers with generous limits (10,000+ requests/day).
            </p>
          </div>

          <div>
            {STEPS.map((s) => (
              <StepCard key={s.step} {...s} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-border bg-muted/30 p-8 sm:p-12 text-center space-y-4">
          <h2 className="font-bold text-2xl sm:text-3xl tracking-tight">Start generating bios</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            No account needed. Fill in a few details and get 4 platform-optimised bios in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button size="lg" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Open BioLoom
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com/zhenxiao-yu/ai-bio-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                Fork on GitHub
              </a>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>
            © 2026{" "}
            <a
              href="https://m4rkyu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Zhenxiao Yu
            </a>
            . MIT License.
          </span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              App
            </Link>
            <a
              href="https://github.com/zhenxiao-yu/ai-bio-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a
              href={SITE_URL}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              {SITE_URL.replace("https://", "")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
