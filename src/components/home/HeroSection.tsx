import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { Sparkles } from "lucide-react";

const PILLS = ["5 Platforms", "6 Tones", "3 AI Models", "Free Forever"];

export function HeroSection() {
  return (
    <div className="col-span-full flex flex-col items-center text-center gap-4 mb-4">
      <AnimatedGradientText className="text-xs gap-1.5">
        <Sparkles className="w-3 h-3" aria-hidden="true" />
        AI-Powered Bio Generator
      </AnimatedGradientText>

      <h1 className="font-extrabold text-3xl md:text-4xl slg:text-5xl tracking-tight uppercase leading-tight">
        Your perfect bio,{" "}
        <span
          className="bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-clip-text text-transparent bg-[length:300%_100%] animate-gradient"
          style={{ "--bg-size": "300%" } as React.CSSProperties}
        >
          ready in seconds
        </span>
      </h1>

      <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
        Fill in a few details and let AI craft compelling bios for LinkedIn, Twitter/X, Instagram,
        GitHub, and more.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {PILLS.map((label) => (
          <span
            key={label}
            className="px-3 py-1 rounded-full text-xs font-medium bg-muted border border-border text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
