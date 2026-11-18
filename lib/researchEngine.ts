// Pure logic for /research: no React or Supabase, so it can be tested on its own.
// Internal values (todas/todos, alta/media/baja, activo...) are ids; labels below are English.
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
  return `Showing ${shown} of ${total} competitors`;
}

export function riskScore(e: ResearchEntry): number {
  const l = Number(e.data.likelihood ?? 0);
  const i = Number(e.data.impact ?? 0);
  return l * i;
}

export function riskLevel(score: number): "high" | "medium" | "low" {
  if (score >= 15) return "high";
  if (score >= 8) return "medium";
  return "low";
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

// Returns a list of errors; empty = valid.
export function validateNote(n: NoteInput): string[] {
  const errors: string[] = [];
  if (n.title.trim().length < 3) errors.push("The title needs at least 3 characters.");
  if (n.summary.trim().length < 10) errors.push("The summary needs at least 10 characters.");
  const url = n.source_url.trim();
  if (url && !/^https?:\/\/\S+\.\S+/.test(url)) {
    errors.push("The source must be a link starting with http:// or https://.");
  }
  return errors;
}

export type LoadResult = {
  entries: ResearchEntry[];
  origin: "db" | "respaldo";
  reason?: string;
};

// Fetches the data; if it fails or takes longer than `ms`, returns the fallback.
export async function loadWithFallback(
  fetcher: () => PromiseLike<ResearchEntry[]>,
  fallback: ResearchEntry[],
  ms = 6000
): Promise<LoadResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("timed out")), ms);
  });
  try {
    const rows = await Promise.race([Promise.resolve(fetcher()), timeout]);
    if (!rows || rows.length === 0) {
      return { entries: fallback, origin: "respaldo", reason: "the database returned no rows" };
    }
    return { entries: rows, origin: "db" };
  } catch (e) {
    const reason = e instanceof Error ? e.message : "unknown error";
    return { entries: fallback, origin: "respaldo", reason };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
