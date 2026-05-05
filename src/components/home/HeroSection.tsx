import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { Sparkles } from "lucide-react";

const PILLS = ["5 Platforms", "6 Tones", "8 AI Models", "Free Forever"];

export function HeroSection() {
  return (
    <div className="col-span-full relative flex flex-col items-center text-center gap-5 mb-4 pt-2">
      {/* Ambient glow blobs behind the headline */}
      <div className="absolute inset-x-0 top-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-4 -translate-x-1/2 w-[560px] h-[180px] bg-primary/[0.07] dark:bg-primary/[0.13] rounded-full blur-3xl" />
        <div className="absolute right-1/3 top-0 w-48 h-24 bg-[#ffaa40]/[0.06] dark:bg-[#ffaa40]/[0.10] rounded-full blur-2xl" />
      </div>

      <div className="animate-fade-up [animation-fill-mode:both]">
        <AnimatedGradientText className="text-xs gap-1.5">
          <Sparkles className="w-3 h-3" aria-hidden="true" />
          AI-Powered Bio Generator
        </AnimatedGradientText>
      </div>

      <h1 className="font-extrabold text-4xl md:text-5xl slg:text-6xl tracking-tight leading-[1.08] animate-fade-up [animation-delay:60ms] [animation-fill-mode:both]">
        Your perfect bio,{" "}
        <span
          className="bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-clip-text text-transparent bg-[length:300%_100%] animate-gradient"
          style={{ "--bg-size": "300%" } as React.CSSProperties}
        >
          ready in seconds
        </span>
      </h1>

      <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed animate-fade-up [animation-delay:130ms] [animation-fill-mode:both]">
        Fill in a few details and let AI craft compelling bios for LinkedIn, Twitter/X, Instagram,
        GitHub, and more.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 animate-fade-up [animation-delay:200ms] [animation-fill-mode:both]">
        {PILLS.map((label) => (
          <span
            key={label}
            className="px-3 py-1 rounded-full text-xs font-medium bg-muted/80 border border-border hover:border-primary/30 hover:bg-accent hover:text-accent-foreground transition-all duration-200 cursor-default"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
