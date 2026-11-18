"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TIERS } from "@/lib/productData";
import {
  ASSUMPTIONS, DEFAULT_INPUTS, annualPrice, calculate, validateScenario,
  type Inputs, type Results,
} from "@/lib/pricingEngine";

type Saved = { id: string; name: string; inputs: Inputs; results: Results; created_at: string };

const mxn = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export default function PricingCalculator() {
  const [inp, setInp] = useState<Inputs>(DEFAULT_INPUTS);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [dbOk, setDbOk] = useState<boolean | null>(null);

  const res = calculate(inp);

  async function load() {
    const { data, error } = await supabase
      .from("pricing_scenarios")
      .select("id, name, inputs, results, created_at")
      .order("created_at", { ascending: false });
    if (error) { setDbOk(false); return; }
    setDbOk(true);
    setSaved((data ?? []) as Saved[]);
  }
  useEffect(() => { load(); }, []);

  const num = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInp({ ...inp, [k]: e.target.value === "" ? NaN : Number(e.target.value) });

  async function save(ev: React.FormEvent) {
    ev.preventDefault();
    setMsg(null);
    const errs = validateScenario({ name, inputs: inp });
    setErrors(errs);
    if (errs.length) return;
    const { error } = await supabase.from("pricing_scenarios").insert({ name: name.trim(), inputs: inp, results: res });
    if (error) { setErrors([error.message]); return; }
    setName(""); setMsg("Scenario saved."); await load();
  }

  async function remove(id: string) {
    await supabase.from("pricing_scenarios").delete().eq("id", id);
    await load();
  }

  const field = "w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600";
  const numField = ({ label, k, suffix }: { label: string; k: keyof Inputs; suffix?: string }) => (
    <label className="block text-sm text-neutral-400">
      {label}{suffix ? ` (${suffix})` : ""}
      <input type="number" inputMode="decimal" value={Number.isNaN(inp[k] as number) ? "" : (inp[k] as number)} onChange={num(k)} className={field + " mt-1"} />
    </label>
  );

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">Pricing</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          Today Vigil charges nothing. These prices and percentages are hypotheses to think through
          the business model, not measurements or offers.
        </p>
      </header>

      <section aria-labelledby="pl" className="space-y-4">
        <h2 id="pl" className="text-lg font-medium">Proposed plans</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {TIERS.map((t) => (
            <article key={t.id} className="rounded-xl border border-neutral-800 p-4">
              <h3 className="font-medium">{t.name}</h3>
              <p className="mt-2 text-2xl tabular-nums">{t.monthlyMXN === 0 ? "Free" : mxn(t.monthlyMXN)}<span className="text-sm text-neutral-500">{t.monthlyMXN === 0 ? "" : " / month"}</span></p>
              {t.monthlyMXN > 0 && <p className="text-xs text-neutral-500">or {mxn(annualPrice(t.monthlyMXN))} / year (2 months free)</p>}
              <p className="mt-3 text-sm text-neutral-300">{t.pitch}</p>
              <p className="mt-2 text-xs text-neutral-500">{t.limit}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="calc" className="space-y-4">
        <h2 id="calc" className="text-lg font-medium">Revenue calculator</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-neutral-800 p-4">
            {numField({ label: "Free signups", k: "signups" })}
            {numField({ label: "Move to a paid plan", k: "paidPct", suffix: "%" })}
            {numField({ label: "Of those who pay, choose Plus", k: "plusSharePct", suffix: "%" })}
            {numField({ label: "Monthly churn", k: "churnPct", suffix: "%" })}
            {numField({ label: "Plus price", k: "plusPrice", suffix: "MXN / month" })}
            {numField({ label: "Family price", k: "familiaPrice", suffix: "MXN / month" })}
            <div role="group" aria-label="Billing" className="flex gap-2 pt-1">
              {(["mensual", "anual"] as const).map((b) => (
                <button key={b} type="button" aria-pressed={inp.billing === b} onClick={() => setInp({ ...inp, billing: b })}
                  className={"rounded-lg px-4 py-2 text-sm font-medium transition " + (inp.billing === b ? "bg-neutral-100 text-neutral-900" : "border border-neutral-800 text-neutral-400 hover:text-neutral-100")}>
                  {b === "mensual" ? "Monthly" : "Annual"}
                </button>
              ))}
            </div>
          </div>

          <div aria-live="polite" data-testid="results" className="space-y-3 rounded-xl border border-neutral-800 p-4">
            <p className="text-sm text-neutral-400">Result with these assumptions</p>
            <p className="text-3xl tabular-nums" data-testid="mrr">{mxn(res.mrr)}<span className="text-sm text-neutral-500"> / month</span></p>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-neutral-500">Annualized</dt><dd data-testid="arr" className="tabular-nums">{mxn(res.arr)}</dd>
              <dt className="text-neutral-500">Paying customers</dt><dd className="tabular-nums">{res.paidUsers} ({res.plusUsers} Plus · {res.familiaUsers} Family)</dd>
              <dt className="text-neutral-500">Revenue per customer</dt><dd className="tabular-nums">{mxn(res.arpu)} / month</dd>
              <dt className="text-neutral-500">Lifetime value (LTV)</dt><dd className="tabular-nums">{res.ltv === null ? "no churn: undefined" : mxn(res.ltv)}</dd>
              <dt className="text-neutral-500">Still active after 12 months</dt><dd className="tabular-nums">{res.retainedAfter12}</dd>
            </dl>
            <p className="text-xs text-neutral-500">
              This is revenue, not profit: it does not include the cost of real SMS, paid hosting or
              taxes. With {inp.billing === "anual" ? "annual billing the charge is upfront and the monthly average is shown here" : "monthly billing"}.
            </p>
          </div>
        </div>

        <form onSubmit={save} className="space-y-3 rounded-xl border border-neutral-800 p-4">
          <p className="text-sm text-neutral-400">Save this scenario</p>
          <div className="flex flex-wrap gap-3">
            <input aria-label="Scenario name" placeholder="Name (min. 3 characters)" value={name} onChange={(e) => setName(e.target.value)} className={field + " max-w-xs"} />
            <button type="submit" className="rounded-lg bg-neutral-100 px-5 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white">Save scenario</button>
          </div>
          {errors.length > 0 && <ul role="alert" className="space-y-1 text-sm text-red-400">{errors.map((m) => <li key={m}>{m}</li>)}</ul>}
          {msg && <p role="status" className="text-sm text-emerald-300">{msg}</p>}
          {dbOk === false && <p className="text-sm text-amber-300">The database is not available: the calculator works, but scenarios cannot be saved.</p>}
        </form>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Saved scenarios ({saved.length})</h3>
          {saved.length === 0 ? <p className="text-sm text-neutral-500">No scenarios saved yet.</p> : (
            <ul className="space-y-2">
              {saved.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-800 p-3 text-sm">
                  <span><span className="font-medium">{s.name}</span> <span className="text-neutral-500">· {mxn(s.results.mrr)} / month · {s.results.paidUsers} customers · {s.inputs.billing === "anual" ? "annual" : "monthly"}</span></span>
                  <span className="flex gap-3">
                    <button onClick={() => setInp(s.inputs)} className="text-xs text-neutral-400 hover:text-neutral-100">Load</button>
                    <button onClick={() => remove(s.id)} className="text-xs text-neutral-500 hover:text-red-400">Remove</button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="as" className="space-y-4">
        <h2 id="as" className="text-lg font-medium">Assumptions and why they could be wrong</h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-neutral-800 text-xs uppercase tracking-wide text-neutral-500">
              <tr><th className="p-3">Assumption</th><th className="p-3">Value</th><th className="p-3">Why it could be wrong</th></tr>
            </thead>
            <tbody>
              {ASSUMPTIONS.map((a) => (
                <tr key={a.label} className="border-b border-neutral-900 align-top">
                  <td className="p-3 font-medium">{a.label}</td>
                  <td className="p-3 text-neutral-300">{a.value}</td>
                  <td className="p-3 text-neutral-400">{a.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TIERS } from "@/lib/productData";
import {
  ASSUMPTIONS, DEFAULT_INPUTS, annualPrice, calculate, validateScenario,
  type Inputs, type Results,
} from "@/lib/pricingEngine";

type Saved = { id: string; name: string; inputs: Inputs; results: Results; created_at: string };

const mxn = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export default function PricingCalculator() {
  const [inp, setInp] = useState<Inputs>(DEFAULT_INPUTS);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [dbOk, setDbOk] = useState<boolean | null>(null);

  const res = calculate(inp);

  async function load() {
    const { data, error } = await supabase
      .from("pricing_scenarios")
      .select("id, name, inputs, results, created_at")
      .order("created_at", { ascending: false });
    if (error) { setDbOk(false); return; }
    setDbOk(true);
    setSaved((data ?? []) as Saved[]);
  }
  useEffect(() => { load(); }, []);

  const num = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInp({ ...inp, [k]: e.target.value === "" ? NaN : Number(e.target.value) });

  async function save(ev: React.FormEvent) {
    ev.preventDefault();
    setMsg(null);
    const errs = validateScenario({ name, inputs: inp });
    setErrors(errs);
    if (errs.length) return;
    const { error } = await supabase.from("pricing_scenarios").insert({ name: name.trim(), inputs: inp, results: res });
    if (error) { setErrors([error.message]); return; }
    setName(""); setMsg("Escenario guardado."); await load();
  }

  async function remove(id: string) {
    await supabase.from("pricing_scenarios").delete().eq("id", id);
    await load();
  }

  const field = "w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600";
  const numField = ({ label, k, suffix }: { label: string; k: keyof Inputs; suffix?: string }) => (
    <label className="block text-sm text-neutral-400">
      {label}{suffix ? ` (${suffix})` : ""}
      <input type="number" inputMode="decimal" value={Number.isNaN(inp[k] as number) ? "" : (inp[k] as number)} onChange={num(k)} className={field + " mt-1"} />
    </label>
  );

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">Precios</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          Hoy Vigil no cobra nada. Estos precios y porcentajes son hipótesis para pensar el modelo
          de negocio, no mediciones ni ofertas.
        </p>
      </header>

      <section aria-labelledby="pl" className="space-y-4">
        <h2 id="pl" className="text-lg font-medium">Planes propuestos</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {TIERS.map((t) => (
            <article key={t.id} className="rounded-xl border border-neutral-800 p-4">
              <h3 className="font-medium">{t.name}</h3>
              <p className="mt-2 text-2xl tabular-nums">{t.monthlyMXN === 0 ? "Gratis" : mxn(t.monthlyMXN)}<span className="text-sm text-neutral-500">{t.monthlyMXN === 0 ? "" : " / mes"}</span></p>
              {t.monthlyMXN > 0 && <p className="text-xs text-neutral-500">o {mxn(annualPrice(t.monthlyMXN))} / año (2 meses gratis)</p>}
              <p className="mt-3 text-sm text-neutral-300">{t.pitch}</p>
              <p className="mt-2 text-xs text-neutral-500">{t.limit}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="calc" className="space-y-4">
        <h2 id="calc" className="text-lg font-medium">Calculadora de ingresos</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-neutral-800 p-4">
            {numField({ label: "Registros gratis", k: "signups" })}
            {numField({ label: "Pasan a un plan de pago", k: "paidPct", suffix: "%" })}
            {numField({ label: "De los que pagan, eligen Plus", k: "plusSharePct", suffix: "%" })}
            {numField({ label: "Cancelación mensual", k: "churnPct", suffix: "%" })}
            {numField({ label: "Precio Plus", k: "plusPrice", suffix: "MXN / mes" })}
            {numField({ label: "Precio Familia", k: "familiaPrice", suffix: "MXN / mes" })}
            <div role="group" aria-label="Facturación" className="flex gap-2 pt-1">
              {(["mensual", "anual"] as const).map((b) => (
                <button key={b} type="button" aria-pressed={inp.billing === b} onClick={() => setInp({ ...inp, billing: b })}
                  className={"rounded-lg px-4 py-2 text-sm font-medium transition " + (inp.billing === b ? "bg-neutral-100 text-neutral-900" : "border border-neutral-800 text-neutral-400 hover:text-neutral-100")}>
                  {b === "mensual" ? "Mensual" : "Anual"}
                </button>
              ))}
            </div>
          </div>

          <div aria-live="polite" data-testid="results" className="space-y-3 rounded-xl border border-neutral-800 p-4">
            <p className="text-sm text-neutral-400">Resultado con estos supuestos</p>
            <p className="text-3xl tabular-nums" data-testid="mrr">{mxn(res.mrr)}<span className="text-sm text-neutral-500"> / mes</span></p>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-neutral-500">Anualizado</dt><dd data-testid="arr" className="tabular-nums">{mxn(res.arr)}</dd>
              <dt className="text-neutral-500">Clientes de pago</dt><dd className="tabular-nums">{res.paidUsers} ({res.plusUsers} Plus · {res.familiaUsers} Familia)</dd>
              <dt className="text-neutral-500">Ingreso por cliente</dt><dd className="tabular-nums">{mxn(res.arpu)} / mes</dd>
              <dt className="text-neutral-500">Valor de vida (LTV)</dt><dd className="tabular-nums">{res.ltv === null ? "sin cancelación: no definido" : mxn(res.ltv)}</dd>
              <dt className="text-neutral-500">Siguen tras 12 meses</dt><dd className="tabular-nums">{res.retainedAfter12}</dd>
            </dl>
            <p className="text-xs text-neutral-500">
              Es ingreso, no ganancia: no incluye costo de SMS reales, hosting de pago ni
              impuestos. Con {inp.billing === "anual" ? "facturación anual se cobra por adelantado y aquí se muestra el promedio mensual" : "facturación mensual"}.
            </p>
          </div>
        </div>

        <form onSubmit={save} className="space-y-3 rounded-xl border border-neutral-800 p-4">
          <p className="text-sm text-neutral-400">Guardar este escenario</p>
          <div className="flex flex-wrap gap-3">
            <input aria-label="Nombre del escenario" placeholder="Nombre (mín. 3 caracteres)" value={name} onChange={(e) => setName(e.target.value)} className={field + " max-w-xs"} />
            <button type="submit" className="rounded-lg bg-neutral-100 px-5 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white">Guardar escenario</button>
          </div>
          {errors.length > 0 && <ul role="alert" className="space-y-1 text-sm text-red-400">{errors.map((m) => <li key={m}>{m}</li>)}</ul>}
          {msg && <p role="status" className="text-sm text-emerald-300">{msg}</p>}
          {dbOk === false && <p className="text-sm text-amber-300">La base no está disponible: la calculadora funciona, pero no se pueden guardar escenarios.</p>}
        </form>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Escenarios guardados ({saved.length})</h3>
          {saved.length === 0 ? <p className="text-sm text-neutral-500">Aún no hay escenarios guardados.</p> : (
            <ul className="space-y-2">
              {saved.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-800 p-3 text-sm">
                  <span><span className="font-medium">{s.name}</span> <span className="text-neutral-500">· {mxn(s.results.mrr)} / mes · {s.results.paidUsers} clientes · {s.inputs.billing}</span></span>
                  <span className="flex gap-3">
                    <button onClick={() => setInp(s.inputs)} className="text-xs text-neutral-400 hover:text-neutral-100">Cargar</button>
                    <button onClick={() => remove(s.id)} className="text-xs text-neutral-500 hover:text-red-400">Quitar</button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="as" className="space-y-4">
        <h2 id="as" className="text-lg font-medium">Supuestos y por qué podrían estar mal</h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-neutral-800 text-xs uppercase tracking-wide text-neutral-500">
              <tr><th className="p-3">Supuesto</th><th className="p-3">Valor</th><th className="p-3">Por qué podría estar mal</th></tr>
            </thead>
            <tbody>
              {ASSUMPTIONS.map((a) => (
                <tr key={a.label} className="border-b border-neutral-900 align-top">
                  <td className="p-3 font-medium">{a.label}</td>
                  <td className="p-3 text-neutral-300">{a.value}</td>
                  <td className="p-3 text-neutral-400">{a.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
