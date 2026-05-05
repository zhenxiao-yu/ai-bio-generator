import Link from "next/link";
import { Github, Globe, Zap } from "lucide-react";
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/siteConfig";

const TECH_LINKS = [
  { label: "Next.js 15", href: "https://nextjs.org" },
  { label: "Vercel AI SDK", href: "https://sdk.vercel.ai" },
  { label: "Groq", href: "https://console.groq.com" },
  { label: "shadcn/ui", href: "https://ui.shadcn.com" },
];

const NAV_LINKS = [
  { label: "Generator", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "GitHub",
    href: "https://github.com/zhenxiao-yu/ai-bio-generator",
    external: true,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-10 slg:px-12 lg:px-16 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link
              href="/"
              className="font-extrabold text-base tracking-tight hover:opacity-80 transition-opacity"
            >
              {SITE_NAME}
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
              {SITE_TAGLINE}. Free, open-source, no signup required.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/zhenxiao-yu/ai-bio-generator"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={SITE_URL}
                aria-label="Live site"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) =>
                link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Built with */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              Built with
            </p>
            <ul className="space-y-2">
              {TECH_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
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
          <span className="flex items-center gap-1">
            Deployed on
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Vercel
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
