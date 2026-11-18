// Data for /product. Everything under "segments" is a HYPOTHESIS to validate, not a fact.
// Each feature's status is honest: "Prototype" = it exists and was tested on the
// live site; "Planned" = it does not exist yet.

export type Status = "Prototype" | "Planned";
export type TierId = "gratis" | "plus" | "familia"; // internal ids; display names are Free / Plus / Family

export type Feature = {
  id: string;
  name: string;
  description: string;
  status: Status;
  tiers: TierId[]; // which plans would include it
  note?: string;
};

export type Segment = {
  id: string;
  name: string;
  who: string;
  problem: string;
  hypothesis: string;
  validation: string; // how it would be checked
};

export const SEGMENTS: Segment[] = [
  {
    id: "sin-camaras",
    name: "People who reject cameras at home",
    who: "Renters or owners in Mexico City / Estado de Mexico who have no alarm because a camera inside their home feels invasive.",
    problem: "They are left with no protection at all, or with an alarm that only sends a notification nobody answers.",
    hypothesis: "They would pay a low monthly fee for alerts that escalate to trusted people without recording their home.",
    validation: "Real conversations with 5 people of this profile (pending: none recorded yet).",
  },
  {
    id: "contactos",
    name: "Families with someone who lives alone",
    who: "Children or siblings who want to know if someone enters the home of a relative who lives alone.",
    problem: "They find out late or not at all; there is no clear chain of who acts first.",
    hypothesis: "The payer is the worried relative, not the person who lives in the home.",
    validation: "Ask 3 families whether they would pay and who would pay (pending).",
  },
];

export const FEATURES: Feature[] = [
  { id: "armar", name: "Arm / disarm property", description: "Property state that persists on reload.", status: "Prototype", tiers: ["gratis", "plus", "familia"] },
  { id: "escalera", name: "Escalation ladder", description: "You, then trusted contacts, then hand-off to a person.", status: "Prototype", tiers: ["gratis", "plus", "familia"], note: "The 60 s / 120 s timings are a demo compression." },
  { id: "contactos", name: "Trusted contacts per level", description: "Add and remove contacts in Tier 1 and 2.", status: "Prototype", tiers: ["gratis", "plus", "familia"] },
  { id: "historial", name: "Incident history", description: "Every incident with its outcome and response time.", status: "Prototype", tiers: ["gratis", "plus", "familia"] },
  { id: "simulado", name: "Simulated, labelled alerts", description: "Each alert is a row labelled 'Simulated — not sent'.", status: "Prototype", tiers: ["gratis", "plus", "familia"], note: "Nothing real is sent." },
  { id: "investigacion", name: "Research page", description: "Cases, competitors and risks with source and confidence.", status: "Prototype", tiers: ["gratis", "plus", "familia"] },
  { id: "sms", name: "Real SMS / phone call to contacts", description: "Real delivery of alerts through a provider.", status: "Planned", tiers: ["plus", "familia"], note: "Requires a paid provider." },
  { id: "servidor", name: "Server-side escalation", description: "The ladder advances even if nobody has the page open.", status: "Planned", tiers: ["plus", "familia"], note: "Known limitation since Week 1." },
  { id: "cuentas", name: "Accounts and private data per user", description: "Authentication and per-user rules instead of open access.", status: "Planned", tiers: ["gratis", "plus", "familia"], note: "Today the database is open (demo only)." },
  { id: "sensores", name: "Door / motion sensors", description: "Automatic trigger instead of a button.", status: "Planned", tiers: ["plus", "familia"], note: "Requires hardware." },
  { id: "vehiculo", name: "Vehicle alerts", description: "The same flow for a car.", status: "Planned", tiers: ["familia"] },
  { id: "multi", name: "Several properties", description: "More than one home or car per account.", status: "Planned", tiers: ["familia"] },
];

export const TIERS: { id: TierId; name: string; monthlyMXN: number; pitch: string; limit: string }[] = [
  { id: "gratis", name: "Free", monthlyMXN: 0, pitch: "Try the ladder with 1 property.", limit: "1 property · 2 contacts" },
  { id: "plus", name: "Plus", monthlyMXN: 99, pitch: "Real alerts and server-side escalation (when they exist).", limit: "1 property · 5 contacts" },
  { id: "familia", name: "Family", monthlyMXN: 199, pitch: "Several properties and vehicle (when they exist).", limit: "3 properties · 10 contacts" },
];
// Datos de /product. Todo lo de "segmentos" son HIPOTESIS a validar, no hechos.
// El estado de cada funcion es honesto: "Prototipo" = existe y se probo en el
// sitio en vivo; "Planeado" = no existe todavia.

