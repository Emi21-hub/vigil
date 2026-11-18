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
  { tier: 1, title: "Tier 1 — You", at: 0 },
  { tier: 2, title: "Tier 2 — Trusted contacts", at: TIER_2_AFTER_SECONDS },
  { tier: 3, title: "Hand-off to a person", at: DISPATCH_AFTER_SECONDS },
];

export default function IncidentPage() {
  // useParams instead of the `params` prop: in Next.js 15 that prop
  // arrives as a Promise and would break this client component.
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

  // Local clock, only to display the counter. It is not the source of truth:
  // the level is always computed from triggered_at.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const isLive =
    incident?.status === "active" || incident?.status === "dispatch_pending";

  // If it is already resolved, the counter freezes at resolved_at.
  // If it is still live, it advances with the clock.
  const clock =
    incident && !isLive && incident.resolved_at
      ? new Date(incident.resolved_at)
      : now;

  const ladder = incident ? deriveTier(incident.triggered_at, clock) : null;

  // Writes the levels already reached to alert_log.
  // It is idempotent thanks to unique(incident_id, contact_id, tier):
  // no matter how many times it refreshes, each contact appears only once.
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

  // Moves the status up to dispatch_pending when the time is reached.
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

  if (!incident || !ladder) return <p className="text-neutral-500">Loading…</p>;

  const contactName = (cid: string) =>
    contacts.find((c) => c.id === cid)?.name ?? "—";

  // Found in testing: the heading said "Incident in progress" even
  // after closing it as a false alarm. Now it follows the real status.
  const HEADING: Record<string, string> = {
    active: "Incident in progress",
    dispatch_pending: "Incident with no response",
    resolved_false_alarm: "Incident closed",
    confirmed: "Intrusion confirmed",
  };

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            {HEADING[incident.status] ?? "Incident"}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Triggered on{" "}
            {new Date(incident.triggered_at).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "medium",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl tabular-nums">
            {formatElapsed(ladder.elapsedSeconds)}
          </p>
          <p className="text-xs text-neutral-500">elapsed</p>
        </div>
      </header>

      {/* Resolved state */}
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
              ? "Confirmed as a real intrusion"
              : "Closed as a false alarm"}
          </p>
          {incident.resolved_at && (
            <p className="mt-1 text-sm text-neutral-400">
              Resolved in{" "}
              {Math.round(
                (new Date(incident.resolved_at).getTime() -
                  new Date(incident.triggered_at).getTime()) /
                  1000
              )}{" "}
              seconds. The ladder stopped here.
            </p>
          )}
        </div>
      )}

      {/* The ladder */}
      <section className="space-y-0">
        {TIER_LABELS.map((step, i) => {
          // A level is "reached" if the time got to it.
          // Since the clock freezes on resolve, an incident closed
          // at 30 s shows only Tier 1 — which is exactly what happened.
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
                      current
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {step.at === 0 ? "immediate" : `at ${step.at} s`}
                </p>

                {step.tier === 3 && reached && (
                  <div className="mt-3 rounded-lg border border-red-900 bg-red-950/40 p-4">
                    <p className="text-sm font-medium text-red-300">
                      Nobody has responded
                    </p>
                    <p className="mt-1 text-sm text-neutral-300">
                      A person must call emergency services
                      now. Vigil does not dial automatically: doing so is
                      prohibited by alarm ordinances in many
                      jurisdictions.
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
                            Simulated — not sent
                          </span>
                          <span className="text-xs text-neutral-600">
                            {new Date(a.sent_at).toLocaleTimeString("en-US")}
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
            I am fine
          </button>
          <button
            onClick={() => resolve("confirmed")}
            className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-500"
          >
            This is real
          </button>
        </div>
      )}
    </div>
  );
}
