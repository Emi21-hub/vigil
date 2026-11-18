// Pricing logic and revenue calculator. Pure, no React or Supabase.
// IMPORTANT: prices and percentages are HYPOTHESES, not measurements.
// Internal ids stay as-is (billing "mensual"/"anual" = monthly/annual).

export const ANNUAL_FREE_MONTHS = 2; // the annual plan gives 2 months free

export type Billing = "mensual" | "anual";

export function annualPrice(monthly: number): number {
  return monthly * (12 - ANNUAL_FREE_MONTHS);
}

// What is charged per month on average for the chosen billing.
export function effectiveMonthly(monthly: number, billing: Billing): number {
  return billing === "anual" ? annualPrice(monthly) / 12 : monthly;
}

export type Inputs = {
  signups: number; // people who create a free account
  paidPct: number; // % of them who move to a paid plan
  plusSharePct: number; // % of payers who choose Plus (the rest Family)
  churnPct: number; // % of paying customers who leave each month
  plusPrice: number;
  familiaPrice: number;
  billing: Billing;
};

export type Results = {
  paidUsers: number;
  plusUsers: number;
  familiaUsers: number;
  mrr: number; // monthly recurring revenue
  arr: number; // annualized
  arpu: number; // monthly revenue per paying customer
  ltv: number | null; // arpu / churn; null if churn = 0
  retainedAfter12: number; // customers still active after 12 months
};

export const DEFAULT_INPUTS: Inputs = {
  signups: 500,
  paidPct: 5,
  plusSharePct: 70,
  churnPct: 5,
  plusPrice: 99,
  familiaPrice: 199,
  billing: "mensual",
};

