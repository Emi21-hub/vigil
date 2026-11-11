// Contenido de marketing de Vigil, generado desde PLANTILLAS con hechos reales del producto.
// No es contenido de IA y no incluye testimonios, cifras de usuarios ni logos de prensa.
// Hechos que se pueden afirmar hoy: no usa camaras; la escalera va de "tu" a contactos de
// confianza a una entrega a una persona; los avisos son simulados; es una demo estudiantil.

import type { Card } from "./marketingEngine";

export const BRAND_CARD: Card = {
  id: "brand",
  kind: "brand",
  title: "Sistema de marca",
  text: [
    "Nombre: Vigil",
    "Promesa: alerta si alguien entra a tu casa y avisa a personas de confianza en orden, sin grabar tu casa.",
    "Voz: tranquila, directa y honesta. Frases cortas. Dice lo que existe hoy y lo que es plan.",
    "Palabras que usamos: aviso, contactos de confianza, escalera, sin cámaras, prototipo.",
    "Palabras que evitamos: el mejor, revolucionario, 100 % seguro, garantizado, protección total.",
    "Color: fondo casi negro (#0a0a0a), texto claro y un solo acento ámbar para lo urgente.",
    "Tipografía: la misma del producto, sans-serif del sistema.",
    "Regla de honestidad: todo aviso es simulado hoy y Vigil no llama a servicios de emergencia.",
  ].join("\n"),
};

export const PERSONA_CARD: Card = {
  id: "persona",
  kind: "persona",
  title: "Persona objetivo (ficticia, de trabajo)",
  text: [
    "ETIQUETA: persona ficticia construida desde la hipótesis del Segmento A. No es una entrevista ni una persona real.",
    "Camila, 31 años, diseñadora freelance que renta un departamento en la Narvarte, CDMX.",
    "Situación: vive sola, no tiene alarma. Una cámara dentro de casa le parece invasiva.",
    "Dolor: si alguien entrara, nadie se enteraría a tiempo, y las notificaciones de una app que nadie atiende no sirven.",
    "Qué quiere: que se avise a su hermano y a una vecina de confianza, en orden, sin que su casa esté grabada.",
    "Qué la frena: no confía en apps que piden datos de más; no quiere pagar por algo que no entiende.",
    "Dónde la encontramos (hipótesis): Instagram y TikTok, grupos de vecinos, recomendaciones de amigos.",
    "Validación pendiente: aún no hay conversaciones reales registradas con este perfil.",
  ].join("\n"),
};

export const LANDING_CARD: Card = {
  id: "landing",
  kind: "landing",
  title: "Copy de la página de inicio",
  text: [
    "Titular A: Alertas de intrusión para tu casa, sin cámaras",
    "Titular B: Si alguien entra, que se entere alguien que sí contesta",
    "Subtítulo: Vigil avisa primero a ti, luego a tus contactos de confianza y al final entrega el aviso a una persona. No graba tu casa.",
    "Botón A: Probar la demo",
    "Botón B: Probar la demo gratis",
    "Cómo funciona: 1) Armas tu propiedad. 2) Si algo la activa, el aviso sube por la escalera. 3) Alguien responde y el incidente queda en el historial.",
    "Aclaración visible: es una demo estudiantil, los avisos son simulados y Vigil no contacta servicios de emergencia.",
    "Pregunta frecuente: ¿Usa cámaras? No. Vigil no graba imagen ni audio de tu casa.",
  ].join("\n"),
};

const FOOT = "Demo estudiantil: los avisos son simulados.";

export const POSTS: Card[] = [
  { id: "post-1", kind: "post", title: "Post 1 (Instagram): la pregunta de las 3 a. m.",
    text: ["Si alguien entra a tu casa mientras duermes, ¿quién se entera?", "Casi nadie. Por eso construí Vigil: una alerta que sube por una escalera de personas de confianza, sin cámaras.", "Pruébala: vigil-vigil21.vercel.app", FOOT, "#sincamaras #seguridad #cdmx"].join("\n\n") },
  { id: "post-2", kind: "post", title: "Post 2 (X): una frase",
    text: ["Una alarma que solo te manda una notificación no resuelve nada si nadie la atiende. Vigil prueba otra idea: tú, luego tus contactos, luego una persona.", "vigil-vigil21.vercel.app", FOOT].join("\n\n") },
  { id: "post-3", kind: "post", title: "Post 3 (LinkedIn): el problema",
    text: ["Vivir solo y no querer cámaras dentro de casa deja a mucha gente sin ninguna protección.", "Estoy probando un prototipo, Vigil, para ese caso: un aviso que escala por contactos de confianza y no graba la casa.", "Es un proyecto de curso. Hoy los avisos son simulados y busco opiniones, no clientes.", "vigil-vigil21.vercel.app"].join("\n\n") },
  { id: "post-4", kind: "post", title: "Post 4 (Instagram): cómo funciona",
    text: ["Cómo funciona Vigil en 3 pasos:", "1. Armas tu propiedad.\n2. Si algo la activa, el aviso sube: tú, tus contactos, una persona.\n3. Alguien responde y queda registrado.", "En la demo los tiempos son 60 y 120 segundos para poder verlo.", FOOT].join("\n\n") },
  { id: "post-5", kind: "post", title: "Post 5 (X): honestidad",
    text: ["Lo que Vigil hace hoy: armar, escalar, historial, contactos.\nLo que NO hace todavía: SMS reales, sensores, cuentas.", "Preferimos decirlo claro. Detalle en vigil-vigil21.vercel.app/product"].join("\n\n") },
  { id: "post-6", kind: "post", title: "Post 6 (Instagram): sin cámaras",
    text: ["¿Por qué sin cámaras?", "Porque una cámara dentro de tu casa graba tu vida, no solo una intrusión. Vigil guarda solo qué pasó y a quién se avisó.", FOOT, "#privacidad #sincamaras"].join("\n\n") },
  { id: "post-7", kind: "post", title: "Post 7 (LinkedIn): investigación",
    text: ["Antes de construir Vigil revisé 5 casos globales y 8 competidores, cada uno con fuente y nivel de confianza. Lo que no pude verificar lo marqué como no verificado.", "Está publicado en vigil-vigil21.vercel.app/research"].join("\n\n") },
  { id: "post-8", kind: "post", title: "Post 8 (X): pregunta abierta",
    text: ["Pregunta real: si un familiar que vive solo pudiera avisarte cuando alguien entra a su casa, ¿lo usarías? ¿Quién debería pagar?", "Respondo todo: vigil-vigil21.vercel.app", FOOT].join("\n\n") },
  { id: "post-9", kind: "post", title: "Post 9 (Instagram): contactos de confianza",
    text: ["La parte que más importa de Vigil no es la alarma: es a quién avisa.", "Defines contactos de nivel 1 y nivel 2. Si el primero no responde, sigue el siguiente.", "Pruébalo con tus propios contactos de ejemplo.", FOOT].join("\n\n") },
  { id: "post-10", kind: "post", title: "Post 10 (LinkedIn): lo que sigue",
    text: ["Qué sigue para Vigil: validar con personas reales si pagarían por esto y cuánto, antes de agregar SMS o sensores.", "Si vives solo, o tienes un familiar que vive solo, me ayudaría 10 minutos de tu opinión.", "vigil-vigil21.vercel.app"].join("\n\n") },
];

