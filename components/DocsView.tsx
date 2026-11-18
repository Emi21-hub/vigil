"use client";

import { useState } from "react";
import { PROMPTS, BUILD_LOG, IMPACT, ROADMAP, roadmapOrder } from "@/lib/venture";
import { copyText } from "@/lib/browserTools";

function CopyButton({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" onClick={async () => { setOk(await copyText(text)); setTimeout(() => setOk(false), 2000); }} className="rounded-lg border border-neutral-700 px-3 py-1 text-xs hover:border-neutral-500">{ok ? "Copied" : "Copy"}</button>
  );
}

export default function DocsView() {
  const th = "px-3 py-2 text-left text-xs font-medium text-neutral-500";
  const td = "px-3 py-2 align-top text-sm text-neutral-300";
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">Docs</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">Prompt library, build log, impact review and version 2 roadmap. Whatever was not measured says “not measured”.</p>
        <nav className="mt-3 flex flex-wrap gap-3 text-sm">
          {[["prompts", "Prompts"], ["bitacora", "Build log"], ["impacto", "Impact"], ["roadmap", "Roadmap v2"]].map(([id, l]) => <a key={id} href={"#" + id} className="underline text-neutral-300">{l}</a>)}
        </nav>
      </header>

      <section id="prompts" aria-labelledby="h-prompts" className="scroll-mt-6 space-y-3">
        <h2 id="h-prompts" className="text-lg font-medium">Prompt library</h2>
        <p className="text-sm text-neutral-400">The build prompts for each week, exactly as they were given to the coding agent.</p>
        {PROMPTS.map((p) => (
          <details key={p.week} className="rounded-xl border border-neutral-800 p-4">
            <summary className="cursor-pointer font-medium">Week {p.week}: {p.title}</summary>
            <p className="mt-3 text-sm text-neutral-300">{p.text}</p>
            <div className="mt-3"><CopyButton text={p.text} /></div>
          </details>
        ))}
      </section>

      <section id="bitacora" aria-labelledby="h-bit" className="scroll-mt-6 space-y-3">
        <h2 id="h-bit" className="text-lg font-medium">Build log</h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full min-w-[40rem]">
            <thead><tr><th className={th}>Week</th><th className={th}>What was built</th><th className={th}>Commits</th><th className={th}>Tests</th><th className={th}>What was fixed</th></tr></thead>
            <tbody>{BUILD_LOG.map((w) => <tr key={w.week} className="border-t border-neutral-800"><td className={td}>{w.week}</td><td className={td}>{w.theme}</td><td className={td + " tabular-nums"}>{w.commits}</td><td className={td}>{w.tests}</td><td className={td}>{w.fix}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-500">Full history at github.com/Emi21-hub/vigil. Several weeks were pushed in a single session, so the history does not show day-by-day iteration.</p>
      </section>

      <section id="impacto" aria-labelledby="h-imp" className="scroll-mt-6 space-y-3">
        <h2 id="h-imp" className="text-lg font-medium">Practical impact review</h2>
        <p className="text-sm text-neutral-400">Who benefits, what harm Vigil could cause and what remains unresolved.</p>
        <div className="space-y-3">
          {IMPACT.map((i) => (
            <article key={i.id} className="rounded-xl border border-neutral-800 p-4 text-sm">
              <h3 className="font-medium">{i.id} · {i.topic}</h3>
              <p className="mt-1 text-neutral-300">{i.finding}</p>
              <p className="mt-2 text-neutral-400"><span className="text-neutral-500">What was done: </span>{i.mitigation}</p>
              <p className="mt-1 text-amber-300/90"><span className="text-neutral-500">Remaining: </span>{i.residual}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="roadmap" aria-labelledby="h-road" className="scroll-mt-6 space-y-3">
        <h2 id="h-road" className="text-lg font-medium">Version 2 roadmap</h2>
        <p className="text-sm text-neutral-400">None of this has been started. The order comes from the risks above.</p>
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full min-w-[40rem]">
            <thead><tr><th className={th}>#</th><th className={th}>What</th><th className={th}>Why</th><th className={th}>Priority</th><th className={th}>After</th><th className={th}>Status</th></tr></thead>
            <tbody>{roadmapOrder(ROADMAP).map((r) => <tr key={r.id} className="border-t border-neutral-800"><td className={td}>{r.id}</td><td className={td}>{r.title}</td><td className={td}>{r.why}</td><td className={td}>{r.priority}</td><td className={td}>{r.after ?? "—"}</td><td className={td}>{r.status}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
