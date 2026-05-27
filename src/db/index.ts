import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

function pickDatabaseUrl(): string | null {
  for (const key of [
    "DATABASE_URL",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
  ] as const) {
    const raw = process.env[key]?.trim();
    if (!raw || raw === '""') continue;
    if (raw.startsWith("postgresql://") || raw.startsWith("postgres://")) {
      return raw;
    }
  }
  return null;
}

export function getDb() {
  const url = pickDatabaseUrl();
  if (!url) return null;
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export function getDbOrThrow() {
  const db = getDb();
  if (!db) throw new Error("DATABASE_NOT_CONFIGURED");
  return db;
}
