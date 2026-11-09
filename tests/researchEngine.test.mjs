// Correr con: node --experimental-strip-types --test tests/researchEngine.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {
  filterCompetitors, counterLabel, riskScore, riskLevel, rankRisks,
  validateNote, loadWithFallback,
} from "../lib/researchEngine.ts";
import { RESEARCH_SEED } from "../lib/researchSeed.ts";

const all = { query: "", camera: "todas", status: "todos" };

test("T1 el seed trae 5+ casos, 8 competidores y riesgos con fuente o aviso", () => {
  const n = (k) => RESEARCH_SEED.filter((e) => e.kind === k).length;
  assert.ok(n("example") >= 5);
  assert.equal(n("competitor"), 8);
  assert.ok(n("mexico") >= 3);
  assert.ok(n("risk") >= 5);
  const ids = new Set(RESEARCH_SEED.map((e) => e.id));
  assert.equal(ids.size, RESEARCH_SEED.length, "ids duplicados");
});

test("T2 filtros y contador de competidores", () => {
  assert.equal(filterCompetitors(RESEARCH_SEED, all).length, 8);
  assert.equal(filterCompetitors(RESEARCH_SEED, { ...all, status: "descontinuado" }).length, 1);
  const cdmx = filterCompetitors(RESEARCH_SEED, { ...all, query: "cdmx" });
  assert.ok(cdmx.length >= 2);
  assert.equal(filterCompetitors(RESEARCH_SEED, { ...all, query: "zzzz" }).length, 0);
  assert.equal(counterLabel(3, 8), "Mostrando 3 de 8 competidores");
});

test("T3 puntaje y orden de riesgos", () => {
  const r = rankRisks(RESEARCH_SEED);
  for (let i = 1; i < r.length; i++) assert.ok(riskScore(r[i - 1]) >= riskScore(r[i]));
  assert.equal(riskLevel(20), "alto");
  assert.equal(riskLevel(12), "medio");
  assert.equal(riskLevel(4), "bajo");
});

test("T4 validacion de notas", () => {
  const ok = { title: "Vecina", summary: "Dice que si recibiria alertas.", source_label: "", source_url: "", confidence: "baja" };
  assert.deepEqual(validateNote(ok), []);
  assert.equal(validateNote({ ...ok, title: "ab" }).length, 1);
  assert.equal(validateNote({ ...ok, summary: "corto" }).length, 1);
  assert.equal(validateNote({ ...ok, source_url: "no-es-link" }).length, 1);
});

test("T5 respaldo cuando la base falla, tarda o viene vacia", async () => {
  const bad = await loadWithFallback(() => Promise.reject(new Error("pausado")), RESEARCH_SEED, 50);
  assert.equal(bad.origin, "respaldo");
  const slow = await loadWithFallback(() => new Promise(() => {}), RESEARCH_SEED, 50);
  assert.equal(slow.origin, "respaldo");
  assert.equal(slow.reason, "tiempo agotado");
  const empty = await loadWithFallback(async () => [], RESEARCH_SEED, 50);
  assert.equal(empty.origin, "respaldo");
  const good = await loadWithFallback(async () => RESEARCH_SEED.slice(0, 2), RESEARCH_SEED, 50);
  assert.equal(good.origin, "db");
  assert.equal(good.entries.length, 2);
});
