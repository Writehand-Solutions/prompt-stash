import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import slugify from "slugify";
import yaml from "js-yaml";

type PromptInput = {
  title: string;
  tags?: string[] | string;
  input_variables?: string[];
  template?: string;
  // allow any other frontmatter fields
  [key: string]: any;
};

const PROMPTS_DIR = path.join(process.cwd(), "prompts");

function ensureArray(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[];
  if (val == null) return [];
  return String(val)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseMarkdownFrontmatter(raw: string) {
  // very small parser to avoid another dep
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { frontmatter: {}, content: raw };
  const front = yaml.load(m[1] || "") as Record<string, any>;
  const content = m[2] || "";
  return { frontmatter: front, content };
}

async function loadMarkdownPrompts() {
  try {
    await fs.mkdir(PROMPTS_DIR, { recursive: true });
    const files = await fs.readdir(PROMPTS_DIR);
    const mdFiles = files.filter((f) => f.endsWith(".md"));

    const items = await Promise.all(
      mdFiles.map(async (file) => {
        const full = path.join(PROMPTS_DIR, file);
        const raw = await fs.readFile(full, "utf8");
        const { frontmatter, content } = parseMarkdownFrontmatter(raw);
        return {
          slug: file.replace(/\.md$/, ""),
          ...frontmatter,
          template: content,
        };
      })
    );

    return items;
  } catch {
    // if the folder doesn't exist yet
    return [];
  }
}

/* ---------- GET: list prompts from /prompts ---------- */
export async function GET() {
  const prompts = await loadMarkdownPrompts();
  return NextResponse.json(prompts);
}

/* ---------- POST: create a new prompt markdown ---------- */
export async function POST(req: Request) {
  try {
    const promptBody = (await req.json()) as PromptInput;

    if (!promptBody?.title || typeof promptBody.title !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'title'." },
        { status: 400 }
      );
    }

    // normalize fields
    const tags = ensureArray(promptBody.tags);
    const input_variables = Array.isArray(promptBody.input_variables)
      ? promptBody.input_variables
      : [];

    const slug = slugify(promptBody.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    await fs.mkdir(PROMPTS_DIR, { recursive: true });
    const filePath = path.join(PROMPTS_DIR, `${slug}.md`);

    // separate template from frontmatter
    const { template = "", ...rest } = promptBody;
    const frontmatter = { ...rest, tags, input_variables };

    const mdContent = `---\n${yaml.dump(frontmatter)}---\n${template}`;

    await fs.writeFile(filePath, mdContent, "utf8");

    return NextResponse.json({ success: true, slug }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
