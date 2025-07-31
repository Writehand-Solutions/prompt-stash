import fs from "fs/promises";
import matter from "gray-matter";
import { promptStructureSchema, PromptStructure } from "../data/validator"; 
export async function loadMarkdownPrompts(): Promise<PromptStructure[]> {
  const files = await fs.readdir("prompts");
  const parsed = await Promise.all(
    files.map(async (file) => {
      const src = await fs.readFile(`prompts/${file}`, "utf8");
      const { data, content } = matter(src); // parse front-matter + body
      return promptStructureSchema.parse({ ...data, template: content.trim() });
    })
  );
  return parsed;
}
