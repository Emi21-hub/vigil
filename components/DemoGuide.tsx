"use client";

import { useState } from "react";
import Link from "next/link";
import { WALKTHROUGH, AGENTS, type AgentKind } from "@/lib/venture";

const COLS: { kind: AgentKind[]; title: string }[] = [
  { kind: ["usuario", "humano"], title: "Personas" },
  { kind: ["reglas"], title: "Reglas fijas (sin IA)" },
  { kind: ["datos"], title: "Datos" },
  { kind: ["agente de código"], title: "Quien construye" },
];

export default function DemoGuide() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const count = Object.values(done).filter(Boolean).length;

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">Demo guiada de Vigil</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">Un recorrido de 8 pasos por todo el sitio (unos 5 minutos). Vigil es una demo estudiantil: los avisos son simulados y no contacta servicios de emergencia.</p>
      </header>

      <section aria-labelledby="walk" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="walk" className="text-lg font-medium">Recorrido</h2>
          <p role="status" className="text-sm text-neutral-400" data-testid="progress">{count} de {WALKTHROUGH.length} pasos</p>
        </div>
        <ol className="space-y-3">
          {WALKTHROUGH.map((s) => (
            <li key={s.n} className="rounded-xl border border-neutral-800 p-4">
              <div className="flex items-start gap-3">
                <input id={"step-" + s.n} type="checkbox" checked={!!done[s.n]} onChange={(e) => setDone({ ...done, [s.n]: e.target.checked })} className="mt-1 h-4 w-4" aria-label={"Paso " + s.n + " hecho"} />
                <div className="space-y-1">
                  <label htmlFor={"step-" + s.n} className="font-medium">{s.n}. {s.title}</label>
                  <p className="text-sm text-neutral-300"><span className="text-neutral-500">Haz: </span>{s.action}</p>
                  <p className="text-sm text-neutral-400"><span className="text-neutral-500">Deberías ver: </span>{s.expect}</p>
                  <Link href={s.path} className="inline-block text-sm text-amber-300 underline">Abrir {s.path}</Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="map" className="space-y-4">
        <h2 id="map" className="text-lg font-medium">Mapa de agentes</h2>
        <p className="max-w-2xl text-sm text-neutral-400">Aquí «agente» es un componente con una tarea fija. Ninguno usa un modelo de lenguaje cuando alguien visita el sitio. El agente de código solo escribió el sitio; no forma parte de él.</p>
        <p className="text-xs text-neutral-500">Flujo: visitante → reglas → datos → revisión humana, y de vuelta a los cambios que hace el agente de código.</p>
        <div className="grid gap-4 md:grid-cols-4">
          {COLS.map((c) => (
            <div key={c.title} className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">{c.title}</h3>
              {AGENTS.filter((a) => c.kind.includes(a.kind)).map((a) => (
                <article key={a.id} className="rounded-xl border border-neutral-800 p-3 text-sm">
                  <h4 className="font-medium">{a.name}</h4>
                  <p className="mt-1 text-neutral-300">{a.does}</p>
                  <dl className="mt-2 space-y-1 text-xs text-neutral-500">
                    {a.file !== "—" && <div><dt className="inline">Código: </dt><dd className="inline font-mono">{a.file}</dd></div>}
                    <div><dt className="inline">Lee: </dt><dd className="inline">{a.reads}</dd></div>
                    <div><dt className="inline">Escribe: </dt><dd className="inline">{a.writes}</dd></div>
                    <div><dt className="inline text-amber-300/80">Control humano: </dt><dd className="inline">{a.checkpoint}</dd></div>
                    <div><dt className="inline">Límite: </dt><dd className="inline">{a.limit}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      <p className="text-sm text-neutral-500">Más: <Link className="underline" href="/dashboard">dashboard</Link> · <Link className="underline" href="/docs">docs</Link></p>
    </div>
  );
}
