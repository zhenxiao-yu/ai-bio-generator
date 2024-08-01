import Output from "@/components/home/Output";
import UserInput from "@/components/home/UserInput";
import { BioProvider } from "@/context/BioContext";
import { ChevronRight, Star } from "lucide-react";

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Bio Generator Built using Next.js",
  description:
    "Generate your perfect social media bio with the help of AI. Just answer a few questions and let our AI craft a bio that truly represents you.",
};

export default function Home() {
  return (
    <main className="relative grid grid-cols-1 slg:grid-cols-2 gap-12 px-4 py-12 sm:py-16 sm:px-8 md:px-10 slg:p-16 lg:p-24 dark:bg-gray-900">
      <div className="col-span-full group w-full flex flex-col items-center justify-center space-y-4 mb-8 text-center">
        <Link
          href="https://github.com/zhenxiao-yu/ai-bio-generator"
          target="_blank"
          className="flex items-center space-x-2 px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-transform duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Star className="w-6 h-6 fill-yellow-300 text-yellow-400" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">Star on GitHub</span>
          <ChevronRight className="ml-1 w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </Link>
        <h1 className="font-extrabold text-4xl md:text-5xl slg:text-6xl lg:text-7xl text-center w-full lg:w-[90%] uppercase mx-auto pt-4 dark:text-gray-100">
          CRAFT THE PERFECT BIO IN SECONDS!
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
          Just answer a few questions, and we&apos;ll generate a bio that captures
          who you are.
        </p>
      </div>

      <BioProvider>
        <UserInput />
        <Output />
      </BioProvider>
    </main>
  );
}
