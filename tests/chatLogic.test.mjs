// Correr con: node --experimental-strip-types --test tests/chatLogic.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import {
  QUESTIONS, checkGuardrails, handleTyped, recommend, needsHuman, cleanTester, validateComment,
  parsePlace, parseContacts, parseConcern, MAX_CHARS,
} from "../lib/chatLogic.ts";

test("C1 guardrails: datos personales, emergencia, abuso, consejos, compra y fuera de tema; las opciones pasan", () => {
  assert.equal(checkGuardrails("mi correo es ana@correo.com"), "pii");
  assert.equal(checkGuardrails("llamame al 55 1234 5678"), "pii");
  assert.equal(checkGuardrails("me estan robando"), "emergency");
  assert.equal(checkGuardrails("eres un idiota"), "abuse");
  assert.equal(checkGuardrails("necesito un abogado por una demanda"), "advice");
  assert.equal(checkGuardrails("cuanto cuesta comprar uno?"), "order");
  assert.equal(checkGuardrails("quien gano el partido de futbol ayer por la noche"), "offtopic");
  for (const q of QUESTIONS) for (const o of q.options) assert.equal(checkGuardrails(o.label), null, o.label);
  // el correo nunca se repite en la respuesta
  const r = handleTyped(0, "ana@correo.com");
  assert.equal(r.kind, "guardrail");
  assert.ok(!JSON.stringify(r).includes("ana@correo.com"));
});

test("C2 lectura de respuestas escritas y reglas de recomendacion", () => {
  assert.equal(parsePlace("la casa de mi mama que vive sola"), "familiar");
  assert.equal(parsePlace("mi depa"), "casa");
  assert.equal(parsePlace("mi coche"), "vehiculo");
  assert.equal(parseContacts("tengo 4"), "tres_mas");
  assert.equal(parseContacts("2"), "uno_dos");
  assert.equal(parseContacts("nadie"), "ninguno");
  assert.equal(parseConcern("que nadie conteste"), "nadie_contesta");
  assert.equal(parseConcern("que me graben"), "privacidad");
  assert.equal(parsePlace("zzz"), null);
  const base = { place: "casa", contacts: "uno_dos", concern: "falsas" };
  assert.equal(recommend(base).confidence, "alta");
  assert.ok(recommend({ ...base, contacts: "tres_mas" }).plan.includes("Plus"));
  assert.ok(recommend({ ...base, contacts: "ninguno" }).ladder[1].includes("agrega"));
  const v = recommend({ ...base, place: "vehiculo" });
  assert.equal(v.confidence, "baja");
  assert.ok(v.caveat.includes("no existen"));
  assert.equal(recommend(base).ladder.length, 3);
});

test("C3 revision humana, limite de caracteres, etiqueta de tester y comentario", () => {
  assert.deepEqual(needsHuman({ place: "casa", contacts: "uno_dos", concern: "falsas" }, [], 0), { flag: false, reason: null });
  assert.equal(needsHuman(null, ["order"], 0).flag, true);
  assert.equal(needsHuman({ place: "vehiculo", contacts: "uno_dos", concern: "falsas" }, [], 0).flag, true);
  assert.equal(needsHuman(null, [], 2).flag, true);
  assert.equal(needsHuman(null, ["abuse", "pii"], 1).flag, false);
  assert.equal(cleanTester("Ana"), "ana");
  assert.equal(cleanTester("a b"), "");
  assert.equal(cleanTester("x".repeat(30)), "");
  assert.equal(cleanTester(null), "");
  assert.equal(validateComment("me gusto").ok, true);
  assert.equal(validateComment("x".repeat(281)).ok, false);
  assert.equal(validateComment("escribeme a ana@correo.com").ok, false);
  // un mensaje largo se recorta antes de analizarlo
  const long = handleTyped(0, "casa " + "a".repeat(500));
  assert.ok(long.kind === "answer" || long.kind === "unknown" || long.kind === "guardrail");
  assert.ok(MAX_CHARS === 200);
});
