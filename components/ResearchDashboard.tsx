"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RESEARCH_SEED, type ResearchEntry, type Confidence } from "@/lib/researchSeed";
import {
  filterCompetitors,
  counterLabel,
  rankRisks,
  riskScore,
  riskLevel,
  validateNote,
  loadWithFallback,
  type CompetitorFilter,
} from "@/lib/researchEngine";

const CONF_STYLE: Record<Confidence, string> = {
  alta: "bg-emerald-500/15 text-emerald-300",
  media: "bg-amber-500/15 text-amber-300",
  baja: "bg-red-500/15 text-red-300",
};

function Conf({ c }: { c: Confidence }) {
  return (
    <span className={"rounded px-1.5 py-0.5 text-[11px] font-medium " + CONF_STYLE[c]}>
      confianza {c}
    </span>
  );
}

function Source({ e }: { e: ResearchEntry }) {
  if (!e.source_label) return null;
  return e.source_url ? (
    <a
      href={e.source_url}
      target="_blank"
      rel="noreferrer"
      className="text-xs text-neutral-400 underline underline-offset-2 hover:text-neutral-200"
    >
      {e.source_label}
    </a>
  ) : (
    <span className="text-xs text-neutral-500">{e.source_label}</span>
  );
}

function Card({ e }: { e: ResearchEntry }) {
  return (
    <article className="rounded-xl border border-neutral-800 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-medium">{e.title}</h3>
        <Conf c={e.confidence} />
      </div>
      <p className="mt-2 text-sm text-neutral-300">{e.summary}</p>
      {typeof e.data.lesson === "string" && (
        <p className="mt-2 text-sm text-amber-200/90">Para Vigil: {e.data.lesson}</p>
      )}
      <div className="mt-2">
        <Source e={e} />
      </div>
    </article>
  );
}

const EMPTY_FORM = {
  title: "",
  summary: "",
  source_label: "",
  source_url: "",
  confidence: "media" as Confidence,
};

