"use client";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics";

const PREFS_KEY = "bioloom-prefs";

function loadPrefs() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(PREFS_KEY) ?? "null"); } catch { return null; }
}
function savePrefs(v: { model: string; tone: string; type: string; emojis: boolean }) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(v)); } catch {}
}

const PLATFORM_PLACEHOLDERS: Record<Platform, string> = {
  general:   "Describe yourself — role, wins, personality, and what makes you unique.",
  twitter:   "Quick hook: who you are + what you do in one punchy line.",
  linkedin:  "Professional journey: role, expertise, key achievements, and the value you bring.",
  instagram: "Your vibe: passions, personality, and what followers get from you.",
  github:    "Tech stack, open-source projects, what you're building right now.",
};

import { Button } from "@/components/shadcn-ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import MetaIcon from "../icons/Meta";
import MistralIcon from "../icons/Mistral";
import GoogleIcon from "../icons/Google";
import DeepSeekIcon from "../icons/DeepSeek";
import QwenIcon from "../icons/Qwen";
import { MODELS } from "@/lib/modelRegistry";
import type { ModelDef } from "@/lib/modelRegistry";
import { Cpu, Trophy, Code2, Smile, Target, Palette, Crown, Users, Briefcase, Handshake, Globe, Brain } from "lucide-react";
import { Slider } from "../shadcn-ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn-ui/tooltip";
import { Info, Loader2, Square } from "lucide-react";
import { Textarea } from "../shadcn-ui/textarea";
import { Switch } from "../shadcn-ui/switch";
import { useBioStore } from "@/store/bioStore";
import PlatformSelector from "./PlatformSelector";
import TemplatesModal from "./TemplatesModal";
import { useTypewriter } from "@/hooks/useTypewriter";
import type { FocusArea, Platform, Template } from "@/types";

function ModelIcon({ def, className }: { def: ModelDef; className?: string }) {
  switch (def.iconType) {
    case "meta": return <MetaIcon className={className ?? "size-5"} />;
    case "google": return <GoogleIcon className={className ?? "size-5"} />;
    case "mistral": return <MistralIcon className={className ?? "size-5"} />;
    case "deepseek": return <DeepSeekIcon className={className ?? "size-5"} />;
    case "qwen": return <QwenIcon className={className ?? "size-5"} />;
    default: return <Cpu className={className ?? "size-5"} />;
  }
}

const FOCUS_AREAS: { value: FocusArea; label: string; icon: React.ElementType; description: string }[] = [
  { value: "achievements", label: "Achievements", icon: Trophy, description: "Wins & milestones" },
  { value: "skills", label: "Skills", icon: Code2, description: "Expertise & tools" },
  { value: "personality", label: "Personality", icon: Smile, description: "Character & vibe" },
  { value: "mission", label: "Mission", icon: Target, description: "Purpose & why" },
  { value: "creativity", label: "Creativity", icon: Palette, description: "Art & originality" },
  { value: "leadership", label: "Leadership", icon: Crown, description: "Vision & impact" },
];

const AUDIENCES = [
  { value: "general", label: "General audience", icon: Globe },
  { value: "recruiters", label: "Recruiters", icon: Briefcase },
  { value: "clients", label: "Potential clients", icon: Handshake },
  { value: "peers", label: "Industry peers", icon: Users },
  { value: "community", label: "Followers / fans", icon: Users },
];

const LENGTHS = [
  { value: "short", label: "Short", hint: "Punchy" },
  { value: "balanced", label: "Balanced", hint: "Ideal" },
  { value: "full", label: "Full", hint: "Rich" },
] as const;

const formSchema = z.object({
  model: z.string().min(1, "Model is required!"),
  temperature: z
    .number()
    .min(0, "Temperature must be at least 0")
    .max(2, "Temperature must be at most 2"),
  content: z
    .string()
    .min(20, "Content should have at least 20 characters.")
    .max(500, "Content should not exceed 500 characters."),
  type: z.enum(["personal", "brand"], {
    errorMap: () => ({ message: "Type is required!" }),
  }),
  tone: z.enum(
    ["professional", "passionate", "thoughtful", "casual", "sarcastic", "funny"],
    { errorMap: () => ({ message: "Tone is required!" }) }
  ),
  emojis: z.boolean(),
  focusAreas: z.array(z.string()).max(3),
  audience: z.string(),
  length: z.enum(["short", "balanced", "full"]),
});

type FormValues = z.infer<typeof formSchema>;

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

