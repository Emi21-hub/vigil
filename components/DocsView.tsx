"use client";

import { useState } from "react";
import { PROMPTS, BUILD_LOG, IMPACT, ROADMAP, roadmapOrder } from "@/lib/venture";
import { copyText } from "@/lib/browserTools";

function CopyButton({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" onClick={async () => { setOk(await copyText(text)); setTimeout(() => setOk(false), 2000); }} className="rounded-lg border border-neutral-700 px-3 py-1 text-xs hover:border-neutral-500">{ok ? "Copiado" : "Copiar"}</button>
  );
}

export default function DocsView() {
  const th = "px-3 py-2 text-left text-xs font-medium text-neutral-500";
  const td = "px-3 py-2 align-top text-sm text-neutral-300";
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">Docs</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">Biblioteca de prompts, bitácora de construcción, revisión de impacto y roadmap de la versión 2. Lo que no se midió dice «no medido».</p>
        <nav className="mt-3 flex flex-wrap gap-3 text-sm">
          {[["prompts", "Prompts"], ["bitacora", "Bitácora"], ["impacto", "Impacto"], ["roadmap", "Roadmap v2"]].map(([id, l]) => <a key={id} href={"#" + id} className="underline text-neutral-300">{l}</a>)}
        </nav>
      </header>

      <section id="prompts" aria-labelledby="h-prompts" className="scroll-mt-6 space-y-3">
        <h2 id="h-prompts" className="text-lg font-medium">Biblioteca de prompts</h2>
        <p className="text-sm text-neutral-400">Los prompts de construcción de cada semana, tal como se entregaron al agente de código.</p>
        {PROMPTS.map((p) => (
          <details key={p.week} className="rounded-xl border border-neutral-800 p-4">
            <summary className="cursor-pointer font-medium">Semana {p.week}: {p.title}</summary>
            <p className="mt-3 text-sm text-neutral-300">{p.text}</p>
            <div className="mt-3"><CopyButton text={p.text} /></div>
          </details>
        ))}
      </section>

      <section id="bitacora" aria-labelledby="h-bit" className="scroll-mt-6 space-y-3">
        <h2 id="h-bit" className="text-lg font-medium">Bitácora de construcción</h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full min-w-[40rem]">
            <thead><tr><th className={th}>Semana</th><th className={th}>Qué se construyó</th><th className={th}>Commits</th><th className={th}>Pruebas</th><th className={th}>Qué se corrigió</th></tr></thead>
            <tbody>{BUILD_LOG.map((w) => <tr key={w.week} className="border-t border-neutral-800"><td className={td}>{w.week}</td><td className={td}>{w.theme}</td><td className={td + " tabular-nums"}>{w.commits}</td><td className={td}>{w.tests}</td><td className={td}>{w.fix}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-500">Historial completo en github.com/Emi21-hub/vigil. Varias semanas se subieron en una sola sesión, así que el historial no muestra iteración día a día.</p>
      </section>

      <section id="impacto" aria-labelledby="h-imp" className="scroll-mt-6 space-y-3">
        <h2 id="h-imp" className="text-lg font-medium">Revisión de impacto práctico</h2>
        <p className="text-sm text-neutral-400">Quién se beneficia, qué daño podría causar Vigil y qué queda sin resolver.</p>
        <div className="space-y-3">
          {IMPACT.map((i) => (
            <article key={i.id} className="rounded-xl border border-neutral-800 p-4 text-sm">
              <h3 className="font-medium">{i.id} · {i.topic}</h3>
              <p className="mt-1 text-neutral-300">{i.finding}</p>
              <p className="mt-2 text-neutral-400"><span className="text-neutral-500">Qué se hizo: </span>{i.mitigation}</p>
              <p className="mt-1 text-amber-300/90"><span className="text-neutral-500">Queda: </span>{i.residual}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="roadmap" aria-labelledby="h-road" className="scroll-mt-6 space-y-3">
        <h2 id="h-road" className="text-lg font-medium">Roadmap de la versión 2</h2>
        <p className="text-sm text-neutral-400">Nada de esto está iniciado. El orden sale de los riesgos de arriba.</p>
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full min-w-[40rem]">
            <thead><tr><th className={th}>#</th><th className={th}>Qué</th><th className={th}>Por qué</th><th className={th}>Prioridad</th><th className={th}>Después de</th><th className={th}>Estado</th></tr></thead>
            <tbody>{roadmapOrder(ROADMAP).map((r) => <tr key={r.id} className="border-t border-neutral-800"><td className={td}>{r.id}</td><td className={td}>{r.title}</td><td className={td}>{r.why}</td><td className={td}>{r.priority}</td><td className={td}>{r.after ?? "—"}</td><td className={td}>{r.status}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
