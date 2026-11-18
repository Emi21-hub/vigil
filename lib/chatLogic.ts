// Pure logic for the /chat advisor: no React, no Supabase and no imports, so it can be tested with Node.
// It is NOT AI: everything comes from fixed rules and the page says so. What the person types is NOT
// saved: only validated options (ids) are stored, never free text.
// Keyword lists accept English AND Spanish, so people can write in either language.

export type Place = "casa" | "familiar" | "vehiculo" | "otro";
export type Contacts = "ninguno" | "uno_dos" | "tres_mas";
export type Concern = "nadie_contesta" | "falsas" | "privacidad" | "no_se_a_quien";
export type Answers = { place: Place; contacts: Contacts; concern: Concern };
export type GuardrailType = "pii" | "emergency" | "abuse" | "advice" | "order" | "offtopic";

export const MAX_CHARS = 200;
export const MAX_COMMENT = 280;

export type Option = { id: string; label: string };
export type Question = { key: keyof Answers; text: string; options: Option[] };

export const QUESTIONS: Question[] = [
  {
    key: "place",
    text: "Question 1 of 3: What do you want to protect?",
    options: [
      { id: "casa", label: "My house or apartment" },
      { id: "familiar", label: "The home of a relative who lives alone" },
      { id: "vehiculo", label: "A vehicle" },
      { id: "otro", label: "Somewhere else" },
    ],
  },
  {
    key: "contacts",
    text: "Question 2 of 3: How many trusted people could you notify?",
    options: [
      { id: "ninguno", label: "Nobody yet" },
      { id: "uno_dos", label: "1 or 2" },
      { id: "tres_mas", label: "3 or more" },
    ],
  },
  {
    key: "concern",
    text: "Question 3 of 3: What worries you most about an alarm?",
    options: [
      { id: "nadie_contesta", label: "That nobody answers in time" },
      { id: "falsas", label: "False alarms" },
      { id: "privacidad", label: "Being recorded or spied on" },
      { id: "no_se_a_quien", label: "Not knowing who to notify first" },
    ],
  },
];

export function norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").trim();
}

const has = (t: string, words: string[]) => words.some((w) => t.includes(w));

// ---------- guardrails ----------
export function hasPersonalData(text: string): boolean {
  if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/i.test(text)) return true;
  return text.replace(/\D/g, "").length >= 10; // phone or card number
}

const ABUSE = ["idiot", "stupid", "shut up", "bastard", "asshole", "fuck", "shit", "i hate you", "damn", "idiota", "estupid", "pendej", "imbecil", "mierda", "puta", "cabron", "maldito", "te odio"];
// Emergency phrases (English + Spanish). Expanded after real testing showed that "thief" / "help" style messages slipped through.
const EMERGENCY = ["emergency", "being robbed", "someone is in my house", "someone broke in", "someone is breaking in", "intruder", "burglar", "thief", "robber", "send help", "need help now", "urgent help", "call the police", "call 911", "kill me", "ladron", "alguien entro", "entraron a mi casa", "policia", "necesito ayuda", "emergencia", "me estan robando", "estan robando", "hay alguien en mi casa", "me quieren matar", "auxilio", "ayuda urgente", "se metieron"];
const ADVICE = ["doctor", "medicine", "diagnosis", "prescription", "illness", "lawyer", "lawsuit", "legal", "invest", "loan", "taxes", "mortgage", "medico", "medicina", "diagnostico", "receta", "enfermedad", "abogado", "demanda", "legal", "denuncia", "inversion", "invertir", "credito", "prestamo", "impuestos"];
const ORDER = ["how much", "price", "pricing", "cost", "buy", "purchase", "subscribe", "order", "quote", "invoice", "cuanto cuesta", "cuanto vale", "precio", "comprar", "contratar", "pagar", "pedido", "ordenar", "suscrib", "cotiz", "factura"];
const ON_TOPIC = ["home", "house", "apartment", "alarm", "alert", "notify", "contact", "neighbor", "family", "camera", "vehicle", "burglar", "secur", "nobody", "false", "privacy", "record", "spy", "trust", "person", "alone", "brother", "sister", "mom", "dad", "friend", "ladder", "protect", "live", "casa", "depa", "alarma", "avis", "contest", "contacto", "vecin", "familia", "camara", "vehiculo", "auto", "robo", "segur", "vigil", "nadie", "falsa", "privacidad", "graben", "confianza", "persona", "solo", "sola", "hermano", "hermana", "mama", "papa", "amigo", "amiga", "escalera", "alerta", "proteg", "vive"];

