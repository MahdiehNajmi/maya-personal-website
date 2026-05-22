import { readFileSync } from "fs";
import { join } from "path";

const FALLBACK_PERSONA = `You are Mahi, an AI clone on Maya's personal website — a full-stack developer and data analyst. Be warm but precise, honest, and helpful about the site and portfolio. Do not invent facts; offer mnajmi@mun.ca when unsure.`;

let cachedPersona: string | null = null;

/** Loads the AI-clone system prompt from content/persona.md (server-only). */
export function loadPersonaPrompt(): string {
  if (cachedPersona) return cachedPersona;
  try {
    const path = join(process.cwd(), "content", "persona.md");
    cachedPersona = readFileSync(path, "utf-8").trim();
    if (cachedPersona) return cachedPersona;
  } catch (e) {
    console.error("[persona] Could not read content/persona.md:", e);
  }
  cachedPersona = FALLBACK_PERSONA;
  return cachedPersona;
}
