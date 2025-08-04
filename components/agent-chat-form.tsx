import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TextureCardHeader } from "./cult/texture-card";
import { MessageCircleDashed } from "lucide-react";

interface AgentChatFormProps {
  variables: string[];
  variableValues: Record<string, string>;
  handleVariableChange: (variable: string, value: string) => void;
  inputValue: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AgentChatForm({
  variables,
  variableValues,
  handleVariableChange,
  inputValue,
  onSubmit,
}: AgentChatFormProps) {
  const showForm = inputValue.includes("{") || variables.length > 0;

  if (!showForm) {
    return null;
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: "auto",
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: [0.43, 0.13, 0.23, 0.96],
        },
      }}
      exit={{
        height: 0,
        opacity: 0,
        transition: {
          duration: 0.4,
          ease: [0.43, 0.13, 0.23, 0.96],
        },
      }}
    >
      <TextureCardHeader className="first:pt-2 last:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96],
              delay: 0.2,
            },
          }}
          exit={{
            opacity: 0,
            y: 20,
            transition: {
              duration: 0.3,
              ease: [0.43, 0.13, 0.23, 0.96],
            },
          }}
          className="w-full"
        >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: [0.43, 0.13, 0.23, 0.96],
                    delay: 0.2,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  transition: {
                    duration: 0.3,
                    ease: [0.43, 0.13, 0.23, 0.96],
                  },
                }}
                className="hidden md:flex flex-col pb-3 w-full items-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      duration: 0.5,
                      ease: [0.43, 0.13, 0.23, 0.96],
                      delay: 0.3,
                    },
                  }}
                  exit={{
                    scale: 0.8,
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      ease: [0.43, 0.13, 0.23, 0.96],
                    },
                  }}
                  className="bg-primary-foreground p-4 rounded-full flex justify-center"
                >
                  <MessageCircleDashed className="h-6 w-6 text-primary" />
                </motion.div>
              </motion.div>
          <form onSubmit={onSubmit}>
            <div className="pb-3 px-3 rounded-lg">
              <fieldset className="grid space-x-3 space-y-3 grid-cols-3 bg-background rounded-lg border border-black/20 dark:border-white/20 px-3 pb-3 -mt-1">
                <legend className="-ml-1 px-1 text-sm font-medium">Variables</legend>
                {variables.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-3">
                    {variables.map((variable) => (
                      <motion.div
                        key={variable}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                      >
                        <Label htmlFor={variable} className="text-sm font-medium">
                          {variable}
                        </Label>
                        <Input
                          id={variable}
                          type="text"
                          value={variableValues[variable] || ""}
                          onChange={(e) =>
                            handleVariableChange(variable, e.target.value)
                          }
                          placeholder={`Enter ${variable}`}
                          className="bg-white text-primary dark:bg-zinc-900 dark:text-white focus-visible:ring-blue-300/0"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
                <div className="pt-4 col-span-3">
                  <Button type="submit" variant="yellow" className="w-full" size="lg">
                    Submit
                  </Button>
                </div>
              </fieldset>
            </div>
          </form>
        </motion.div>
      </TextureCardHeader>
    </motion.div>
  );
}