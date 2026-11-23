// Data and rules for Vigil's final layer (Week 6): routes, walkthrough, agent map,
// impact review, roadmap and build log. No imports, so it can be tested with Node.
// No invented figures: whatever was not measured says "not measured" or "pending".
// Internal ids (AgentKind "usuario"/"reglas"...) stay as-is; the UI shows English labels.

export type RouteInfo = { path: string; label: string; week: number; what: string; marker?: string };

// "marker" is text that must appear in the page HTML (title defined in its metadata).
export const ROUTES: RouteInfo[] = [
  { path: "/", label: "Home", week: 1, what: "Arm the property, simulate an intrusion and watch the ladder." },
  { path: "/contacts", label: "Contacts", week: 1, what: "Trusted contacts by level." },
  { path: "/log", label: "History", week: 1, what: "Incidents and response time." },
  { path: "/research", label: "Research", week: 2, what: "Cases, competitors and risks with sources.", marker: "Research — Vigil" },
  { path: "/product", label: "Product", week: 3, what: "Segments and features: prototype or planned.", marker: "Product — Vigil" },
  { path: "/pricing", label: "Pricing", week: 3, what: "Plans and revenue calculator.", marker: "Pricing — Vigil" },
  { path: "/marketing", label: "Marketing", week: 4, what: "Content pieces and A/B tests.", marker: "Marketing — Vigil" },
  { path: "/chat", label: "Advisor", week: 5, what: "Rule-based advisor with filters.", marker: "Advisor — Vigil" },
  { path: "/demo", label: "Demo", week: 6, what: "Guided walkthrough and agent map.", marker: "Demo — Vigil" },
  { path: "/dashboard", label: "Dashboard", week: 6, what: "Real records and route check.", marker: "Dashboard — Vigil" },
  { path: "/docs", label: "Docs", week: 6, what: "Prompts, build log, impact and roadmap.", marker: "Docs — Vigil" },
];

export type Step = { n: number; path: string; title: string; action: string; expect: string };

export const WALKTHROUGH: Step[] = [
  { n: 1, path: "/", title: "Understand what Vigil is", action: "Read the headline, click “Arm” in the demo and then “Simulate intrusion”.", expect: "The alert climbs from level 1 to 2 at 60 s and to the hand-off at 120 s, always labelled as simulated." },
  { n: 2, path: "/contacts", title: "See who gets notified", action: "Open Contacts and look at the levels.", expect: "Contacts appear ordered by level. They are sample data: do not enter real data." },
  { n: 3, path: "/log", title: "Review the history", action: "Open History after resolving an incident.", expect: "The incident is kept with its status and response time." },
  { n: 4, path: "/research", title: "See the research", action: "Filter the competitors with the word “cdmx”.", expect: "The counter drops from 8 and every row has a source and a confidence level." },
  { n: 5, path: "/pricing", title: "Try the pricing", action: "Change the calculator assumptions and save a scenario.", expect: "The result changes and each assumption says why it could be wrong. Everything is a hypothesis." },
  { n: 6, path: "/marketing", title: "See the content and the A/B", action: "Copy a piece and check the A/B panel.", expect: "You will see “Copied”; the A/B shows only real visitors and names no winner without 20 views per variant." },
  { n: 7, path: "/chat", title: "Talk to the advisor", action: "Answer the 3 questions and then type an email address in one of them.", expect: "You receive a suggested chain. The email is not shown back or saved." },
  { n: 8, path: "/dashboard", title: "Check the records", action: "Click “Check routes” in the dashboard.", expect: "Every route answers 200 and the counts come from the live database." },
];

export type AgentKind = "usuario" | "reglas" | "datos" | "humano" | "agente de código";
export type AgentNode = {
  id: string; name: string; kind: AgentKind; file: string;
  does: string; reads: string; writes: string; checkpoint: string; limit: string;
};

