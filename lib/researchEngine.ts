// Logica pura de /research: sin React ni Supabase, para poder probarla sola.
import type { ResearchEntry, Confidence } from "./researchSeed";

export type CompetitorFilter = {
  query: string;
  camera: "todas" | "no" | "opcional";
  status: "todos" | "activo" | "descontinuado";
};

export function filterCompetitors(
  list: ResearchEntry[],
  f: CompetitorFilter
): ResearchEntry[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((e) => {
    if (e.kind !== "competitor") return false;
    if (f.camera !== "todas" && e.data.camera !== f.camera) return false;
    if (f.status !== "todos" && e.data.status !== f.status) return false;
    if (!q) return true;
    const hay = [e.title, e.summary, String(e.data.region ?? ""), String(e.data.price ?? "")]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function counterLabel(shown: number, total: number): string {
  return `Mostrando ${shown} de ${total} competidores`;
}

export function riskScore(e: ResearchEntry): number {
  const l = Number(e.data.likelihood ?? 0);
  const i = Number(e.data.impact ?? 0);
  return l * i;
}

export function riskLevel(score: number): "alto" | "medio" | "bajo" {
  if (score >= 15) return "alto";
  if (score >= 8) return "medio";
  return "bajo";
}

export function rankRisks(list: ResearchEntry[]): ResearchEntry[] {
  return list
    .filter((e) => e.kind === "risk")
    .sort((a, b) => riskScore(b) - riskScore(a) || a.title.localeCompare(b.title));
}

export type NoteInput = {
  title: string;
  summary: string;
  source_label: string;
  source_url: string;
  confidence: Confidence;
};

// Devuelve una lista de errores; vacia = valida.
export function validateNote(n: NoteInput): string[] {
  const errors: string[] = [];
  if (n.title.trim().length < 3) errors.push("El titulo necesita al menos 3 caracteres.");
  if (n.summary.trim().length < 10) errors.push("El resumen necesita al menos 10 caracteres.");
  const url = n.source_url.trim();
  if (url && !/^https?:\/\/\S+\.\S+/.test(url)) {
    errors.push("La fuente debe ser un enlace que empiece con http:// o https://.");
  }
  return errors;
}

export type LoadResult = {
  entries: ResearchEntry[];
  origin: "db" | "respaldo";
  reason?: string;
};

// Pide los datos; si falla o tarda mas de `ms`, devuelve el respaldo.
export async function loadWithFallback(
  fetcher: () => PromiseLike<ResearchEntry[]>,
  fallback: ResearchEntry[],
  ms = 6000
): Promise<LoadResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("tiempo agotado")), ms);
  });
  try {
    const rows = await Promise.race([Promise.resolve(fetcher()), timeout]);
    if (!rows || rows.length === 0) {
      return { entries: fallback, origin: "respaldo", reason: "la base no devolvio filas" };
    }
    return { entries: rows, origin: "db" };
  } catch (e) {
    const reason = e instanceof Error ? e.message : "error desconocido";
    return { entries: fallback, origin: "respaldo", reason };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
