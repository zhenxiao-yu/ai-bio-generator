"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { TEMPLATES } from "@/config/templates";
import type { Template } from "@/types";
import {
  Rocket,
  Palette,
  Briefcase,
  GraduationCap,
  Video,
  Laptop,
  Heart,
  BookOpen,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Rocket,
  Palette,
  Briefcase,
  GraduationCap,
  Video,
  Laptop,
  Heart,
  BookOpen,
};

interface TemplatesModalProps {
  onSelect: (template: Template) => void;
}

const TemplatesModal = ({ onSelect }: TemplatesModalProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm" type="button" className="gap-1.5">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          Templates
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-[calc(100vw-2rem)] max-w-2xl max-h-[85vh] overflow-y-auto",
            "bg-background border border-border rounded-xl shadow-xl p-6",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <Dialog.Title className="text-lg font-semibold">Templates</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mt-0.5">
                Choose a template to pre-fill your form and get started faster.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Close templates">
                <X className="w-4 h-4" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES.map((template) => {
              const Icon = ICON_MAP[template.icon] ?? Rocket;
              return (
                <Dialog.Close asChild key={template.id}>
                  <button
                    onClick={() => onSelect(template)}
                    className={cn(
                      "flex items-start gap-3 text-left p-4 rounded-xl border border-border",
                      "hover:bg-muted/50 hover:border-foreground/30 transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </button>
                </Dialog.Close>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TemplatesModal;
