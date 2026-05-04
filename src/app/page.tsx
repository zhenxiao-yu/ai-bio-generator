export const dynamic = "force-dynamic";

import Output from "@/components/home/Output";
import UserInput from "@/components/home/UserInput";
import BioHistory from "@/components/home/BioHistory";
import Header from "@/components/layout/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BioLoom — AI Bio Generator",
  description:
    "Generate your perfect social media bio with the help of AI. BioLoom crafts personalized and compelling bios for LinkedIn, Twitter, Instagram, GitHub, and more.",
  authors: [{ name: "Zhenxiao Yu" }],
  keywords: [
    "Bio Generator",
    "AI Bio Generator",
    "Next.js",
    "Social Media Bio",
    "AI",
    "Personal Branding",
    "Professional Networking",
  ],
};

const Footer = () => (
  <footer className="py-6 border-t border-border text-center bg-background">
    <p className="text-xs sm:text-sm text-muted-foreground px-4">
      © 2026 Zhenxiao Yu. All rights reserved.{" "}
      <a
        href="https://m4rkyu.com"
        className="underline underline-offset-2 hover:text-foreground transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        m4rkyu.com
      </a>
    </p>
  </footer>
);

export default function Home() {
  return (
    <>
      {/* Skip-nav for accessibility */}
      <a
        href="#output"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to results
      </a>

      <Header />

      <main className="relative grid grid-cols-1 slg:grid-cols-2 gap-8 slg:gap-12 px-4 py-8 sm:py-12 sm:px-8 md:px-10 slg:p-12 lg:p-16 max-w-[1600px] mx-auto">
        {/* Compact hero */}
        <div className="col-span-full flex flex-col items-center text-center gap-3 mb-4">
          <h1 className="font-extrabold text-3xl md:text-4xl slg:text-5xl tracking-tight uppercase">
            Your perfect bio, ready in seconds
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
            Fill in a few details and let AI craft compelling bios for LinkedIn, Twitter/X, Instagram, GitHub, and more.
          </p>
        </div>

        <UserInput />
        <div id="output" className="flex flex-col gap-4">
          <Output />
          <BioHistory />
        </div>
      </main>

      <Footer />
    </>
  );
}
