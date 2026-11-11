"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AbHero from "@/components/AbHero";
import { Faq, HowItWorks, PlansSection } from "@/components/Landing";

type Property = {
  id: string;
  name: string;
  kind: string;
  armed: boolean;
  armed_at: string | null;
};

function PropertyDemo() {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("properties")
      .select("id, name, kind, armed, armed_at")
      .limit(1)
      .single();

    if (error) setError(error.message);
    else setProperty(data as Property);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleArmed() {
    if (!property) return;
    setBusy(true);
    const next = !property.armed;

    const { error } = await supabase
      .from("properties")
      .update({ armed: next, armed_at: next ? new Date().toISOString() : null })
      .eq("id", property.id);

    if (error) setError(error.message);
    else await load();
    setBusy(false);
  }

  // AC-2: con la alarma desactivada esto no se puede invocar —
  // el boton esta deshabilitado y no se crea ninguna fila.
  async function simulateBreach() {
    if (!property || !property.armed) return;
    setBusy(true);

    const { data, error } = await supabase
      .from("incidents")
      .insert({ property_id: property.id, source: "simulated" })
      .select("id")
      .single();

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    router.push(`/incident/${data.id}`);
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900 bg-red-950/40 p-6">
        <p className="font-medium text-red-300">Error de Supabase</p>
        <p className="mt-2 font-mono text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!property) {
    return <p className="text-neutral-500">Cargando…</p>;
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-medium tracking-tight">Mis propiedades (demo)</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Cuando la alarma está activa y alguien entra, Vigil avisa a tus
          contactos en orden hasta que alguien responda.
        </p>
      </header>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium">{property.name}</h2>
            <p className="text-sm capitalize text-neutral-500">
              {property.kind === "home" ? "Casa" : "Vehículo"}
            </p>
          </div>
          <span
            className={
              "rounded-full px-3 py-1 text-xs font-medium " +
              (property.armed
                ? "bg-amber-500/15 text-amber-300"
                : "bg-neutral-800 text-neutral-400")
            }
          >
            {property.armed ? "ARMADA" : "DESARMADA"}
          </span>
        </div>

        {property.armed && property.armed_at && (
          <p className="mt-4 text-xs text-neutral-500">
            Activada el{" "}
            {new Date(property.armed_at).toLocaleString("es-MX", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={toggleArmed}
            disabled={busy}
            className="rounded-lg bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-white disabled:opacity-40"
          >
            {property.armed ? "Desarmar" : "Armar"}
          </button>

          <button
            onClick={simulateBreach}
            disabled={busy || !property.armed}
            title={
              property.armed
                ? "Dispara un incidente de prueba"
                : "Arma la propiedad primero"
            }
            className="rounded-lg border border-neutral-700 px-4 py-2.5 text-sm text-neutral-300 transition hover:border-neutral-500 hover:text-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Simular intrusión
          </button>
        </div>

        {!property.armed && (
          <p className="mt-3 text-xs text-neutral-600">
            El botón de simulación se habilita solo con la propiedad armada.
          </p>
        )}
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-16">
      <AbHero />
      <div id="demo" className="scroll-mt-6">
        <PropertyDemo />
      </div>
      <HowItWorks />
      <PlansSection />
      <Faq />
    </div>
  );
}
