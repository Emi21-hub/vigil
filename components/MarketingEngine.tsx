"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { copyText, downloadFile } from "@/lib/browserTools";
import { cardToMarkdown, packMarkdown, scoreHeadline, slug, type Card } from "@/lib/marketingEngine";
import { ALL_CARDS, BRAND_CARD, CALENDAR_CARD, LANDING_CARD, PERSONA_CARD, POSTS, SCRIPTS } from "@/lib/marketingContent";
import { EXPERIMENTS, MIN_VIEWS, percent, summarize, type AbEvent, type TestId } from "@/lib/abTesting";

type Saved = { id: string; asset_type: string; title: string; content: string; created_at: string };

const withTimeout = <T,>(p: PromiseLike<T>, ms = 6000) =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("tiempo agotado")), ms))]);

function ContentCard({ card, onSaved }: { card: Card; onSaved: (msg: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<string | null>(null);

  async function copy() {
    const ok = await copyText(card.text);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 1500);
  }
  async function save() {
    setState(null);
    try {
      const { error } = await withTimeout(
        supabase.from("marketing_assets").insert({ asset_type: card.kind, title: card.title, content: card.text })
      );
      if (error) throw new Error(error.message);
      setState("Guardado en tus assets.");
      onSaved(card.title);
    } catch (e) {
      setState("No se pudo guardar: " + (e instanceof Error ? e.message : "error"));
    }
  }

  return (
    <article className="rounded-xl border border-neutral-800 p-4" data-card={card.id}>
      <h3 className="font-medium">{card.title}</h3>
      <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-neutral-300">{card.text}</pre>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button onClick={copy} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs hover:border-neutral-500">{copied ? "Copiado" : "Copiar"}</button>
        <button onClick={() => downloadFile(`${slug(card.title)}.md`, cardToMarkdown(card))} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs hover:border-neutral-500">Exportar .md</button>
        <button onClick={save} className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-white">Guardar</button>
        {state && <span role="status" className="text-xs text-neutral-400">{state}</span>}
      </div>
    </article>
  );
}

function AbResults() {
  const [events, setEvents] = useState<AbEvent[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await withTimeout(
          supabase.from("ab_events").select("test_id, variant, event, visitor_id, is_test").limit(5000)
        );
        if (error) throw new Error(error.message);
        setEvents((data ?? []) as AbEvent[]);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "error");
      }
    })();
  }, []);

  if (err) return <p className="text-sm text-amber-300">Los resultados A/B no están disponibles ({err}). El contenido de arriba sí funciona.</p>;
  if (!events) return <p className="text-sm text-neutral-500">Cargando resultados…</p>;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {(["headline", "button"] as TestId[]).map((t) => {
        const s = summarize(events, t);
        return (
          <article key={t} className="rounded-xl border border-neutral-800 p-4" data-testid={`ab-${t}`}>
            <h3 className="font-medium">{EXPERIMENTS[t].label}</h3>
            {(["A", "B"] as const).map((v) => (
              <p key={v} className="mt-2 text-sm text-neutral-300">
                <span className="font-medium">{v}:</span> “{EXPERIMENTS[t][v]}” · {s[v].views} vistas · {s[v].clicks} clics · {percent(s[v].rate)}
              </p>
            ))}
            <p className="mt-2 text-xs text-neutral-500">{s.note}</p>
          </article>
        );
      })}
    </div>
  );
}

function Scorer() {
  const [text, setText] = useState(EXPERIMENTS.headline.A);
  const r = scoreHeadline(text);
  return (
    <section className="space-y-2 rounded-xl border border-neutral-800 p-4">
      <h3 className="font-medium">Puntuador de titulares (simulado)</h3>
      <p className="text-xs text-neutral-500">Reglas fijas, no es IA. Sirve para pensar un titular, no para decidir: decide el A/B real.</p>
      <input aria-label="Titular a evaluar" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600" />
      <p className="text-2xl tabular-nums" data-testid="score">{r.score}<span className="text-sm text-neutral-500"> / 100</span></p>
      <ul className="text-xs text-neutral-400">{r.reasons.map((x) => <li key={x}>{x}</li>)}</ul>
    </section>
  );
}

