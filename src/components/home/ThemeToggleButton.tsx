"use client";

import { Sun, Moon } from "lucide-react";
import { useBioStore } from "@/store/bioStore";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useBioStore();

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 flex items-center justify-center bg-muted text-foreground rounded-full transition-colors duration-200 hover:bg-muted/80"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 fill-yellow-300 text-yellow-400" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
