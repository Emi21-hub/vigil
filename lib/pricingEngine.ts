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
