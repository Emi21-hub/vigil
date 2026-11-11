// Datos y reglas de la capa final de Vigil (Week 6): rutas, recorrido, mapa de agentes,
// revision de impacto, roadmap y bitacora. Sin imports, para probarlo con Node.
// No hay cifras inventadas: lo que no se midio dice "no medido" o "pendiente".

export type RouteInfo = { path: string; label: string; week: number; what: string; marker?: string };

// "marker" es texto que debe aparecer en el HTML de la pagina (titulo definido en su metadata).
export const ROUTES: RouteInfo[] = [
  { path: "/", label: "Inicio", week: 1, what: "Armar la propiedad, simular una intrusion y ver la escalera." },
  { path: "/contacts", label: "Contactos", week: 1, what: "Contactos de confianza por nivel." },
  { path: "/log", label: "Historial", week: 1, what: "Incidentes y tiempo de respuesta." },
  { path: "/research", label: "Investigación", week: 2, what: "Casos, competidores y riesgos con fuente.", marker: "Investigación — Vigil" },
  { path: "/product", label: "Producto", week: 3, what: "Segmentos y funciones: prototipo o planeado.", marker: "Producto — Vigil" },
  { path: "/pricing", label: "Precios", week: 3, what: "Planes y calculadora de ingresos.", marker: "Precios — Vigil" },
  { path: "/marketing", label: "Marketing", week: 4, what: "Piezas de contenido y pruebas A/B.", marker: "Marketing — Vigil" },
  { path: "/chat", label: "Asesor", week: 5, what: "Asesor basado en reglas con filtros.", marker: "Asesor — Vigil" },
  { path: "/demo", label: "Demo", week: 6, what: "Recorrido guiado y mapa de agentes.", marker: "Demo — Vigil" },
  { path: "/dashboard", label: "Dashboard", week: 6, what: "Registros reales y revisión de rutas.", marker: "Dashboard — Vigil" },
  { path: "/docs", label: "Docs", week: 6, what: "Prompts, bitácora, impacto y roadmap.", marker: "Docs — Vigil" },
];

export type Step = { n: number; path: string; title: string; action: string; expect: string };

export const WALKTHROUGH: Step[] = [
  { n: 1, path: "/", title: "Entender qué es Vigil", action: "Lee el titular, pulsa «Armar» en la demo y luego «Simular intrusión».", expect: "El aviso sube de nivel 1 a 2 a los 60 s y a la entrega a los 120 s, siempre marcado como simulado." },
  { n: 2, path: "/contacts", title: "Ver a quién se avisa", action: "Abre Contactos y mira los niveles.", expect: "Los contactos aparecen ordenados por nivel. Son datos de ejemplo: no escribas datos reales." },
  { n: 3, path: "/log", title: "Revisar el historial", action: "Abre Historial después de resolver un incidente.", expect: "El incidente queda con su estado y su tiempo de respuesta." },
  { n: 4, path: "/research", title: "Ver la investigación", action: "Filtra los competidores con la palabra «cdmx».", expect: "El contador baja de 8 y cada fila trae fuente y nivel de confianza." },
  { n: 5, path: "/pricing", title: "Probar los precios", action: "Cambia los supuestos de la calculadora y guarda un escenario.", expect: "El resultado cambia y cada supuesto dice por qué podría estar mal. Todo es hipótesis." },
  { n: 6, path: "/marketing", title: "Ver el contenido y el A/B", action: "Copia una pieza y revisa el panel A/B.", expect: "Verás «Copiado»; el A/B muestra solo visitantes reales y no nombra ganador sin 20 vistas por variante." },
  { n: 7, path: "/chat", title: "Hablar con el asesor", action: "Responde las 3 preguntas y luego escribe un correo electrónico en una de ellas.", expect: "Recibes una cadena sugerida. El correo no se muestra de vuelta ni se guarda." },
  { n: 8, path: "/dashboard", title: "Revisar los registros", action: "Pulsa «Revisar rutas» en el dashboard.", expect: "Cada ruta responde 200 y los conteos salen de la base de datos en vivo." },
];

export type AgentKind = "usuario" | "reglas" | "datos" | "humano" | "agente de código";
export type AgentNode = {
  id: string; name: string; kind: AgentKind; file: string;
  does: string; reads: string; writes: string; checkpoint: string; limit: string;
};

