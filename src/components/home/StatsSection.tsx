"use client";
import { useRef, useState, useEffect } from "react";
import CountUp from "react-countup";
import { CheckCircle2, Sparkles, Globe, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  end: number;
  label: string;
  icon: React.ElementType;
  isZero?: boolean;
  delay?: number;
}

const STATS: Stat[] = [
  { end: 4,  label: "bios per generation", icon: Sparkles, delay: 0   },
  { end: 5,  label: "target platforms",    icon: Globe,    delay: 60  },
  { end: 8,  label: "AI models",           icon: Zap,      delay: 120 },
  { end: 0,  label: "signup required",     icon: CheckCircle2, isZero: true, delay: 180 },
];

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [duration, setDuration] = useState(1.4);

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
      { threshold: 0.25 }
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
      {STATS.map(({ end, label, icon: Icon, isZero, delay = 0 }) => (
        <div
          key={label}
          className={cn(
            "group flex flex-col items-center gap-2 rounded-xl px-4 py-4 text-center",
            "border border-border/70 bg-card/80 shadow-sm",
            "hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
            "hover:-translate-y-0.5 card-hover",
            "animate-fade-up [animation-fill-mode:both]"
          )}
          style={{ animationDelay: `${delay}ms` }}
        >
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            isZero
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-primary/10 text-primary"
          )}>
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>

          {isZero ? (
            <span className="text-2xl font-extrabold text-emerald-500">
              Zero
            </span>
          ) : (
            <span className="text-2xl font-extrabold tabular-nums text-primary">
              {started ? <CountUp start={0} end={end} duration={duration} /> : "0"}
            </span>
          )}

          <span className="text-[11px] font-medium text-muted-foreground leading-tight">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
