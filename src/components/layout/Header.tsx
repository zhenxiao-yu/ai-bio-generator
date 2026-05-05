"use client";

import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import ThemeToggleButton from "@/components/home/ThemeToggleButton";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-8 md:px-10 slg:px-16 lg:px-24 max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 font-extrabold text-lg tracking-tight transition-all duration-200 hover:text-primary"
        >
          <span className="transition-colors duration-200">BioLoom</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {/* About link with sliding underline */}
          <Link
            href="/about"
            className={cn(
              "relative px-2.5 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200",
              "hover:text-foreground hover:bg-muted/60",
              pathname === "/about"
                ? "text-foreground bg-muted/60"
                : "text-muted-foreground"
            )}
          >
            About
            {pathname === "/about" && (
              <span className="absolute inset-x-2.5 -bottom-[1px] h-px bg-primary rounded-full" />
            )}
          </Link>

          {/* GitHub star button */}
          <Link
            href="https://github.com/zhenxiao-yu/ai-bio-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/70 transition-all duration-200 text-sm font-medium hover:shadow-sm ml-1"
            aria-label="Star on GitHub"
          >
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
            <span className="hidden sm:inline text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              Star
            </span>
            <ChevronRight className="w-3 h-3 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>

          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
