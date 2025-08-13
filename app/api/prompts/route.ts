import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import slugify from "slugify";
import yaml from "js-yaml";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROMPTS_DIR = path.join(process.cwd(), "prompts");

type PromptRecord = {
  id?: string;
  title: string;
  description?: string;
  template: string;
  tags: string[];
  input_variables?: Array<{
    name: string;
    description?: string;
    type?: string;
    required?: boolean;
    variable_validation?: string;
  }>;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
};

async function ensureDir() {
  await fs.mkdir(PROMPTS_DIR, { recursive: true });
}

function parseFrontmatter(fileContent: string): { data: any; content: string } {
  // Expect: ---\n<yaml>\n---\n<template>
  if (!fileContent.startsWith("---")) {
    return { data: {}, content: fileContent };
  }
  const parts = fileContent.split("\n");
  let end = -1;
  for (let i = 1; i < parts.length; i++) {
    if (parts[i].trim() === "---") {
      end = i;
      break;
    }
  }
  if (end === -1) return { data: {}, content: fileContent };

  const fm = parts.slice(1, end).join("\n");
  const content = parts.slice(end + 1).join("\n");
  const data = yaml.load(fm) ?? {};
  return { data, content };
}

async function computeVersion(): Promise<string> {
  try {
    await ensureDir();
    const files = await fs.readdir(PROMPTS_DIR);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    if (mdFiles.length === 0) return "0";
    const stats = await Promise.all(
      mdFiles.map((f) => fs.stat(path.join(PROMPTS_DIR, f)))
    );
    const newest = Math.max(...stats.map((s) => s.mtimeMs));
    return String(newest);
  } catch {
    return "0";
  }
}

async function loadMarkdownPrompts(): Promise<PromptRecord[]> {
  await ensureDir();
  const files = await fs.readdir(PROMPTS_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const results: PromptRecord[] = [];

  for (const file of mdFiles) {
    const full = path.join(PROMPTS_DIR, file);
    const raw = await fs.readFile(full, "utf8");
    const { data, content } = parseFrontmatter(raw);

    const rec: PromptRecord = {
      title: data?.title ?? "",
      description: data?.description ?? "",
      template: content ?? "",
      tags: Array.isArray(data?.tags)
        ? data.tags
        : String(data?.tags ?? "")
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean),
      input_variables: Array.isArray(data?.input_variables)
        ? data.input_variables
        : [],
      created_at: data?.created_at,
      updated_at: data?.updated_at,
      id: data?.id,
      ...data, // keep any extra fields
    };

    results.push(rec);
  }

  // newest first if timestamps exist
  results.sort((a, b) =>
    String(b.updated_at || b.created_at || "").localeCompare(
      String(a.updated_at || a.created_at || "")
    )
  );

  return results;
}

export async function GET() {
  const [prompts, version] = await Promise.all([
    loadMarkdownPrompts(),
    computeVersion(),
  ]);

  return new NextResponse(JSON.stringify(prompts), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
      "x-prompts-version": version,
    },
  });
}

// Lightweight version check
export async function HEAD() {
  const version = await computeVersion();
  return new NextResponse(null, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "x-prompts-version": version,
    },
  });
}

export async function POST(req: Request) {
  try {
    const prompt = (await req.json()) as Partial<PromptRecord>;

    // Normalize tags
    const tags = Array.isArray(prompt.tags)
      ? prompt.tags
      : String(prompt.tags ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

    // Normalize input variables
    const input_variables = Array.isArray(prompt.input_variables)
      ? prompt.input_variables
      : [];

    const slug = slugify(String(prompt.title || "untitled"), {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    await ensureDir();
    const filePath = path.join(PROMPTS_DIR, `${slug}.md`);

    const now = new Date().toISOString();
    const frontmatter = {
      ...prompt,
      id: prompt.id ?? slug,
      tags,
      input_variables,
      created_at: prompt.created_at ?? now,
      updated_at: now,
    };

    const { template = "", ...fm } = frontmatter;
    const mdContent = `---\n${yaml.dump(fm)}---\n${template || ""}`;

    await fs.writeFile(filePath, mdContent, "utf8");

    const version = await computeVersion();
    return NextResponse.json(
      { success: true },
      {
        status: 201,
        headers: {
          "x-prompts-version": version,
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
