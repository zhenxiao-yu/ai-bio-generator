"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Copy, Check } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { toast } from "sonner";

export function SharedBioModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bioText, setBioText] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const shared = searchParams.get("shared");
    if (shared) {
      try {
        const decoded = decodeURIComponent(escape(atob(shared)));
        setBioText(decoded);
        setOpen(true);
      } catch {
        // invalid base64 — silently ignore
      }
    }
  }, [searchParams]);

  const handleClose = () => {
    setOpen(false);
    router.replace("/", { scroll: false });
  };

  const handleCopy = async () => {
    if (!bioText) return;
    try {
      await navigator.clipboard.writeText(bioText);
      setCopied(true);
      toast.success("Bio copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy.");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md rounded-xl bg-background border border-border shadow-xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Dialog.Title className="font-semibold text-base">Shared Bio</Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground mt-0.5">
                Someone shared this AI-generated bio with you
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleClose} aria-label="Close">
                <X className="w-4 h-4" />
              </Button>
            </Dialog.Close>
          </div>

          <blockquote className="text-sm leading-relaxed bg-muted/40 rounded-lg p-4 border border-border mb-4 italic">
            {bioText}
          </blockquote>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleClose}>
              Generate Your Own
            </Button>
            <Button variant="outline" onClick={handleCopy} aria-label="Copy bio">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
