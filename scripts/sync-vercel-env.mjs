#!/usr/bin/env node
/**
 * Sync critical env vars from .env.local to Vercel (production + preview).
 * Run: node scripts/sync-vercel-env.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

function loadEnvFile(path) {
  if (!existsSync(path)) throw new Error(`Missing ${path}`);
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const required = [
  "DATABASE_URL",
  "NEON_AUTH_BASE_URL",
  "NEON_AUTH_COOKIE_SECRET",
  "BLOB_READ_WRITE_TOKEN",
];

const env = loadEnvFile(envPath);
for (const key of required) {
  if (!env[key]) throw new Error(`Missing ${key} in .env.local`);
}

function vercelEnvAdd(name, value, target) {
  execFileSync(
    "vercel",
    ["env", "add", name, target, "--value", value, "--force", "--yes", "--sensitive"],
    { cwd: root, stdio: "inherit" },
  );
}

const targets = ["production", "preview"];
const vars = [
  ["DATABASE_URL", env.DATABASE_URL],
  ["POSTGRES_URL", env.DATABASE_URL],
  ["NEON_AUTH_BASE_URL", env.NEON_AUTH_BASE_URL],
  ["NEON_AUTH_COOKIE_SECRET", env.NEON_AUTH_COOKIE_SECRET],
  ["BLOB_READ_WRITE_TOKEN", env.BLOB_READ_WRITE_TOKEN],
];

for (const target of targets) {
  console.log(`\nSyncing ${target}...`);
  for (const [name, value] of vars) {
    console.log(`  ${name}`);
    vercelEnvAdd(name, value, target);
  }
}

console.log("\nDone. Deploy with: vercel deploy --prod");
