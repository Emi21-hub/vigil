// Correr con: node --experimental-strip-types --test tests/venture.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {
  ROUTES, WALKTHROUGH, AGENTS, IMPACT, ROADMAP, BUILD_LOG, PROMPTS, evaluateRoute, roadmapOrder,
} from "../lib/venture.ts";

test("V1 rutas, recorrido y mapa de agentes son coherentes", () => {
  const paths = new Set(ROUTES.map((r) => r.path));
  assert.equal(paths.size, ROUTES.length);
  for (const p of ["/", "/contacts", "/log", "/research", "/product", "/pricing", "/marketing", "/chat", "/demo", "/dashboard", "/docs"]) assert.ok(paths.has(p), p);
  assert.ok(WALKTHROUGH.length >= 6);
  WALKTHROUGH.forEach((s, i) => { assert.equal(s.n, i + 1); assert.ok(paths.has(s.path), s.path); assert.ok(s.action && s.expect); });
  const ids = AGENTS.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const a of AGENTS) assert.ok(a.checkpoint && a.limit, a.id);
  assert.ok(AGENTS.some((a) => a.kind === "humano"));
  // ningun componente del producto dice usar un modelo de lenguaje
  assert.ok(AGENTS.filter((a) => a.kind === "reglas").every((a) => !/IA\b|GPT|LLM/.test(a.does)));
});

test("V2 impacto y roadmap: cada riesgo tiene mitigacion y limite; el roadmap es honesto y ordenado", () => {
  assert.ok(IMPACT.length >= 6);
  for (const i of IMPACT) assert.ok(i.mitigation.length > 10 && i.residual.length > 10, i.id);
  assert.ok(ROADMAP.every((r) => r.status === "no iniciado"));
  const ids = new Set(ROADMAP.map((r) => r.id));
  for (const r of ROADMAP) if (r.after) assert.ok(ids.has(r.after), r.id + " depende de " + r.after);
  const sorted = roadmapOrder(ROADMAP);
  assert.equal(sorted.length, ROADMAP.length);
  assert.equal(sorted[0].priority, "Alta");
  assert.equal(sorted[sorted.length - 1].priority, "Baja");
  assert.deepEqual(BUILD_LOG.map((w) => w.week), [1, 2, 3, 4, 5]);
  assert.equal(PROMPTS.length, 5);
});

test("V3 evaluateRoute: 200 con marcador pasa; otros casos fallan con razon", () => {
  const r = ROUTES.find((x) => x.path === "/chat");
  assert.equal(evaluateRoute(r, 200, "<title>Asesor — Vigil</title>").ok, true);
  assert.equal(evaluateRoute(r, 200, "<title>otro</title>").ok, false);
  assert.equal(evaluateRoute(r, 404, "").ok, false);
  assert.equal(evaluateRoute(r, null, null).detail, "sin respuesta");
  const home = ROUTES.find((x) => x.path === "/");
  assert.equal(evaluateRoute(home, 200, "cualquier cosa").ok, true);
});
