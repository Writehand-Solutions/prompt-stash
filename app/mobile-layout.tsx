"use client"

import { useState } from "react"
import {
  Bookmark,
  ListTreeIcon,
  PlusIcon,
  Search,
  Tag,
  X,
  LogOut,
} from "lucide-react"

import { PromptStructure } from "@/lib/data/validator"
import { useFilters } from "@/lib/hooks/use-prompt-filters"
import { usePrompt, usePrompts } from "@/lib/hooks/use-prompts"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Chat from "@/components/agent-chat"
import { AgentPromptEditor } from "@/components/agent-prompt"
import { NewPromptForm } from "@/components/create-new-prompt-form"
import { MobilePromptCard } from "@/components/prompt-card"
import { PromptTagList } from "@/components/prompt-tag-list"
import { set } from "date-fns"

export function MobileLayout() {
  const [tab, setTab] = useState("prompts")
  const { logout } = useAuth()

  // Global state
  const [prompt] = usePrompt()
  const [filters  , setFilters] = useFilters()
  const { prompts } = usePrompts()

  // Filter the prompts based on the selected filters
  const filteredPrompts = prompts.filter((prompt) => {
    const lowerCaseTags = prompt.tags
      ? prompt?.tags.map((tag) => tag.toLowerCase())
      : []

    const matchesUseCases =
      filters.useCases.length === 0 ||
      filters.useCases.some((useCase) => lowerCaseTags.includes(useCase))

    return matchesUseCases
  })

  const bookmarkedPrompts = filteredPrompts.filter(
    (prompt) => prompt.bookmarked
  )

  return (
    <div className="grid h-screen w-full ">
      <div className="flex flex-col">
        <Tabs value={tab} onValueChange={setTab}>
          <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-transparent"
              >
                <PlusIcon className="size-4" />
                <span className="sr-only">New prompt</span>
              </Button>
            </div>

            <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="md:hidden hover:bg-transparent"
              >
                <LogOut className="size-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </header>

          <main className="grid flex-1 gap-4 overflow-auto  md:grid-cols-2 lg:grid-cols-3">
            <TabsContent value="prompts" className="m-0">
              <MobilePromptList
                filteredPrompts={filteredPrompts}
                setTab={setTab}
                filters={filters}
                setFilters={setFilters}
              />
            </TabsContent>
            <TabsContent value="edit" className="m-0">
              <ScrollArea className="h-[calc(100vh-60px)]">
                <div className="flex-1 overflow-y-auto bg-white">
                  <AgentPromptEditor
                    prompt={
                      prompts.find((item) => item.id === prompt.selected) ||
                      null
                    }
                  />
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="test" className="m-0">
              <Chat
                prompt={
                  prompts.find((item) => item.id === prompt.selected) || null
                }
              />
            </TabsContent>
          </main>
        </Tabs>
      </div>
    </div>
  )
}

function MobilePromptList({
  setTab,
  filteredPrompts,
  filters,
  setFilters,
}: {
  setTab: (string) => void
  filteredPrompts: PromptStructure[]
  filters: any
  setFilters: (filters: any) => void
}) {
  const bookmarkedPrompts = filteredPrompts.filter(
    (prompt) => prompt.bookmarked
  );

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center  justify-between pr-4 pl-2 py-2">
        <TabsList className="grid w-full grid-cols-3  max-w-xs">
          <TabsTrigger value="all">
            <ListTreeIcon className="size-4" />
          </TabsTrigger>
          <TabsTrigger value="bookmarked">
            <Bookmark className="size-4" />
          </TabsTrigger>
          <TabsTrigger value="tags">
            <Tag className="size-4" />
          </TabsTrigger>
        </TabsList>
      </div>

      <Separator />

      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground/50" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <TabsContent value="all" className="m-0">
          <div className="p-4">
                          <PromptTagList filters={filters} setFilters={setFilters} />
                        </div>
        <ScrollArea className="h-[calc(100vh-129px)] ">
          <div className="flex flex-col gap-3 pb-48 pt-4 p-4 ">
            {filteredPrompts.map((prompt, index) => (
              <MobilePromptCard setTab={setTab} key={index} prompt={prompt} showTags={false} />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="bookmarked" className="m-0">
        <ScrollArea className="h-[calc(100vh-129px)] ">
          <div className="flex flex-col gap-3 pb-48 pt-4 p-4 ">
            {bookmarkedPrompts.map((prompt, index) => (
              <MobilePromptCard setTab={setTab} key={index} prompt={prompt} showTags={false} />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="tags" className="m-0">
          <div className="p-4">
                          <PromptTagList filters={filters} setFilters={setFilters} />
                        </div>
        <ScrollArea className="h-[calc(100vh-129px)] ">
          <div className="flex flex-col gap-3 pb-48 pt-4 p-4 ">
            {filteredPrompts.map((prompt, index) => (
              <MobilePromptCard setTab={setTab} key={index} prompt={prompt} showTags={true} />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}