export function calculate(i: Inputs): Results {
  const paidUsers = Math.round((i.signups * i.paidPct) / 100);
  const plusUsers = Math.round((paidUsers * i.plusSharePct) / 100);
  const familiaUsers = paidUsers - plusUsers;
  const mrr =
    plusUsers * effectiveMonthly(i.plusPrice, i.billing) +
    familiaUsers * effectiveMonthly(i.familiaPrice, i.billing);
  const arpu = paidUsers === 0 ? 0 : mrr / paidUsers;
  const churn = i.churnPct / 100;
  return {
    paidUsers,
    plusUsers,
    familiaUsers,
    mrr: round2(mrr),
    arr: round2(mrr * 12),
    arpu: round2(arpu),
    ltv: churn === 0 ? null : round2(arpu / churn),
    retainedAfter12: Math.round(paidUsers * Math.pow(1 - churn, 12)),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export type ScenarioInput = { name: string; inputs: Inputs };

export function validateScenario(s: ScenarioInput): string[] {
  const e: string[] = [];
  const i = s.inputs;
  if (s.name.trim().length < 3) e.push("The name needs at least 3 characters.");
  if (!Number.isInteger(i.signups) || i.signups < 0) e.push("Signups must be a whole number of 0 or more.");
  for (const [label, v] of [
    ["% paying", i.paidPct],
    ["% Plus", i.plusSharePct],
    ["% churn", i.churnPct],
  ] as [string, number][]) {
    if (!Number.isFinite(v) || v < 0 || v > 100) e.push(`${label} must be between 0 and 100.`);
  }
  if (!(i.plusPrice >= 0) || !(i.familiaPrice >= 0)) e.push("Prices cannot be negative.");
  return e;
}

export type Assumption = { label: string; value: string; why: string };

// Each assumption says why it could be wrong.
export const ASSUMPTIONS: Assumption[] = [
  { label: "Free signups: 500", value: "500", why: "It is a round number, not a measurement. Today Vigil has no real users." },
  { label: "Conversion to paid: 5%", value: "5 %", why: "No data of my own. For free apps with a paid plan it is often much lower or higher depending on the case; I have no verified source." },
  { label: "Plus 70% / Family 30%", value: "70 / 30", why: "An assumption. If the real buyer is the worried relative, Family could weigh more." },
  { label: "Monthly churn: 5%", value: "5 %", why: "An assumption. A security product where 'nothing ever happens' can feel unnecessary and be cancelled faster." },
  { label: "Plus MXN 99 / Family MXN 199", value: "99 / 199", why: "Chosen below the private monitoring range of MXN 250–700 a month (2015 figure, low confidence). No customer was asked." },
  { label: "Annual plan = 10 months", value: "-16.7 %", why: "A typical but arbitrary discount. Also, the annual plan charges upfront, which can slow down purchase." },
  { label: "Cost of sending real alerts: not included", value: "—", why: "Today alerts are simulated. Real SMS and calls have a per-message cost that was not calculated, so the real margin is unknown." },
];
// Logica de precios y calculadora de ingresos. Pura, sin React ni Supabase.
// IMPORTANTE: los precios y porcentajes son HIPOTESIS, no mediciones.

export const ANNUAL_FREE_MONTHS = 2; // el plan anual regala 2 meses

export type Billing = "mensual" | "anual";

export function annualPrice(monthly: number): number {
  return monthly * (12 - ANNUAL_FREE_MONTHS);
}

// Lo que se cobra por mes en promedio segun la facturacion elegida.
export function effectiveMonthly(monthly: number, billing: Billing): number {
  return billing === "anual" ? annualPrice(monthly) / 12 : monthly;
}

export type Inputs = {
  signups: number; // personas que crean cuenta gratis
  paidPct: number; // % de ellas que pasa a un plan de pago
  plusSharePct: number; // % de los que pagan que eligen Plus (el resto Familia)
  churnPct: number; // % de clientes de pago que se va cada mes
  plusPrice: number;
  familiaPrice: number;
  billing: Billing;
};

export type Results = {
  paidUsers: number;
  plusUsers: number;
  familiaUsers: number;
  mrr: number; // ingreso mensual recurrente
  arr: number; // anualizado
  arpu: number; // ingreso mensual por cliente de pago
  ltv: number | null; // arpu / churn; null si churn = 0
  retainedAfter12: number; // clientes que siguen tras 12 meses
};

export const DEFAULT_INPUTS: Inputs = {
  signups: 500,
  paidPct: 5,
  plusSharePct: 70,
  churnPct: 5,
  plusPrice: 99,
  familiaPrice: 199,
  billing: "mensual",
};

export function calculate(i: Inputs): Results {
  const paidUsers = Math.round((i.signups * i.paidPct) / 100);
  const plusUsers = Math.round((paidUsers * i.plusSharePct) / 100);
  const familiaUsers = paidUsers - plusUsers;
  const mrr =
    plusUsers * effectiveMonthly(i.plusPrice, i.billing) +
    familiaUsers * effectiveMonthly(i.familiaPrice, i.billing);
  const arpu = paidUsers === 0 ? 0 : mrr / paidUsers;
  const churn = i.churnPct / 100;
  return {
    paidUsers,
    plusUsers,
    familiaUsers,
    mrr: round2(mrr),
    arr: round2(mrr * 12),
    arpu: round2(arpu),
    ltv: churn === 0 ? null : round2(arpu / churn),
    retainedAfter12: Math.round(paidUsers * Math.pow(1 - churn, 12)),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export type ScenarioInput = { name: string; inputs: Inputs };

export function validateScenario(s: ScenarioInput): string[] {
  const e: string[] = [];
  const i = s.inputs;
  if (s.name.trim().length < 3) e.push("El nombre necesita al menos 3 caracteres.");
  if (!Number.isInteger(i.signups) || i.signups < 0) e.push("Los registros deben ser un entero de 0 o mas.");
  for (const [label, v] of [
    ["% de pago", i.paidPct],
    ["% Plus", i.plusSharePct],
    ["% de cancelacion", i.churnPct],
  ] as [string, number][]) {
    if (!Number.isFinite(v) || v < 0 || v > 100) e.push(`${label} debe estar entre 0 y 100.`);
  }
  if (!(i.plusPrice >= 0) || !(i.familiaPrice >= 0)) e.push("Los precios no pueden ser negativos.");
  return e;
}

export type Assumption = { label: string; value: string; why: string };

// Cada supuesto dice por que podria estar mal.
export const ASSUMPTIONS: Assumption[] = [
  { label: "Registros gratis: 500", value: "500", why: "Es un numero redondo, no una medicion. Hoy Vigil no tiene usuarios reales." },
  { label: "Conversion a pago: 5 %", value: "5 %", why: "No hay datos propios. Para apps gratis con plan de pago suele ser mucho menor o mayor segun el caso; no tengo una fuente verificada." },
  { label: "Plus 70 % / Familia 30 %", value: "70 / 30", why: "Suposicion. Si el comprador real es el familiar preocupado, Familia podria pesar mas." },
  { label: "Cancelacion mensual: 5 %", value: "5 %", why: "Suposicion. Un producto de seguridad que 'nunca pasa nada' puede sentirse innecesario y cancelarse mas rapido." },
  { label: "Plus MXN 99 / Familia MXN 199", value: "99 / 199", why: "Elegidos por debajo del rango de monitoreo privado de MXN 250–700 al mes (dato de 2015, confianza baja). No se pregunto a ningun cliente." },
  { label: "Plan anual = 10 meses", value: "-16.7 %", why: "Descuento tipico pero arbitrario. Ademas el anual cobra por adelantado, lo que puede frenar la compra." },
  { label: "Costo de enviar avisos reales: no incluido", value: "—", why: "Hoy los avisos son simulados. SMS y llamadas reales tienen costo por mensaje que no se calculo, asi que el margen real es desconocido." },
];
