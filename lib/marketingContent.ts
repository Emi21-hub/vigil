// Vigil marketing content, generated from TEMPLATES with real product facts.
// It is not AI content and includes no testimonials, user numbers or press logos.
// Facts that can be stated today: it uses no cameras; the ladder goes from "you" to trusted
// contacts to a hand-off to a person; alerts are simulated; it is a student demo.

import type { Card } from "./marketingEngine";

export const BRAND_CARD: Card = {
  id: "brand",
  kind: "brand",
  title: "Brand system",
  text: [
    "Name: Vigil",
    "Promise: alerts you if someone enters your home and notifies trusted people in order, without recording your home.",
    "Voice: calm, direct and honest. Short sentences. Says what exists today and what is only a plan.",
    "Words we use: alert, trusted contacts, ladder, no cameras, prototype.",
    "Words we avoid: the best, revolutionary, 100% safe, guaranteed, total protection.",
    "Color: near-black background (#0a0a0a), light text and a single amber accent for urgent things.",
    "Typography: the same as the product, system sans-serif.",
    "Honesty rule: every alert is simulated today and Vigil does not call emergency services.",
  ].join("\n"),
};

export const PERSONA_CARD: Card = {
  id: "persona",
  kind: "persona",
  title: "Target persona (fictional, working)",
  text: [
    "LABEL: fictional persona built from the Segment A hypothesis. It is not an interview or a real person.",
    "Camila, 31, freelance designer who rents an apartment in Narvarte, Mexico City.",
    "Situation: lives alone, has no alarm. A camera inside her home feels invasive.",
    "Pain: if someone broke in, nobody would find out in time, and notifications from an app nobody answers are useless.",
    "What she wants: for her brother and a trusted neighbor to be notified, in order, without her home being recorded.",
    "What holds her back: she does not trust apps that ask for too much data; she does not want to pay for something she does not understand.",
    "Where we find her (hypothesis): Instagram and TikTok, neighborhood groups, recommendations from friends.",
    "Validation pending: there are no real conversations recorded with this profile yet.",
  ].join("\n"),
};

export const LANDING_CARD: Card = {
  id: "landing",
  kind: "landing",
  title: "Home page copy",
  text: [
    "Headline A: Intrusion alerts for your home, without cameras",
    "Headline B: If someone breaks in, let someone who answers find out",
    "Subtitle: Vigil alerts you first, then your trusted contacts, and finally hands the alert to a person. It does not record your home.",
    "Button A: Try the demo",
    "Button B: Try the demo for free",
    "How it works: 1) You arm your property. 2) If something triggers it, the alert climbs the ladder. 3) Someone responds and the incident is kept in the history.",
    "Visible disclaimer: it is a student demo, alerts are simulated and Vigil does not contact emergency services.",
    "FAQ: Does it use cameras? No. Vigil does not record images or audio of your home.",
  ].join("\n"),
};

const FOOT = "Student demo: alerts are simulated.";

export const POSTS: Card[] = [
  { id: "post-1", kind: "post", title: "Post 1 (Instagram): the 3 a.m. question",
    text: ["If someone enters your home while you sleep, who finds out?", "Almost nobody. That is why I built Vigil: an alert that climbs a ladder of trusted people, without cameras.", "Try it: vigil-vigil21.vercel.app", FOOT, "#nocameras #security #cdmx"].join("\n\n") },
  { id: "post-2", kind: "post", title: "Post 2 (X): one sentence",
    text: ["An alarm that only sends you a notification solves nothing if nobody answers it. Vigil tests another idea: you, then your contacts, then a person.", "vigil-vigil21.vercel.app", FOOT].join("\n\n") },
  { id: "post-3", kind: "post", title: "Post 3 (LinkedIn): the problem",
    text: ["Living alone and not wanting cameras inside your home leaves many people with no protection at all.", "I am testing a prototype, Vigil, for that case: an alert that escalates through trusted contacts and does not record the home.", "It is a course project. Today the alerts are simulated and I am looking for opinions, not customers.", "vigil-vigil21.vercel.app"].join("\n\n") },
  { id: "post-4", kind: "post", title: "Post 4 (Instagram): how it works",
    text: ["How Vigil works in 3 steps:", "1. You arm your property.\n2. If something triggers it, the alert climbs: you, your contacts, a person.\n3. Someone responds and it is logged.", "In the demo the timings are 60 and 120 seconds so you can see it.", FOOT].join("\n\n") },
  { id: "post-5", kind: "post", title: "Post 5 (X): honesty",
    text: ["What Vigil does today: arm, escalate, history, contacts.\nWhat it does NOT do yet: real SMS, sensors, accounts.", "We prefer to say it clearly. Details at vigil-vigil21.vercel.app/product"].join("\n\n") },
  { id: "post-6", kind: "post", title: "Post 6 (Instagram): no cameras",
    text: ["Why no cameras?", "Because a camera inside your home records your life, not just an intrusion. Vigil keeps only what happened and who was notified.", FOOT, "#privacy #nocameras"].join("\n\n") },
  { id: "post-7", kind: "post", title: "Post 7 (LinkedIn): research",
    text: ["Before building Vigil I reviewed 5 global cases and 8 competitors, each with a source and a confidence level. What I could not verify I marked as not verified.", "It is published at vigil-vigil21.vercel.app/research"].join("\n\n") },
  { id: "post-8", kind: "post", title: "Post 8 (X): open question",
    text: ["A real question: if a relative who lives alone could alert you when someone enters their home, would you use it? Who should pay?", "I answer everything: vigil-vigil21.vercel.app", FOOT].join("\n\n") },
  { id: "post-9", kind: "post", title: "Post 9 (Instagram): trusted contacts",
    text: ["The part of Vigil that matters most is not the alarm: it is who it notifies.", "You define level 1 and level 2 contacts. If the first does not respond, the next one follows.", "Try it with your own sample contacts.", FOOT].join("\n\n") },
  { id: "post-10", kind: "post", title: "Post 10 (LinkedIn): what comes next",
    text: ["What is next for Vigil: validating with real people whether they would pay for this and how much, before adding SMS or sensors.", "If you live alone, or have a relative who lives alone, 10 minutes of your opinion would help me.", "vigil-vigil21.vercel.app"].join("\n\n") },
];

