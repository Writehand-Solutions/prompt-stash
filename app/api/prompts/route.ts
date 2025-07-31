import { NextResponse } from "next/server"
import { loadMarkdownPrompts } from "@/lib/server/loadMarkdownPrompts"

export async function GET() {
  const prompts = await loadMarkdownPrompts()
  return NextResponse.json(prompts)
}
