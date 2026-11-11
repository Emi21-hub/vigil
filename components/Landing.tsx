import Link from "next/link";
import { FEATURES, TIERS } from "@/lib/productData";

const FAQ = [
  { q: "¿Usa cámaras?", a: "No. Vigil no graba imagen ni audio de tu casa. Guarda qué pasó, cuándo y a quién se avisó." },
  { q: "¿Los avisos son reales?", a: "Todavía no. Hoy cada aviso es una fila etiquetada como simulada. El envío real por SMS o llamada es un plan, no algo que exista." },
  { q: "¿Llama a la policía o a emergencias?", a: "No. Vigil no contacta servicios de emergencia automáticamente. El nivel 3 entrega el aviso a una persona." },
  { q: "¿Cuánto cuesta?", a: "Hoy no cobra nada. Los planes de abajo son una hipótesis de precios, no una oferta." },
  { q: "¿Mis datos están seguros?", a: "Es una demo: la base de datos está abierta a propósito y no debes escribir datos personales reales. Cuentas privadas están planeadas." },
];

export function HowItWorks() {
  const steps = [
    ["1", "Armas tu propiedad", "Un clic. El estado queda guardado aunque recargues."],
    ["2", "El aviso sube por la escalera", "Primero tú, luego tus contactos de confianza, luego una persona."],
    ["3", "Alguien responde", "El incidente queda en el historial con su tiempo de respuesta."],
  ];
  return (
    <section aria-labelledby="how" className="space-y-4">
      <h2 id="how" className="text-lg font-medium">Cómo funciona</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {steps.map(([n, t, d]) => (
          <article key={n} className="rounded-xl border border-neutral-800 p-4">
            <span className="text-xs text-amber-300">Paso {n}</span>
            <h3 className="mt-1 font-medium">{t}</h3>
            <p className="mt-1 text-sm text-neutral-400">{d}</p>
          </article>
        ))}
      </div>
      <p className="text-sm text-neutral-500">
        Conoce más: <Link className="underline" href="/product">producto</Link> ·{" "}
        <Link className="underline" href="/research">investigación</Link> ·{" "}
        <Link className="underline" href="/pricing">precios</Link> ·{" "}
        <Link className="underline" href="/marketing">marketing</Link>
      </p>
    </section>
  );
}

export function PlansSection() {
  const live = FEATURES.filter((f) => f.status === "Prototipo").length;
  return (
    <section aria-labelledby="plans" className="space-y-4">
      <h2 id="plans" className="text-lg font-medium">Planes</h2>
      <p className="text-sm text-neutral-400">
        Hoy todo es gratis y es un prototipo: {live} de {FEATURES.length} funciones existen. Los planes de pago son una idea.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {TIERS.map((t) => (
          <article key={t.id} className="rounded-xl border border-neutral-800 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t.name}</h3>
              <span className={"rounded-full px-2 py-0.5 text-xs " + (t.id === "gratis" ? "bg-emerald-500/15 text-emerald-300" : "bg-neutral-800 text-neutral-400")}>
                {t.id === "gratis" ? "Disponible hoy" : "Planeado"}
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-300">{t.pitch}</p>
            <p className="mt-1 text-xs text-neutral-500">{t.limit}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section aria-labelledby="faq" className="space-y-3">
      <h2 id="faq" className="text-lg font-medium">Preguntas frecuentes</h2>
      <div className="space-y-2">
        {FAQ.map((f) => (
          <details key={f.q} className="rounded-xl border border-neutral-800 p-4">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-2 text-sm text-neutral-400">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