// "Agentes" aqui son componentes con una tarea fija. Ninguno usa un modelo de lenguaje en tiempo de ejecucion.
export const AGENTS: AgentNode[] = [
  { id: "visitor", name: "Visitante", kind: "usuario", file: "—", does: "Usa las páginas, responde al asesor, ve los resultados.", reads: "Páginas", writes: "Clics, respuestas elegidas", checkpoint: "Decide si confiar en lo que ve", limit: "Puede escribir datos personales por error." },
  { id: "ladder", name: "Escalera de avisos", kind: "reglas", file: "lib/ladder.ts", does: "Deriva el nivel de aviso del tiempo transcurrido.", reads: "incidents", writes: "alert_log (simulado)", checkpoint: "Nivel 3 entrega a una persona", limit: "No envía mensajes reales ni llama a emergencias." },
  { id: "research", name: "Motor de investigación", kind: "reglas", file: "lib/researchEngine.ts", does: "Filtra, ordena y puntúa riesgos.", reads: "research_entries", writes: "Notas del usuario", checkpoint: "Cada fila lleva fuente y confianza", limit: "Fuentes secundarias; precios solo orientativos." },
  { id: "pricing", name: "Motor de precios", kind: "reglas", file: "lib/pricingEngine.ts", does: "Calcula ingresos a partir de supuestos.", reads: "Entradas del usuario", writes: "pricing_scenarios", checkpoint: "Todo supuesto dice por qué podría estar mal", limit: "Ningún precio está validado con clientes." },
  { id: "marketing", name: "Motor de marketing y A/B", kind: "reglas", file: "lib/marketingEngine.ts, lib/abTesting.ts", does: "Genera piezas desde plantillas, puntúa titulares (simulado) y cuenta visitantes únicos.", reads: "ab_events, marketing_assets", writes: "ab_events, marketing_assets", checkpoint: "No nombra ganador sin 20 vistas por variante", limit: "Sin visitantes reales todavía; el puntuador no es IA." },
  { id: "chat", name: "Asesor /chat", kind: "reglas", file: "lib/chatLogic.ts", does: "Hace 3 preguntas, aplica filtros y recomienda una cadena de avisos.", reads: "Opciones elegidas", writes: "chat_sessions, chat_feedback (solo escritura)", checkpoint: "Marca precio, vehículo o confusión para revisión humana", limit: "Entiende palabras clave; nadie puede responder a un chat marcado." },
  { id: "db", name: "Supabase", kind: "datos", file: "sql/week1..5.sql", does: "Guarda registros con reglas de acceso por fila.", reads: "—", writes: "—", checkpoint: "Chats y comentarios: solo escritura; el resto: demo abierta", limit: "Las políticas abiertas permiten datos falsos." },
  { id: "owner", name: "Emilio (revisión humana)", kind: "humano", file: "—", does: "Lee las tablas, decide qué cambiar y aprueba cada commit.", reads: "Tablas y totales", writes: "Decisiones", checkpoint: "Aprueba el alcance y los textos", limit: "Una sola persona revisa." },
  { id: "coder", name: "Agente de código (Claude)", kind: "agente de código", file: "—", does: "Escribe el código a partir de prompts y lo prueba.", reads: "Prompts y archivos", writes: "Commits", checkpoint: "Cada cambio se verifica y se sube con hash comprobado", limit: "No forma parte del producto en ejecución." },
];

export type Impact = { id: string; topic: string; finding: string; mitigation: string; residual: string };

