"use client"

import React, { useState } from "react"
import { generatePromptWithAI } from "@/ai/generate-prompt-action"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader, SparklesIcon, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import TextArea from "react-textarea-autosize"
import { toast } from "sonner"
import { z } from "zod"

import { PromptStructure } from "@/lib/data/validator"
import { useSettings } from "@/lib/hooks/use-api-key"
import { usePrompts } from "@/lib/hooks/use-prompts"
import { useCurrentUser } from "@/lib/hooks/use-current-user"
import { nanoid } from "@/lib/utils"

import {
  CreateNewPromptGenerateDialog,
  PromptType,
} from "./create-new-prompt-generate"
import { AddVariablesModal } from "./add-variables-modal"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  template: z.string().min(1, "Template is required"),
  // tags is a free-form field in the UI (string), we normalize to array on submit
  tags: z.any(),
  input_variables: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        type: z.string(),
        required: z.boolean(),
        variable_validation: z.string(),
      })
    )
    .optional(),
})

type FormSchema = z.infer<typeof formSchema>

export function NewPromptForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVariablesModalOpen, setIsVariablesModalOpen] = useState(false)
  const { settings } = useSettings()
  const { createPrompt } = usePrompts()
  const { currentUser } = useCurrentUser()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      template: "",
      // IMPORTANT: use a string here so the <Input> works
      tags: "",
      input_variables: [],
    },
  })

  async function onSubmit(data: FormSchema) {
    // Normalize tags to an array
    const tagsArray = Array.isArray(data.tags)
      ? data.tags
      : String(data.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)

    // Ensure input variables is always an array
    const inputVarsArray = Array.isArray(data.input_variables)
      ? data.input_variables
      : []

    const promptData: Partial<PromptStructure> = {
      ...data,
      tags: tagsArray,
      id: nanoid(22),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      bookmarked: false,
      input_variables: inputVarsArray,
      locked: false,
      creator: currentUser,
    }

    try {
      await createPrompt(promptData as PromptStructure)
      toast.success("Prompt created successfully")
      // Reset to clean defaults
      form.reset({
        title: "",
        description: "",
        template: "",
        tags: "",
        input_variables: [],
      })
    } catch (error) {
      toast.error("Failed to create prompt")
    }
  }

  const handleGeneratePrompt = async (
    promptIdea: string,
    promptType: PromptType
  ) => {
    setIsGenerating(true)
    try {
      const result = await generatePromptWithAI(
        promptIdea,
        settings.USER_OPEN_AI_API_KEY,
        promptType
      )

      if (result.success && result.data) {
        const generated = result.data as Partial<PromptStructure> & {
          tags?: string[] | string
        }

        // Convert tags to a string for the form input
        const tagsString = Array.isArray(generated.tags)
          ? generated.tags.join(", ")
          : String(generated.tags || "")

        // Ensure input_variables is an array for the form
        const inputVarsArray = Array.isArray(generated.input_variables)
          ? generated.input_variables
          : []

        form.reset({
          title: generated.title || "",
          description: generated.description || "",
          template: generated.template || "",
          tags: tagsString,
          input_variables: inputVarsArray,
        })

        toast.success("Prompt generated successfully")
      } else {
        throw new Error(result.error || "Failed to generate prompt")
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while generating the prompt"
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVariablesGenerated = (
    variables: Array<{ name: string; description: string; type: string }>
  ) => {
    // Merge with existing (guard if undefined)
    const existingVars = Array.isArray(form.getValues("input_variables"))
      ? form.getValues("input_variables")
      : []

    const mergedVariables = [
      ...existingVars,
      ...variables.map((v) => ({
        ...v,
        required: true,
        variable_validation: "^.+$",
      })),
    ]

    // Save back to form
    form.setValue("input_variables", mergedVariables)

    // Always rebuild the variables section in the template
    const variablePlaceholders = mergedVariables
      .map((v) => `{${v.name}}`)
      .join(" ")

    const newTemplate = `Use the following variables in your response:\n${variablePlaceholders}`
    form.setValue("template", newTemplate)

    toast.success(`${variables.length} variables added to your prompt`)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto h-[1000px] rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle>Manual or Generate</CardTitle>
            <CardDescription>
              Fill out the form below or generate a prompt using AI. <br /> (zero
              shot, few shot, or chain of thought, etc)
            </CardDescription>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="mr-2 h-4 w-4" />
                Generate with AI
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[800px] pr-4 ">
              <div className="space-y-6 px-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormDescription>
                        A descriptive title for your prompt.
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="Enter a title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormDescription>
                        An easy to understand description of your prompt.
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="Describe your prompt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormDescription>
                        The main prompt template in markdown format.
                      </FormDescription>
                      <FormControl>
                        <TextArea
                          placeholder="Add your prompt template here"
                          className="resize-none p-1 flex min-h-[80px] w-full rounded-md border border-black/10 dark:border-white/10 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          minRows={5}
                          {...field}
                        />
                      </FormControl>
                      <div className="mt-3">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setIsVariablesModalOpen(true)}
                          className="w-full sm:w-auto"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add form input variables
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormDescription>
                        Enter up to 3 relevant tags for the prompt, separated by
                        commas.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Enter comma-separated tags"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
          </form>
        </Form>

        <div className="pt-4">
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            className="w-full"
          >
            Create Prompt
          </Button>
        </div>
      </CardContent>

      <CreateNewPromptGenerateDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onGenerate={handleGeneratePrompt}
      />

      <AddVariablesModal
        isOpen={isVariablesModalOpen}
        onOpenChange={setIsVariablesModalOpen}
        onVariablesGenerated={handleVariablesGenerated}
      />
    </Card>
  )
}
