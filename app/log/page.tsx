"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Incident = {
  id: string;
  triggered_at: string;
  status: string;
  resolved_at: string | null;
};

const STATUS: Record<string, { label: string; className: string }> = {
  active: { label: "En curso", className: "bg-amber-500/15 text-amber-300" },
  dispatch_pending: {
    label: "Sin respuesta",
    className: "bg-red-500/15 text-red-300",
  },
  resolved_false_alarm: {
    label: "Falsa alarma",
    className: "bg-neutral-800 text-neutral-400",
  },
  confirmed: {
    label: "Intrusión real",
    className: "bg-red-500/15 text-red-300",
  },
};

export default function LogPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("id, triggered_at, status, resolved_at")
        .order("triggered_at", { ascending: false });

      if (error) setError(error.message);
      else setIncidents((data ?? []) as Incident[]);
    })();
  }, []);

  function timeToAck(i: Incident) {
    if (!i.resolved_at) return "—";
    const s = Math.round(
      (new Date(i.resolved_at).getTime() -
        new Date(i.triggered_at).getTime()) /
        1000
    );
    return `${s} s`;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900 bg-red-950/40 p-6">
        <p className="font-medium text-red-300">Error de Supabase</p>
        <p className="mt-2 font-mono text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">
          Historial de incidentes
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Cada alerta disparada, con su desenlace y cuánto tardó en responderse.
        </p>
      </header>

      {incidents.length === 0 ? (
        <p className="rounded-xl border border-neutral-800 px-4 py-6 text-sm text-neutral-600">
          Todavía no hay incidentes. Arma la propiedad y simula una intrusión.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/70 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Disparado</th>
                <th className="px-4 py-3 font-medium">Desenlace</th>
                <th className="px-4 py-3 font-medium">Tiempo de respuesta</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {incidents.map((i) => {
                const s = STATUS[i.status] ?? {
                  label: i.status,
                  className: "bg-neutral-800 text-neutral-400",
                };
                return (
                  <tr key={i.id}>
                    <td className="px-4 py-3 text-neutral-300">
                      {new Date(i.triggered_at).toLocaleString("es-MX", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          "rounded-full px-2.5 py-1 text-xs font-medium " +
                          s.className
                        }
                      >
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-neutral-400">
                      {timeToAck(i)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/incident/${i.id}`}
                        className="text-xs text-neutral-500 transition hover:text-neutral-200"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
