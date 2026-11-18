// Week 2 research. Every row cites its source and says how reliable it is.
// Rule: if a fact could not be verified, it says "not verified"; nothing is invented.
// This file is also the FALLBACK: if Supabase is paused or takes longer than
// 6 s, the page shows these same rows instead of staying empty.
// Internal enum values (alta/media/baja, activo, opcional...) stay as ids; the UI shows English labels.

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
    title: "Salt Lake City: verified response (2000)",
    summary:
      "The city required an alarm to be verified before sending police. The POP Center guide reports that cities adopting this cut alarm calls by around 90% and that Salt Lake City gained the equivalent of five full-time officers. The guide cites no study for those figures.",
    source_label: "POP Center — False Burglar Alarms, 2nd ed.",
    source_url: "https://popcenter.asu.edu/problems/false_alarms/4",
    confidence: "media",
    data: { lesson: "Verifying before dispatching is the norm Vigil must respect." },
  },
  {
    id: "ex-los-angeles",
    kind: "example",
    title: "Los Angeles PD: 2004 policy overhaul",
    summary:
      "After restructuring its policy in 2004, alarm calls and dispatches fell by about half. LAPD suspends service after two false alarms in 12 months.",
    source_label: "POP Center — False Burglar Alarms, 2nd ed.",
    source_url: "https://popcenter.asu.edu/problems/false_alarms/4",
    confidence: "media",
    data: { lesson: "False alarms have a real cost: the police stop responding." },
  },
  {
    id: "ex-ecv",
    kind: "example",
    title: "Enhanced call verification (ECV)",
    summary:
      "Trying to reach the owner by two or more channels before calling the police reduced false alarms by 25% to 40%. In Montgomery County (Maryland, 2004) alarm companies cancelled 24% of dispatch requests.",
    source_label: "POP Center — False Burglar Alarms, 2nd ed.",
    source_url: "https://popcenter.asu.edu/problems/false_alarms/4",
    confidence: "media",
    data: { lesson: "This is the origin of Vigil's ladder: first you, then your contacts." },
  },
  {
    id: "ex-noonlight",
    kind: "example",
    title: "Noonlight: safety button with emergency dispatch",
    summary:
      "App with a safety button and emergency response; free on Android, and on iOS the subscription adds an Apple Watch app and automatic crash response. It offers APIs so other apps can add dispatch and professional monitoring. API pricing: not published.",
    source_label: "Noonlight Help Center",
    source_url: "https://help.noonlight.com/en/articles/3270559-how-much-does-noonlight-cost",
    confidence: "alta",
    data: { lesson: "Human dispatch can be bought as a service; Vigil does not do it yet." },
  },
  {
    id: "ex-wyze",
    kind: "example",
    title: "Wyze Home Monitoring: cheap professional monitoring (2020)",
    summary:
      "Wyze launched professional monitoring at US$5 a month (US$60 a year) on December 10, 2020, operated with Noonlight and a TMA Five-Diamond certified center. A later guide lists Wyze at US$10 a month: the price changed.",
    source_label: "Security Sales & Integration",
    source_url: "https://www.securitysales.com/news/wyze-pro-security-monitoring/122183/",
    confidence: "media",
    data: { lesson: "Monitoring prices drop and change; the model cannot depend on a fixed price." },
  },

  // ---------- Mexico ----------
  {
    id: "mx-alarmas-vecinales",
    kind: "mexico",
    title: "Alarmas Vecinales CDMX (2014–2020)",
    summary:
      "Program created in 2014 by the Mexico City government. It stopped operating in all 16 boroughs on August 3, 2020 because the contract with the company ended. It was replaced by the 'Mi Calle' panic button in the App CDMX.",
    source_label: "Eje Central",
    source_url: "https://www.ejecentral.com.mx/programa-alarmas-vecinales-dejara-de-funcionar-en-la-cdmx?p=10",
    confidence: "alta",
    data: { lesson: "A community alarm program died from depending on a single contract." },
  },
  {
    id: "mx-mi-alarma-en-casa",
    kind: "mexico",
    title: "Mi Alarma en Casa (App CDMX)",
    summary:
      "Virtual phone button that rings at the C2 (city command center). If the address is registered and the person is at home, the C2 sends a patrol; the authority itself presents it as a complement to 911, not a replacement, and the 3–4 minute arrival is an official estimate, not a guarantee.",
    source_label: "Chilango (Feb 2024)",
    source_url: "https://www.chilango.com/ciudadania/mi-alarma-en-casa-de-app-cdmx-activa-el-boton-del-c2-desde-el-celular-en-caso-de-emergencia/",
    confidence: "alta",
    data: { lesson: "Mexico City already has an official channel; Vigil should send the person to that channel." },
  },
  {
    id: "mx-robo-casa-2026",
    kind: "mexico",
    title: "Home burglary, January–June 2026",
    summary:
      "Reports: Estado de Mexico 1,559 (vs 2,806 a year earlier, -44%), Guanajuato 1,278, Mexico City 1,113, Puebla 959, Hidalgo 841, Jalisco 835. The article attributes the 44% drop to SESNSP; it does not name the source of the ranking. These are reports, not total crimes.",
    source_label: "Posta Mexico",
    source_url: "https://www.posta.com.mx/edomex/edomex-encabeza-lista-nacional-en-robo-a-casa-habitacion/vl2235886",
    confidence: "media",
    data: { lesson: "The problem exists in the area of the first users (CDMX / Edomex)." },
  },
  {
    id: "mx-mercado-2015",
    kind: "mexico",
    title: "Home alarm market (2015 figure)",
    summary:
      "AMAI: 14.2% of Mexican households (4.06 million) had an advanced security system; monitoring cost 250 to 700 pesos a month. A figure more than ten years old: useful as an order of magnitude, not as a current number.",
    source_label: "El Financiero (Aug 2015)",
    source_url: "https://www.elfinanciero.com.mx/empresas/uno-de-cada-10-hogares-tiene-sistema-antirrobo/",
    confidence: "baja",
    data: { lesson: "There is willingness to pay a monthly fee, but the figure is old." },
  },

  // ---------- Competidores ----------
  {
    id: "cp-ring",
    kind: "competitor",
    title: "Ring Alarm",
    summary:
      "DIY system with a professional monitoring plan. Cameras are optional. In Mexico, Ring devices are sold on Amazon and Mercado Libre; professional monitoring in Mexico: not verified.",
    source_label: "Tom's Guide / Xataka Mexico",
    source_url: "https://www.tomsguide.com/us/best-diy-security-system,review-5591.html",
    confidence: "baja",
    data: { price: "US$10–20/mo (the source contradicts itself)", camera: "opcional", region: "US; hardware in MX", status: "activo", model: "Hardware + subscription" },
  },
  {
    id: "cp-simplisafe",
    kind: "competitor",
    title: "SimpliSafe",
    summary:
      "Tiered professional monitoring. Cameras are not required except for the AI outdoor protection in the Pro tiers. The same guide gives two different sets of prices.",
    source_label: "Tom's Guide",
    source_url: "https://www.tomsguide.com/us/best-diy-security-system,review-5591.html",
    confidence: "baja",
    data: { price: "US$15–50/mo (or US$22–80 per another table)", camera: "no", region: "US", status: "activo", model: "Hardware + subscription" },
  },
  {
    id: "cp-abode",
    kind: "competitor",
    title: "Abode",
    summary:
      "Free plan, Standard (US$69/year) and Pro with professional monitoring (US$229/year). Short-term monitoring as an add-on.",
    source_label: "Tom's Guide",
    source_url: "https://www.tomsguide.com/us/best-diy-security-system,review-5591.html",
    confidence: "media",
    data: { price: "US$229/yr (Pro)", camera: "opcional", region: "US", status: "activo", model: "Freemium + subscription" },
  },
  {
    id: "cp-wyze",
    kind: "competitor",
    title: "Wyze Home Monitoring",
    summary:
      "A single professional monitoring plan, without cellular backup. The starter kit includes no camera. It launched at US$5/month in 2020; a recent guide lists it at US$10/month.",
    source_label: "Tom's Guide / Security Sales",
    source_url: "https://www.securitysales.com/news/wyze-pro-security-monitoring/122183/",
    confidence: "media",
    data: { price: "US$10/mo or US$100/yr", camera: "opcional", region: "US", status: "activo", model: "Hardware + subscription" },
  },
  {
    id: "cp-noonlight",
    kind: "competitor",
    title: "Noonlight",
    summary:
      "Protects the person, not the home: safety button with dispatch. Free on Android; the iOS subscription adds features. No cameras.",
    source_label: "Noonlight Help Center",
    source_url: "https://help.noonlight.com/en/articles/3270559-how-much-does-noonlight-cost",
    confidence: "alta",
    data: { price: "Free; iOS paid (amount not published)", camera: "no", region: "US", status: "activo", model: "Freemium" },
  },
  {
    id: "cp-mi-alarma",
    kind: "competitor",
    title: "Mi Alarma en Casa (CDMX government)",
    summary:
      "Free official channel inside the App CDMX. Cost: the source does not say. Requires registering an address and a Llave account; covers only CDMX.",
    source_label: "Chilango",
    source_url: "https://www.chilango.com/ciudadania/mi-alarma-en-casa-de-app-cdmx-activa-el-boton-del-c2-desde-el-celular-en-caso-de-emergencia/",
    confidence: "alta",
    data: { price: "Not stated by the source", camera: "no", region: "CDMX", status: "activo", model: "Public service" },
  },
  {
    id: "cp-alarmas-vecinales",
    kind: "competitor",
    title: "Alarmas Vecinales (CDMX)",
    summary:
      "Community alarms run by the Mexico City government. They ended on August 3, 2020 when the contract expired.",
    source_label: "Eje Central",
    source_url: "https://www.ejecentral.com.mx/programa-alarmas-vecinales-dejara-de-funcionar-en-la-cdmx?p=10",
    confidence: "alta",
    data: { price: "Not stated by the source", camera: "no", region: "CDMX", status: "descontinuado", model: "Public service" },
  },
  {
    id: "cp-monitoreo-mx",
    kind: "competitor",
    title: "Traditional private monitoring (Mexico)",
    summary:
      "Local alarm companies with monitoring. 2015 range: 250–700 pesos a month, hardware separate or included. Current Verisure and Prosegur prices in Mexico were not verified.",
    source_label: "El Financiero (2015)",
    source_url: "https://www.elfinanciero.com.mx/empresas/uno-de-cada-10-hogares-tiene-sistema-antirrobo/",
    confidence: "baja",
    data: { price: "MXN 250–700/mo (2015)", camera: "opcional", region: "Mexico", status: "activo", model: "Service contract" },
  },

  // ---------- Riesgos ----------
  {
    id: "rk-auto911",
    kind: "risk",
    title: "Automatically calling emergency services",
    summary:
      "Many jurisdictions penalize or suspend the response after false alarms (LAPD: two in 12 months). That is why Vigil does not dial by itself: at the end of the ladder a person is instructed to call.",
    source_label: "POP Center",
    source_url: "https://popcenter.asu.edu/problems/false_alarms/4",
    confidence: "media",
    data: { likelihood: 4, impact: 5, mitigation: "Hand-off to a person; never automatic dialing." },
  },
  {
    id: "rk-falsas",
    kind: "risk",
    title: "False alarms that tire out contacts",
    summary: "If contacts receive false alerts, they stop responding. The 'I am fine' button stops the ladder before Tier 2.",
    source_label: "Own test (Week 1)",
    source_url: null,
    confidence: "media",
    data: { likelihood: 4, impact: 4, mitigation: "Owner confirmation window before notifying others." },
  },
  {
    id: "rk-simulado",
    kind: "risk",
    title: "Notifications are only simulated",
    summary: "No SMS or call is really sent. Every notice is labelled 'Simulated — not sent'. Sending real ones requires paid providers and approval.",
    source_label: "Current state of the prototype",
    source_url: null,
    confidence: "alta",
    data: { likelihood: 5, impact: 3, mitigation: "Visible label and a statement in the footer." },
  },
  {
    id: "rk-pestana",
    kind: "risk",
    title: "The ladder only advances with the page open",
    summary: "Real finding from Week 1: the level is computed on read, but alert_log rows are only written while the page is open. A real version needs a server process.",
    source_label: "Week 1 iteration log",
    source_url: null,
    confidence: "alta",
    data: { likelihood: 5, impact: 4, mitigation: "Documented; next phase: server-side escalation." },
  },
  {
    id: "rk-rls",
    kind: "risk",
    title: "Database open to anyone (demo only)",
    summary: "The RLS policies allow anonymous read and write so the demo works. With real contact data this would be unacceptable.",
    source_label: "sql/week1.sql",
    source_url: null,
    confidence: "alta",
    data: { likelihood: 5, impact: 4, mitigation: "Fictitious contacts; authentication and per-user RLS before real data." },
  },
  {
    id: "rk-contactos",
    kind: "risk",
    title: "Contacts do not accept the role",
    summary: "Nobody has asked a potential trusted contact whether they would want to receive these alerts. It is an unvalidated assumption.",
    source_label: "Pending: validation conversation",
    source_url: null,
    confidence: "baja",
    data: { likelihood: 3, impact: 4, mitigation: "Real interview with one person before Week 3." },
  },
  {
    id: "rk-proveedor",
    kind: "risk",
    title: "Depending on a single provider or contract",
    summary: "Alarmas Vecinales ended when a contract expired. Vigil depends on free Supabase and Vercel: Supabase pauses inactive projects after 7 days.",
    source_label: "Eje Central; own experience (Week 1)",
    source_url: "https://www.ejecentral.com.mx/programa-alarmas-vecinales-dejara-de-funcionar-en-la-cdmx?p=10",
    confidence: "media",
    data: { likelihood: 3, impact: 3, mitigation: "Fallback with local data and a weekly project check." },
  },
];
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
