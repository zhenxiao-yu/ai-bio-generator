"use client";

import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import ThemeToggleButton from "@/components/home/ThemeToggleButton";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-8 md:px-10 slg:px-16 lg:px-24 max-w-[1600px] mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold text-lg tracking-tight hover:opacity-80 transition-opacity"
        >
          BioLoom
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/zhenxiao-yu/ai-bio-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm font-medium"
            aria-label="Star on GitHub"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <span className="hidden sm:inline text-muted-foreground group-hover:text-foreground transition-colors">
              Star
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
