"use client";

import React, { useState } from "react";
import { Tag } from "lucide-react";

import { useAllTags } from "@/lib/hooks/use-tags";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Filters {
  useCases: string[];
  dateRange: { from: Date | undefined; to: Date | undefined } | null;
  bookmarked: boolean;
}

interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function PromptTagList({ filters, setFilters }: FilterSidebarProps) {
  const [openCollapsible, setOpenCollapsible] = useState("useCases");
  const [tags] = useAllTags();

  const handleCollapsibleChange = (id: string) => {
    setOpenCollapsible(openCollapsible === id ? "" : id);
  };

  const handleCheckboxChange = (category: keyof Filters, itemId: string) => {
    setFilters((prevFilters) => {
      const categoryFilters = prevFilters[category] as string[];
      const updatedFilters = categoryFilters.includes(itemId)
        ? categoryFilters.filter((id) => id !== itemId)
        : [...categoryFilters, itemId];
      return { ...prevFilters, [category]: updatedFilters };
    });
  };

  return (
    <div className="flex flex-col gap-4 py-2 pl-2">
      <Collapsible
        open={openCollapsible === "useCases"}
        onOpenChange={() => handleCollapsibleChange("useCases")}
      >
        <CollapsibleTrigger>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 px-2 py-1">
                <Tag className="h-4 w-4 stroke-muted-foreground/80" />
                <span className="text-sm text-muted-foreground">Tags</span>
              </div>
            </TooltipTrigger>
          </Tooltip>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollArea className="max-h-[250px] overflow-y-auto border-l border-border/50">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-2">
              {tags.useCases.map((item) => (
                <div key={item.id} className="flex items-center gap-2 py-1">
                  <Checkbox
                    id={item.id}
                    checked={filters.useCases.includes(item.id)}
                    onCheckedChange={() =>
                      handleCheckboxChange("useCases", item.id)
                    }
                  />
                  <label
                    htmlFor={item.id}
                    className="text-xs text-muted-foreground"
                  >
                    {item.label}
                  </label>
                  <span className="ml-auto text-muted-foreground/50 text-xs">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
