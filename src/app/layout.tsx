import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/shadcn-ui/tooltip";
import GridPattern from "@/components/magicui/grid-pattern";
import { Toaster } from "sonner";

export const metadata: Metadata = {
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
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </body>
    </html>
  );
}
