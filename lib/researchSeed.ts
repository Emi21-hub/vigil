// Investigacion de Week 2. Cada fila cita su fuente y dice que tan confiable es.
// Regla: si un dato no se pudo verificar, se dice "no verificado"; no se inventa.
// Este archivo es tambien el RESPALDO: si Supabase esta pausado o tarda mas de
// 6 s, la pagina muestra estas mismas filas en vez de quedarse vacia.

export type Kind = "example" | "competitor" | "mexico" | "risk" | "note";
export type Confidence = "alta" | "media" | "baja";

export type ResearchEntry = {
  id: string;
  kind: Kind;
  title: string;
  summary: string;
  source_label: string | null;
  source_url: string | null;
  confidence: Confidence;
  data: Record<string, string | number | boolean | null>;
  created_at?: string;
};

export const RESEARCH_SEED: ResearchEntry[] = [
  // ---------- Casos globales ----------
  {
    id: "ex-salt-lake",
    kind: "example",
    title: "Salt Lake City: respuesta verificada (2000)",
    summary:
      "La ciudad exigio verificar una alarma antes de enviar policia. La guia de POP Center reporta que las ciudades que lo adoptan reducen llamadas de alarma en torno al 90 % y que Salt Lake City gano el equivalente a cinco policias de tiempo completo. La guia no cita estudio para esas cifras.",
    source_label: "POP Center — False Burglar Alarms, 2nd ed.",
    source_url: "https://popcenter.asu.edu/problems/false_alarms/4",
    confidence: "media",
    data: { lesson: "Verificar antes de despachar es la norma que Vigil debe respetar." },
  },
  {
    id: "ex-los-angeles",
    kind: "example",
    title: "Los Angeles PD: reestructura de 2004",
    summary:
      "Tras reestructurar su politica en 2004, las llamadas y los despachos por alarma cayeron aproximadamente a la mitad. LAPD suspende el servicio despues de dos falsas alarmas en 12 meses.",
    source_label: "POP Center — False Burglar Alarms, 2nd ed.",
    source_url: "https://popcenter.asu.edu/problems/false_alarms/4",
    confidence: "media",
    data: { lesson: "Las falsas alarmas tienen costo real: la policia deja de responder." },
  },
  {
    id: "ex-ecv",
    kind: "example",
    title: "Verificacion mejorada por llamada (ECV)",
    summary:
      "Intentar contactar al duenio por dos o mas vias antes de llamar a la policia redujo las falsas alarmas entre 25 % y 40 %. En Montgomery County (Maryland, 2004) las empresas de alarmas cancelaron 24 % de las solicitudes de despacho.",
    source_label: "POP Center — False Burglar Alarms, 2nd ed.",
    source_url: "https://popcenter.asu.edu/problems/false_alarms/4",
    confidence: "media",
    data: { lesson: "Este es el origen de la escalera de Vigil: primero tu, luego tus contactos." },
  },
  {
    id: "ex-noonlight",
    kind: "example",
    title: "Noonlight: boton de seguridad con despacho de emergencia",
    summary:
      "App con boton de seguridad y respuesta de emergencia; gratis en Android, y en iOS la suscripcion agrega app de Apple Watch y respuesta automatica por choque. Ofrece APIs para que otras apps agreguen despacho y monitoreo profesional. Precio de las APIs: no publicado.",
    source_label: "Noonlight Help Center",
    source_url: "https://help.noonlight.com/en/articles/3270559-how-much-does-noonlight-cost",
    confidence: "alta",
    data: { lesson: "El despacho humano se puede comprar como servicio; Vigil aun no lo hace." },
  },
  {
    id: "ex-wyze",
    kind: "example",
    title: "Wyze Home Monitoring: monitoreo profesional barato (2020)",
    summary:
      "Wyze lanzo monitoreo profesional a US$5 al mes (US$60 al anio) el 10 de diciembre de 2020, operado con Noonlight y una central certificada TMA Five-Diamond. Una guia posterior lista Wyze en US$10 al mes: el precio cambio.",
    source_label: "Security Sales & Integration",
    source_url: "https://www.securitysales.com/news/wyze-pro-security-monitoring/122183/",
    confidence: "media",
    data: { lesson: "Los precios de monitoreo bajan y cambian; el modelo no puede depender de un precio fijo." },
  },

  // ---------- Mexico ----------
  {
    id: "mx-alarmas-vecinales",
    kind: "mexico",
    title: "Alarmas Vecinales CDMX (2014–2020)",
    summary:
      "Programa creado en 2014 por el gobierno de la CDMX. Dejo de operar en las 16 alcaldias el 3 de agosto de 2020 porque termino el contrato con la empresa. Lo sustituyo el boton de panico de 'Mi Calle' en la App CDMX.",
    source_label: "Eje Central",
    source_url: "https://www.ejecentral.com.mx/programa-alarmas-vecinales-dejara-de-funcionar-en-la-cdmx?p=10",
    confidence: "alta",
    data: { lesson: "Un programa de alarma comunitaria murio por depender de un solo contrato." },
  },
  {
    id: "mx-mi-alarma-en-casa",
    kind: "mexico",
    title: "Mi Alarma en Casa (App CDMX)",
    summary:
      "Boton virtual en el celular que suena en el C2. Si el domicilio esta registrado y la persona esta en casa, el C2 envia patrulla; la propia autoridad lo presenta como complemento del 911, no sustituto, y los 3–4 minutos de llegada son estimacion oficial, no garantia.",
    source_label: "Chilango (feb 2024)",
    source_url: "https://www.chilango.com/ciudadania/mi-alarma-en-casa-de-app-cdmx-activa-el-boton-del-c2-desde-el-celular-en-caso-de-emergencia/",
    confidence: "alta",
    data: { lesson: "En CDMX ya existe un canal oficial; Vigil debe mandar a la persona a ese canal." },
  },
  {
    id: "mx-robo-casa-2026",
    kind: "mexico",
    title: "Robo a casa habitacion, enero–junio 2026",
    summary:
      "Denuncias: Estado de Mexico 1,559 (frente a 2,806 un anio antes, -44 %), Guanajuato 1,278, Ciudad de Mexico 1,113, Puebla 959, Hidalgo 841, Jalisco 835. La nota atribuye la baja de 44 % al SESNSP; no indica la fuente del ranking. Son denuncias, no delitos totales.",
    source_label: "Posta Mexico",
    source_url: "https://www.posta.com.mx/edomex/edomex-encabeza-lista-nacional-en-robo-a-casa-habitacion/vl2235886",
    confidence: "media",
    data: { lesson: "El problema existe en la zona de los primeros usuarios (CDMX / Edomex)." },
  },
  {
    id: "mx-mercado-2015",
    kind: "mexico",
    title: "Mercado de alarmas en hogares (dato de 2015)",
    summary:
      "AMAI: 14.2 % de los hogares mexicanos (4.06 millones) tenia sistema de seguridad avanzado; monitoreo de 250 a 700 pesos al mes. Dato de hace mas de diez anios: sirve como orden de magnitud, no como cifra actual.",
    source_label: "El Financiero (ago 2015)",
    source_url: "https://www.elfinanciero.com.mx/empresas/uno-de-cada-10-hogares-tiene-sistema-antirrobo/",
    confidence: "baja",
    data: { lesson: "Existe disposicion a pagar mensualidad, pero el dato esta viejo." },
  },

  // ---------- Competidores ----------
  {
    id: "cp-ring",
    kind: "competitor",
    title: "Ring Alarm",
    summary:
      "Sistema DIY con plan de monitoreo profesional. Las camaras son opcionales. En Mexico se venden dispositivos Ring en Amazon y Mercado Libre; monitoreo profesional en Mexico: no verificado.",
    source_label: "Tom's Guide / Xataka Mexico",
    source_url: "https://www.tomsguide.com/us/best-diy-security-system,review-5591.html",
    confidence: "baja",
    data: { price: "US$10–20/mes (la fuente se contradice)", camera: "opcional", region: "EE. UU.; equipo en MX", status: "activo", model: "Hardware + suscripcion" },
  },
  {
    id: "cp-simplisafe",
    kind: "competitor",
    title: "SimpliSafe",
    summary:
      "Monitoreo profesional por niveles. Camaras no requeridas salvo para la proteccion exterior con IA de los niveles Pro. La misma guia da dos juegos de precios distintos.",
    source_label: "Tom's Guide",
    source_url: "https://www.tomsguide.com/us/best-diy-security-system,review-5591.html",
    confidence: "baja",
    data: { price: "US$15–50/mes (o US$22–80 segun otra tabla)", camera: "no", region: "EE. UU.", status: "activo", model: "Hardware + suscripcion" },
  },
  {
    id: "cp-abode",
    kind: "competitor",
    title: "Abode",
    summary:
      "Plan gratis, Standard (US$69/anio) y Pro con monitoreo profesional (US$229/anio). Monitoreo por periodos cortos como complemento.",
    source_label: "Tom's Guide",
    source_url: "https://www.tomsguide.com/us/best-diy-security-system,review-5591.html",
    confidence: "media",
    data: { price: "US$229/anio (Pro)", camera: "opcional", region: "EE. UU.", status: "activo", model: "Freemium + suscripcion" },
  },
  {
    id: "cp-wyze",
    kind: "competitor",
    title: "Wyze Home Monitoring",
    summary:
      "Un solo plan de monitoreo profesional, sin respaldo celular. El kit inicial no trae camara. Lanzo a US$5/mes en 2020; una guia reciente lo lista en US$10/mes.",
    source_label: "Tom's Guide / Security Sales",
    source_url: "https://www.securitysales.com/news/wyze-pro-security-monitoring/122183/",
    confidence: "media",
    data: { price: "US$10/mes o US$100/anio", camera: "opcional", region: "EE. UU.", status: "activo", model: "Hardware + suscripcion" },
  },
  {
    id: "cp-noonlight",
    kind: "competitor",
    title: "Noonlight",
    summary:
      "Protege a la persona, no a la casa: boton de seguridad con despacho. Gratis en Android; la suscripcion de iOS agrega funciones. Sin camaras.",
    source_label: "Noonlight Help Center",
    source_url: "https://help.noonlight.com/en/articles/3270559-how-much-does-noonlight-cost",
    confidence: "alta",
    data: { price: "Gratis; iOS de pago (monto no publicado)", camera: "no", region: "EE. UU.", status: "activo", model: "Freemium" },
  },
  {
    id: "cp-mi-alarma",
    kind: "competitor",
    title: "Mi Alarma en Casa (gobierno CDMX)",
    summary:
      "Canal oficial gratuito dentro de la App CDMX. Costo: la fuente no lo indica. Requiere registrar domicilio y cuenta Llave; solo cubre CDMX.",
    source_label: "Chilango",
    source_url: "https://www.chilango.com/ciudadania/mi-alarma-en-casa-de-app-cdmx-activa-el-boton-del-c2-desde-el-celular-en-caso-de-emergencia/",
    confidence: "alta",
    data: { price: "No indicado por la fuente", camera: "no", region: "CDMX", status: "activo", model: "Servicio publico" },
  },
  {
    id: "cp-alarmas-vecinales",
    kind: "competitor",
    title: "Alarmas Vecinales (CDMX)",
    summary:
      "Alarmas comunitarias del gobierno de la CDMX. Terminaron el 3 de agosto de 2020 al vencer el contrato.",
    source_label: "Eje Central",
    source_url: "https://www.ejecentral.com.mx/programa-alarmas-vecinales-dejara-de-funcionar-en-la-cdmx?p=10",
    confidence: "alta",
    data: { price: "No indicado por la fuente", camera: "no", region: "CDMX", status: "descontinuado", model: "Servicio publico" },
  },
  {
    id: "cp-monitoreo-mx",
    kind: "competitor",
    title: "Monitoreo privado tradicional (Mexico)",
    summary:
      "Empresas locales de alarma con monitoreo. Rango de 2015: 250–700 pesos al mes, equipo aparte o incluido. No se verificaron precios actuales de Verisure ni Prosegur en Mexico.",
    source_label: "El Financiero (2015)",
    source_url: "https://www.elfinanciero.com.mx/empresas/uno-de-cada-10-hogares-tiene-sistema-antirrobo/",
    confidence: "baja",
    data: { price: "MXN 250–700/mes (2015)", camera: "opcional", region: "Mexico", status: "activo", model: "Contrato de servicio" },
  },

  // ---------- Riesgos ----------
  {
    id: "rk-auto911",
    kind: "risk",
    title: "Llamar a emergencias automaticamente",
    summary:
      "Muchas jurisdicciones castigan o suspenden la respuesta tras falsas alarmas (LAPD: dos en 12 meses). Por eso Vigil no marca solo: al final de la escalera una persona recibe la instruccion de llamar.",
    source_label: "POP Center",
    source_url: "https://popcenter.asu.edu/problems/false_alarms/4",
    confidence: "media",
    data: { likelihood: 4, impact: 5, mitigation: "Entrega a una persona; nunca marcado automatico." },
  },
  {
    id: "rk-falsas",
    kind: "risk",
    title: "Falsas alarmas que cansan a los contactos",
    summary: "Si los contactos reciben alertas falsas, dejan de responder. El boton 'Estoy bien' corta la escalera antes del Tier 2.",
    source_label: "Prueba propia (Week 1)",
    source_url: null,
    confidence: "media",
    data: { likelihood: 4, impact: 4, mitigation: "Ventana de confirmacion del duenio antes de avisar a otros." },
  },
  {
    id: "rk-simulado",
    kind: "risk",
    title: "Las notificaciones son solo simuladas",
    summary: "Ningun SMS ni llamada sale de verdad. Cada aviso esta marcado 'Simulado — no enviado'. Enviar reales requiere proveedores con costo y aprobacion.",
    source_label: "Estado actual del prototipo",
    source_url: null,
    confidence: "alta",
    data: { likelihood: 5, impact: 3, mitigation: "Etiqueta visible y declaracion en el pie de pagina." },
  },
  {
    id: "rk-pestana",
    kind: "risk",
    title: "La escalera solo avanza con la pagina abierta",
    summary: "Hallazgo real de Week 1: el nivel se calcula al leer, pero las filas de alert_log solo se escriben mientras la pagina esta abierta. Una version real necesita un proceso en servidor.",
    source_label: "Iteration log de Week 1",
    source_url: null,
    confidence: "alta",
    data: { likelihood: 5, impact: 4, mitigation: "Documentado; fase siguiente: escalamiento en servidor." },
  },
  {
    id: "rk-rls",
    kind: "risk",
    title: "Base de datos abierta a cualquiera (solo demo)",
    summary: "Las politicas RLS permiten lectura y escritura anonima para que la demo funcione. Con datos reales de contactos esto seria inaceptable.",
    source_label: "sql/week1.sql",
    source_url: null,
    confidence: "alta",
    data: { likelihood: 5, impact: 4, mitigation: "Contactos ficticios; autenticacion y RLS por usuario antes de datos reales." },
  },
  {
    id: "rk-contactos",
    kind: "risk",
    title: "Los contactos no aceptan el rol",
    summary: "Nadie ha preguntado a un posible contacto de confianza si querria recibir estas alertas. Es una suposicion sin validar.",
    source_label: "Pendiente: conversacion de validacion",
    source_url: null,
    confidence: "baja",
    data: { likelihood: 3, impact: 4, mitigation: "Entrevista real con una persona antes de Week 3." },
  },
  {
    id: "rk-proveedor",
    kind: "risk",
    title: "Depender de un solo proveedor o contrato",
    summary: "Alarmas Vecinales termino al vencer un contrato. Vigil depende de Supabase y Vercel gratuitos: Supabase pausa proyectos inactivos a los 7 dias.",
    source_label: "Eje Central; experiencia propia (Week 1)",
    source_url: "https://www.ejecentral.com.mx/programa-alarmas-vecinales-dejara-de-funcionar-en-la-cdmx?p=10",
    confidence: "media",
    data: { likelihood: 3, impact: 3, mitigation: "Respaldo con datos locales y revision semanal del proyecto." },
  },
];