const MAX_FOCUS = 3;

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const pct = len / max;
  const color =
    pct >= 1 ? "text-destructive" : pct >= 0.9 ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground";
  return (
    <span className={cn("text-xs tabular-nums transition-colors", color)}>
      {len}/{max}
    </span>
  );
}

const UserInput = () => {
  const {
    loading,
    error,
    platform,
    setPlatform,
    generateBios,
    cancelGeneration,
    clearError,
    templatesModalOpen,
    setTemplatesModalOpen,
  } = useBioStore();

  const { type: typeText, stop: stopTyping, isTyping } = useTypewriter({ speed: 28 });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "llama-3.1-8b-instant",
      temperature: 1,
      content: "",
      type: "personal",
      tone: "professional",
      emojis: false,
      focusAreas: [],
      audience: "general",
      length: "balanced",
    },
  });

  // Restore last-used model/tone/type/emojis after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const saved = loadPrefs();
    if (saved) form.reset({ ...form.getValues(), ...saved });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const contentValue = form.watch("content");
  const focusAreasValue = form.watch("focusAreas");

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      savePrefs({ model: values.model, tone: values.tone, type: values.type, emojis: values.emojis });
      track("bio_generated", {
        model: values.model,
        platform,
        tone: values.tone,
        type: values.type,
        length: values.length ?? "balanced",
        focusAreaCount: (values.focusAreas ?? []).length,
      });
      document.getElementById("output")?.scrollIntoView({ behavior: "smooth", block: "start" });
      await generateBios({
        model: values.model,
        temperature: values.temperature,
        content: values.content,
        type: values.type,
        tone: values.tone,
        emojis: values.emojis,
        platform,
        focusAreas: values.focusAreas,
        audience: values.audience,
        length: values.length,
      });
    },
    [generateBios, platform]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!loading) form.handleSubmit(onSubmit)();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, form, onSubmit]);

  useEffect(() => {
    const handleGenerate = () => {
      if (!loading) form.handleSubmit(onSubmit)();
    };
    window.addEventListener("bioloom:generate", handleGenerate);
    return () => window.removeEventListener("bioloom:generate", handleGenerate);
  }, [loading, form, onSubmit]);

  useEffect(() => () => stopTyping(), [stopTyping]);

  const handleTemplateSelect = (template: Template) => {
    const v = template.formValues;
    if (v.type) form.setValue("type", v.type);
    if (v.tone) form.setValue("tone", v.tone);
    if (v.emojis !== undefined) form.setValue("emojis", v.emojis);
    if (v.platform) setPlatform(v.platform as Platform);
    if (v.content) {
      typeText(v.content, (val: string) => form.setValue("content", val, { shouldValidate: false }));
    }
  };

  const fillExampleContent = () => {
    stopTyping();
    typeText(
      "Game developer & software engineer. Crafting engaging 2D/3D games and innovative digital solutions. Follow for tech insights and creativity!",
      (val: string) => form.setValue("content", val, { shouldValidate: false })
    );
  };

  const toggleFocusArea = (area: FocusArea) => {
    const current = focusAreasValue as FocusArea[];
    if (current.includes(area)) {
      form.setValue("focusAreas", current.filter((a) => a !== area));
    } else if (current.length < MAX_FOCUS) {
      form.setValue("focusAreas", [...current, area]);
    } else {
      toast.info(`Pick up to ${MAX_FOCUS} focus areas.`);
    }
  };

  return (
    <div className="relative flex flex-col items-start gap-6">
      {/* Platform Selector */}
      <div className="w-full">
        <p className="text-sm font-medium mb-2">Target Platform</p>
        <PlatformSelector value={platform} onChange={setPlatform} />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-start gap-5">

          {/* ── Your Info ─────────────────────────────────────────── */}
          <fieldset className="grid gap-5 rounded-xl border border-border/60 p-4 bg-background/10 backdrop-blur-sm transition-all focus-within:border-foreground/30 focus-within:shadow-sm">
            <legend className="-ml-1 px-1 text-sm font-medium">Your Info</legend>

            {/* Content textarea */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between pb-1.5">
                    About Yourself
                    <div className="flex items-center gap-2">
                      <CharCounter value={contentValue} max={500} />
                      <TemplatesModal
                        onSelect={handleTemplateSelect}
                        open={templatesModalOpen}
                        onOpenChange={setTemplatesModalOpen}
                      />
                      <Button variant="outline" size="sm" type="button" onClick={fillExampleContent}>
                        Example
                      </Button>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={PLATFORM_PLACEHOLDERS[platform as Platform] ?? PLATFORM_PLACEHOLDERS.general}
                      className="min-h-[9rem] resize-none transition-colors"
                      readOnly={isTyping}
                      onClick={() => { if (isTyping) stopTyping(); }}
                      onFocus={() => { if (isTyping) stopTyping(); }}
                    />
                  </FormControl>
                  {isTyping && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="inline-block w-1 h-3 bg-foreground animate-pulse rounded-sm" />
                      Click to stop typing
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type + Tone row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="brand">Brand</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="passionate">Passionate</SelectItem>
                        <SelectItem value="thoughtful">Thoughtful</SelectItem>
                        <SelectItem value="sarcastic">Sarcastic</SelectItem>
                        <SelectItem value="funny">Funny</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Focus areas */}
            <div>
              <p className="text-sm font-medium mb-2 flex items-center justify-between">
                Focus Areas
                <span className="text-xs font-normal text-muted-foreground">
                  {focusAreasValue.length}/{MAX_FOCUS} selected
                </span>
              </p>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                {FOCUS_AREAS.map(({ value, label, icon: Icon, description }) => {
                  const selected = (focusAreasValue as FocusArea[]).includes(value);
                  return (
                    <Tooltip key={value}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => toggleFocusArea(value)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border transition-all duration-150",
                            "hover:border-foreground/40 active:scale-[0.97]",
                            selected
                              ? "bg-foreground text-background border-foreground shadow-sm"
                              : "bg-background/50 text-muted-foreground border-border/60"
                          )}
                          aria-pressed={selected}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          {label}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">{description}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Audience + Emojis row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-end">
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Written for</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AUDIENCES.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emojis"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 pb-0.5">
                    <Switch checked={field.value} onCheckedChange={field.onChange} className="!my-0" />
                    <FormLabel className="text-sm cursor-pointer select-none">Add Emojis</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          {/* ── Settings ──────────────────────────────────────────── */}
          <fieldset className="grid gap-5 rounded-xl border border-border/60 p-4 bg-background/10 backdrop-blur-sm transition-all focus-within:border-foreground/30 focus-within:shadow-sm">
            <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>

            {/* Length preset */}
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio Length</FormLabel>
                  <div className="flex gap-2 mt-1">
                    {LENGTHS.map(({ value, label, hint }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={cn(
                          "flex-1 flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-xs transition-all duration-150 hover:border-foreground/40 active:scale-[0.97]",
                          field.value === value
                            ? "bg-foreground text-background border-foreground shadow-sm"
                            : "bg-background/50 text-muted-foreground border-border/60"
                        )}
                        aria-pressed={field.value === value}
                      >
                        <span className="font-medium">{label}</span>
                        <span className={cn("text-[10px]", field.value === value ? "text-background/70" : "text-muted-foreground/70")}>{hint}</span>
                      </button>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            {/* Model */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {MODELS.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <ModelIcon def={m} />
                              <div>
                                <p className="flex items-center gap-1.5">
                                  <span className="text-foreground font-medium">{m.name}</span>
                                  <span className="text-xs">{m.tag}</span>
                                  {m.isReasoning && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1 py-0.5 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                                      <Brain className="w-2.5 h-2.5" />
                                      Thinks
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs mt-0.5 leading-tight">{m.description}</p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Creativity / Temperature */}
            <FormField
              control={form.control}
              name="temperature"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between pb-2">
                    <span className="flex items-center gap-1">
                      Creativity
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 cursor-pointer text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent sideOffset={25} collisionPadding={20} className="max-w-sm">
                          <p>
                            Higher = more surprising and unconventional bios. Lower = more predictable
                            and safe. Start at 1.0 and tune from there.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <span className="font-mono text-xs tabular-nums">{value.toFixed(1)}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider defaultValue={[1]} min={0} max={2} step={0.1} onValueChange={(val) => onChange(val[0])} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>

          {/* ── Generate ──────────────────────────────────────────── */}
          <div className="flex gap-3">
            <Button
              className={cn(
                "relative flex-1 rounded-lg overflow-hidden font-semibold transition-all duration-200",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-violet-600/20 before:via-blue-500/20 before:to-cyan-500/20",
                "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
                loading && "animate-pulse-subtle"
              )}
              type="submit"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Generating…" : "Generate Bios"}
            </Button>
            {loading && (
              <Button type="button" variant="outline" className="rounded-lg" onClick={cancelGeneration} aria-label="Stop generating">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}
          </div>
          {!loading && (
            <p className="text-xs text-muted-foreground text-center -mt-2">
              Press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-xs">
                {isMac ? "⌘↵" : "Ctrl+↵"}
              </kbd>{" "}
              to generate
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default UserInput;
