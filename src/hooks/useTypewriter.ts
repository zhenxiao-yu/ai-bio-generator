"use client";
import { useRef, useState, useCallback } from "react";

interface UseTypewriterOptions {
  speed?: number;
  onComplete?: () => void;
}

export function useTypewriter({ speed = 28, onComplete }: UseTypewriterOptions = {}) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTyping(false);
  }, []);

  const type = useCallback(
    (fullText: string, setter: (val: string) => void) => {
      stop();
      setter("");
      setIsTyping(true);
      let i = 0;
      intervalRef.current = setInterval(() => {
        i++;
        setter(fullText.slice(0, i));
        if (i >= fullText.length) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsTyping(false);
          onComplete?.();
        }
      }, speed);
    },
    [stop, speed, onComplete]
  );

  return { type, stop, isTyping };
}
