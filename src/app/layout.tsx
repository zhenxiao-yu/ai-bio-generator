import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/shadcn-ui/tooltip";
import GridPattern from "@/components/magicui/grid-pattern";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(GeistSans.variable, "font-sans")}>
        <GridPattern width={20} height={20} className="-z-10 opacity-60" />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
