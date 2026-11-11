"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { EXPERIMENTS, pickVariant, type TestId, type Variant } from "@/lib/abTesting";

// Cada visitante recibe una variante estable por prueba. La vista se registra solo
// despues de la primera interaccion (asi los chequeos automaticos no cuentan como visitantes),
// y cada vista y clic se registra una sola vez por visitante.

function safeGet(k: string): string | null {
  try { return window.localStorage.getItem(k); } catch { return null; }
}
function safeSet(k: string, v: string) {
  try { window.localStorage.setItem(k, v); } catch { /* sin almacenamiento: no pasa nada */ }
}

function visitorId(): string {
  let id = safeGet("vigil_vid");
  if (!id) {
    id = (crypto.randomUUID?.() ?? String(Math.random()).slice(2) + Date.now()).replace(/-/g, "");
    safeSet("vigil_vid", id);
  }
  return id;
}

function variantFor(test: TestId): Variant {
  const stored = safeGet(`vigil_ab_${test}`);
  if (stored === "A" || stored === "B") return stored;
  const v = pickVariant(Math.random());
  safeSet(`vigil_ab_${test}`, v);
  return v;
}

async function log(test: TestId, variant: Variant, event: "view" | "click", isTest: boolean) {
  const flag = `vigil_logged_${test}_${event}`;
  if (safeGet(flag)) return;
  safeSet(flag, "1");
  await supabase.from("ab_events").insert({
    test_id: test, variant, event, visitor_id: visitorId(), is_test: isTest,
  });
}

const STEPS = [
  { n: "Nivel 1", t: "Tú", d: "0 s", c: "border-amber-500/40 text-amber-300" },
  { n: "Nivel 2", t: "Contactos de confianza", d: "60 s (demo)", c: "border-neutral-700 text-neutral-300" },
  { n: "Nivel 3", t: "Entrega a una persona", d: "120 s (demo)", c: "border-neutral-700 text-neutral-300" },
];

export default function AbHero() {
  const [v, setV] = useState<{ headline: Variant; button: Variant } | null>(null);
  const isTest = useRef(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("ab_test") === "1") safeSet("vigil_is_test", "1");
    isTest.current = safeGet("vigil_is_test") === "1";
    const assigned = { headline: variantFor("headline"), button: variantFor("button") };
    setV(assigned);

    const onFirst = () => {
      cleanup();
      log("headline", assigned.headline, "view", isTest.current);
      log("button", assigned.button, "view", isTest.current);
    };
    const evs = ["scroll", "mousemove", "touchstart", "keydown"] as const;
    const cleanup = () => evs.forEach((e) => window.removeEventListener(e, onFirst));
    evs.forEach((e) => window.addEventListener(e, onFirst, { passive: true }));
    return cleanup;
  }, []);

  function onCta() {
    if (v) {
      log("headline", v.headline, "click", isTest.current);
      log("button", v.button, "click", isTest.current);
    }
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="grid items-center gap-10 py-4 md:grid-cols-2">
      <div>
        <p className="mb-3 inline-block rounded-full border border-neutral-800 px-3 py-1 text-xs text-neutral-400">
          Acceso anticipado · demo estudiantil
        </p>
        {/* oculto hasta conocer la variante, para que nadie vea A y luego B */}
        <h1 className="text-3xl font-medium tracking-tight md:text-4xl" style={{ visibility: v ? "visible" : "hidden" }}>
          {v ? EXPERIMENTS.headline[v.headline] : EXPERIMENTS.headline.A}
        </h1>
        <p className="mt-4 max-w-md text-neutral-400">
          Vigil avisa primero a ti, luego a tus contactos de confianza y al final entrega el aviso a
          una persona. No graba tu casa.
        </p>
        <button
          onClick={onCta}
          style={{ visibility: v ? "visible" : "hidden" }}
          className="mt-6 rounded-lg bg-neutral-100 px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-white"
        >
          {v ? EXPERIMENTS.button[v.button] : EXPERIMENTS.button.A}
        </button>
        <p className="mt-3 text-xs text-neutral-600">Los avisos son simulados. Vigil no contacta servicios de emergencia.</p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5" aria-label="Ejemplo de la escalera de aviso">
        <p className="mb-3 text-xs uppercase tracking-wide text-neutral-500">Así sube un aviso</p>
        <ol className="space-y-3">
          {STEPS.map((s) => (
            <li key={s.n} className={"rounded-lg border p-3 " + s.c}>
              <span className="text-xs opacity-70">{s.n} · {s.d}</span>
              <p className="font-medium">{s.t}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
