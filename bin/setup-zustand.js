import path from "path";
import fs from "fs/promises";
import { execSync } from "child_process";
import pc from "picocolors";
import { removeIfExists } from "./utils.js";

// Replace Zustand imports if removed
export async function stripZustandFromApp(appFile) {
  try {
    let content = await fs.readFile(appFile, "utf-8");
    content = content
      .replace(/import.*useAppStore.*\n?/g, "")
      .replace(/useAppStore\(.*\)/g, "");
    await fs.writeFile(appFile, content);
  } catch {}
}

// Remove Zustand setup
export async function removeZustand(targetDir, template) {
  if (template === "nextjs-ts") {
    await removeIfExists(path.join(targetDir, "lib", "store"));
    await removeIfExists(path.join(targetDir, "app", "components"));
  } else {
    await removeIfExists(path.join(targetDir, "src", "store"));
    await stripZustandFromApp(path.join(targetDir, "src", "App.tsx"));
    await stripZustandFromApp(path.join(targetDir, "src", "App.jsx"));
  }
}

// Setup Zustand
export async function setupZustand(targetDir, template) {
  console.log(pc.blue("\nAdding Zustand..."));

  // Install Zustand
  execSync("npm install zustand", {
    cwd: targetDir,
    stdio: "inherit",
    shell: true,
  });

  const isNextjs = template === "nextjs-ts";
  const isTsReact = template === "react-ts-vite";
  const appExt = isTsReact || isNextjs ? "tsx" : "jsx";
  const storeExt = isTsReact || isNextjs ? "ts" : "js";
  const componentExt = appExt;

  // For Next.js, use lib/store (best practice), for React use src/store
  const storeDir = isNextjs
    ? path.join(targetDir, "lib", "store")
    : path.join(targetDir, "src", "store");
  await fs.mkdir(storeDir, { recursive: true });

  // Next.js uses TypeScript, so use TypeScript format
  const storeContent = (isTsReact || isNextjs)
    ? `import { create } from "zustand";

type AppState = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
}));
`
    : `import { create } from "zustand";

export const useAppStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
}));
`;

  await fs.writeFile(
    path.join(storeDir, `useAppStore.${storeExt}`),
    storeContent
  );

  const componentsDir = isNextjs
    ? path.join(targetDir, "app", "components")
    : path.join(targetDir, "src", "components");
  await fs.mkdir(componentsDir, { recursive: true });

  // Import paths: Next.js components are in app/components, store in lib/store
  const storeImportPath = isNextjs ? "../../lib/store/useAppStore" : "../store/useAppStore";

  const counterContent = (isTsReact || isNextjs)
    ? `${isNextjs ? '"use client";\n\n' : ''}import { useAppStore } from "${storeImportPath}";

        export function Counter() {
          const { count, increment, decrement } = useAppStore();

          return (
            <section style={{ marginTop: "2rem" }}>
              <p style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                Count: <span>{count}</span>
              </p>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button onClick={decrement}>-1</button>
                <button onClick={increment}>+1</button>
              </div>
            </section>
          );
        }
        `
    : `import { useAppStore } from "../store/useAppStore";

        export function Counter() {
          const { count, increment, decrement } = useAppStore();

          return (
            <section style={{ marginTop: "2rem" }}>
              <p style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                Count: <span>{count}</span>
              </p>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button onClick={decrement}>-1</button>
                <button onClick={increment}>+1</button>
              </div>
            </section>
          );
        }
      `;

  await fs.writeFile(
    path.join(componentsDir, `Counter.${componentExt}`),
    counterContent
  );

  // Only create App.tsx/jsx for React templates, not Next.js
  if (isNextjs) {
    return; // Next.js uses app/page.tsx, which will be handled by setupNextjsTailwindUI
  }

  const appPath = path.join(targetDir, "src", `App.${appExt}`);
  const appContent = isTsReact
    ? `import { Counter } from "./components/Counter";

      export default function App() {
        return (
          <main
            style={{
              padding: "2rem",
              fontFamily: "system-ui, sans-serif",
              maxWidth: 640,
              margin: "0 auto"
            }}
          >
            <header>
              <p style={{ textTransform: "uppercase", color: "#6b7280", fontSize: 13 }}>
                React + Vite + Zustand
              </p>
              <h1 style={{ marginTop: 8 }}>Your starter project is ready.</h1>
              <p style={{ color: "#4b5563" }}>
                Use the demo counter below to explore the shared Zustand store.
              </p>
            </header>

            <Counter />
          </main>
        );
      }
      `
    : `import { Counter } from "./components/Counter";
        export default function App() {
          return (
            <main
              style={{
                padding: "2rem",
                fontFamily: "system-ui, sans-serif",
                maxWidth: 640,
                margin: "0 auto"
              }}
            >
              <header>
                <p style={{ textTransform: "uppercase", color: "#6b7280", fontSize: 13 }}>
                  React + Vite + Zustand
                </p>
                <h1 style={{ marginTop: 8 }}>Your starter project is ready.</h1>
                <p style={{ color: "#4b5563" }}>
                  Use the demo counter below to explore the shared Zustand store.
                </p>
              </header>

              <Counter />
            </main>
          );
        }
        `;

  await fs.writeFile(appPath, appContent);
}
