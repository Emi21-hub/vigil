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
