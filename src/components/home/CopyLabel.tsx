"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "../shadcn-ui/button";

interface CopyLabelProps {
  text: string;
  index?: number;
}

const CopyLabel = ({ text, index }: CopyLabelProps) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      aria-label={`Copy bio ${index !== undefined ? index + 1 : ""}`}
      className="text-sm text-muted-foreground bg-background my-0 h-auto rounded-none border border-primary/20 border-t-0 rounded-b-lg hover:bg-primary hover:text-primary-foreground pt-0 pb-0.5 gap-1.5 transition-all"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </>
      )}
    </Button>
  );
};

export default CopyLabel;
