"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Contact = {
  id: string;
  name: string;
  tier: number;
  destination: string;
  sort_order: number;
};

const TIER_HELP: Record<number, string> = {
  1: "Notified immediately",
  2: "Notified at one minute, if nobody responded",
  3: "Reserved — this level hands off to a person, it does not notify",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [tier, setTier] = useState(2);
  const [destination, setDestination] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase
      .from("contacts")
      .select("id, name, tier, destination, sort_order")
      .order("tier")
      .order("sort_order");

    if (error) setError(error.message);
    else setContacts((data ?? []) as Contact[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function addContact(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setFormError("Enter a name.");
    if (!destination.trim())
      return setFormError("Enter a contact phone number or email.");

    setFormError(null);
    setBusy(true);
    const { error } = await supabase.from("contacts").insert({
      name: name.trim(),
      tier,
      destination: destination.trim(),
      sort_order: contacts.filter((c) => c.tier === tier).length,
    });

    if (error) setFormError(error.message);
    else {
      setName("");
      setDestination("");
      await load();
    }
    setBusy(false);
  }

  async function remove(id: string) {
    setBusy(true);
    await supabase.from("contacts").delete().eq("id", id);
    await load();
    setBusy(false);
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900 bg-red-950/40 p-6">
        <p className="font-medium text-red-300">Supabase error</p>
        <p className="mt-2 font-mono text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-medium tracking-tight">
          Emergency contacts
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Order matters: Vigil notifies by level until someone responds.
        </p>
      </header>

      {[1, 2].map((t) => (
        <section key={t}>
          <div className="mb-3 flex items-baseline gap-3">
            <h2 className="font-medium">Tier {t}</h2>
            <p className="text-xs text-neutral-500">{TIER_HELP[t]}</p>
          </div>

          <ul className="divide-y divide-neutral-800 rounded-xl border border-neutral-800">
            {contacts.filter((c) => c.tier === t).length === 0 && (
              <li className="px-4 py-5 text-sm text-neutral-600">
                No contacts at this level.
              </li>
            )}
            {contacts
              .filter((c) => c.tier === t)
              .map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div>
                    <p className="text-sm">{c.name}</p>
                    <p className="font-mono text-xs text-neutral-500">
                      {c.destination}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(c.id)}
                    disabled={busy}
                    className="text-xs text-neutral-500 transition hover:text-red-400 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ))}

      <section className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h2 className="font-medium">Add contact</h2>
        <form onSubmit={addContact} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs text-neutral-400">
                Name
              </span>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFormError(null);
                }}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
                placeholder="Ana (neighbor)"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs text-neutral-400">
                Level
              </span>
              <select
                value={tier}
                onChange={(e) => setTier(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
              >
                <option value={1}>Tier 1 — immediate</option>
                <option value={2}>Tier 2 — at one minute</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs text-neutral-400">
                Phone or email
              </span>
              <input
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setFormError(null);
                }}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-500"
                placeholder="+52-55-0000-0000"
              />
            </label>
          </div>

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-white disabled:opacity-40"
            >
              Add
            </button>
            <p className="text-xs text-neutral-600">
              Use made-up data: this database is public for the demo.
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
