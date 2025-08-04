import { z } from "zod"

export const promptStructureSchema = z.object({
  id: z.string(),
  locked: z.boolean(),
  title: z.string(),
  description: z.string().nullable(),
  template: z.string().nullable(),
  input_variables: z.array(
    z.object({
      id: z.number().nullable().optional(),
      prompt_id: z.string().nullable().optional(),
      name: z.string(),
      description: z.string(),
      type: z.string(),
      required: z.boolean(),
      variable_validation: z.string(),
    })
  ),
  tags: z.array(z.string()).optional(),
  examples: z
    .array(
      z.object({
        id: z.number().optional(),
        prompt_id: z.string().nullable().optional(),
        input: z.record(z.any()).optional(),
        output: z.any().optional(),
      })
    )
    .optional(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  bookmarked: z.boolean(),
  creator: z.string().optional(),
})

export type PromptStructure = z.infer<typeof promptStructureSchema>


function generateTags(prompts: PromptStructure[]) {
  const tags: {
    useCases: { id: string; label: string; count: number }[]
    type: { id: string; label: string; count: number }[]
    language: { id: string; label: string; count: number }[]
    model: { id: string; label: string; count: number }[]
  } = {
    useCases: [],
    type: [],
    language: [],
    model: [],
  }

  prompts.forEach((prompt) => {
    if (prompt.tags) {
      prompt.tags.forEach((tag) => {
        const lowercaseTag = tag.toLowerCase()
        if (lowercaseTag.includes("prompttemplate")) {
          const existingType = tags.type.find((t) => t.id === lowercaseTag)
          if (existingType) {
            existingType.count++
          } else {
            tags.type.push({
              id: lowercaseTag,
              label: lowercaseTag
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              count: 1,
            })
          }
        } else {
          const existingUseCase = tags.useCases.find(
            (u) => u.id === lowercaseTag
          )
          if (existingUseCase) {
            existingUseCase.count++
          } else {
            tags.useCases.push({
              id: lowercaseTag,
              label: lowercaseTag
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              count: 1,
            })
          }
        }
      })
    }
  })

  return tags
}

// export const tags = generateTags(prompts)

type DummyArray = PromptStructure[]
export type Prompt = DummyArray[number]

