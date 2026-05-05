"use client";
import { useRef, useState, useEffect } from "react";
import CountUp from "react-countup";
import { CheckCircle2 } from "lucide-react";

interface Stat {
  end: number;
  label: string;
  isZero?: boolean;
}

const STATS: Stat[] = [
  { end: 4, label: "bio options generated" },
  { end: 5, label: "target platforms" },
  { end: 3, label: "AI models" },
  { end: 0, label: "signup required", isZero: true },
];

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [duration, setDuration] = useState(1.5);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDuration(0);
      setStarted(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="col-span-full grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2"
      aria-label="App statistics"
    >
      {STATS.map(({ end, label, isZero }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1 rounded-xl bg-muted/40 border border-border px-4 py-3 text-center"
        >
          {isZero ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" aria-hidden="true" />
          ) : (
            <span className="text-2xl font-extrabold tabular-nums text-foreground">
              {started ? <CountUp start={0} end={end} duration={duration} /> : "0"}
            </span>
          )}
          <span className="text-xs text-muted-foreground leading-tight">{label}</span>
        </div>
      ))}
    </div>
  );
}
