#!/usr/bin/env node

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import prompts from "prompts";
import pc from "picocolors";
import { execSync } from "child_process";
import { copyDirectory, updatePackageName, removeIfExists } from "./utils.js";
import { setupZustand, removeZustand } from "./setup-zustand.js";
import {
  setupReactTailwindUI,
  setupNextjsTailwindUI,
} from "./setup-tailwind-ui.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cancel
const onCancel = () => {
  console.log(pc.red("\n✖ Operation cancelled by user."));
  process.exit(1);
};

async function main() {
  const arg = process.argv[2];

  // Handle --version, -v
  if (arg === "--version" || arg === "-v") {
    const pkg = JSON.parse(
      await fs.readFile(path.join(__dirname, "..", "package.json"), "utf-8")
    );
    console.log(pkg.version);
    process.exit(0);
  }
  // Handle --help, -h
  if (arg === "--help" || arg === "-h") {
    console.log(`
    ${pc.cyan(
      "create-unistack"
    )} - A modern, extensible project generator for full-stack applications.

    ${pc.bold("Usage:")}
      npx create-unistack [project-name]

    ${pc.bold("Options:")}
      -v, --version    Show version number
      -h, --help       Show help message

    ${pc.bold("Examples:")}
      npx create-unistack
      npx create-unistack my-awesome-app

    ${pc.bold("Templates:")}
      • React + Vite (TypeScript or JavaScript)
      • Next.js (TypeScript)
      • Node.js + Express

    ${pc.bold("Features:")}
      • Zustand for state management (React only)
      • TailwindCSS for styling (React & Next.js)

    ${pc.bold("Repository:")}
      https://github.com/marcel-poroch/create-unistack

    ${pc.bold("Issues:")}
      https://github.com/marcel-poroch/create-unistack/issues
    `);
    process.exit(0);
  }

  console.log(pc.cyan("✨ Welcome to create-modern-react-stack ✨\n"));

  let projectPath = arg;

  if (!projectPath) {
    const p = await prompts(
      {
        type: "text",
        name: "path",
        message: "What should your project be called?",
        initial: "my-project",
        validate: (v) => !!v.trim() || "Project name required",
      },
      { onCancel }
    );
    projectPath = p.path;
  }

  const targetDir = path.resolve(process.cwd(), projectPath);
  const projectName = path.basename(targetDir);

  // Overwrite?
  try {
    await fs.access(targetDir);
    const ask = await prompts(
      {
        type: "confirm",
        name: "value",
        message: `Directory "${projectName}" exists. Overwrite?`,
        initial: false,
      },
      { onCancel }
    );
    if (!ask.value) return console.log(pc.red("✖ Aborted."));
    await fs.rm(targetDir, { recursive: true, force: true });
  } catch {}

  // Select template
  const { template } = await prompts(
    {
      type: "select",
      name: "template",
      message: "Choose a template:",
      choices: [
        { title: "React + Vite (TypeScript)", value: "react-ts-vite" },
        { title: "React + Vite (JavaScript)", value: "react-js-vite" },
        { title: "Next.js (TypeScript)", value: "nextjs-ts" },
        { title: "Node.js (Express)", value: "node-express" },
      ],
    },
    { onCancel }
  );

  let stateManager = "none";
  let styling = "none";

  if (template.startsWith("react") || template === "nextjs-ts") {
    const sm = await prompts(
      {
        type: "select",
        name: "value",
        message: "State manager?",
        choices: [
          { title: "None", value: "none" },
          { title: "Zustand", value: "zustand" },
        ],
      },
      { onCancel }
    );
    stateManager = sm.value;

    const st = await prompts(
      {
        type: "select",
        name: "value",
        message: "Styling system?",
        choices: [
          { title: "None", value: "none" },
          { title: "TailwindCSS", value: "tailwind" },
        ],
      },
      { onCancel }
    );
    styling = st.value;
  }

  const { installDeps } = await prompts(
    {
      type: "toggle",
      name: "installDeps",
      message: "Run npm install?",
      active: "yes",
      inactive: "no",
      initial: true,
    },
    { onCancel }
  );

  const templateDir = path.join(__dirname, "..", "templates", template);

  console.log(pc.blue(`\nCreating project in ${targetDir} ...`));
  await copyDirectory(templateDir, targetDir);
  await updatePackageName(targetDir, projectName);

  // Zustand
  if (stateManager === "none") {
    await removeZustand(targetDir, template);
  }

  if (stateManager === "zustand") {
    await setupZustand(targetDir, template);
  }

  // Tailwind
  if (styling === "none") {
    await removeIfExists(path.join(targetDir, "tailwind.config.js"));
    await removeIfExists(path.join(targetDir, "postcss.config.js"));
  }

  // INSTALL TAILWIND
  if (styling === "tailwind") {
    console.log(pc.blue("\nAdding Tailwind..."));

    // Install dependencies (pin to stable Tailwind v3)
    execSync("npm install -D tailwindcss@3.4.13 postcss autoprefixer", {
      cwd: targetDir,
      stdio: "inherit",
      shell: true,
    });

    // Determine content paths based on template
    const isNextjs = template === "nextjs-ts";
    const contentPaths = isNextjs
      ? ["./app/**/*.{js,ts,jsx,tsx}"]
      : ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"];

    // Create tailwind.config.js
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ${JSON.stringify(contentPaths)},
  theme: { extend: {} },
  plugins: [],
}
`.trim();

    await fs.writeFile(
      path.join(targetDir, "tailwind.config.js"),
      tailwindConfig
    );

    // Create postcss.config.js
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`.trim();

    await fs.writeFile(
      path.join(targetDir, "postcss.config.js"),
      postcssConfig
    );

    // Create/update CSS file based on template
    const tailwindCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

    if (isNextjs) {
      // Next.js: create app/globals.css
      await fs.writeFile(
        path.join(targetDir, "app", "globals.css"),
        tailwindCss
      );

      // Update layout.tsx to import globals.css
      const layoutPath = path.join(targetDir, "app", "layout.tsx");
      try {
        let layoutContent = await fs.readFile(layoutPath, "utf-8");
        if (!layoutContent.includes("globals.css")) {
          layoutContent = `import "./globals.css";\n${layoutContent}`;
          await fs.writeFile(layoutPath, layoutContent);
        }
      } catch {}
    } else {
      // Vite: update src/index.css
      await fs.writeFile(path.join(targetDir, "src", "index.css"), tailwindCss);
    }

    // Add a simple Tailwind-flavored UI so the page looks styled out of the box
    if (template === "react-ts-vite" || template === "react-js-vite") {
      await setupReactTailwindUI(targetDir, template, stateManager);
    } else if (template === "nextjs-ts") {
      await setupNextjsTailwindUI(targetDir, stateManager);
    }

    // Create VS Code settings to fix @tailwind linter warnings
    const vscodeDir = path.join(targetDir, ".vscode");
    await fs.mkdir(vscodeDir, { recursive: true });
    const vscodeSettings = `{
  "css.lint.unknownAtRules": "ignore"
}
`;
    await fs.writeFile(path.join(vscodeDir, "settings.json"), vscodeSettings);
  }

  // Install deps
  if (installDeps) {
    console.log(pc.blue("\nInstalling dependencies...\n"));
    try {
      execSync("npm install", {
        cwd: targetDir,
        stdio: "inherit",
        shell: true,
      });
    } catch {
      console.log(pc.red("⚠ npm install failed"));
    }
  }

  console.log(pc.green("\n✔ Project ready!\n"));
  console.log(pc.green(`cd ${projectPath}`));
  if (!installDeps) console.log("npm install");
  console.log("npm run dev\n");
}

main();
