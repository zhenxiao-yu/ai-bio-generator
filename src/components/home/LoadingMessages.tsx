"use client";
import { useState, useEffect } from "react";

const MESSAGES = [
  "Reading your story...",
  "Crafting your narrative...",
  "Adding personality...",
  "Polishing the words...",
  "Making it shine...",
  "Almost ready...",
];

const INTERVAL_MS = 2200;

export function LoadingMessages() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <p
      className="text-sm text-muted-foreground text-center w-full transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      aria-live="polite"
      aria-atomic="true"
    >
      {MESSAGES[index]}
    </p>
  );
}
