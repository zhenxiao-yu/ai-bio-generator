import Output from "@/components/home/Output";
import UserInput from "@/components/home/UserInput";
import { BioProvider } from "@/context/BioContext";
import { ChevronRight, Star } from "lucide-react";
import ThemeToggleButton from "@/components/home/ThemeToggleButton";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BIOLOOM: AI Bio Generator Built using Next.js 14 by Zhenxiao Yu",
  description:
    "Generate your perfect social media bio with the help of AI, crafted by Zhenxiao Yu. This innovative application, built using Next.js, leverages advanced AI algorithms to create personalized and compelling bios for your social media profiles. Simply answer a few questions, and our AI will generate a bio that truly represents you. Whether for professional networking, personal branding, or social connections, this tool ensures your online presence is impactful and authentic.",
  authors: [{ name: "Zhenxiao Yu" }],
  keywords: [
    "Bio Generator",
    "AI Bio Generator",
    "Next.js",
    "Zhenxiao Yu",
    "Social Media Bio",
    "AI Algorithms",
    "Personalized Bios",
    "Online Presence",
    "Personal Branding",
    "Professional Networking",
  ],
};

export default function Home() {
  return (
    <main className="relative grid grid-cols-1 slg:grid-cols-2 gap-12 px-4 py-12 sm:py-16 sm:px-8 md:px-10 slg:p-16 lg:p-24 dark:bg-gray-900">
      <div className="col-span-full group w-full flex flex-col items-center justify-center space-y-4 mb-8 text-center">
        <ThemeToggleButton />
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
          BioLoom
        </h1>
        <h2 className="text-xl md:text-2xl slg:text-3xl lg:text-4xl text-center w-full lg:w-[80%] mx-auto pt-2 dark:text-gray-200">
          YOUR PERFECT BIO, READY IN SECONDS
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 lg:w-[80%] mx-auto">
          <strong>BioLoom</strong> is designed to help you create a <strong>personalized</strong> and <strong>compelling biography</strong> in just a few moments. Simply answer a few insightful questions about yourself, and let the <strong>AI models</strong> do the rest. Whether a bio is needed for <strong>social media</strong>, <strong>professional networking</strong>, or <strong>personal branding</strong>, BioLoom has it covered. Capture your <strong>unique story</strong> and make a <strong>lasting impression</strong> with ease. Learn about my other projects at <a href="https://m4rkyu.com" className="text-blue-500 hover:underline">m4rkyu.com</a>.
        </p>
      </div>

      <BioProvider>
        <UserInput />
        <Output />
      </BioProvider>
    </main>
  );
}
