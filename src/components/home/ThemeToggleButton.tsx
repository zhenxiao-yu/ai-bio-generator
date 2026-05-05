"use client";

import { Sun, Moon } from "lucide-react";
import { useBioStore } from "@/store/bioStore";
import { cn } from "@/lib/utils";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useBioStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-all duration-200 hover:shadow-sm overflow-hidden"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun icon */}
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        )}
      >
        <Sun className="w-4 h-4 text-yellow-400 fill-yellow-300" aria-hidden="true" />
      </span>

      {/* Moon icon */}
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          !isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        )}
      >
        <Moon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
      </span>
    </button>
  );
};

export default ThemeToggleButton;
