export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
  description: SITE_DESCRIPTION,
};

import { Suspense } from "react";
import Output from "@/components/home/Output";
import UserInput from "@/components/home/UserInput";
import BioHistory from "@/components/home/BioHistory";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { SharedBioModal } from "@/components/home/SharedBioModal";

export default function Home() {
  return (
    <>
      {/* Skip-nav — keyboard only, hidden off-screen until focused */}
      <a
        href="#output"
        className="fixed left-4 top-0 -translate-y-full z-[60] px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-b-lg shadow-lg transition-transform duration-150 focus-visible:translate-y-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
