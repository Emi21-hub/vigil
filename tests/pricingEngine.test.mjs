// Correr con: node --experimental-strip-types --test tests/pricingEngine.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {
  annualPrice, effectiveMonthly, calculate, validateScenario, DEFAULT_INPUTS, ASSUMPTIONS,
} from "../lib/pricingEngine.ts";
import { FEATURES, TIERS, SEGMENTS } from "../lib/productData.ts";

// ---- 2 pruebas de logica de precios ----
test("P1 plan anual = 10 meses y el mensual equivalente baja", () => {
  assert.equal(annualPrice(99), 990);
  assert.equal(annualPrice(0), 0);
  assert.ok(effectiveMonthly(99, "anual") < effectiveMonthly(99, "mensual"));
  assert.equal(effectiveMonthly(99, "mensual"), 99);
});

test("P2 ingresos: 500 registros, 5 % pagan, 70 % Plus, 5 % cancela", () => {
  const r = calculate(DEFAULT_INPUTS);
  assert.equal(r.paidUsers, 25);
  assert.equal(r.plusUsers, 18); // round(17.5)
  assert.equal(r.familiaUsers, 7);
  assert.equal(r.mrr, 18 * 99 + 7 * 199);
  assert.equal(r.arr, r.mrr * 12);
  assert.equal(r.retainedAfter12, Math.round(25 * Math.pow(0.95, 12)));
  const zero = calculate({ ...DEFAULT_INPUTS, signups: 0 });
  assert.equal(zero.mrr, 0);
  assert.equal(zero.arpu, 0);
  assert.equal(calculate({ ...DEFAULT_INPUTS, churnPct: 0 }).ltv, null);
});

// ---- 3 pruebas de software ----
test("S1 validacion de escenarios", () => {
  const ok = { name: "Base", inputs: DEFAULT_INPUTS };
  assert.deepEqual(validateScenario(ok), []);
  assert.equal(validateScenario({ ...ok, name: "ab" }).length, 1);
  assert.equal(validateScenario({ ...ok, inputs: { ...DEFAULT_INPUTS, paidPct: 140 } }).length, 1);
  assert.equal(validateScenario({ ...ok, inputs: { ...DEFAULT_INPUTS, signups: -3 } }).length, 1);
  assert.equal(validateScenario({ ...ok, inputs: { ...DEFAULT_INPUTS, plusPrice: -1 } }).length, 1);
});

test("S2 integridad de funciones: estado honesto y planes validos", () => {
  const ids = new Set(FEATURES.map((f) => f.id));
  assert.equal(ids.size, FEATURES.length);
  const tierIds = new Set(TIERS.map((t) => t.id));
  for (const f of FEATURES) {
    assert.ok(["Prototipo", "Planeado"].includes(f.status));
    assert.ok(f.tiers.length > 0 && f.tiers.every((t) => tierIds.has(t)));
  }
  // lo que depende de proveedor o hardware no puede figurar como Prototipo
  for (const id of ["sms", "servidor", "sensores", "vehiculo"]) {
    assert.equal(FEATURES.find((f) => f.id === id).status, "Planeado");
  }
  assert.equal(SEGMENTS.length, 2);
});

test("S3 cada supuesto explica por que podria estar mal; el JSON de un escenario se conserva", () => {
  assert.ok(ASSUMPTIONS.length >= 6);
  assert.ok(ASSUMPTIONS.every((a) => a.why.length > 20));
  const saved = JSON.parse(JSON.stringify({ inputs: DEFAULT_INPUTS, results: calculate(DEFAULT_INPUTS) }));
  assert.deepEqual(calculate(saved.inputs), saved.results);
});
