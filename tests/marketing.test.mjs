// Correr con: node --experimental-strip-types --test tests/marketing.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { scoreHeadline, cardToMarkdown, packMarkdown, slug } from "../lib/marketingEngine.ts";
import { summarize, MIN_VIEWS } from "../lib/abTesting.ts";
import { POSTS, SCRIPTS, CALENDAR_DAYS, ALL_CARDS } from "../lib/marketingContent.ts";

test("M1 el puntuador premia un titular claro y castiga uno exagerado", () => {
  const good = scoreHeadline("Alertas de intrusión para tu casa, sin cámaras");
  const bad = scoreHeadline("El mejor sistema revolucionario, 100% garantizado");
  assert.ok(good.score >= 80, "claro >= 80, fue " + good.score);
  assert.ok(bad.score <= 30, "exagerado <= 30, fue " + bad.score);
  assert.equal(scoreHeadline("   ").score, 0);
});

const ev = (test_id, variant, event, visitor_id, is_test = false) => ({ test_id, variant, event, visitor_id, is_test });

test("M2 A/B: visitantes unicos, sin sesiones de prueba, lider solo con 20 vistas por variante", () => {
  const events = [
    ev("headline", "A", "view", "v1"), ev("headline", "A", "view", "v1"), // duplicado: cuenta 1
    ev("headline", "A", "click", "v1"), ev("headline", "A", "click", "v1"),
    ev("headline", "B", "view", "v2"),
    ev("headline", "A", "view", "t1", true), // prueba: no cuenta
    ev("headline", "B", "click", "v9"), // clic sin vista: no cuenta
  ];
  const s = summarize(events, "headline");
  assert.deepEqual([s.A.views, s.A.clicks, s.B.views, s.B.clicks], [1, 1, 1, 0]);
  assert.equal(s.leader, null);
  const many = [];
  for (let i = 0; i < MIN_VIEWS; i++) {
    many.push(ev("button", "A", "view", "a" + i), ev("button", "B", "view", "b" + i));
    if (i < 10) many.push(ev("button", "A", "click", "a" + i));
    if (i < 4) many.push(ev("button", "B", "click", "b" + i));
  }
  const m = summarize(many, "button");
  assert.equal(m.leader, "A");
});

test("M3 el contenido tiene los conteos exactos y exporta a Markdown", () => {
  assert.equal(POSTS.length, 10);
  assert.equal(SCRIPTS.length, 3);
  assert.equal(CALENDAR_DAYS.length, 14);
  const ids = new Set(ALL_CARDS.map((c) => c.id));
  assert.equal(ids.size, ALL_CARDS.length);
  assert.ok(cardToMarkdown(POSTS[0]).startsWith("# Post 1"));
  const pack = packMarkdown(ALL_CARDS);
  for (const c of [...POSTS, ...SCRIPTS]) assert.ok(pack.includes(c.title));
  assert.equal(slug("Post 1 (Instagram): la pregunta"), "post-1-instagram-la-pregunta");
  // honestidad: nada de testimonios ni cifras de usuarios inventadas
  const all = ALL_CARDS.map((c) => c.text).join(" ").toLowerCase();
  for (const bad of ["testimonio", "miles de usuarios", "ya confían", "como visto en"]) assert.ok(!all.includes(bad));
});
