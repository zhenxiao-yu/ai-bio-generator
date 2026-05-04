"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { Slider } from "../shadcn-ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn-ui/tooltip";
import { Info, Loader2, Square } from "lucide-react";
import { Textarea } from "../shadcn-ui/textarea";
import { Switch } from "../shadcn-ui/switch";
import { useBioStore } from "@/store/bioStore";
import PlatformSelector from "./PlatformSelector";
import TemplatesModal from "./TemplatesModal";
import type { Platform, Template } from "@/types";

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
});

type FormValues = z.infer<typeof formSchema>;

const UserInput = () => {
  const { loading, error, platform, setPlatform, generateBios, cancelGeneration, clearError } =
    useBioStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "llama-3.1-8b-instant",
      temperature: 1,
      content: "",
      type: "personal",
      tone: "professional",
      emojis: false,
    },
  });

  // Show toast on error
  React.useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  async function onSubmit(values: FormValues) {
    await generateBios({
      model: values.model,
      temperature: values.temperature,
      content: values.content,
      type: values.type,
      tone: values.tone,
      emojis: values.emojis,
      platform,
    });
  }

  const handleTemplateSelect = (template: Template) => {
    const v = template.formValues;
    if (v.content) form.setValue("content", v.content);
    if (v.type) form.setValue("type", v.type);
    if (v.tone) form.setValue("tone", v.tone);
    if (v.emojis !== undefined) form.setValue("emojis", v.emojis);
    if (v.platform) setPlatform(v.platform as Platform);
  };

  const fillExampleContent = () => {
    form.setValue(
      "content",
      "Game developer & software engineer. Crafting engaging 2D/3D games and innovative digital solutions. Follow for tech insights and creativity!"
    );
  };

  return (
    <div className="relative flex flex-col items-start gap-6">
      {/* Platform Selector */}
      <div className="w-full">
        <p className="text-sm font-medium mb-2">Target Platform</p>
        <PlatformSelector value={platform} onChange={setPlatform} />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full items-start gap-6"
        >
          {/* User Input Fieldset — Primary */}
          <fieldset className="grid gap-6 rounded-[8px] border p-4 bg-background/10 backdrop-blur-sm">
            <legend className="-ml-1 px-1 text-sm font-medium">Your Info</legend>

            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between pb-2">
                      About Yourself
                      <div className="flex gap-2">
                        <TemplatesModal onSelect={handleTemplateSelect} />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={fillExampleContent}
                        >
                          Example
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Share your previous bio or describe yourself in a few sentences"
                        className="min-h-[10rem]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        <SelectItem value="sarcastic">Sarcastic</SelectItem>
                        <SelectItem value="funny">Funny</SelectItem>
                        <SelectItem value="passionate">Passionate</SelectItem>
                        <SelectItem value="thoughtful">Thoughtful</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="emojis"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="text-sm mr-4">Add Emojis</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="!my-0"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          {/* Settings Fieldset — Secondary */}
          <fieldset className="grid gap-6 rounded-[8px] border p-4 bg-background/10 backdrop-blur-sm">
            <legend className="-ml-1 px-1 text-sm font-medium">Settings</legend>

            <div className="grid gap-3">
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
                          <SelectItem value="llama-3.1-8b-instant">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <MetaIcon className="size-5" />
                              <div>
                                <p>
                                  <span className="text-foreground font-medium mr-2">Llama 3.1</span>
                                  8B Instant
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="mixtral-8x7b-32768">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <MistralIcon className="size-5" />
                              <div>
                                <p>
                                  <span className="text-foreground font-medium mr-2">Mixtral</span>
                                  8x7b
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="llama-3.3-70b-versatile">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <MetaIcon className="size-5" />
                              <div>
                                <p>
                                  <span className="text-foreground font-medium mr-2">Llama 3.3</span>
                                  70B Versatile
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between pb-2">
                      <span className="flex items-center justify-center">
                        Creativity
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 ml-1 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent
                            sideOffset={25}
                            collisionPadding={20}
                            className="max-w-sm"
                          >
                            <p>
                              A higher setting produces more creative and surprising bios, while a
                              lower setting sticks to more predictable and conventional styles.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <span>{value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[1]}
                        min={0}
                        max={2}
                        step={0.1}
                        onValueChange={(val) => onChange(val[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          {/* Submit / Cancel */}
          <div className="flex gap-3">
            <Button className="rounded flex-1" type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Generate
            </Button>
            {loading && (
              <Button
                type="button"
                variant="outline"
                className="rounded"
                onClick={cancelGeneration}
                aria-label="Stop generating"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserInput;
