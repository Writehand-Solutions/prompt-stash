// Make this API run on Node and always read fresh from disk
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { loadMarkdownPrompts } from '@/lib/server/loadMarkdownPrompts';
import { promptStructureSchema } from '@/lib/data/validator';

import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import yaml from 'js-yaml';

/** Normalize any loader output so the UI never crashes on missing fields */
function normalizePrompt(p: any) {
  return {
    id: p.id,
    locked: Boolean(p.locked),
    title: String(p.title || ''),
    description: String(p.description || ''),
    tags: Array.isArray(p.tags) ? p.tags : [],
    input_variables: Array.isArray(p.input_variables) ? p.input_variables : [],
    examples: Array.isArray(p.examples) ? p.examples : [],
    created_at: p.created_at ?? new Date().toISOString(),
    updated_at: p.updated_at ?? null,
    bookmarked: Boolean(p.bookmarked),
    template: (p.template ?? '').toString(),
    // keep anything else the UI might expect
  };
}

/** GET: return every .md prompt from /prompts as JSON */
export async function GET() {
  try {
    const items = await loadMarkdownPrompts(); // already reads /prompts/*.md
    const prompts = items.map(normalizePrompt);
    return NextResponse.json(prompts);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to load prompts', detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}

/** POST: save a new prompt as /prompts/<slug>.md (used by “New prompt” in UI) */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Coerce arrays so validation passes even if client sent strings
    const prompt = {
      ...body,
      tags: Array.isArray(body.tags)
        ? body.tags
        : String(body.tags || '')
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean),
      input_variables: Array.isArray(body.input_variables) ? body.input_variables : [],
      examples: Array.isArray(body.examples) ? body.examples : [],
      created_at: body.created_at ?? new Date().toISOString(),
      updated_at: body.updated_at ?? null,
      bookmarked: Boolean(body.bookmarked),
      locked: Boolean(body.locked),
      template: body.template ?? '',
    };

    // Validate against your zod schema
    const validation = promptStructureSchema.safeParse(prompt);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid prompt structure', issues: validation.error.issues },
        { status: 400 }
      );
    }

    // Build safe filename from title
    const slug = slugify(prompt.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Separate frontmatter & template body
    const { template, ...frontmatter } = prompt;

    // YAML frontmatter (avoid line wrapping to keep regex intact)
    const fm = yaml.dump(frontmatter, { lineWidth: -1, noRefs: true });
    const md = `---\n${fm}---\n${template ? String(template).trim() + '\n' : ''}`;

    const filePath = path.join(process.cwd(), 'prompts', `${slug}.md`);
    await fs.writeFile(filePath, md, 'utf8');

    return NextResponse.json({ success: true, slug }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to save prompt', detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