export const SCRIPTS: Card[] = [
  { id: "script-1", kind: "script", title: "Script 1 (30 s): the ladder in action",
    text: ["0-5 s  Screen: Arm button. Voice: I arm my home with one click.", "5-12 s  Screen: Simulate intrusion. Voice: Someone gets in. Vigil records nothing, it only alerts.", "12-22 s  Screen: counter and level 2. Voice: It alerts me first. If I do not respond, it climbs to my trusted contacts.", "22-30 s  Screen: level 3. Voice: At the end it hands the alert to a person. In the demo the timings are short.", "On-screen close: Student demo, simulated alerts."].join("\n") },
  { id: "script-2", kind: "script", title: "Script 2 (30 s): why no cameras",
    text: ["0-6 s  Voice to camera: A camera in your living room records your whole life.", "6-16 s  Screen: Vigil history. Voice: Vigil keeps only what happened, when and who was notified.", "16-26 s  Screen: /product page. Voice: And it tells you honestly what exists today and what is only a plan.", "26-30 s  Close: Try it at vigil-vigil21.vercel.app"].join("\n") },
  { id: "script-3", kind: "script", title: "Script 3 (45 s): behind the project",
    text: ["0-8 s  Voice to camera: This is a course project and everything is a prototype.", "8-20 s  Screen: /research. Voice: First I researched cases and competitors, with a source and a confidence level.", "20-34 s  Screen: /pricing. Voice: Then I calculated revenue with assumptions that I myself marked as possible errors.", "34-45 s  Screen: home. Voice: I am looking for opinions from people who live alone or have relatives who live alone."].join("\n") },
];

export const CALENDAR_DAYS: { day: number; channel: string; piece: string; goal: string }[] = [
  { day: 1, channel: "Instagram", piece: "Post 1", goal: "Introduce the central question" },
  { day: 2, channel: "X", piece: "Post 2", goal: "Traffic to the demo" },
  { day: 3, channel: "TikTok / Reels", piece: "Script 1", goal: "Show the ladder in action" },
  { day: 4, channel: "LinkedIn", piece: "Post 3", goal: "Explain the problem" },
  { day: 5, channel: "Instagram", piece: "Post 4", goal: "Explain how it works" },
  { day: 6, channel: "X", piece: "Post 5", goal: "Build trust through honesty" },
  { day: 7, channel: "TikTok / Reels", piece: "Script 2", goal: "Defend the no-camera approach" },
  { day: 8, channel: "Instagram", piece: "Post 6", goal: "Privacy" },
  { day: 9, channel: "LinkedIn", piece: "Post 7", goal: "Show the research" },
  { day: 10, channel: "X", piece: "Post 8", goal: "Get validation responses" },
  { day: 11, channel: "TikTok / Reels", piece: "Script 3", goal: "Show the process" },
  { day: 12, channel: "Instagram", piece: "Post 9", goal: "Explain trusted contacts" },
  { day: 13, channel: "LinkedIn", piece: "Post 10", goal: "Ask for 10 minutes of opinion" },
  { day: 14, channel: "Internal", piece: "Review", goal: "Read the A/B results and decide what to change" },
];

export const CALENDAR_CARD: Card = {
  id: "calendar",
  kind: "calendar",
  title: "14-day campaign calendar",
  text: CALENDAR_DAYS.map((d) => `Day ${d.day} · ${d.channel} · ${d.piece}: ${d.goal}`).join("\n"),
};

export const ALL_CARDS: Card[] = [BRAND_CARD, PERSONA_CARD, LANDING_CARD, ...POSTS, ...SCRIPTS, CALENDAR_CARD];
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
