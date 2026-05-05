"use client";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { LoadingMessages } from "./LoadingMessages";

const BioCardSkeleton = () => (
  <li className="w-full border border-primary/20 rounded-xl p-4 bg-background space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-4/6" />
  </li>
);

export const BioCardSkeletons = () => (
  <div
    role="status"
    aria-label="Generating bios"
    className="flex flex-col items-start justify-start gap-6 p-8 py-12 xs:p-8 xs:py-12 sm:p-12 lg:p-16"
  >
    <LoadingMessages />
    <ul className="w-full flex flex-col gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <BioCardSkeleton key={i} />
      ))}
    </ul>
  </div>
);

export default BioCardSkeleton;
