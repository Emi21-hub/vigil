// Logica pura del asesor /chat: sin React, sin Supabase y sin imports, para probarla con Node.
// NO es IA: todo sale de reglas fijas y la pagina lo dice. Lo que escribe la persona NO se
// guarda: solo se guardan opciones ya validadas (identificadores), nunca texto libre.

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
    text: "Pregunta 1 de 3: ¿Qué quieres proteger?",
    options: [
      { id: "casa", label: "Mi casa o departamento" },
      { id: "familiar", label: "La casa de un familiar que vive solo" },
      { id: "vehiculo", label: "Un vehículo" },
      { id: "otro", label: "Otro lugar" },
    ],
  },
  {
    key: "contacts",
    text: "Pregunta 2 de 3: ¿A cuántas personas de confianza podrías avisar?",
    options: [
      { id: "ninguno", label: "A nadie todavía" },
      { id: "uno_dos", label: "A 1 o 2" },
      { id: "tres_mas", label: "A 3 o más" },
    ],
  },
  {
    key: "concern",
    text: "Pregunta 3 de 3: ¿Qué te preocupa más de una alarma?",
    options: [
      { id: "nadie_contesta", label: "Que nadie conteste a tiempo" },
      { id: "falsas", label: "Las falsas alarmas" },
      { id: "privacidad", label: "Que me graben o espíen" },
      { id: "no_se_a_quien", label: "No saber a quién avisar primero" },
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
  return text.replace(/\D/g, "").length >= 10; // telefono o tarjeta
}

const ABUSE = ["idiota", "estupid", "pendej", "imbecil", "mierda", "puta", "cabron", "maldito", "te odio"];
const EMERGENCY = ["emergencia", "me estan robando", "estan robando", "hay alguien en mi casa", "me quieren matar", "auxilio", "ayuda urgente", "se metieron"];
const ADVICE = ["medico", "medicina", "diagnostico", "receta", "enfermedad", "abogado", "demanda", "legal", "denuncia", "inversion", "invertir", "credito", "prestamo", "impuestos"];
const ORDER = ["cuanto cuesta", "cuanto vale", "precio", "comprar", "contratar", "pagar", "pedido", "ordenar", "suscrib", "cotiz", "factura"];
const ON_TOPIC = ["casa", "depa", "alarma", "avis", "contest", "contacto", "vecin", "familia", "camara", "vehiculo", "auto", "robo", "segur", "vigil", "nadie", "falsa", "privacidad", "graben", "confianza", "persona", "solo", "sola", "hermano", "hermana", "mama", "papa", "amigo", "amiga", "escalera", "alerta", "proteg", "vive"];

export const GUARDRAIL_REPLIES: Record<GuardrailType, string> = {
  pii: "Parece que escribiste un dato personal (correo, teléfono o número largo). No lo repito ni lo guardo. Responde sin datos personales, por favor.",
  emergency: "Si hay una emergencia ahora mismo, llama al 911. Vigil es una demo y no contacta servicios de emergencia.",
  abuse: "Prefiero seguir con respeto. Si quieres, retomamos la pregunta.",
  advice: "No puedo dar consejos médicos, legales ni financieros. Solo oriento sobre cómo armar tu cadena de avisos en Vigil.",
  order: "Vigil no vende ni cobra nada todavía: los planes son una hipótesis. Marqué tu pregunta para que una persona la revise, aunque no puedo prometer respuesta porque no guardo contactos.",
  offtopic: "Eso se sale de lo que puedo ayudar: solo oriento sobre alertas de intrusión y contactos de confianza en Vigil.",
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

// ---------- lectura de respuestas escritas ----------
export function parsePlace(text: string): Place | null {
  const t = norm(text);
  if (has(t, ["familiar", "mama", "papa", "abuel", "madre", "padre", "hermano", "hermana", "vive solo", "vive sola"])) return "familiar";
  if (has(t, ["auto", "carro", "coche", "vehiculo", "moto", "camioneta"])) return "vehiculo";
  if (has(t, ["casa", "depa", "departamento", "hogar", "mi cuarto"])) return "casa";
  if (has(t, ["otro", "negocio", "oficina", "tienda", "local"])) return "otro";
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
  if (has(t, ["nadie", "ningun", "cero"])) return "ninguno";
  if (has(t, ["tres", "cuatro", "cinco", "varios", "muchos", "mas de"])) return "tres_mas";
  if (has(t, ["uno", "una", "dos", "un par", "mi hermano", "mi mama"])) return "uno_dos";
  return null;
}

export function parseConcern(text: string): Concern | null {
  const t = norm(text);
  if (has(t, ["contest", "atiend", "a tiempo", "nadie vea", "se tarden"])) return "nadie_contesta";
  if (has(t, ["falsa", "equivoc", "error"])) return "falsas";
  if (has(t, ["grab", "espi", "privacidad", "datos", "camara"])) return "privacidad";
  if (has(t, ["a quien", "primero", "orden", "no se quien"])) return "no_se_a_quien";
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

// ---------- recomendacion ----------
export type Recommendation = {
  ladder: string[];
  plan: string;
  tip: string;
  caveat: string | null;
  confidence: "alta" | "media" | "baja";
};

export function recommend(a: Answers): Recommendation {
  const level2 =
    a.contacts === "ninguno"
      ? "Nivel 2: aún no tienes a quién avisar; agrega al menos 2 contactos de confianza"
      : a.contacts === "uno_dos"
        ? "Nivel 2: tus 1 o 2 contactos de confianza (a los 60 s en la demo)"
        : "Nivel 2: tus contactos de confianza, en orden (a los 60 s en la demo)";
  const plan =
    a.contacts === "tres_mas"
      ? "El plan Gratis permite 2 contactos. Para 5 haría falta Plus, que hoy es solo un plan y no se puede contratar."
      : "El plan Gratis (1 propiedad y 2 contactos) alcanza para tu caso.";
  const tips: Record<Concern, string> = {
    nadie_contesta: "Elige contactos que suelan tener el teléfono a la mano y avísales de antemano que serán tu cadena.",
    falsas: "Hoy Vigil solo dispara con un botón de simulación; con sensores reales (planeados) habría falsas alarmas. Pídeles a tus contactos que sepan que puede ser una prueba.",
    privacidad: "Vigil no usa cámaras ni micrófonos y no guarda imagen. Este chat tampoco guarda lo que escribes: solo guarda tus opciones.",
    no_se_a_quien: "Pon en el nivel 1 a quien viva más cerca o conteste más rápido, y en el 2 a quien sea más de confianza.",
  };
  let caveat: string | null = null;
  let confidence: Recommendation["confidence"] = "alta";
  if (a.place === "vehiculo") {
    caveat = "Las alertas para vehículo todavía no existen (están planeadas). Lo que hoy puedes probar es el mismo flujo con una casa.";
    confidence = "baja";
  } else if (a.place === "otro") {
    caveat = "Vigil se probó solo con una casa o departamento; para otros lugares no hay evidencia todavía.";
    confidence = "media";
  } else if (a.contacts === "ninguno") {
    confidence = "media";
  }
  return {
    ladder: ["Nivel 1: tú (al instante)", level2, "Nivel 3: entrega a una persona (a los 120 s en la demo)"],
    plan,
    tip: tips[a.concern],
    caveat,
    confidence,
  };
}

// ---------- revision humana ----------
export function needsHuman(a: Answers | null, guardrails: GuardrailType[], unknownCount: number): { flag: boolean; reason: string | null } {
  if (guardrails.includes("order")) return { flag: true, reason: "pregunta de compra o precio" };
  if (a && a.place === "vehiculo") return { flag: true, reason: "lugar no soportado: vehículo" };
  if (unknownCount >= 2) return { flag: true, reason: "no se entendieron las respuestas" };
  return { flag: false, reason: null };
}

// ---------- utilidades ----------
export function cleanTester(s: string | null | undefined): string {
  const t = (s ?? "").trim().toLowerCase();
  return /^[a-z0-9_-]{1,20}$/.test(t) ? t : "";
}

export function validateComment(text: string): { ok: boolean; error?: string } {
  if (text.length > MAX_COMMENT) return { ok: false, error: `El comentario admite máximo ${MAX_COMMENT} caracteres.` };
  if (hasPersonalData(text)) return { ok: false, error: "El comentario parece incluir un dato personal. Quítalo para enviarlo." };
  return { ok: true };
}
