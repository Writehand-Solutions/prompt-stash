import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TextureCardHeader, TextureCardContent } from "./cult/texture-card";

interface AgentChatFormProps {
  variables: string[];
  variableValues: Record<string, string>;
  handleVariableChange: (variable: string, value: string) => void;
  inputValue: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // <-- Add this
}

export function AgentChatForm({
  variables,
  variableValues,
  handleVariableChange,
  inputValue,
  onSubmit, // <-- Add this
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
          <form onSubmit={onSubmit}>
            <div className="space-y-4 p-4">
              {variables.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div className="pt-4">
                <Button type="submit" className="w-full" size="lg">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </TextureCardHeader>
    </motion.div>
  );
}
