import Link from "next/link";
import { FEATURES, TIERS } from "@/lib/productData";

const FAQ = [
  { q: "Does it use cameras?", a: "No. Vigil does not record images or audio of your home. It keeps what happened, when, and who was notified." },
  { q: "Are the alerts real?", a: "Not yet. Today each alert is a row labelled as simulated. Real SMS or phone-call delivery is a plan, not something that exists." },
  { q: "Does it call the police or emergency services?", a: "No. Vigil does not contact emergency services automatically. Level 3 hands the alert to a person." },
  { q: "How much does it cost?", a: "Today it charges nothing. The plans below are a pricing hypothesis, not an offer." },
  { q: "Is my data safe?", a: "It is a demo: the database is open on purpose and you must not enter real personal data. Private accounts are planned." },
];

export function HowItWorks() {
  const steps = [
    ["1", "You arm your property", "One click. The state is saved even if you reload."],
    ["2", "The alert climbs the ladder", "First you, then your trusted contacts, then a person."],
    ["3", "Someone responds", "The incident is kept in the history with its response time."],
  ];
  return (
    <section aria-labelledby="how" className="space-y-4">
      <h2 id="how" className="text-lg font-medium">How it works</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {steps.map(([n, t, d]) => (
          <article key={n} className="rounded-xl border border-neutral-800 p-4">
            <span className="text-xs text-amber-300">Step {n}</span>
            <h3 className="mt-1 font-medium">{t}</h3>
            <p className="mt-1 text-sm text-neutral-400">{d}</p>
          </article>
        ))}
      </div>
      <p className="text-sm text-neutral-500">
        Learn more: <Link className="underline" href="/product">product</Link> ·{" "}
        <Link className="underline" href="/research">research</Link> ·{" "}
        <Link className="underline" href="/pricing">pricing</Link> ·{" "}
        <Link className="underline" href="/marketing">marketing</Link> ·{" "}
        <Link className="underline" href="/chat">advisor</Link>
      </p>
    </section>
  );
}

export function PlansSection() {
  const live = FEATURES.filter((f) => f.status === "Prototype").length;
  return (
    <section aria-labelledby="plans" className="space-y-4">
      <h2 id="plans" className="text-lg font-medium">Plans</h2>
      <p className="text-sm text-neutral-400">
        Today everything is free and a prototype: {live} of {FEATURES.length} features exist. The paid plans are an idea.
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {TIERS.map((t) => (
          <article key={t.id} className="rounded-xl border border-neutral-800 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t.name}</h3>
              <span className={"rounded-full px-2 py-0.5 text-xs " + (t.id === "gratis" ? "bg-emerald-500/15 text-emerald-300" : "bg-neutral-800 text-neutral-400")}>
                {t.id === "gratis" ? "Available today" : "Planned"}
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
      <h2 id="faq" className="text-lg font-medium">Frequently asked questions</h2>
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
