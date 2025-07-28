"use client"

import React, { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

interface Variable {
  name: string
  description: string
  type: string
}

interface AddVariablesModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onVariablesGenerated: (variables: Variable[]) => void
}

export function AddVariablesModal({
  isOpen,
  onOpenChange,
  onVariablesGenerated,
}: AddVariablesModalProps) {
  const [questions, setQuestions] = useState("")
  const [generatedVariables, setGeneratedVariables] = useState<Variable[]>([])

  const generateVariablesFromQuestions = () => {
    if (!questions.trim()) return

    const questionLines = questions
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const variables: Variable[] = questionLines.map((question, index) => {
      // Extract a variable name from the question
      const words = question
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(" ")
        .filter((word) => word.length > 0)
        .slice(0, 3)

      const variableName = words.join("_") || `variable_${index + 1}`

      return {
        name: variableName,
        description: question,
        type: "string",
      }
    })

    setGeneratedVariables(variables)
  }

  const handleApplyVariables = () => {
    onVariablesGenerated(generatedVariables)
    onOpenChange(false)
    setQuestions("")
    setGeneratedVariables([])
  }

  const handleCancel = () => {
    onOpenChange(false)
    setQuestions("")
    setGeneratedVariables([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Form Input Variables
          </DialogTitle>
          <DialogDescription>
            Variables allow you to add form inputs into a prompt. Enter your questions below and we'll auto-generate variables for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="questions" className="text-sm font-medium">
              Enter your questions (one per line)
            </Label>
            <Textarea
              id="questions"
              placeholder="e.g., What is your name?&#10;What is your age?&#10;What is your favorite color?"
              className="min-h-[120px] mt-2"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
            />
          </div>

          <Button
            onClick={generateVariablesFromQuestions}
            disabled={!questions.trim()}
            className="w-full h-10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Generate Variables
          </Button>

          {generatedVariables.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Generated Variables ({generatedVariables.length})
              </Label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto border border-black/10 dark:border-white/10 rounded-md p-3">
                {generatedVariables.map((variable, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-black/5 dark:border-white/5"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm text-primary">
                        {variable.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {variable.description}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {variable.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={handleCancel} className="h-10">
            Cancel
          </Button>
          <Button
            onClick={handleApplyVariables}
            disabled={generatedVariables.length === 0}
            className="h-10"
          >
            Apply Variables
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 