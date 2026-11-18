import { SEGMENTS, FEATURES, TIERS } from "@/lib/productData";

export default function ProductMap() {
  const protos = FEATURES.filter((f) => f.status === "Prototype").length;
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">Product</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          Who Vigil is for and what it does today. The segments are hypotheses to validate; each
          feature's status tells the truth: {protos} of {FEATURES.length} exist as a prototype.
        </p>
      </header>

      <section aria-labelledby="seg" className="space-y-4">
        <h2 id="seg" className="text-lg font-medium">Two segments (hypotheses)</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {SEGMENTS.map((s) => (
            <article key={s.id} className="rounded-xl border border-neutral-800 p-4">
              <h3 className="font-medium">{s.name}</h3>
              <p className="mt-2 text-sm text-neutral-300">{s.who}</p>
              <p className="mt-2 text-sm text-neutral-400"><span className="text-neutral-200">Problem: </span>{s.problem}</p>
              <p className="mt-2 text-sm text-neutral-400"><span className="text-neutral-200">Hypothesis: </span>{s.hypothesis}</p>
              <p className="mt-2 text-sm text-amber-200/90">How it would be validated: {s.validation}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="map" className="space-y-4">
        <h2 id="map" className="text-lg font-medium">Feature map by plan</h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-800 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="p-3">Feature</th>
                <th className="p-3">Status</th>
                {TIERS.map((t) => <th key={t.id} className="p-3 text-center">{t.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.id} className="border-b border-neutral-900 align-top">
                  <td className="p-3">
                    <p className="font-medium">{f.name}</p>
                    <p className="mt-1 max-w-sm text-xs text-neutral-500">{f.description}{f.note ? ` ${f.note}` : ""}</p>
                  </td>
                  <td className="p-3">
                    <span className={"rounded px-1.5 py-0.5 text-[11px] font-medium " + (f.status === "Prototype" ? "bg-emerald-500/15 text-emerald-300" : "bg-neutral-800 text-neutral-400")}>
                      {f.status}
                    </span>
                  </td>
                  {TIERS.map((t) => (
                    <td key={t.id} className="p-3 text-center text-neutral-300" aria-label={f.tiers.includes(t.id) ? "included" : "not included"}>
                      {f.tiers.includes(t.id) ? "●" : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-500">
          “Prototype” = exists on the live site. “Planned” = does not exist yet. The plans show
          where features would go, not what can be bought today: nothing is charged today.
        </p>
      </section>
    </div>
  );
}
