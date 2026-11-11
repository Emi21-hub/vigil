"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  MAX_CHARS, MAX_COMMENT, QUESTIONS, GUARDRAIL_REPLIES, handleTyped, needsHuman, recommend,
  cleanTester, validateComment, type Answers, type GuardrailType,
} from "@/lib/chatLogic";

type Msg = { role: "bot" | "user"; text: string };
type Stats = {
  total_chats: number; external_chats: number; flagged_chats: number; guardrail_chats: number;
  human_requests: number; external_ratings: number; avg_rating_external: number | null;
};

const withTimeout = <T,>(p: PromiseLike<T>, ms = 6000) =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("tiempo agotado")), ms))]);

const INTRO = "Soy un asesor basado en reglas, no una IA. Te hago 3 preguntas y te sugiero cómo armar tu cadena de avisos en Vigil. No escribas datos personales: no guardo lo que escribes, solo tus opciones.";
const DEFAULTS = { place: "otro", contacts: "uno_dos", concern: "no_se_a_quien" } as const;

function newId(): string {
  return crypto.randomUUID?.() ?? "00000000-0000-4000-8000-" + String(Date.now()).padStart(12, "0");
}

export default function ChatAssistant() {
  const [tester, setTester] = useState("");
  const [sessionId, setSessionId] = useState(newId);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: INTRO }, { role: "bot", text: QUESTIONS[0].text }]);
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [guardrails, setGuardrails] = useState<GuardrailType[]>([]);
  const [unknown, setUnknown] = useState(0);
  const [stepRetry, setStepRetry] = useState(0);
  const [text, setText] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved" | "failed">("idle");
  const [flag, setFlag] = useState<{ flag: boolean; reason: string | null }>({ flag: false, reason: null });
  const [humanMsg, setHumanMsg] = useState<string | null>(null);
  const [thumbs, setThumbs] = useState<"up" | "down" | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [fbMsg, setFbMsg] = useState<string | null>(null);
  const [fbErr, setFbErr] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsErr, setStatsErr] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setTester(cleanTester(new URLSearchParams(window.location.search).get("t"))); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "nearest" }); }, [msgs]);

  async function loadStats() {
    try {
      const { data, error } = await withTimeout(supabase.from("chat_stats").select("*").single());
      if (error) throw new Error(error.message);
      setStats(data as Stats); setStatsErr(null);
    } catch (e) { setStatsErr(e instanceof Error ? e.message : "error"); }
  }
  useEffect(() => { loadStats(); }, []);

  const rec = step === 3 && answers.place && answers.contacts && answers.concern ? recommend(answers as Answers) : null;

  async function finish(final: Answers, gr: GuardrailType[], unk: number) {
    const f = needsHuman(final, gr, unk);
    setFlag(f);
    try {
      const { error } = await withTimeout(supabase.from("chat_sessions").insert({
        id: sessionId, tester, place: final.place, contacts: final.contacts, concern: final.concern,
        guardrails: gr, needs_human: f.flag, human_reason: f.reason,
      }));
      if (error) throw new Error(error.message);
      setSaveState("saved"); loadStats();
    } catch { setSaveState("failed"); }
  }

  function advance(id: string, label: string, extra: Msg[] = [], unk = unknown, gr = guardrails) {
    const q = QUESTIONS[step];
    const next = { ...answers, [q.key]: id } as Partial<Answers>;
    setAnswers(next);
    const out: Msg[] = [...extra, { role: "user", text: label }];
    setStepRetry(0);
    if (step < 2) {
      out.push({ role: "bot", text: QUESTIONS[step + 1].text });
      setStep((step + 1) as 1 | 2);
      setMsgs((m) => [...m, ...out]);
    } else {
      out.push({ role: "bot", text: "Listo. Con esas respuestas, esto te sugiero:" });
      setStep(3);
      setMsgs((m) => [...m, ...out]);
      finish(next as Answers, gr, unk);
    }
  }

  function choose(id: string, label: string) { if (step < 3) advance(id, label); }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 3) return;
    const raw = text.trim().slice(0, MAX_CHARS);
    if (!raw) return;
    setText("");
    const r = handleTyped(step as 0 | 1 | 2, raw);
    if (r.kind === "guardrail") {
      const shown = r.type === "pii" ? "[mensaje no mostrado: parecía incluir datos personales]" : raw;
      const gr = guardrails.includes(r.type) ? guardrails : [...guardrails, r.type];
      setGuardrails(gr);
      setMsgs((m) => [...m, { role: "user", text: shown }, { role: "bot", text: r.reply }, { role: "bot", text: "Sigamos. " + QUESTIONS[step].text }]);
      return;
    }
    if (r.kind === "answer") {
      const opt = QUESTIONS[step].options.find((o) => o.id === r.id);
      advance(r.id, opt ? opt.label : raw);
      return;
    }
    const unk = unknown + 1;
    setUnknown(unk);
    if (stepRetry === 0) {
      setStepRetry(1);
      setMsgs((m) => [...m, { role: "user", text: raw }, { role: "bot", text: "No entendí esa respuesta. Elige una opción de abajo o escríbelo con otras palabras." }]);
    } else {
      const id = DEFAULTS[QUESTIONS[step].key];
      const opt = QUESTIONS[step].options.find((o) => o.id === id)!;
      advance(id, raw, [{ role: "bot", text: "Sigo sin entenderla, así que tomo una opción general: “" + opt.label + "”." }], unk);
    }
  }

  function startOver() {
    setSessionId(newId()); setMsgs([{ role: "bot", text: INTRO }, { role: "bot", text: QUESTIONS[0].text }]);
    setStep(0); setAnswers({}); setGuardrails([]); setUnknown(0); setStepRetry(0); setText("");
  }

  async function sendHuman() {
    try {
      const { error } = await withTimeout(supabase.from("chat_feedback").insert({ session_id: sessionId, wants_human: true }));
      if (error) throw new Error(error.message);
      setHumanMsg("Marcado. Una persona podría revisar esta conversación, pero no puedo prometer respuesta porque no guardo ningún contacto.");
      loadStats();
    } catch { setHumanMsg("No se pudo marcar (la conversación no se guardó o la base no responde)."); }
  }

  async function sendFeedback(e: React.FormEvent) {
    e.preventDefault();
    setFbMsg(null); setFbErr(null);
    const v = validateComment(comment);
    if (!v.ok) { setFbErr(v.error ?? "Comentario inválido."); return; }
    if (!thumbs && !rating && !comment.trim()) { setFbErr("Elige un pulgar, una calificación o escribe un comentario."); return; }
    try {
      const { error } = await withTimeout(supabase.from("chat_feedback").insert({
        session_id: sessionId, thumbs, rating, comment: comment.trim() || null,
      }));
      if (error) throw new Error(error.message);
      setFbMsg("Gracias, guardé tu opinión."); loadStats();
    } catch (err) { setFbErr("No se pudo guardar: " + (err instanceof Error ? err.message : "error")); }
  }

  const q = step < 3 ? QUESTIONS[step] : null;
  const btn = "rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:border-neutral-500";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">Asesor de Vigil</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">Asesor basado en reglas, no es IA. Te ayuda a pensar tu cadena de avisos. Es una demo estudiantil: no contacta a nadie ni a emergencias.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
        <section className="space-y-4" aria-label="Conversación">
          <div className="max-h-[28rem] space-y-2 overflow-y-auto rounded-xl border border-neutral-800 p-4" data-testid="log">
            {msgs.map((m, i) => (
              <p key={i} className={"max-w-[90%] rounded-lg px-3 py-2 text-sm " + (m.role === "bot" ? "bg-neutral-900 text-neutral-200" : "ml-auto bg-neutral-100 text-neutral-900")}>{m.text}</p>
            ))}
            <div ref={endRef} />
          </div>

          {q && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">{q.options.map((o) => <button key={o.id} onClick={() => choose(o.id, o.label)} className={btn}>{o.label}</button>)}</div>
              <form onSubmit={submit} className="flex gap-2">
                <input aria-label="Escribe tu respuesta" value={text} maxLength={MAX_CHARS} onChange={(e) => setText(e.target.value)} placeholder="O escríbelo aquí (máx. 200 caracteres)" className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600" />
                <button type="submit" className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white">Enviar</button>
              </form>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{text.length}/{MAX_CHARS}</span>
                {step >= 1 && <button onClick={startOver} className="underline hover:text-neutral-300">Empezar de nuevo</button>}
              </div>
            </div>
          )}

          {rec && (
            <article className="space-y-3 rounded-xl border border-neutral-800 p-4" data-testid="recommendation">
              <h2 className="text-lg font-medium">Tu cadena sugerida</h2>
              <ol className="space-y-2">{rec.ladder.map((l, i) => <li key={i} className={"rounded-lg border p-2 text-sm " + (i === 0 ? "border-amber-500/40 text-amber-300" : "border-neutral-700 text-neutral-300")}>{l}</li>)}</ol>
              <p className="text-sm text-neutral-300"><span className="font-medium">Plan: </span>{rec.plan}</p>
              <p className="text-sm text-neutral-300"><span className="font-medium">Consejo: </span>{rec.tip}</p>
              {rec.caveat && <p className="text-sm text-amber-300">{rec.caveat}</p>}
              <p className="text-xs text-neutral-500">Confianza de esta sugerencia: {rec.confidence}. Reglas fijas, no IA.</p>
              {saveState === "failed" && <p role="status" className="text-sm text-amber-300">No se pudo guardar la conversación, pero tu sugerencia sigue aquí.</p>}
              {saveState === "saved" && <p role="status" className="text-xs text-neutral-500">Conversación guardada sin nombre ni texto libre.</p>}
              <button onClick={startOver} className={btn}>Empezar de nuevo</button>
            </article>
          )}

          {rec && (
            <section className="space-y-2 rounded-xl border border-neutral-800 p-4" aria-label="Revisión humana">
              <h2 className="text-lg font-medium">Revisión humana</h2>
              {flag.flag && <p className="text-sm text-amber-300" data-testid="flagged">Esta conversación quedó marcada para revisión: {flag.reason}.</p>}
              <p className="text-sm text-neutral-400">Si algo no te convence, puedes marcarla. No guardo contactos, así que no puedo prometer una respuesta.</p>
              <button onClick={sendHuman} className={btn}>Marcar para revisión humana</button>
              {humanMsg && <p role="status" className="text-sm text-neutral-300">{humanMsg}</p>}
            </section>
          )}

          {rec && (
            <form onSubmit={sendFeedback} className="space-y-3 rounded-xl border border-neutral-800 p-4" aria-label="Opinión">
              <h2 className="text-lg font-medium">¿Te sirvió?</h2>
              <div className="flex flex-wrap items-center gap-2">
                {(["up", "down"] as const).map((t) => <button type="button" key={t} aria-pressed={thumbs === t} onClick={() => setThumbs(t)} className={btn + (thumbs === t ? " bg-neutral-100 text-neutral-900" : "")}>{t === "up" ? "👍 Sí" : "👎 No"}</button>)}
                <span className="mx-2 text-neutral-700">|</span>
                {[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} aria-pressed={rating === n} aria-label={`Calificar ${n} de 5`} onClick={() => setRating(n)} className={btn + (rating === n ? " bg-neutral-100 text-neutral-900" : "")}>{n}</button>)}
              </div>
              <textarea aria-label="Comentario opcional" value={comment} maxLength={MAX_COMMENT} onChange={(e) => setComment(e.target.value)} placeholder="Comentario opcional (máx. 280, sin datos personales)" className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600" rows={2} />
              <button type="submit" className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white">Enviar opinión</button>
              {fbErr && <p role="alert" className="text-sm text-red-400">{fbErr}</p>}
              {fbMsg && <p role="status" className="text-sm text-emerald-300">{fbMsg}</p>}
            </form>
          )}
        </section>

        <aside className="space-y-4" aria-label="Información">
          <div className="rounded-xl border border-neutral-800 p-4 text-sm">
            <h2 className="font-medium">Qué se guarda</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-400">
              <li>Solo tus 3 opciones elegidas, qué filtros se activaron y si quedó marcada.</li>
              <li>Nunca el texto que escribes, ni nombres, ni contactos.</li>
              <li>Tu calificación y comentario opcional (sin datos personales).</li>
              <li>Nadie puede leer las conversaciones desde esta página: solo se escriben.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-neutral-800 p-4 text-sm">
            <h2 className="font-medium">Cómo decide</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-400">
              <li>Reglas fijas por palabras clave. Si no entiende, te lo dice y lo intenta una vez más.</li>
              <li>Filtros: datos personales, emergencias, insultos, consejos médicos/legales/financieros, compras o precios y temas ajenos.</li>
              <li>Se marca para revisión si preguntas por compra o precio, si eliges vehículo (aún no existe) o si no entiende dos veces.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-neutral-800 p-4 text-sm" data-testid="stats">
            <h2 className="font-medium">Totales en vivo</h2>
            {statsErr ? <p className="mt-2 text-amber-300">No disponibles ({statsErr}). El asesor sigue funcionando.</p> : !stats ? <p className="mt-2 text-neutral-500">Cargando…</p> : (
              <dl className="mt-2 grid grid-cols-2 gap-1 text-neutral-400">
                <dt>Conversaciones</dt><dd className="tabular-nums text-neutral-200">{stats.total_chats}</dd>
                <dt>De usuarios externos</dt><dd className="tabular-nums text-neutral-200">{stats.external_chats}</dd>
                <dt>Marcadas</dt><dd className="tabular-nums text-neutral-200">{stats.flagged_chats}</dd>
                <dt>Con filtros activados</dt><dd className="tabular-nums text-neutral-200">{stats.guardrail_chats}</dd>
                <dt>Pidieron humano</dt><dd className="tabular-nums text-neutral-200">{stats.human_requests}</dd>
                <dt>Calificación externa</dt><dd className="tabular-nums text-neutral-200">{stats.avg_rating_external ?? "—"} ({stats.external_ratings})</dd>
              </dl>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