export default function ResearchDashboard() {
  const [entries, setEntries] = useState<ResearchEntry[]>(RESEARCH_SEED);
  const [origin, setOrigin] = useState<"cargando" | "db" | "respaldo">("cargando");
  const [reason, setReason] = useState<string | undefined>();
  const [filter, setFilter] = useState<CompetitorFilter>({
    query: "",
    camera: "todas",
    status: "todos",
  });
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  async function reload() {
    const res = await loadWithFallback(
      () =>
        supabase
          .from("research_entries")
          .select("slug, id, kind, title, summary, source_label, source_url, confidence, data, created_at")
          .order("created_at")
          .then(({ data, error }) => {
            if (error) throw new Error(error.message);
            return (data ?? []).map((r) => ({
              ...r,
              id: (r.slug as string | null) ?? (r.id as string),
              // las notas usan su uuid real para poder borrarlas
              ...(r.kind === "note" ? { id: r.id as string } : {}),
            })) as ResearchEntry[];
          }),
      RESEARCH_SEED,
      6000
    );
    setEntries(res.entries);
    setOrigin(res.origin);
    setReason(res.reason);
  }

  useEffect(() => {
    reload();
  }, []);

  const by = (k: ResearchEntry["kind"]) => entries.filter((e) => e.kind === k);
  const competitors = by("competitor");
  const shown = useMemo(() => filterCompetitors(entries, filter), [entries, filter]);
  const risks = useMemo(() => rankRisks(entries), [entries]);
  const notes = by("note");

  async function saveNote(ev: React.FormEvent) {
    ev.preventDefault();
    setSaveMsg(null);
    const errs = validateNote(form);
    setErrors(errs);
    if (errs.length) return;
    if (origin !== "db") {
      setErrors(["La base no esta disponible ahora; la nota no se guardo."]);
      return;
    }
    const { error } = await supabase.from("research_entries").insert({
      kind: "note",
      title: form.title.trim(),
      summary: form.summary.trim(),
      source_label: form.source_label.trim() || null,
      source_url: form.source_url.trim() || null,
      confidence: form.confidence,
      data: {},
    });
    if (error) {
      setErrors([error.message]);
      return;
    }
    setForm(EMPTY_FORM);
    setSaveMsg("Nota guardada.");
    await reload();
  }

  async function removeNote(id: string) {
    await supabase.from("research_entries").delete().eq("id", id).eq("kind", "note");
    await reload();
  }

  const input =
    "w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600";

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">Investigación</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          Qué existe, qué se sabe de México y qué puede salir mal. Cada dato trae su fuente y un
          nivel de confianza; lo que no se pudo verificar se dice.
        </p>
        <p
          role="status"
          className={
            "mt-3 inline-block rounded px-2 py-1 text-xs " +
            (origin === "db"
              ? "bg-emerald-500/10 text-emerald-300"
              : origin === "respaldo"
              ? "bg-amber-500/10 text-amber-300"
              : "bg-neutral-800 text-neutral-400")
          }
        >
          {origin === "db" && "Datos de la base (Supabase)"}
          {origin === "respaldo" &&
            `Mostrando datos de respaldo (${reason ?? "sin conexión"}). Las notas no se pueden guardar.`}
          {origin === "cargando" && "Cargando…"}
        </p>
      </header>

      <section aria-labelledby="ej" className="space-y-4">
        <h2 id="ej" className="text-lg font-medium">Casos globales ({by("example").length})</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {by("example").map((e) => <Card key={e.id} e={e} />)}
        </div>
      </section>

      <section aria-labelledby="mx" className="space-y-4">
        <h2 id="mx" className="text-lg font-medium">México y CDMX ({by("mexico").length})</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {by("mexico").map((e) => <Card key={e.id} e={e} />)}
        </div>
      </section>

      <section aria-labelledby="cp" className="space-y-4">
        <h2 id="cp" className="text-lg font-medium">Competidores</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            aria-label="Buscar competidor"
            placeholder="Buscar (nombre, región, precio)…"
            value={filter.query}
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
            className={input}
          />
          <select
            aria-label="Filtrar por cámara"
            value={filter.camera}
            onChange={(e) => setFilter({ ...filter, camera: e.target.value as CompetitorFilter["camera"] })}
            className={input}
          >
            <option value="todas">Cámara: todas</option>
            <option value="no">Sin cámara</option>
            <option value="opcional">Cámara opcional</option>
          </select>
          <select
            aria-label="Filtrar por estado"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value as CompetitorFilter["status"] })}
            className={input}
          >
            <option value="todos">Estado: todos</option>
            <option value="activo">Activo</option>
            <option value="descontinuado">Descontinuado</option>
          </select>
        </div>
        <p aria-live="polite" data-testid="competitor-counter" className="text-sm text-neutral-400">
          {counterLabel(shown.length, competitors.length)}
        </p>
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-800 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="p-3">Producto</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Cámara</th>
                <th className="p-3">Región</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Fuente</th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr><td colSpan={6} className="p-4 text-neutral-500">Ningún competidor coincide.</td></tr>
              )}
              {shown.map((e) => (
                <tr key={e.id} className="border-b border-neutral-900 align-top">
                  <td className="p-3">
                    <p className="font-medium">{e.title}</p>
                    <p className="mt-1 max-w-xs text-xs text-neutral-500">{e.summary}</p>
                  </td>
                  <td className="p-3 text-neutral-300">{String(e.data.price ?? "—")}</td>
                  <td className="p-3 text-neutral-300">{String(e.data.camera ?? "—")}</td>
                  <td className="p-3 text-neutral-300">{String(e.data.region ?? "—")}</td>
                  <td className="p-3 text-neutral-300">{String(e.data.status ?? "—")}</td>
                  <td className="space-y-1 p-3"><Source e={e} /><div><Conf c={e.confidence} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-500">
          Verisure, Prosegur y ADT en México: precios no verificados, por eso no están en la tabla.
        </p>
      </section>

      <section aria-labelledby="rk" className="space-y-4">
        <h2 id="rk" className="text-lg font-medium">Mapa de riesgos</h2>
        <div className="grid gap-6 md:grid-cols-[auto_1fr]">
          <div>
            <div className="flex gap-2">
              <p className="[writing-mode:vertical-rl] rotate-180 text-xs text-neutral-500">
                Impacto →
              </p>
              <div
                role="img"
                aria-label="Mapa de riesgos: probabilidad contra impacto, con números que corresponden a la lista"
                className="grid grid-cols-5 gap-1"
              >
                {[5, 4, 3, 2, 1].flatMap((imp) =>
                  [1, 2, 3, 4, 5].map((lik) => {
                    const here = risks
                      .map((r, i) => ({ r, n: i + 1 }))
                      .filter(({ r }) => Number(r.data.impact) === imp && Number(r.data.likelihood) === lik);
                    const lvl = riskLevel(lik * imp);
                    return (
                      <div
                        key={`${imp}-${lik}`}
                        className={
                          "flex h-12 w-12 flex-wrap items-center justify-center gap-0.5 rounded text-[11px] font-medium " +
                          (lvl === "alto"
                            ? "bg-red-500/20"
                            : lvl === "medio"
                            ? "bg-amber-500/15"
                            : "bg-emerald-500/10")
                        }
                      >
                        {here.map(({ n }) => (
                          <span key={n} className="rounded-full bg-neutral-100 px-1.5 text-neutral-900">
                            {n}
                          </span>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <p className="mt-1 text-center text-xs text-neutral-500">Probabilidad →</p>
          </div>
          <ol className="space-y-3">
            {risks.map((r, i) => (
              <li key={r.id} className="rounded-xl border border-neutral-800 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-neutral-100 px-2 text-xs font-medium text-neutral-900">{i + 1}</span>
                  <h3 className="font-medium">{r.title}</h3>
                  <span className="text-xs text-neutral-500">
                    puntaje {riskScore(r)} ({riskLevel(riskScore(r))})
                  </span>
                  <Conf c={r.confidence} />
                </div>
                <p className="mt-2 text-sm text-neutral-300">{r.summary}</p>
                <p className="mt-2 text-sm text-amber-200/90">Mitigación: {String(r.data.mitigation ?? "—")}</p>
                <div className="mt-2"><Source e={r} /></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="nt" className="space-y-4">
        <h2 id="nt" className="text-lg font-medium">Mis notas de investigación ({notes.length})</h2>
        <form onSubmit={saveNote} className="space-y-3 rounded-xl border border-neutral-800 p-4">
          <input aria-label="Título" placeholder="Título" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} />
          <textarea aria-label="Resumen" placeholder="Qué aprendiste (mín. 10 caracteres)" rows={3}
            value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className={input} />
          <div className="grid gap-3 sm:grid-cols-3">
            <input aria-label="Nombre de la fuente" placeholder="Fuente (nombre)" value={form.source_label}
              onChange={(e) => setForm({ ...form, source_label: e.target.value })} className={input} />
            <input aria-label="Enlace de la fuente" placeholder="https://…" value={form.source_url}
              onChange={(e) => setForm({ ...form, source_url: e.target.value })} className={input} />
            <select aria-label="Confianza" value={form.confidence}
              onChange={(e) => setForm({ ...form, confidence: e.target.value as Confidence })} className={input}>
              <option value="alta">Confianza alta</option>
              <option value="media">Confianza media</option>
              <option value="baja">Confianza baja</option>
            </select>
          </div>
          {errors.length > 0 && (
            <ul role="alert" className="space-y-1 text-sm text-red-400">
              {errors.map((m) => <li key={m}>{m}</li>)}
            </ul>
          )}
          {saveMsg && <p role="status" className="text-sm text-emerald-300">{saveMsg}</p>}
          <button type="submit"
            className="rounded-lg bg-neutral-100 px-5 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white">
            Guardar nota
          </button>
        </form>
        {notes.length === 0 ? (
          <p className="text-sm text-neutral-500">Aún no hay notas guardadas.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="relative">
                <Card e={n} />
                <button onClick={() => removeNote(n.id)}
                  className="absolute right-3 top-3 text-xs text-neutral-500 hover:text-red-400">
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
