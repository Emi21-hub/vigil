import { SEGMENTS, FEATURES, TIERS } from "@/lib/productData";

export default function ProductMap() {
  const protos = FEATURES.filter((f) => f.status === "Prototipo").length;
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">Producto</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          Para quién es Vigil y qué hace hoy. Los segmentos son hipótesis por validar; el estado de
          cada función dice la verdad: {protos} de {FEATURES.length} existen como prototipo.
        </p>
      </header>

      <section aria-labelledby="seg" className="space-y-4">
        <h2 id="seg" className="text-lg font-medium">Dos segmentos (hipótesis)</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {SEGMENTS.map((s) => (
            <article key={s.id} className="rounded-xl border border-neutral-800 p-4">
              <h3 className="font-medium">{s.name}</h3>
              <p className="mt-2 text-sm text-neutral-300">{s.who}</p>
              <p className="mt-2 text-sm text-neutral-400"><span className="text-neutral-200">Problema: </span>{s.problem}</p>
              <p className="mt-2 text-sm text-neutral-400"><span className="text-neutral-200">Hipótesis: </span>{s.hypothesis}</p>
              <p className="mt-2 text-sm text-amber-200/90">Cómo se validaría: {s.validation}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="map" className="space-y-4">
        <h2 id="map" className="text-lg font-medium">Mapa de funciones por plan</h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-800 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="p-3">Función</th>
                <th className="p-3">Estado</th>
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
                    <span className={"rounded px-1.5 py-0.5 text-[11px] font-medium " + (f.status === "Prototipo" ? "bg-emerald-500/15 text-emerald-300" : "bg-neutral-800 text-neutral-400")}>
                      {f.status}
                    </span>
                  </td>
                  {TIERS.map((t) => (
                    <td key={t.id} className="p-3 text-center text-neutral-300" aria-label={f.tiers.includes(t.id) ? "incluida" : "no incluida"}>
                      {f.tiers.includes(t.id) ? "●" : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-500">
          “Prototipo” = existe en el sitio en vivo. “Planeado” = no existe todavía. Los planes
          muestran dónde irían las funciones, no lo que hoy se puede contratar: hoy no se cobra nada.
        </p>
      </section>
    </div>
  );
}
