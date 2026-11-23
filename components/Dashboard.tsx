"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { summarize, percent, MIN_VIEWS, type AbEvent } from "@/lib/abTesting";
import { ROUTES, evaluateRoute, GOAL_EXTERNAL_USERS, type RouteResult } from "@/lib/venture";

const withTimeout = <T,>(p: PromiseLike<T>, ms = 6000) =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timed out")), ms))]);

const TABLES = [
  { table: "contacts", label: "Contacts", week: 1 },
  { table: "incidents", label: "Incidents", week: 1 },
  { table: "alert_log", label: "Simulated alerts", week: 1 },
  { table: "research_entries", label: "Research entries", week: 2 },
  { table: "pricing_scenarios", label: "Saved pricing scenarios", week: 3 },
  { table: "marketing_assets", label: "Saved marketing pieces", week: 4 },
  { table: "ab_events", label: "A/B events (includes tests)", week: 4 },
] as const;

type Stats = {
  total_chats: number; external_chats: number; flagged_chats: number; guardrail_chats: number;
  human_requests: number; external_ratings: number; avg_rating_external: number | null;
};
type Incident = { id: string; triggered_at: string; status: string };

const TESTS = [
  { week: 1, what: "Ladder, contacts and history", auto: 0, live: 5 },
  { week: 2, what: "Research", auto: 5, live: 4 },
  { week: 3, what: "Product and pricing", auto: 5, live: 0 },
  { week: 4, what: "Marketing and A/B", auto: 3, live: 3 },
  { week: 5, what: "/chat advisor", auto: 3, live: 3 },
  { week: 6, what: "Routes, walkthrough, impact and roadmap", auto: 3, live: 0 },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number | string>>({});
  const [incidents, setIncidents] = useState<Incident[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [ab, setAb] = useState<AbEvent[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [checking, setChecking] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const out: Record<string, number | string> = {};
      let failed = 0;
      await Promise.all(TABLES.map(async (t) => {
        try {
          const { count, error } = await withTimeout(supabase.from(t.table).select("*", { count: "exact", head: true }));
          if (error) throw new Error(error.message);
          out[t.table] = count ?? 0;
        } catch { out[t.table] = "—"; failed++; }
      }));
      setCounts(out);
      if (failed === TABLES.length) setErr("The database did not respond.");
      try {
        const { data, error } = await withTimeout(supabase.from("incidents").select("id, triggered_at, status").order("triggered_at", { ascending: false }).limit(5));
        if (error) throw new Error(error.message);
        setIncidents((data ?? []) as Incident[]);
      } catch { setIncidents([]); }
      try {
        const { data, error } = await withTimeout(supabase.from("chat_stats").select("*").single());
        if (error) throw new Error(error.message);
        setStats(data as Stats);
      } catch { /* se muestra como no disponible */ }
      try {
        const { data, error } = await withTimeout(supabase.from("ab_events").select("test_id, variant, event, visitor_id, is_test").limit(2000));
        if (error) throw new Error(error.message);
        setAb((data ?? []) as AbEvent[]);
      } catch { /* no disponible */ }
    })();
  }, []);

  async function checkRoutes() {
    setChecking(true); setRoutes([]);
    const res: RouteResult[] = [];
    for (const r of ROUTES) {
      try {
        const c = new AbortController();
        const timer = setTimeout(() => c.abort(), 8000);
        const resp = await fetch(r.path, { cache: "no-store", signal: c.signal });
        const body = await resp.text();
        clearTimeout(timer);
        res.push(evaluateRoute(r, resp.status, body));
      } catch { res.push(evaluateRoute(r, null, null)); }
      setRoutes([...res]);
    }
    setCheckedAt(new Date().toLocaleString("en-US"));
    setChecking(false);
  }

  const passed = routes.filter((r) => r.ok).length;
  const realVisitors = ab ? new Set(ab.filter((e) => !e.is_test).map((e) => e.visitor_id)).size : null;
  const autoTotal = TESTS.reduce((a, t) => a + t.auto, 0);
  const th = "px-3 py-2 text-left text-xs font-medium text-neutral-500";
  const td = "px-3 py-2 text-sm text-neutral-300";

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">Dashboard</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">Real records from the database, external-user progress and a route check of the site. It is a student demo: alerts are simulated.</p>
        {err && <p className="mt-2 text-sm text-amber-300">{err} The rest of the page keeps working.</p>}
      </header>

      <section aria-labelledby="rec" className="space-y-3">
        <h2 id="rec" className="text-lg font-medium">Records in the database</h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full min-w-[28rem]">
            <thead><tr><th className={th}>Table</th><th className={th}>Week</th><th className={th}>Rows</th></tr></thead>
            <tbody>
              {TABLES.map((t) => (
                <tr key={t.table} className="border-t border-neutral-800">
                  <td className={td}>{t.label} <span className="text-neutral-600">({t.table})</span></td>
                  <td className={td}>{t.week}</td>
                  <td className={td + " tabular-nums"}>{counts[t.table] ?? "…"}</td>
                </tr>
              ))}
              <tr className="border-t border-neutral-800">
                <td className={td}>Advisor conversations <span className="text-neutral-600">(totals only)</span></td>
                <td className={td}>5</td>
                <td className={td + " tabular-nums"}>{stats ? stats.total_chats : "…"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-500">The advisor tables are write-only: only totals are read here.</p>

        <h3 className="pt-2 text-sm font-medium text-neutral-300">Latest simulated incidents</h3>
        {incidents === null ? <p className="text-sm text-neutral-500">Loading…</p> : incidents.length === 0 ? <p className="text-sm text-neutral-500">No incidents saved. Create one on <Link className="underline" href="/">Home</Link>.</p> : (
          <ul className="space-y-1 text-sm text-neutral-400">
            {incidents.map((i) => <li key={i.id}>{new Date(i.triggered_at).toLocaleString("en-US")} · {String(i.status).replace(/_/g, " ")}</li>)}
          </ul>
        )}
      </section>

      <section aria-labelledby="ext" className="space-y-3">
        <h2 id="ext" className="text-lg font-medium">External users</h2>
        {stats ? (
          <div className="rounded-xl border border-neutral-800 p-4 text-sm">
            <p className="text-neutral-300"><span className="text-2xl font-medium tabular-nums">{stats.external_chats}</span> of {GOAL_EXTERNAL_USERS} external chats in the advisor (those tagged “selftest” do not count).</p>
            <p className="mt-2 text-neutral-400">Flagged: {stats.flagged_chats} · With filters: {stats.guardrail_chats} · Asked for a human: {stats.human_requests} · External rating: {stats.avg_rating_external ?? "—"} ({stats.external_ratings})</p>
            <p className="mt-2 text-xs text-neutral-500">An external chat is not the same as a distinct person: the ?t= tag helps tell them apart. Real visitors on the home page (A/B): {realVisitors ?? "not available"}.</p>
          </div>
        ) : <p className="text-sm text-neutral-500">Totals not available.</p>}
        {ab && (["headline", "button"] as const).map((t) => {
          const s = summarize(ab, t);
          return <p key={t} className="text-xs text-neutral-500">A/B {t}: A {s.A.views} views ({percent(s.A.rate)}), B {s.B.views} views ({percent(s.B.rate)}). {s.note.startsWith("No leader") ? "No winner: " + MIN_VIEWS + " views per variant are needed." : s.note}</p>;
        })}
      </section>

      <section aria-labelledby="test" className="space-y-3">
        <h2 id="test" className="text-lg font-medium">Test summary</h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full min-w-[28rem]">
            <thead><tr><th className={th}>Week</th><th className={th}>What was tested</th><th className={th}>Automated</th><th className={th}>Live</th></tr></thead>
            <tbody>{TESTS.map((t) => <tr key={t.week} className="border-t border-neutral-800"><td className={td}>{t.week}</td><td className={td}>{t.what}</td><td className={td + " tabular-nums"}>{t.auto}</td><td className={td + " tabular-nums"}>{t.live}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="text-xs text-neutral-500">{autoTotal} automated tests in total (node --test). The live tests were done by hand and are described in the weekly packets.</p>

        <div className="rounded-xl border border-neutral-800 p-4">
          <h3 className="font-medium">Route check (regression)</h3>
          <p className="mt-1 text-sm text-neutral-400">Requests every page of this site and checks that it answers 200 and carries its title. It checks that the pages load, not that every button works.</p>
          <button onClick={checkRoutes} disabled={checking} className="mt-3 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white disabled:opacity-50">{checking ? "Checking…" : "Check routes"}</button>
          {routes.length > 0 && (
            <div className="mt-3" data-testid="route-results">
              <p role="status" className="text-sm text-neutral-300">{passed} of {ROUTES.length} routes correct{checkedAt ? " · " + checkedAt : ""}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {routes.map((r) => <li key={r.path} className={r.ok ? "text-emerald-300" : "text-red-400"}>{r.ok ? "✓" : "✗"} {r.path} — {r.detail}</li>)}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