function SavedAssets({ refreshKey }: { refreshKey: number }) {
  const [rows, setRows] = useState<Saved[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  async function load() {
    try {
      const { data, error } = await withTimeout(
        supabase.from("marketing_assets").select("id, asset_type, title, content, created_at").order("created_at", { ascending: false })
      );
      if (error) throw new Error(error.message);
      setRows((data ?? []) as Saved[]);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "error");
    }
  }
  useEffect(() => { load(); }, [refreshKey]);
  async function remove(id: string) {
    await supabase.from("marketing_assets").delete().eq("id", id);
    await load();
  }

  if (err) return <p className="text-sm text-amber-300">Los assets guardados no están disponibles ({err}).</p>;
  if (!rows) return <p className="text-sm text-neutral-500">Cargando…</p>;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium">Guardados ({rows.length})</h3>
        {rows.length > 0 && (
          <button onClick={() => downloadFile("vigil-assets-guardados.md", packMarkdown(rows.map((r) => ({ id: r.id, kind: r.asset_type as Card["kind"], title: r.title, text: r.content }))))} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs hover:border-neutral-500">Exportar todos los guardados</button>
        )}
      </div>
      {rows.length === 0 ? <p className="text-sm text-neutral-500">Aún no hay assets guardados.</p> : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-800 p-3 text-sm">
              <span className="font-medium">{r.title}</span>
              <span className="flex gap-3">
                <button onClick={() => copyText(r.content)} className="text-xs text-neutral-400 hover:text-neutral-100">Copiar</button>
                <button onClick={() => remove(r.id)} className="text-xs text-neutral-500 hover:text-red-400">Quitar</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MarketingEngine() {
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((n) => n + 1);
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">Marketing</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          Todo el contenido sale de plantillas con datos reales del producto. No es contenido de IA y no hay testimonios ni cifras de usuarios.
        </p>
        <button onClick={() => downloadFile("vigil-paquete-de-contenido.md", packMarkdown(ALL_CARDS))} className="mt-3 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs hover:border-neutral-500">Exportar paquete completo</button>
      </header>

      <section className="space-y-3"><h2 className="text-lg font-medium">Marca y persona</h2>
        <div className="grid gap-3 md:grid-cols-2">{[BRAND_CARD, PERSONA_CARD].map((c) => <ContentCard key={c.id} card={c} onSaved={bump} />)}</div></section>
      <section className="space-y-3"><h2 className="text-lg font-medium">Copy de la página de inicio</h2><ContentCard card={LANDING_CARD} onSaved={bump} /></section>
      <section className="space-y-3"><h2 className="text-lg font-medium">10 posts</h2>
        <div className="grid gap-3 md:grid-cols-2">{POSTS.map((c) => <ContentCard key={c.id} card={c} onSaved={bump} />)}</div></section>
      <section className="space-y-3"><h2 className="text-lg font-medium">3 guiones de video</h2>
        <div className="grid gap-3 md:grid-cols-2">{SCRIPTS.map((c) => <ContentCard key={c.id} card={c} onSaved={bump} />)}</div></section>
      <section className="space-y-3"><h2 className="text-lg font-medium">Calendario de 14 días</h2><ContentCard card={CALENDAR_CARD} onSaved={bump} /></section>

      <section className="space-y-3"><h2 className="text-lg font-medium">Pruebas A/B en vivo (solo visitantes reales)</h2>
        <p className="text-sm text-neutral-400">Cada visitante cuenta una vez; las sesiones de prueba no cuentan; no se nombra líder hasta tener {MIN_VIEWS} vistas por variante.</p>
        <AbResults /><Scorer /></section>

      <section className="space-y-3"><h2 className="text-lg font-medium">Assets guardados</h2><SavedAssets refreshKey={refresh} /></section>
    </div>
  );
}
