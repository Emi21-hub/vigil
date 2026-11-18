// Pure logic for /marketing: SIMULATED headline scorer and Markdown export. English + Spanish keywords.

export type Card = {
  id: string;
  kind: "brand" | "persona" | "landing" | "post" | "script" | "calendar";
  title: string;
  text: string;
};

const HYPE = ["best", "revolutionary", "incredible", "unique", "number 1", "guaranteed", "perfect", "ultimate", "mejor", "revolucionario", "increible", "increíble", "unico", "único", "numero 1", "número 1", "garantizado", "100%", "perfecto", "definitivo"];
const CONCRETE = ["alert", "alerts", "home", "camera", "cameras", "contacts", "notifies", "notice", "breaks in", "intrusion", "trusted", "alerta", "alertas", "casa", "camara", "cámara", "cámaras", "camaras", "contactos", "avisa", "aviso", "entra", "intrusión", "intrusion", "confianza"];

export type Score = { score: number; reasons: string[] };

// Fixed rules, not AI: it helps think, not decide. The real A/B test decides.
export function scoreHeadline(text: string): Score {
  const t = text.trim();
  if (!t) return { score: 0, reasons: ["Empty: write a headline."] };
  const lower = t.toLowerCase();
  let score = 40;
  const reasons: string[] = [];

  if (t.length >= 20 && t.length <= 70) { score += 20; reasons.push("+20 clear length (20 to 70 characters)"); }
  else if (t.length > 100) { score -= 20; reasons.push("-20 too long (over 100 characters)"); }
  else reasons.push("+0 length outside the ideal range");

  const concrete = CONCRETE.filter((w) => lower.includes(w)).length;
  if (concrete >= 2) { score += 25; reasons.push("+25 mentions 2 or more concrete product things"); }
  else if (concrete === 1) { score += 12; reasons.push("+12 mentions 1 concrete product thing"); }
  else reasons.push("+0 mentions nothing concrete about the product");

  const hype = HYPE.filter((w) => lower.includes(w));
  if (hype.length > 0) { score -= 15 * hype.length; reasons.push(`-${15 * hype.length} hype words: ${hype.join(", ")}`); }
  else { score += 15; reasons.push("+15 no hype words"); }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

export function cardToMarkdown(c: Card): string {
  return `# ${c.title}\n\n${c.text}\n`;
}

export function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export function packMarkdown(cards: Card[]): string {
  return (
    "# Vigil: content pack\n\n" +
    "Generated from templates with real product data. It is not AI content.\n\n" +
    cards.map((c) => `## ${c.title}\n\n${c.text}\n`).join("\n")
  );
}
