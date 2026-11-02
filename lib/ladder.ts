// La escalera de escalamiento.
//
// DECISION DE ARQUITECTURA: el nivel actual se DERIVA del tiempo
// transcurrido desde triggered_at, no se agenda.
//
// Razon: el plan gratuito de Vercel corre cron jobs como maximo una vez
// al dia y solo garantiza la hora, no el minuto. Un motor de escalamiento
// agendado es imposible en este stack.
//
// Efecto secundario util: como el estado no vive en el navegador,
// refrescar la pagina a media alerta no lo pierde (criterio AC-6).

export const TIER_2_AFTER_SECONDS = 60;
export const DISPATCH_AFTER_SECONDS = 120;

export type LadderState = {
  tier: 1 | 2 | 3;
  status: "active" | "dispatch_pending";
  elapsedSeconds: number;
};

export function deriveTier(
  triggeredAt: string,
  now: Date = new Date()
): LadderState {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((now.getTime() - new Date(triggeredAt).getTime()) / 1000)
  );

  if (elapsedSeconds >= DISPATCH_AFTER_SECONDS) {
    return { tier: 3, status: "dispatch_pending", elapsedSeconds };
  }
  if (elapsedSeconds >= TIER_2_AFTER_SECONDS) {
    return { tier: 2, status: "active", elapsedSeconds };
  }
  return { tier: 1, status: "active", elapsedSeconds };
}

export function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}