export const GUARDRAIL_REPLIES: Record<GuardrailType, string> = {
  pii: "It looks like you typed personal data (an email, a phone number or a long number). I do not repeat or save it. Please answer without personal data.",
  emergency: "If there is an emergency right now, call 911. Vigil is a demo and does not contact emergency services.",
  abuse: "I prefer to keep this respectful. If you want, we can go back to the question.",
  advice: "I cannot give medical, legal or financial advice. I only guide you on how to build your alert chain in Vigil.",
  order: "Vigil does not sell or charge anything yet: the plans are a hypothesis. I flagged your question for a person to review, although I cannot promise a reply because I do not store contacts.",
  offtopic: "That is outside what I can help with: I only guide you on intrusion alerts and trusted contacts in Vigil.",
};

export function checkGuardrails(text: string): GuardrailType | null {
  const t = norm(text);
  if (hasPersonalData(text)) return "pii";
  if (has(t, EMERGENCY)) return "emergency";
  if (has(t, ABUSE)) return "abuse";
  if (has(t, ADVICE)) return "advice";
  if (has(t, ORDER)) return "order";
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length >= 5 && !has(t, ON_TOPIC)) return "offtopic";
  return null;
}

// ---------- reading typed answers ----------
export function parsePlace(text: string): Place | null {
  const t = norm(text);
  if (has(t, ["relative", "family", "my mom", "my dad", "mother", "father", "grandma", "grandpa", "brother", "sister", "lives alone", "familiar", "mama", "papa", "abuel", "madre", "padre", "hermano", "hermana", "vive solo", "vive sola"])) return "familiar";
  if (has(t, ["vehicle", "car", "truck", "motorcycle", "bike", "auto", "carro", "coche", "vehiculo", "moto", "camioneta"])) return "vehiculo";
  if (has(t, ["house", "home", "apartment", "flat", "my room", "casa", "depa", "departamento", "hogar", "mi cuarto"])) return "casa";
  if (has(t, ["other", "business", "office", "shop", "store", "otro", "negocio", "oficina", "tienda", "local"])) return "otro";
  return null;
}

export function parseContacts(text: string): Contacts | null {
  const t = norm(text);
  const m = t.match(/\b(\d+)\b/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n === 0) return "ninguno";
    if (n <= 2) return "uno_dos";
    return "tres_mas";
  }
  if (has(t, ["nobody", "no one", "none", "zero", "nadie", "ningun", "cero"])) return "ninguno";
  if (has(t, ["three", "four", "five", "several", "many", "more than", "tres", "cuatro", "cinco", "varios", "muchos", "mas de"])) return "tres_mas";
  if (has(t, ["one", "two", "a couple", "my brother", "my mom", "uno", "una", "dos", "un par", "mi hermano", "mi mama"])) return "uno_dos";
  return null;
}

export function parseConcern(text: string): Concern | null {
  const t = norm(text);
  if (has(t, ["answer", "respond", "in time", "nobody sees", "take too long", "contest", "atiend", "a tiempo", "nadie vea", "se tarden"])) return "nadie_contesta";
  if (has(t, ["false", "mistake", "wrong", "falsa", "equivoc", "error"])) return "falsas";
  if (has(t, ["record", "spy", "privacy", "data", "camera", "grab", "espi", "privacidad", "datos", "camara"])) return "privacidad";
  if (has(t, ["who to", "first", "order", "who first", "a quien", "primero", "orden", "no se quien"])) return "no_se_a_quien";
  return null;
}

