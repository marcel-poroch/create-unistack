import path from "path";
import fs from "fs/promises";

// Setup Tailwind UI for React templates
export async function setupReactTailwindUI(targetDir, template, stateManager) {
  const appExt = template === "react-ts-vite" ? "tsx" : "jsx";
  const appPath = path.join(targetDir, "src", `App.${appExt}`);
  const counterPath = path.join(targetDir, "src", "components", `Counter.${appExt}`);
  const includeCounter = stateManager === "zustand";
  const counterImport = includeCounter ? `import { Counter } from "./components/Counter";\n\n` : "";
  
  const counterSection = includeCounter
    ? `<section className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 shadow-2xl shadow-slate-900/50 backdrop-blur-lg hover:shadow-slate-900/70 transition-shadow duration-300">
  <div className="flex items-center justify-between gap-6">
    <div className="flex-1">
      <p className="text-xs uppercase tracking-widest text-indigo-300/90">
        Shared state
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-white">
        Zustand Counter Demo
      </h2>
      <p className="mt-3 text-sm text-slate-300 max-w-prose">
        Increment or decrement the value to confirm the store works across components.
      </p>
    </div>
    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200 text-2xl">
      ⚡
    </span>
  </div>

  <div className="mt-8">
    <Counter className="mx-auto max-w-xs" />
  </div>
</section>

`
    : `<section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-900/40 backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">Ready for your first component</h2>
          <p className="mt-2 text-sm text-slate-300">
            Start building UI instantly. Tailwind, Vite and your preferred stack are already configured.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Styling</p>
              <p className="text-lg font-semibold text-white">TailwindCSS</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Tooling</p>
              <p className="text-lg font-semibold text-white">Vite + ESLint</p>
            </div>
          </div>
        </section>`;

  const reactTailwindApp = `${counterImport}export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-900/50 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          React + Vite + Tailwind${includeCounter ? " + Zustand" : ""}
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Your starter project is live.</h1>
        <p className="mt-2 text-slate-300">
          The layout is already styled with Tailwind so you can jump straight into building UI without starting from a blank page.
        </p>
        <div className="mt-6 grid gap-4">
          ${counterSection}
        </div>
        <p className="mt-6 text-[13px] uppercase tracking-[0.4em] text-slate-500">
          Happy building ✦
        </p>
      </section>
    </main>
  );
}
`;

  await fs.writeFile(appPath, reactTailwindApp);

  if (includeCounter) {
    const reactTailwindCounter = `import { useAppStore } from "../store/useAppStore";

export function Counter() {
  const { count, increment, decrement } = useAppStore();

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
      <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/70">Live value</p>
      <p className="mt-2 text-4xl font-semibold text-white">{count}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={decrement}
          className="flex-1 rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
        >
          -1
        </button>
        <button
          onClick={increment}
          className="flex-1 rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          +1
        </button>
      </div>
    </div>
  );
}
`;
    await fs.writeFile(counterPath, reactTailwindCounter);
  }
}

// Setup Tailwind UI for Next.js template
export async function setupNextjsTailwindUI(targetDir) {
  const pagePath = path.join(targetDir, "app", "page.tsx");
  const nextTailwindPage = `export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-900/50 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Next.js + Tailwind
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Your starter project is live.</h1>
        <p className="mt-2 text-slate-300">
          A minimal gradient card shows how Tailwind utility classes can bring your UI to life immediately.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-400">
            Explore code
          </button>
          <button className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white">
            Read docs
          </button>
        </div>
      </section>
    </main>
  );
}
`;
  await fs.writeFile(pagePath, nextTailwindPage);
}

