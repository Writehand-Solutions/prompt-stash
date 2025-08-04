"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Lock,
  Pencil,
  Save,
  Trash,
  UnlockKeyhole,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Prompt, PromptStructure } from "@/lib/data/validator";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { usePromptString } from "@/lib/hooks/use-prompt-variables";
import { usePrompts } from "@/lib/hooks/use-prompts";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { PromptUsageExampleComponent } from "./agent-prompt-usage-example";
import { AgentPromptVariables } from "./agent-prompt-variables";
import { FadeIn } from "./cult/fade-in";
import { TextureCardPrimary } from "./cult/texture-card";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { IconCheck, IconCopy, IconOpenAI } from "./ui/icons";
import Editor from "./ui/prompt-editor";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function extractVariablesFromPrompt(promptString: string): string[] {
  const matches = promptString.match(/\{(\w+)\}/g) || [];
  return [...new Set(matches.map((match) => match.slice(1, -1)))];
}

interface PromptDisplayProps {
  prompt: Prompt | null;
}

export function AgentPromptEditor({ prompt }: PromptDisplayProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const { setPromptString, promptString } = usePromptString(prompt);
  const {
    saveDraftPrompt,
    deletePrompt,
    saveDraftAsFinalPrompt,
    toggleLock,
    editPrompt,
  } = usePrompts();
  const { currentUser } = useCurrentUser();

  // Check if current user is the creator of the prompt
  const isCreator =
    prompt?.creator === currentUser || prompt?.creator === "system";

  // State for inline editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    setPromptString(prompt?.template || "");
    setEditTitle(prompt?.title || "");
    setEditDescription(prompt?.description || "");
  }, [prompt, setPromptString]);

  const computedInputVariables = useMemo(() => {
    const extractedVars = extractVariablesFromPrompt(promptString);
    return extractedVars.map((name) => ({
      name,
      description: "",
      type: "string",
    }));
  }, [promptString]);

  const handleSave = () => {
    if (prompt?.id) {
      saveDraftAsFinalPrompt(prompt.id);
      toast.success("Prompt saved successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleOutputFormatChange = (newFormat: string) => {
    setPromptString(newFormat);
    if (prompt?.id) {
      const updatedPrompt: PromptStructure = {
        ...prompt,
        template: newFormat,
        input_variables: computedInputVariables.map((v) => ({
          ...v,
          required: true,
          variable_validation: null,
        })),
        updated_at: new Date().toISOString(),
      };
      saveDraftPrompt(prompt.id, updatedPrompt);
    }
  };

  const handleDelete = () => {
    if (prompt?.id) {
      deletePrompt(prompt.id);
      toast.success("Prompt deleted successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(prompt.template);
  };

  const handleTitleEdit = () => {
    if (prompt?.id) {
      editPrompt(prompt.id, { title: editTitle });
      setIsEditingTitle(false);
      toast.success("Title updated successfully");
    }
  };

  const handleDescriptionEdit = () => {
    if (prompt?.id) {
      editPrompt(prompt.id, { description: editDescription });
      setIsEditingDescription(false);
      toast.success("Description updated successfully");
    }
  };

  const cancelTitleEdit = () => {
    setEditTitle(prompt?.title || "");
    setIsEditingTitle(false);
  };

  const cancelDescriptionEdit = () => {
    setEditDescription(prompt?.description || "");
    setIsEditingDescription(false);
  };

  const highlightVariables = useCallback((code: string) => {
    const highlightedCode = code.replace(
      /\{(\w+)\}/g,
      '<span style="color: hsl(var(--primary));">{$1}</span>'
    );
    return <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />;
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="flex h-full flex-col">
        {prompt ? (
          <div className="flex flex-1 flex-col">
            <div className="flex items-start p-4">
              <div className="flex items-start gap-4 text-sm">
                <div className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <Pencil className="h-5 w-5 stroke-primary dark:stroke-white-200 fill-primary/30 dark:fill-yellow-200/30" />
                </div>
                <div className="grid gap-1">
                  {/* Title with inline editing */}
                  <div className="flex items-center gap-2">
                    {isEditingTitle ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-8 text-sm font-semibold"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleTitleEdit}
                          className="h-6 w-6 p-0"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelTitleEdit}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <div className="font-semibold text-gray-700 dark:text-gray-200">
                          {prompt.title}
                        </div>
                        <div
                          className={`transition-opacity ${isCreator ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsEditingTitle(true)}
                            className="h-6 w-6 p-0"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description with inline editing */}
                  <div className="flex items-start gap-2">
                    {isEditingDescription ? (
                      <div className="flex items-start gap-2 w-full">
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="h-16 text-xs resize-none"
                          autoFocus
                        />
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDescriptionEdit}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelDescriptionEdit}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 w-full group">
                        <div className="line-clamp-3 text-xs max-w-md text-gray-600 dark:text-gray-100">
                          {prompt.description}
                        </div>
                        <div
                          className={`transition-opacity flex-shrink-0 ${isCreator ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsEditingDescription(true)}
                            className="h-6 w-6 p-0"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div className="line-clamp-1 text-xs flex gap-2 items-center text-gray-500 dark:text-gray-300">
                      <IconOpenAI />
                    </div>
                    <div className="line-clamp-1 text-xs flex gap-2 items-center text-gray-500 dark:text-gray-300">
                      <CalendarClock className="size-4" />
                      {formatRelativeTime(
                        prompt?.updated_at || prompt.created_at
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-2 right-3">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleLock(prompt?.id || "")}
                    >
                      {prompt.locked ? (
                        <Lock className="size-4 stroke-blue-500" />
                      ) : (
                        <UnlockKeyhole className="size-4" />
                      )}
                      <span className="sr-only">Locked</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Prompt is {prompt.locked ? "locked" : "un-locked"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <Separator />

            <FadeIn>
              <AgentPromptVariables inputVariables={computedInputVariables} />
            </FadeIn>

            <FadeIn>
              <div className="flex-1 p-4 ">
                <TextureCardPrimary className="relative">
                  <CardHeader>
                    <CardTitle className="text-lg">Prompt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Editor
                      value={promptString}
                      onValueChange={handleOutputFormatChange}
                      highlight={highlightVariables}
                      padding={10}
                      disabled={prompt?.locked}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </CardContent>

                  <div className="absolute top-2 right-3">
                    <Button variant="ghost" size="icon" onClick={onCopy}>
                      {isCopied ? (
                        <IconCheck className="text-lime-500" />
                      ) : (
                        <IconCopy />
                      )}
                      <span className="sr-only">Copy code</span>
                    </Button>
                  </div>
                </TextureCardPrimary>
              </div>

              <div className="flex-1 p-4">
                {prompt.examples ? (
                  <PromptUsageExampleComponent examples={prompt.examples} />
                ) : null}
              </div>
            </FadeIn>

            <Separator className="mt-auto" />

            <div className="p-4">
              <div className="grid gap-4">
                <div className="flex items-center">
                  <Label
                    htmlFor="locked"
                    className="flex items-center gap-2 text-xs font-normal"
                  >
                    <Switch
                      id="locked"
                      checked={prompt?.locked || false}
                      onCheckedChange={() => toggleLock(prompt?.id || "")}
                    />
                    Lock
                  </Label>

                  <div className="ml-auto space-x-2 flex items-center">
                    <Button
                      onClick={handleDelete}
                      size="sm"
                      variant="ghost"
                      className="hover:bg-neutral-200 group"
                      disabled={prompt?.locked}
                    >
                      <Trash className="h-4 w-4 group-hover:stroke-red-800 group-hover:fill-red-400" />
                    </Button>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="space-x-2"
                      disabled={prompt?.locked}
                    >
                      <span>Save prompt</span> <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No prompt selected
          </div>
        )}
      </div>
    </div>
  );
}
