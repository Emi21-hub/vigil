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