export type Status = "Prototipo" | "Planeado";
export type TierId = "gratis" | "plus" | "familia";

export type Feature = {
  id: string;
  name: string;
  description: string;
  status: Status;
  tiers: TierId[]; // en que planes estaria incluida
  note?: string;
};

export type Segment = {
  id: string;
  name: string;
  who: string;
  problem: string;
  hypothesis: string;
  validation: string; // como se comprobaria
};

export const SEGMENTS: Segment[] = [
  {
    id: "sin-camaras",
    name: "Personas que rechazan camaras en casa",
    who: "Inquilinos o propietarios en CDMX / Estado de Mexico que no tienen alarma porque una camara dentro de su casa les parece invasiva.",
    problem: "Se quedan sin ninguna proteccion, o tienen una alarma que solo manda una notificacion que nadie atiende.",
    hypothesis: "Pagarian una mensualidad baja por avisos que escalan a personas de confianza sin grabar su casa.",
    validation: "Conversaciones reales con 5 personas de este perfil (pendiente: aun no hay ninguna registrada).",
  },
  {
    id: "contactos",
    name: "Familias con alguien que vive solo",
    who: "Hijos o hermanos que quieren enterarse si alguien entra a la casa de un familiar que vive solo.",
    problem: "Se enteran tarde o no se enteran; no hay una cadena clara de quien actua primero.",
    hypothesis: "El que paga es el familiar preocupado, no el que vive en la casa.",
    validation: "Preguntar a 3 familias si pagarian y quien pagaria (pendiente).",
  },
];

export const FEATURES: Feature[] = [
  { id: "armar", name: "Armar / desarmar propiedad", description: "Estado de la propiedad que persiste al recargar.", status: "Prototipo", tiers: ["gratis", "plus", "familia"] },
  { id: "escalera", name: "Escalera de escalamiento", description: "Tu, luego contactos de confianza, luego entrega a una persona.", status: "Prototipo", tiers: ["gratis", "plus", "familia"], note: "Tiempos de 60 s / 120 s son compresion de demo." },
  { id: "contactos", name: "Contactos de confianza por nivel", description: "Alta y baja de contactos en Tier 1 y 2.", status: "Prototipo", tiers: ["gratis", "plus", "familia"] },
  { id: "historial", name: "Historial de incidentes", description: "Cada incidente con su resultado y tiempo de respuesta.", status: "Prototipo", tiers: ["gratis", "plus", "familia"] },
  { id: "simulado", name: "Avisos simulados y etiquetados", description: "Cada aviso es una fila etiquetada 'Simulado — no enviado'.", status: "Prototipo", tiers: ["gratis", "plus", "familia"], note: "No se envia nada real." },
  { id: "investigacion", name: "Pagina de investigacion", description: "Casos, competidores y riesgos con fuente y confianza.", status: "Prototipo", tiers: ["gratis", "plus", "familia"] },
  { id: "sms", name: "SMS / llamada real a contactos", description: "Entrega real de avisos por un proveedor.", status: "Planeado", tiers: ["plus", "familia"], note: "Requiere proveedor de pago." },
  { id: "servidor", name: "Escalamiento en servidor", description: "La escalera avanza aunque nadie tenga la pagina abierta.", status: "Planeado", tiers: ["plus", "familia"], note: "Limitacion conocida desde Week 1." },
  { id: "cuentas", name: "Cuentas y datos privados por usuario", description: "Autenticacion y reglas por usuario en vez de acceso abierto.", status: "Planeado", tiers: ["gratis", "plus", "familia"], note: "Hoy la base esta abierta (solo demo)." },
  { id: "sensores", name: "Sensores de puerta / movimiento", description: "Disparo automatico en vez de boton.", status: "Planeado", tiers: ["plus", "familia"], note: "Requiere hardware." },
  { id: "vehiculo", name: "Alertas para vehiculo", description: "Mismo flujo para un auto.", status: "Planeado", tiers: ["familia"] },
  { id: "multi", name: "Varias propiedades", description: "Mas de una casa o auto por cuenta.", status: "Planeado", tiers: ["familia"] },
];

export const TIERS: { id: TierId; name: string; monthlyMXN: number; pitch: string; limit: string }[] = [
  { id: "gratis", name: "Gratis", monthlyMXN: 0, pitch: "Probar la escalera con 1 propiedad.", limit: "1 propiedad · 2 contactos" },
  { id: "plus", name: "Plus", monthlyMXN: 99, pitch: "Avisos reales y escalamiento en servidor (cuando existan).", limit: "1 propiedad · 5 contactos" },
  { id: "familia", name: "Familia", monthlyMXN: 199, pitch: "Varias propiedades y vehiculo (cuando existan).", limit: "3 propiedades · 10 contactos" },
];