// "Agents" here are components with a fixed task. None uses a language model at runtime.
export const AGENTS: AgentNode[] = [
  { id: "visitor", name: "Visitor", kind: "usuario", file: "—", does: "Uses the pages, answers the advisor, sees the results.", reads: "Pages", writes: "Clicks, chosen answers", checkpoint: "Decides whether to trust what they see", limit: "May type personal data by mistake." },
  { id: "ladder", name: "Alert ladder", kind: "reglas", file: "lib/ladder.ts", does: "Derives the alert level from elapsed time.", reads: "incidents", writes: "alert_log (simulated)", checkpoint: "Level 3 hands off to a person", limit: "Sends no real messages and does not call emergency services." },
  { id: "research", name: "Research engine", kind: "reglas", file: "lib/researchEngine.ts", does: "Filters, sorts and scores risks.", reads: "research_entries", writes: "User notes", checkpoint: "Every row carries a source and confidence", limit: "Secondary sources; prices are only indicative." },
  { id: "pricing", name: "Pricing engine", kind: "reglas", file: "lib/pricingEngine.ts", does: "Calculates revenue from assumptions.", reads: "User inputs", writes: "pricing_scenarios", checkpoint: "Every assumption says why it could be wrong", limit: "No price has been validated with customers." },
  { id: "marketing", name: "Marketing and A/B engine", kind: "reglas", file: "lib/marketingEngine.ts, lib/abTesting.ts", does: "Generates pieces from templates, scores headlines (simulated) and counts unique visitors.", reads: "ab_events, marketing_assets", writes: "ab_events, marketing_assets", checkpoint: "Names no winner without 20 views per variant", limit: "No real visitors yet; the scorer is not AI." },
  { id: "chat", name: "/chat advisor", kind: "reglas", file: "lib/chatLogic.ts", does: "Asks 3 questions, applies filters and recommends an alert chain.", reads: "Chosen options", writes: "chat_sessions, chat_feedback (write-only)", checkpoint: "Flags price, vehicle or confusion for human review", limit: "Understands keywords; nobody can reply to a flagged chat." },
  { id: "db", name: "Supabase", kind: "datos", file: "sql/week1..5.sql", does: "Stores records with row-level access rules.", reads: "—", writes: "—", checkpoint: "Chats and comments: write-only; the rest: open demo", limit: "Open policies allow fake data." },
  { id: "owner", name: "Emilio (human review)", kind: "humano", file: "—", does: "Reads the tables, decides what to change and approves every commit.", reads: "Tables and totals", writes: "Decisions", checkpoint: "Approves scope and texts", limit: "Only one person reviews." },
  { id: "coder", name: "Coding agent (Claude)", kind: "agente de código", file: "—", does: "Writes the code from prompts and tests it.", reads: "Prompts and files", writes: "Commits", checkpoint: "Every change is verified and pushed with a checked hash", limit: "It is not part of the running product." },
];

export type Impact = { id: string; topic: string; finding: string; mitigation: string; residual: string };

export const IMPACT: Impact[] = [
  { id: "I1", topic: "Value for the user", finding: "Hypothesis: notifying trusted people in order, without cameras, helps whoever lives alone.", mitigation: "It was tested with the advisor and the research; the texts say “hypothesis”.", residual: "There is not enough validation with real users: pending." },
  { id: "I2", topic: "False sense of security", finding: "Someone could believe Vigil already protects their home.", mitigation: "Every alert is labelled simulated, the footer and FAQ repeat it and the product page separates prototype from planned.", residual: "A person can ignore the notices; there is no way to prevent it." },
  { id: "I3", topic: "Emergencies", finding: "Vigil does not contact emergency services.", mitigation: "The advisor replies “call 911” in an emergency and makes it clear.", residual: "If someone uses Vigil instead of calling, there is real risk." },
  { id: "I4", topic: "Privacy", finding: "It uses no cameras or microphones. The advisor stores only chosen options, never free text.", mitigation: "Advisor tables are write-only; text with personal data is neither shown nor saved.", residual: "The contacts table and other demos are open; real data must not be entered." },
  { id: "I5", topic: "Improper surveillance", finding: "The Family plan involves alerting about another person's home.", mitigation: "It is only a plan; it cannot be bought.", residual: "Before building it, the monitored person's consent is needed: it does not exist." },
  { id: "I6", topic: "Fake data", finding: "Open policies let anyone insert A/B events or chats.", mitigation: "Test sessions are excluded and external totals separate “selftest”.", residual: "Without rate limits or accounts, totals can be manipulated." },
  { id: "I7", topic: "Economic viability", finding: "The prices of 99 and 199 MXN a month are hypotheses.", mitigation: "The calculator lists each assumption and why it could fail.", residual: "Real cost of SMS, hosting and taxes: not measured." },
  { id: "I8", topic: "Accessibility", finding: "English site, with form labels and high contrast.", mitigation: "Aria labels and text states were used.", residual: "Not tested with a screen reader or in all browsers." },
];

export type RoadmapItem = { id: string; title: string; why: string; priority: "High" | "Medium" | "Low"; after: string | null; status: "not started" };

export const ROADMAP: RoadmapItem[] = [
  { id: "R1", title: "Accounts and per-user access", why: "Closes the open tables and lets each person see only their own data.", priority: "High", after: null, status: "not started" },
  { id: "R2", title: "Consent of the monitored person", why: "Needed before the Family plan (see I5).", priority: "High", after: "R1", status: "not started" },
  { id: "R3", title: "Validate with 10 real users and willingness to pay", why: "Today prices and segment are hypotheses.", priority: "High", after: null, status: "not started" },
  { id: "R4", title: "Real alerts by SMS or WhatsApp", why: "Today everything is simulated; per-message cost to be verified.", priority: "High", after: "R1", status: "not started" },
  { id: "R5", title: "Rate limit on inserts", why: "Prevents fake data in A/B and chats (see I6).", priority: "Medium", after: "R1", status: "not started" },
  { id: "R6", title: "Door and window sensors", why: "Without sensors there is only simulation.", priority: "Medium", after: "R4", status: "not started" },
  { id: "R7", title: "Automated end-to-end tests", why: "Today regression is run by hand and by routes.", priority: "Medium", after: null, status: "not started" },
  { id: "R8", title: "Accessibility audit", why: "Not tested with a screen reader (see I8).", priority: "Medium", after: null, status: "not started" },
  { id: "R9", title: "Vehicle alerts", why: "The advisor already flags this case as unsupported.", priority: "Low", after: "R6", status: "not started" },
];