export const IMPACT: Impact[] = [
  { id: "I1", topic: "Valor para el usuario", finding: "Hipótesis: avisar en orden a personas de confianza, sin cámaras, ayuda a quien vive solo.", mitigation: "Se probó con el asesor y la investigación; los textos dicen «hipótesis».", residual: "No hay validación con usuarios reales suficiente: pendiente." },
  { id: "I2", topic: "Falsa sensación de seguridad", finding: "Alguien podría creer que Vigil ya protege su casa.", mitigation: "Todo aviso se marca como simulado, el pie de página y la FAQ lo repiten y la página de producto separa prototipo de planeado.", residual: "Una persona puede ignorar los avisos; no hay forma de impedirlo." },
  { id: "I3", topic: "Emergencias", finding: "Vigil no contacta servicios de emergencia.", mitigation: "El asesor responde «llama al 911» ante una emergencia y lo aclara.", residual: "Si alguien usa Vigil en lugar de llamar, hay riesgo real." },
  { id: "I4", topic: "Privacidad", finding: "No usa cámaras ni micrófonos. El asesor guarda solo opciones elegidas, nunca texto libre.", mitigation: "Tablas del asesor solo de escritura; texto con datos personales no se muestra ni se guarda.", residual: "Las tablas de contactos y otras demos están abiertas; no se deben escribir datos reales." },
  { id: "I5", topic: "Vigilancia indebida", finding: "El plan Familia implica avisar sobre la casa de otra persona.", mitigation: "Es solo un plan; no se puede contratar.", residual: "Antes de construirlo hace falta el consentimiento de la persona monitoreada: no existe." },
  { id: "I6", topic: "Datos falsos", finding: "Las políticas abiertas permiten que cualquiera inserte A/B o chats.", mitigation: "Las sesiones de prueba se excluyen y los totales externos separan «selftest».", residual: "Sin límite de frecuencia ni cuentas, los totales pueden manipularse." },
  { id: "I7", topic: "Viabilidad económica", finding: "Los precios de 99 y 199 MXN al mes son hipótesis.", mitigation: "La calculadora lista cada supuesto y por qué podría fallar.", residual: "Costo real de SMS, hosting e impuestos: no medido." },
  { id: "I8", topic: "Accesibilidad", finding: "Sitio en español, con etiquetas en formularios y contraste alto.", mitigation: "Se usaron etiquetas aria y estados de texto.", residual: "No se probó con lector de pantalla ni en todos los navegadores." },
];

export type RoadmapItem = { id: string; title: string; why: string; priority: "Alta" | "Media" | "Baja"; after: string | null; status: "no iniciado" };

export const ROADMAP: RoadmapItem[] = [
  { id: "R1", title: "Cuentas y acceso por usuario", why: "Cierra las tablas abiertas y permite que cada persona vea solo lo suyo.", priority: "Alta", after: null, status: "no iniciado" },
  { id: "R2", title: "Consentimiento de la persona monitoreada", why: "Necesario antes del plan Familia (ver I5).", priority: "Alta", after: "R1", status: "no iniciado" },
  { id: "R3", title: "Validar con 10 usuarios reales y disposición a pagar", why: "Hoy precios y segmento son hipótesis.", priority: "Alta", after: null, status: "no iniciado" },
  { id: "R4", title: "Avisos reales por SMS o WhatsApp", why: "Hoy todo es simulado; costo por mensaje por verificar.", priority: "Alta", after: "R1", status: "no iniciado" },
  { id: "R5", title: "Límite de frecuencia en inserciones", why: "Evita datos falsos en A/B y chats (ver I6).", priority: "Media", after: "R1", status: "no iniciado" },
  { id: "R6", title: "Sensores de puerta y ventana", why: "Sin sensores solo hay simulación.", priority: "Media", after: "R4", status: "no iniciado" },
  { id: "R7", title: "Pruebas de extremo a extremo automáticas", why: "Hoy la regresión se corre a mano y por rutas.", priority: "Media", after: null, status: "no iniciado" },
  { id: "R8", title: "Auditoría de accesibilidad", why: "No se probó con lector de pantalla (ver I8).", priority: "Media", after: null, status: "no iniciado" },
  { id: "R9", title: "Alertas para vehículo", why: "El asesor ya marca este caso como no soportado.", priority: "Baja", after: "R6", status: "no iniciado" },
];

export type WeekLog = { week: number; theme: string; commits: number; tests: string; fix: string };

export const BUILD_LOG: WeekLog[] = [
  { week: 1, theme: "Escalera de avisos, contactos e historial", commits: 8, tests: "5 pruebas en vivo", fix: "El encabezado decía «Incidente en curso» tras cerrar la alerta; ahora sigue el estado guardado." },
  { week: 2, theme: "Investigación con fuentes", commits: 7, tests: "5 automáticas + 4 en vivo", fix: "La primera versión corrió sin tabla; la página mostró datos de respaldo en vez de romperse." },
  { week: 3, theme: "Producto y precios", commits: 9, tests: "5 automáticas", fix: "Un campo de la calculadora perdía el foco en cada tecla; se rehízo antes de subir." },
  { week: 4, theme: "Marketing y pruebas A/B", commits: 13, tests: "3 automáticas + 3 en vivo", fix: "Las vistas solo se cuentan tras una interacción real, para no contar robots." },
  { week: 5, theme: "Asesor /chat con filtros", commits: 7, tests: "3 automáticas + 3 en vivo", fix: "El filtro de fuera de tema rechazaba «avisar»; ahora usa raíces de palabra." },
];

