import fs from "fs/promises";
import path from "path";

// Delete file/folder if exists
export async function removeIfExists(target) {
  try {
    await fs.rm(target, { recursive: true, force: true });
  } catch {}
}

// Copy template
export async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(from, to);
    } else {
      await fs.copyFile(from, to);
    }
  }
}

// Update project name and ensure module type
export async function updatePackageName(targetDir, name) {
  try {
    const pkgPath = path.join(targetDir, "package.json");
    const raw = await fs.readFile(pkgPath, "utf-8");
    const json = JSON.parse(raw);
    json.name = name;
    // Ensure "type": "module" is set for ES modules (needed for postcss.config.js)
    // Only set if not already specified
    if (!json.type) {
      json.type = "module";
    }
    await fs.writeFile(pkgPath, JSON.stringify(json, null, 2));
  } catch {}
}

