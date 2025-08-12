import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import slugify from "slugify";
import yaml from "js-yaml";

// If these live elsewhere in your repo, adjust the import paths accordingly:
// import { loadMarkdownPrompts } from "@/lib/load-prompts";
// import { promptStructureSchema } from "@/lib/schemas/prompt";

export async function GET() {
  const prompts = await loadMarkdownPrompts();
  return NextResponse.json(prompts);
}

export async function POST(req: Request) {
  try {
    // parse body once
    const prompt = await req.json();

    // validate
    const validation = promptStructureSchema.safeParse(prompt);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid prompt structure" },
        { status: 400 }
      );
    }

    // normalize types
    const tags = Array.isArray(prompt.tags)
      ? prompt.tags
      : String(prompt.tags ?? "")
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean);

    const input_variables = Array.isArray(prompt.input_variables)
      ? prompt.input_variables
      : [];

    const normalized = { ...prompt, tags, input_variables };

    // slug + path
    const slug = slugify(normalized.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
    const filePath = path.join(process.cwd(), "prompts", `${slug}.md`);

    // frontmatter + body
    const { template = "", ...frontmatter } = normalized;
    const mdContent = `---\n${yaml.dump(frontmatter)}---\n${template}`;

    // write
    await fs.writeFile(filePath, mdContent, "utf8");
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