export type TypedResult =
  | { kind: "guardrail"; type: GuardrailType; reply: string }
  | { kind: "answer"; id: string }
  | { kind: "unknown" };

export function handleTyped(step: 0 | 1 | 2, text: string): TypedResult {
  const trimmed = text.trim().slice(0, MAX_CHARS);
  const g = checkGuardrails(trimmed);
  if (g) return { kind: "guardrail", type: g, reply: GUARDRAIL_REPLIES[g] };
  const id = step === 0 ? parsePlace(trimmed) : step === 1 ? parseContacts(trimmed) : parseConcern(trimmed);
  return id ? { kind: "answer", id } : { kind: "unknown" };
}

// ---------- recommendation ----------
export type Recommendation = {
  ladder: string[];
  plan: string;
  tip: string;
  caveat: string | null;
  confidence: "alta" | "media" | "baja"; // internal ids; the UI shows high / medium / low
};

export function recommend(a: Answers): Recommendation {
  const level2 =
    a.contacts === "ninguno"
      ? "Level 2: you have nobody to notify yet; add at least 2 trusted contacts"
      : a.contacts === "uno_dos"
        ? "Level 2: your 1 or 2 trusted contacts (at 60 s in the demo)"
        : "Level 2: your trusted contacts, in order (at 60 s in the demo)";
  const plan =
    a.contacts === "tres_mas"
      ? "The Free plan allows 2 contacts. For 5 you would need Plus, which today is only a plan and cannot be bought."
      : "The Free plan (1 property and 2 contacts) is enough for your case.";
  const tips: Record<Concern, string> = {
    nadie_contesta: "Choose contacts who usually keep their phone at hand and tell them in advance that they will be your chain.",
    falsas: "Today Vigil only triggers with a simulation button; with real sensors (planned) there would be false alarms. Let your contacts know it may be a test.",
    privacidad: "Vigil uses no cameras or microphones and stores no images. This chat does not save what you type either: it only saves your options.",
    no_se_a_quien: "Put whoever lives closest or answers fastest at level 1, and the most trusted person at level 2.",
  };
  let caveat: string | null = null;
  let confidence: Recommendation["confidence"] = "alta";
  if (a.place === "vehiculo") {
    caveat = "Vehicle alerts do not exist yet (they are planned). What you can try today is the same flow with a home.";
    confidence = "baja";
  } else if (a.place === "otro") {
    caveat = "Vigil was only tested with a house or apartment; there is no evidence for other places yet.";
    confidence = "media";
  } else if (a.contacts === "ninguno") {
    confidence = "media";
  }
  return {
    ladder: ["Level 1: you (instantly)", level2, "Level 3: hand-off to a person (at 120 s in the demo)"],
    plan,
    tip: tips[a.concern],
    caveat,
    confidence,
  };
}

// ---------- human review ----------
export function needsHuman(a: Answers | null, guardrails: GuardrailType[], unknownCount: number): { flag: boolean; reason: string | null } {
  if (guardrails.includes("order")) return { flag: true, reason: "purchase or price question" };
  if (a && a.place === "vehiculo") return { flag: true, reason: "unsupported place: vehicle" };
  if (unknownCount >= 2) return { flag: true, reason: "answers were not understood" };
  return { flag: false, reason: null };
}

// ---------- utilities ----------
export function cleanTester(s: string | null | undefined): string {
  const t = (s ?? "").trim().toLowerCase();
  return /^[a-z0-9_-]{1,20}$/.test(t) ? t : "";
}

export function validateComment(text: string): { ok: boolean; error?: string } {
  if (text.length > MAX_COMMENT) return { ok: false, error: `The comment allows at most ${MAX_COMMENT} characters.` };
  if (hasPersonalData(text)) return { ok: false, error: "The comment seems to include personal data. Remove it to send it." };
  return { ok: true };
}
