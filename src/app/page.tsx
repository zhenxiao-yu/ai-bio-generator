export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Output from "@/components/home/Output";
import UserInput from "@/components/home/UserInput";
import BioHistory from "@/components/home/BioHistory";
import Header from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { SharedBioModal } from "@/components/home/SharedBioModal";

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
        <HeroSection />
        <StatsSection />

        <UserInput />
        <div id="output" className="flex flex-col gap-4">
          <Output />
          <BioHistory />
        </div>
      </main>

      <Footer />

      <Suspense fallback={null}>
        <SharedBioModal />
      </Suspense>
    </>
  );
}
