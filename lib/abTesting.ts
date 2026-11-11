// Logica pura de las pruebas A/B de la home. Sin React ni Supabase.
// Reglas: cada visitante cuenta UNA vez por prueba y variante, las sesiones
// de prueba (is_test) no cuentan, y solo se nombra lider con 20 vistas por variante.

export type TestId = "headline" | "button";
export type Variant = "A" | "B";
export type EventKind = "view" | "click";

export const MIN_VIEWS = 20;

export const EXPERIMENTS: Record<TestId, { label: string; A: string; B: string }> = {
  headline: {
    label: "Titular principal",
    A: "Alertas de intrusión para tu casa, sin cámaras",
    B: "Si alguien entra, que se entere alguien que sí contesta",
  },
  button: {
    label: "Texto del botón principal",
    A: "Probar la demo",
    B: "Probar la demo gratis",
  },
};

export type AbEvent = {
  test_id: string;
  variant: string;
  event: string;
  visitor_id: string;
  is_test: boolean;
};

export type VariantStats = { views: number; clicks: number; rate: number };
export type TestSummary = {
  A: VariantStats;
  B: VariantStats;
  leader: Variant | null;
  note: string;
};

export function pickVariant(random: number): Variant {
  return random < 0.5 ? "A" : "B";
}

function stats(events: AbEvent[], test: TestId, variant: Variant): VariantStats {
  const views = new Set<string>();
  const clicks = new Set<string>();
  for (const e of events) {
    if (e.is_test || e.test_id !== test || e.variant !== variant) continue;
    if (e.event === "view") views.add(e.visitor_id);
    if (e.event === "click") clicks.add(e.visitor_id);
  }
  // un clic solo cuenta si ese visitante tambien tiene su vista
  const validClicks = [...clicks].filter((id) => views.has(id)).length;
  return {
    views: views.size,
    clicks: validClicks,
    rate: views.size === 0 ? 0 : validClicks / views.size,
  };
}

export function summarize(events: AbEvent[], test: TestId): TestSummary {
  const A = stats(events, test, "A");
  const B = stats(events, test, "B");
  if (A.views < MIN_VIEWS || B.views < MIN_VIEWS) {
    return {
      A, B, leader: null,
      note: `Aun sin lider: se necesitan ${MIN_VIEWS} vistas por variante (A ${A.views}, B ${B.views}).`,
    };
  }
  if (A.rate === B.rate) {
    return { A, B, leader: null, note: "Empate: ambas variantes tienen la misma tasa de clics." };
  }
  const leader: Variant = A.rate > B.rate ? "A" : "B";
  return {
    A, B, leader,
    note: `Va arriba la variante ${leader}. Con pocos visitantes la diferencia puede ser azar.`,
  };
}

export function percent(rate: number): string {
  return `${(rate * 100).toFixed(1)} %`;
}
