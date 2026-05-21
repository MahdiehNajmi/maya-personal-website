import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function getAvatarDataUrl() {
  const file = await readFile(join(process.cwd(), "public", "me.png"));
  return `data:image/png;base64,${file.toString("base64")}`;
}
