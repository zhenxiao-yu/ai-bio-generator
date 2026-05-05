import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/shadcn-ui/tooltip";
import GridPattern from "@/components/magicui/grid-pattern";
import { Toaster } from "sonner";
import { CommandPalette } from "@/components/home/CommandPalette";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const APP_URL = "https://ai-bio-generator-steel.vercel.app";

export const metadata: Metadata = {
  title: "BioLoom — AI Bio Generator",
  description:
    "Generate 4 unique bios in seconds. 8 AI models, 5 platforms, 6 tones. Free forever — no signup required.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "BioLoom — AI Bio Generator",
    description: "4 unique bios in seconds. Free, no signup.",
    url: APP_URL,
    siteName: "BioLoom",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BioLoom — AI Bio Generator",
    description: "4 unique bios in seconds. 8 AI models. Free forever.",
  },
  icons: {
    icon: [{ url: "/icon.png" }, { url: "/favicon.ico" }],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Anti-FOUT: apply stored theme before first paint */}
      <head>
        {/* DNS prefetch — shaves ~50–150ms off the first API call cold start */}
        <link rel="dns-prefetch" href="https://api.groq.com" />
        <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com" />
        <link rel="preconnect" href="https://api.groq.com" crossOrigin="anonymous" />
        {/* Mobile browser chrome color */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var s = JSON.parse(localStorage.getItem('bio-store') || '{}');
                if (s.state && s.state.theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={cn(GeistSans.variable, "font-sans")}>
        <GridPattern width={20} height={20} className="-z-10 opacity-60" />
        <TooltipProvider>
          {children}
          <CommandPalette />
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