export type WeekLog = { week: number; theme: string; commits: number; tests: string; fix: string };

export const BUILD_LOG: WeekLog[] = [
  { week: 1, theme: "Alert ladder, contacts and history", commits: 8, tests: "5 live tests", fix: "The heading said “Incident in progress” after the alert was closed; it now follows the saved status." },
  { week: 2, theme: "Research with sources", commits: 7, tests: "5 automated + 4 live", fix: "The first version ran without the table; the page showed fallback data instead of breaking." },
  { week: 3, theme: "Product and pricing", commits: 9, tests: "5 automated", fix: "A calculator field lost focus on every keystroke; it was rebuilt before pushing." },
  { week: 4, theme: "Marketing and A/B tests", commits: 13, tests: "3 automated + 3 live", fix: "Views are only counted after a real interaction, so bots are not counted." },
  { week: 5, theme: "/chat advisor with filters", commits: 7, tests: "3 automated + 3 live", fix: "The off-topic filter rejected “avisar”; it now uses word stems." },
];

export type PromptEntry = { week: number; title: string; text: string };

export const PROMPTS: PromptEntry[] = [
  { week: 1, title: "Escalera de avisos", text: "Build the escalation feature for Vigil: a property card with arm/disarm and a simulate-breach button that is disabled while disarmed; a contacts page with tiers; a live incident page; and an incident log. The tier must be derived from (now − incidents.triggered_at) on every read — no cron or background job. Tier 1 at 0 s, Tier 2 at 60 s, hand-off at 120 s. alert_log writes must be idempotent via the unique constraint. Label every simulated alert. Never dial an emergency number. No paid APIs." },
  { week: 2, title: "Research", text: "Build a /research page for Vigil modelled on the attached Week 2 example: a Supabase table of sourced research entries, ≥5 global cases, a Mexico section, 8 competitors in a filterable table with a live counter, a risk map, and a notes form. Fall back to the same data if the database is unreachable for 6 seconds. Do not invent data: mark anything unverified and give every row a source and a confidence level." },
  { week: 3, title: "Producto y precios", text: "Build /product and /pricing for Vigil: two customer-segment hypotheses, a 12-feature table where each feature is honestly marked Prototipo or Planeado, three plans (Gratis, Plus 99 MXN, Familia 199 MXN per month), and a revenue calculator with monthly/annual billing that saves scenarios to Supabase. Every price and percentage must be labelled a hypothesis and every assumption must say why it could be wrong." },
  { week: 4, title: "Marketing y A/B", text: "Build /marketing and upgrade the home page for Vigil: a brand system, one fictional-labelled persona, landing copy, exactly 10 posts, 3 video scripts and a 14-day calendar, all template-generated from real product facts; cards with Copy, Export and Save backed by a Supabase marketing_assets table; two live A/B tests on the home (headline and button) logged to ab_events, counting unique visitors, excluding test sessions and naming a leader only after 20 views per variant; a simulated headline scorer; and a credible home with the ladder above the fold, plans labelled available or planned, FAQ, full footer and link-preview metadata. No paid APIs, no invented testimonials, and everything must still render if the database is down." },
  { week: 5, title: "Asesor /chat", text: "Build /chat for Vigil: a guided, rule-based advisor (no AI API, labelled clearly) with a chat UI, exactly 3 intake questions (what to protect, how many trusted people, biggest worry) and rules that return a three-level chain, plan note, tip and confidence. Add guardrails for personal data (never echo or store it), emergencies, abuse, medical/legal/financial advice, order or price requests and off-topic messages; a human checkpoint that flags risky or low-confidence chats; storage in Supabase with insert-only row-level security and an aggregate chat_stats view; optional tester tag; thumbs, 1–5 rating and a comment checked for personal data. Never store typed text, use a 6-second timeout so the chat works if the database is down, and add 3 logic tests." },
];

// Route test: says whether a response is correct. Pure so it can be tested.
export type RouteResult = { path: string; ok: boolean; status: number | null; detail: string };

export function evaluateRoute(r: RouteInfo, status: number | null, body: string | null): RouteResult {
  if (status === null) return { path: r.path, ok: false, status, detail: "no response" };
  if (status !== 200) return { path: r.path, ok: false, status, detail: "status " + status };
  if (r.marker && !(body ?? "").includes(r.marker)) return { path: r.path, ok: false, status, detail: "missing “" + r.marker + "”" };
  return { path: r.path, ok: true, status, detail: r.marker ? "200 and “" + r.marker + "”" : "200" };
}

export function roadmapOrder(items: RoadmapItem[]): RoadmapItem[] {
  const rank = { High: 0, Medium: 1, Low: 2 } as const;
  return [...items].sort((a, b) => rank[a.priority] - rank[b.priority] || a.id.localeCompare(b.id, "en", { numeric: true }));
}

export const GOAL_EXTERNAL_USERS = 5;
