"use client";

import { Sun, Moon } from "lucide-react";
import { useBioStore } from "@/store/bioStore";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useBioStore();

  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 mb-3"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6 fill-yellow-300 text-yellow-400" />
      ) : (
        <Moon className="w-6 h-6 text-gray-800 dark:text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