export type PromptEntry = { week: number; title: string; text: string };

export const PROMPTS: PromptEntry[] = [
  { week: 1, title: "Escalera de avisos", text: "Build the escalation feature for Vigil: a property card with arm/disarm and a simulate-breach button that is disabled while disarmed; a contacts page with tiers; a live incident page; and an incident log. The tier must be derived from (now − incidents.triggered_at) on every read — no cron or background job. Tier 1 at 0 s, Tier 2 at 60 s, hand-off at 120 s. alert_log writes must be idempotent via the unique constraint. Label every simulated alert. Never dial an emergency number. No paid APIs." },
  { week: 2, title: "Investigación", text: "Build a /research page for Vigil modelled on the attached Week 2 example: a Supabase table of sourced research entries, ≥5 global cases, a Mexico section, 8 competitors in a filterable table with a live counter, a risk map, and a notes form. Fall back to the same data if the database is unreachable for 6 seconds. Do not invent data: mark anything unverified and give every row a source and a confidence level." },
  { week: 3, title: "Producto y precios", text: "Build /product and /pricing for Vigil: two customer-segment hypotheses, a 12-feature table where each feature is honestly marked Prototipo or Planeado, three plans (Gratis, Plus 99 MXN, Familia 199 MXN per month), and a revenue calculator with monthly/annual billing that saves scenarios to Supabase. Every price and percentage must be labelled a hypothesis and every assumption must say why it could be wrong." },
  { week: 4, title: "Marketing y A/B", text: "Build /marketing and upgrade the home page for Vigil: a brand system, one fictional-labelled persona, landing copy, exactly 10 posts, 3 video scripts and a 14-day calendar, all template-generated from real product facts; cards with Copy, Export and Save backed by a Supabase marketing_assets table; two live A/B tests on the home (headline and button) logged to ab_events, counting unique visitors, excluding test sessions and naming a leader only after 20 views per variant; a simulated headline scorer; and a credible home with the ladder above the fold, plans labelled available or planned, FAQ, full footer and link-preview metadata. No paid APIs, no invented testimonials, and everything must still render if the database is down." },
  { week: 5, title: "Asesor /chat", text: "Build /chat for Vigil: a guided, rule-based advisor (no AI API, labelled clearly) with a chat UI, exactly 3 intake questions (what to protect, how many trusted people, biggest worry) and rules that return a three-level chain, plan note, tip and confidence. Add guardrails for personal data (never echo or store it), emergencies, abuse, medical/legal/financial advice, order or price requests and off-topic messages; a human checkpoint that flags risky or low-confidence chats; storage in Supabase with insert-only row-level security and an aggregate chat_stats view; optional tester tag; thumbs, 1–5 rating and a comment checked for personal data. Never store typed text, use a 6-second timeout so the chat works if the database is down, and add 3 logic tests." },
];

// Prueba de rutas: dice si una respuesta es correcta. Pura para poder probarla.
export type RouteResult = { path: string; ok: boolean; status: number | null; detail: string };

export function evaluateRoute(r: RouteInfo, status: number | null, body: string | null): RouteResult {
  if (status === null) return { path: r.path, ok: false, status, detail: "sin respuesta" };
  if (status !== 200) return { path: r.path, ok: false, status, detail: "estado " + status };
  if (r.marker && !(body ?? "").includes(r.marker)) return { path: r.path, ok: false, status, detail: "falta «" + r.marker + "»" };
  return { path: r.path, ok: true, status, detail: r.marker ? "200 y «" + r.marker + "»" : "200" };
}

export function roadmapOrder(items: RoadmapItem[]): RoadmapItem[] {
  const rank = { Alta: 0, Media: 1, Baja: 2 } as const;
  return [...items].sort((a, b) => rank[a.priority] - rank[b.priority] || a.id.localeCompare(b.id, "en", { numeric: true }));
}

export const GOAL_EXTERNAL_USERS = 5;