export const SCRIPTS: Card[] = [
  { id: "script-1", kind: "script", title: "Guion 1 (30 s): la escalera en acción",
    text: ["0-5 s  Pantalla: botón Armar. Voz: Armo mi casa en un clic.", "5-12 s  Pantalla: Simular intrusión. Voz: Alguien entra. Vigil no graba nada, solo avisa.", "12-22 s  Pantalla: contador y nivel 2. Voz: Primero me avisa a mí. Si no respondo, sube a mis contactos de confianza.", "22-30 s  Pantalla: nivel 3. Voz: Al final entrega el aviso a una persona. En la demo los tiempos son cortos.", "Cierre en pantalla: Demo estudiantil, avisos simulados."].join("\n") },
  { id: "script-2", kind: "script", title: "Guion 2 (30 s): por qué sin cámaras",
    text: ["0-6 s  Voz a cámara: Una cámara en tu sala graba tu vida entera.", "6-16 s  Pantalla: historial de Vigil. Voz: Vigil guarda solo qué pasó, cuándo y a quién se avisó.", "16-26 s  Pantalla: página /product. Voz: Y te dice con honestidad qué existe hoy y qué es solo un plan.", "26-30 s  Cierre: Pruébalo en vigil-vigil21.vercel.app"].join("\n") },
  { id: "script-3", kind: "script", title: "Guion 3 (45 s): detrás del proyecto",
    text: ["0-8 s  Voz a cámara: Este es un proyecto de curso y todo es un prototipo.", "8-20 s  Pantalla: /research. Voz: Primero investigué casos y competidores, con fuente y nivel de confianza.", "20-34 s  Pantalla: /pricing. Voz: Después calculé ingresos con supuestos que yo mismo marqué como posibles errores.", "34-45 s  Pantalla: home. Voz: Busco opiniones de gente que vive sola o con familiares que viven solos."].join("\n") },
];

export const CALENDAR_DAYS: { day: number; channel: string; piece: string; goal: string }[] = [
  { day: 1, channel: "Instagram", piece: "Post 1", goal: "Presentar la pregunta central" },
  { day: 2, channel: "X", piece: "Post 2", goal: "Tráfico a la demo" },
  { day: 3, channel: "TikTok / Reels", piece: "Guion 1", goal: "Mostrar la escalera en acción" },
  { day: 4, channel: "LinkedIn", piece: "Post 3", goal: "Explicar el problema" },
  { day: 5, channel: "Instagram", piece: "Post 4", goal: "Explicar cómo funciona" },
  { day: 6, channel: "X", piece: "Post 5", goal: "Ganar confianza con honestidad" },
  { day: 7, channel: "TikTok / Reels", piece: "Guion 2", goal: "Defender el enfoque sin cámaras" },
  { day: 8, channel: "Instagram", piece: "Post 6", goal: "Privacidad" },
  { day: 9, channel: "LinkedIn", piece: "Post 7", goal: "Mostrar la investigación" },
  { day: 10, channel: "X", piece: "Post 8", goal: "Conseguir respuestas de validación" },
  { day: 11, channel: "TikTok / Reels", piece: "Guion 3", goal: "Mostrar el proceso" },
  { day: 12, channel: "Instagram", piece: "Post 9", goal: "Explicar los contactos de confianza" },
  { day: 13, channel: "LinkedIn", piece: "Post 10", goal: "Pedir 10 minutos de opinión" },
  { day: 14, channel: "Interno", piece: "Revisión", goal: "Leer los resultados A/B y decidir qué cambiar" },
];

export const CALENDAR_CARD: Card = {
  id: "calendar",
  kind: "calendar",
  title: "Calendario de campaña de 14 días",
  text: CALENDAR_DAYS.map((d) => `Día ${d.day} · ${d.channel} · ${d.piece}: ${d.goal}`).join("\n"),
};

export const ALL_CARDS: Card[] = [BRAND_CARD, PERSONA_CARD, LANDING_CARD, ...POSTS, ...SCRIPTS, CALENDAR_CARD];
