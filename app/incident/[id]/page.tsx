"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  deriveTier,
  formatElapsed,
  TIER_2_AFTER_SECONDS,
  DISPATCH_AFTER_SECONDS,
} from "@/lib/ladder";

type Incident = {
  id: string;
  triggered_at: string;
  status: string;
  resolved_at: string | null;
};

type Contact = { id: string; name: string; tier: number; destination: string };

type AlertRow = {
  id: string;
  contact_id: string;
  tier: number;
  sent_at: string;
  simulated: boolean;
};

const TIER_LABELS = [
  { tier: 1, title: "Tier 1 — Tú", at: 0 },
  { tier: 2, title: "Tier 2 — Contactos de confianza", at: TIER_2_AFTER_SECONDS },
  { tier: 3, title: "Entrega a una persona", at: DISPATCH_AFTER_SECONDS },
];

export default function IncidentPage() {
  // useParams en vez de la prop `params`: en Next.js 15 esa prop
  // llega como Promise y romperia este componente de cliente.
  const routeParams = useParams<{ id: string }>();
  const id = routeParams?.id as string;

  const [incident, setIncident] = useState<Incident | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  const load = useCallback(async () => {
    const [inc, con, log] = await Promise.all([
      supabase
        .from("incidents")
        .select("id, triggered_at, status, resolved_at")
        .eq("id", id)
        .single(),
      supabase
        .from("contacts")
        .select("id, name, tier, destination")
        .order("tier")
        .order("sort_order"),
      supabase
        .from("alert_log")
        .select("id, contact_id, tier, sent_at, simulated")
        .eq("incident_id", id)
        .order("sent_at"),
    ]);

    if (inc.error) return setError(inc.error.message);
    setIncident(inc.data as Incident);
    setContacts((con.data ?? []) as Contact[]);
    setAlerts((log.data ?? []) as AlertRow[]);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Reloj local, solo para mostrar el contador. No es el que manda:
  // el nivel se calcula siempre desde triggered_at.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const isLive =
    incident?.status === "active" || incident?.status === "dispatch_pending";

  // Si ya se resolvio, el contador se congela en resolved_at.
  // Si sigue vivo, avanza con el reloj.
  const clock =
    incident && !isLive && incident.resolved_at
      ? new Date(incident.resolved_at)
      : now;

  const ladder = incident ? deriveTier(incident.triggered_at, clock) : null;

  // Escribe en alert_log los niveles ya alcanzados.
  // Es idempotente gracias a unique(incident_id, contact_id, tier):
  // por mas veces que se refresque, cada contacto aparece una sola vez.
  useEffect(() => {
    if (!incident || !ladder || !isLive || contacts.length === 0) return;

    const reached = contacts.filter((c) => c.tier <= ladder.tier && c.tier <= 2);
    if (reached.length === 0) return;

    const missing = reached.filter(
      (c) => !alerts.some((a) => a.contact_id === c.id && a.tier === c.tier)
    );
    if (missing.length === 0) return;

    (async () => {
      await supabase.from("alert_log").upsert(
        missing.map((c) => ({
          incident_id: incident.id,
          contact_id: c.id,
          tier: c.tier,
          simulated: true,
        })),
        { onConflict: "incident_id,contact_id,tier", ignoreDuplicates: true }
      );
      await load();
    })();
  }, [incident, ladder?.tier, contacts, alerts, isLive, load]);

  // Sube el estado a dispatch_pending cuando se cumple el tiempo.
  useEffect(() => {
    if (!incident || !ladder) return;
    if (incident.status === "active" && ladder.status === "dispatch_pending") {
      (async () => {
        await supabase
          .from("incidents")
          .update({ status: "dispatch_pending" })
          .eq("id", incident.id);
        await load();
      })();
    }
  }, [incident, ladder?.status, load]);

  async function resolve(status: "resolved_false_alarm" | "confirmed") {
    if (!incident) return;
    await supabase
      .from("incidents")
      .update({ status, resolved_at: new Date().toISOString() })
      .eq("id", incident.id);
    await load();
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900 bg-red-950/40 p-6">
        <p className="font-medium text-red-300">Error</p>
        <p className="mt-2 font-mono text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!incident || !ladder) return <p className="text-neutral-500">Cargando…</p>;

  const contactName = (cid: string) =>
    contacts.find((c) => c.id === cid)?.name ?? "—";

  // Encontrado en pruebas: el titulo decia "Incidente en curso" incluso
  // despues de cerrarlo como falsa alarma. Ahora sigue el estado real.
  const HEADING: Record<string, string> = {
    active: "Incidente en curso",
    dispatch_pending: "Incidente sin respuesta",
    resolved_false_alarm: "Incidente cerrado",
    confirmed: "Intrusión confirmada",
  };

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            {HEADING[incident.status] ?? "Incidente"}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Disparado el{" "}
            {new Date(incident.triggered_at).toLocaleString("es-MX", {
              dateStyle: "medium",
              timeStyle: "medium",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl tabular-nums">
            {formatElapsed(ladder.elapsedSeconds)}
          </p>
          <p className="text-xs text-neutral-500">transcurrido</p>
        </div>
      </header>

      {/* Estado resuelto */}
      {!isLive && (
        <div
          className={
            "rounded-xl border p-5 " +
            (incident.status === "confirmed"
              ? "border-red-900 bg-red-950/40"
              : "border-emerald-900 bg-emerald-950/30")
          }
        >
          <p className="font-medium">
            {incident.status === "confirmed"
              ? "Confirmado como intrusión real"
              : "Cerrado como falsa alarma"}
          </p>
          {incident.resolved_at && (
            <p className="mt-1 text-sm text-neutral-400">
              Resuelto en{" "}
              {Math.round(
                (new Date(incident.resolved_at).getTime() -
                  new Date(incident.triggered_at).getTime()) /
                  1000
              )}{" "}
              segundos. La escalera se detuvo aquí.
            </p>
          )}
        </div>
      )}

      {/* La escalera */}
      <section className="space-y-0">
        {TIER_LABELS.map((step, i) => {
          // Un nivel esta "alcanzado" si el tiempo llego hasta el.
          // Como el reloj se congela al resolver, un incidente cerrado
          // a los 30 s muestra solo Tier 1 — que es justo lo que paso.
          const reached = ladder.tier >= step.tier;
          const active = isLive && ladder.tier === step.tier;
          return (
            <div key={step.tier} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={
                    "h-3 w-3 rounded-full ring-4 " +
                    (reached
                      ? step.tier === 3
                        ? "bg-red-400 ring-red-400/15"
                        : "bg-amber-400 ring-amber-400/15"
                      : "bg-neutral-700 ring-transparent")
                  }
                />
                {i < TIER_LABELS.length - 1 && (
                  <div
                    className={
                      "w-px flex-1 " +
                      (ladder.tier > step.tier && reached
                        ? "bg-amber-400/40"
                        : "bg-neutral-800")
                    }
                  />
                )}
              </div>

              <div className="flex-1 pb-8">
                <div className="flex items-center gap-2">
                  <p
                    className={
                      "font-medium " + (reached ? "" : "text-neutral-600")
                    }
                  >
                    {step.title}
                  </p>
                  {active && (
                    <span className="rounded bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                      actual
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {step.at === 0 ? "inmediato" : `a los ${step.at} s`}
                </p>

                {step.tier === 3 && reached && (
                  <div className="mt-3 rounded-lg border border-red-900 bg-red-950/40 p-4">
                    <p className="text-sm font-medium text-red-300">
                      Nadie ha respondido
                    </p>
                    <p className="mt-1 text-sm text-neutral-300">
                      Una persona debe llamar a los servicios de emergencia
                      ahora. Vigil no marca automáticamente: hacerlo está
                      prohibido por ordenanzas de alarmas en muchas
                      jurisdicciones.
                    </p>
                  </div>
                )}

                {step.tier <= 2 && (
                  <ul className="mt-3 space-y-1.5">
                    {alerts
                      .filter((a) => a.tier === step.tier)
                      .map((a) => (
                        <li
                          key={a.id}
                          className="flex flex-wrap items-center gap-2 text-sm"
                        >
                          <span className="text-neutral-300">
                            {contactName(a.contact_id)}
                          </span>
                          <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                            Simulado — no enviado
                          </span>
                          <span className="text-xs text-neutral-600">
                            {new Date(a.sent_at).toLocaleTimeString("es-MX")}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {isLive && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => resolve("resolved_false_alarm")}
            className="rounded-lg bg-neutral-100 px-6 py-3 font-medium text-neutral-900 transition hover:bg-white"
          >
            Estoy bien
          </button>
          <button
            onClick={() => resolve("confirmed")}
            className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-500"
          >
            Esto es real
          </button>
        </div>
      )}
    </div>
  );
}
