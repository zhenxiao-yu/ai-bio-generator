"use client";
import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { toast } from "sonner";
import { track } from "@vercel/analytics";

interface ShareBioButtonProps {
  text: string;
}

export function ShareBioButton({ text }: ShareBioButtonProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(text)));
      const url = `${window.location.origin}/?shared=${encoded}`;
      await navigator.clipboard.writeText(url);
      setShared(true);
      track("bio_shared");
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setShared(false), 2500);
    } catch {
      toast.error("Failed to create share link.");
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7"
      onClick={handleShare}
      aria-label="Copy share link for this bio"
    >
      {shared ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Share2 className="w-3.5 h-3.5" />
      )}
    </Button>
  );
}
