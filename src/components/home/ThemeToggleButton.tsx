"use client"; // This marks the component as a Client Component

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react"; // Importing icons from lucide-react

const ThemeToggleButton = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 mb-3"
      aria-label="Toggle Dark Mode"
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
