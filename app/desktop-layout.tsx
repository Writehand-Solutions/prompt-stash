"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Edit,
  InfoIcon,
  LogOut,
  MessageCircleCode,
  Search,
  Tag,
} from "lucide-react";
import { useState } from "react";

import { PromptStructure } from "@/lib/data/validator";
import {
  filterPrompts,
  useFilters,
  useSearchQuery,
} from "@/lib/hooks/use-prompt-filters";
import { usePrompt, usePrompts } from "@/lib/hooks/use-prompts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import Chat from "../components/agent-chat";
import { AgentPromptEditor } from "../components/agent-prompt";
import ApiKeyInputModal from "../components/api-key-input-modal";
import { CreateNewPromptDrawer } from "../components/create-new-prompt-drawer";
import { PromptCard } from "../components/prompt-card";

import { IntroDisclosure } from "@/components/ui/intro-disclosure";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";
import { ModeToggle } from "../components/theme-provider";
import { PromptTagList } from "@/components/prompt-tag-list";
import { PromptFilterListSidebar } from "@/components/prompt-filter-sidebar";
interface PromptLibraryProps {
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
}
const steps = [
  {
    title: "Welcome to Cult UI",
    short_description: "Discover our modern component library",
    full_description:
      "Welcome to Cult UI! Let's explore how our beautifully crafted components can help you build stunning user interfaces with ease.",
    media: {
      type: "image" as const,
      src: "/feature-3.webp",
      alt: "Cult UI components overview",
    },
  },
  {
    title: "Customizable Components",
    short_description: "Style and adapt to your needs",
    full_description:
      "Every component is built with customization in mind. Use our powerful theming system with Tailwind CSS to match your brand perfectly.",
    media: {
      type: "image" as const,
      src: "/feature-2.webp",
      alt: "Component customization interface",
    },
    action: {
      label: "View Theme Builder",
      href: "/docs/theming",
    },
  },
  {
    title: "Responsive & Accessible",
    short_description: "Built for everyone",
    full_description:
      "All components are fully responsive and follow WAI-ARIA guidelines, ensuring your application works seamlessly across all devices and is accessible to everyone.",
    media: {
      type: "image" as const,
      src: "/feature-1.webp",
      alt: "Responsive design demonstration",
    },
  },
  {
    title: "Start Building",
    short_description: "Create your next project",
    full_description:
      "You're ready to start building! Check out our comprehensive documentation and component examples to create your next amazing project.",
    action: {
      label: "View Components",
      href: "/docs/components",
    },
  },
];
export const DesktopLayout: React.FC<PromptLibraryProps> = ({
  defaultCollapsed = false,
  navCollapsedSize,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { logout } = useAuth();

  // Global State
  const [prompt] = usePrompt();
  const [filters] = useFilters();
  const { prompts } = usePrompts();
  const [searchQuery, setSearchQuery] = useSearchQuery();
  const [open, setOpen] = useState(false);
  const filteredPrompts = filterPrompts(prompts, filters, searchQuery);
  const selectedPrompt = prompts.find((item) => item.id === prompt.selected);
  const bookmarkedPrompts = filteredPrompts.filter(
    (prompt) => prompt.bookmarked
  );

  return (
    <div className="">
      <TooltipProvider>
        {/* LEFT PANEL */}
        <ResizablePanelGroup
          direction="horizontal"
          className="bg-neutral-100 dark:bg-neutral-900"
        >
          <ResizablePanel
            defaultSize={15}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={15}
            maxSize={20}
            onCollapse={(collapsed: any) => {
              setIsCollapsed(collapsed);

              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(collapsed)}`;
            }}
            className={cn(
              isCollapsed &&
                "min-w-[60px] bg-neutral-100 dark:bg-neutral-900 transition-all duration-300 ease-in-out"
            )}
          >
            <CreateNewPromptDrawer isCollapsed={isCollapsed} />
            <Separator />
            <PromptFilterListSidebar isCollapsed={isCollapsed} />
            {/* User Settings */}
            <div className="absolute bottom-6 left-3">
              <div className={cn("flex gap-2", isCollapsed ? "flex-col " : "")}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setOpen(true)}
                  className="border border-black/10 dark:border-white/10 group"
                  aria-label="Show Intro"
                >
                  <InfoIcon className="h-[1.2rem] w-[1.2rem] group-hover:scale-110 transition-all" />
                </Button>
                <ModeToggle />
                <ApiKeyInputModal />

                {/* <Button
                  variant="outline"
                  size="icon"
                  onClick={logout}
                  className="border border-black/10 dark:border-white/10 group"
                  aria-label="Logout"
                >
                  <LogOut className="h-[1.2rem] w-[1.2rem] group-hover:rotate-6 transition-all" />
                </Button> */}
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          {/* Center Panel */}
          <ResizablePanel defaultSize={40} minSize={36} className="shadow-lg">
            <Tabs defaultValue="all">
              <div className="flex items-center  justify-between px-4 py-2">
                <h2 className="font-semibold">Prompts</h2>
                <TabsList className="grid w-full grid-cols-3  max-w-[150px]">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="bookmarked">
                    <Bookmark className="size-4" />
                  </TabsTrigger>
                  <TabsTrigger value="tags">
                    <Tag className="size-4" />
                  </TabsTrigger>
                </TabsList>
              </div>

              <Separator />

              {/* Prompt Search */}
              <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
                <form id="prompt-search">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      placeholder="Search"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>

              {/* All Prompts */}
              <TabsContent value="all" className="m-0">
                <ScrollArea className="h-[calc(100vh-129px)] z-20 bg-background/95">
                  <div className=" m-3 ">
                    <AnimatePresence initial={false}>
                      {filteredPrompts.map((prompt, index) => (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{
                            height: 0,
                            y:
                              -53 *
                              countSelectedPromptsAfter(
                                prompts,
                                filteredPrompts,
                                prompt
                              ),

                            zIndex: groupSelectedPrompts(
                              prompts,
                              filteredPrompts
                            )
                              .reverse()
                              .findIndex((group) => group.includes(prompt)),
                          }}
                          transition={{
                            ease: [0.32, 0.72, 0, 1],
                            duration: 0.2,
                          }}
                          style={{ overflow: "hidden", zIndex: 1000 }}
                          key={`${prompt.id}`}
                          className="relative z-[1000] flex flex-col justify-end "
                        >
                          <div className="py-2 px-1">
                            <PromptCard prompt={prompt} showTags={false} />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Bookmarked Prompts */}
              <TabsContent value="bookmarked" className="m-0">
                <ScrollArea className="h-[calc(100vh-129px)] ">
                  <div className="flex flex-col gap-3 pb-48 pt-4 p-4 ">
                    {bookmarkedPrompts.map((prompt, index) => (
                      <PromptCard
                        key={index}
                        prompt={prompt}
                        showTags={false}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Tags Prompts */}
              <TabsContent value="tags" className="m-0">
                <ScrollArea className="h-[calc(100vh-129px)] z-20 bg-background/95">
                  <div className=" m-3 ">
                    <AnimatePresence initial={false}>
                      {filteredPrompts.map((prompt, index) => (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{
                            height: 0,
                            y:
                              -53 *
                              countSelectedPromptsAfter(
                                prompts,
                                filteredPrompts,
                                prompt
                              ),

                            zIndex: groupSelectedPrompts(
                              prompts,
                              filteredPrompts
                            )
                              .reverse()
                              .findIndex((group) => group.includes(prompt)),
                          }}
                          transition={{
                            ease: [0.32, 0.72, 0, 1],
                            duration: 0.2,
                          }}
                          style={{ overflow: "hidden", zIndex: 1000 }}
                          key={`${prompt.id}`}
                          className="relative z-[1000] flex flex-col justify-end "
                        >
                          <div className="py-2 px-1">
                            <PromptCard prompt={prompt} showTags={true} />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={45} minSize={42}>
            <Tabs defaultValue="test">
              <div className="flex items-center  justify-between px-4 py-2">
                <h2 className="font-semibold">Test your prompt</h2>

                <TabsList className="grid w-full grid-cols-2  max-w-[100px]">
                  <TabsTrigger value="test">
                    <MessageCircleCode className="size-4" />
                  </TabsTrigger>
                  <TabsTrigger value="edit">
                    <Edit className="size-4" />
                  </TabsTrigger>
                </TabsList>
              </div>

              <Separator />

              <TabsContent value="test" className="m-0">
                <Chat prompt={selectedPrompt || null} />
              </TabsContent>
              <TabsContent value="edit" className="m-0">
                <ScrollArea className="h-[calc(100vh-60px)]">
                  <AgentPromptEditor prompt={selectedPrompt || null} />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
        <IntroDisclosure
          open={open}
          setOpen={setOpen}
          steps={steps}
          featureId="intro-onboarding"
          showProgressBar={true}
          onComplete={() => toast.success("Tour completed")}
          onSkip={() => toast.info("Tour skipped")}
        />
      </TooltipProvider>
    </div>
  );
};

function countSelectedPromptsAfter(
  prompts: PromptStructure[],
  selectedPrompts: PromptStructure[],
  prompt: PromptStructure
) {
  const startIndex = prompts.indexOf(prompt);

  if (startIndex === -1 || !selectedPrompts.includes(prompt)) {
    return 0;
  }

  let consecutiveCount = 0;

  for (let i = startIndex + 1; i < prompts.length; i++) {
    if (selectedPrompts.includes(prompt[i])) {
      consecutiveCount++;
    } else {
      break;
    }
  }

  return consecutiveCount;
}

function groupSelectedPrompts(
  prompts: PromptStructure[],
  selectedPrompts: PromptStructure[]
) {
  const todoGroups = [];
  let currentGroup = [];

  for (let i = 0; i < prompts.length; i++) {
    const todo = prompts[i];

    if (selectedPrompts.includes(todo)) {
      currentGroup.push(todo);
    } else if (currentGroup.length > 0) {
      // If we encounter a non-selected message and there is an active group,
      // push the current group to the result and reset it.
      todoGroups.push(currentGroup);
      currentGroup = [];
    }
  }

  // Check if there's a group remaining after the loop.
  if (currentGroup.length > 0) {
    todoGroups.push(currentGroup);
  }

  return todoGroups;
}
