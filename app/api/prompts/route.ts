export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { promptStructureSchema } from "@/lib/data/validator";
import { loadMarkdownPrompts } from "@/lib/server/loadMarkdownPrompts";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import slugify from "slugify";
import yaml from "js-yaml";
 
export async function GET() {
  const prompts = await loadMarkdownPrompts()
  return NextResponse.json(prompts)
}
export async function POST(req: Request) {
  try {
    const prompt = await req.json();
    const validation = promptStructureSchema.safeParse(prompt);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid prompt structure" }, { status: 400 });
    }
 
    //  Ensure correct types
    prompt.tags = Array.isArray(prompt.tags)
      ? prompt.tags
      : String(prompt.tags || "")
          .split(",")
          .map(t => t.trim())
          .filter(Boolean);
 
    prompt.input_variables = Array.isArray(prompt.input_variables)
      ? prompt.input_variables
      : [];
 
    const slug = slugify(prompt.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
 
    const filePath = path.join(process.cwd(), "prompts", `${slug}.md`);
    const { template, ...frontmatter } = prompt;
    const mdContent = `---\n${yaml.dump(frontmatter)}---\n${template || ""}`;
 
    await fs.writeFile(filePath, mdContent, "utf8");
    return NextResponse.json({ success: true }, { status: 201 });
 
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
