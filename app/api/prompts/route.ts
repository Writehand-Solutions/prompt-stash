export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

// Minimal type for the UI
type PromptDoc = {
  id: string;
  locked?: boolean;
  title: string;
  description: string;
  tags?: string[];
  input_variables?: any[];
  examples?: any[];
  created_at?: string;
  updated_at?: string | null;
  bookmarked?: boolean;
  template: string;
  slug: string;
};

function readAllMarkdownPrompts(): PromptDoc[] {
  const dir = path.join(process.cwd(), 'prompts');
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.md'));
  const docs: PromptDoc[] = [];

  for (const filename of files) {
    const filePath = path.join(dir, filename);
    const raw = fs.readFileSync(filePath, 'utf8');

    const { data, content } = matter(raw); // reads YAML frontmatter + body
    const front = data as any;

    // Basic guardrails so a single bad file doesn't crash the list
    if (!front || !front.id || !front.title || !front.description) {
      continue;
    }

    docs.push({
      ...front,
      template: (content || '').trim(),
      slug: filename.replace(/\.md$/i, ''),
    });
  }
  return docs;
}

export async function GET() {
  const prompts = readAllMarkdownPrompts();
  return NextResponse.json(prompts);
}

// Keep POST working (optional). It just echoes 405 for now to be safe.
// If you were using POST to save prompts from the UI, we can wire it back later.
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
