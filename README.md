# Vigil

Privacy-first intrusion alerts for a home, with no cameras. When an alarm triggers, Vigil escalates through a ladder of people: first you, then your trusted contacts, then a hand-off to a person. It never dials emergency services by itself.

Student project for Negocios Inteligentes y Comercio Digital (Universidad Iberoamericana). **All alerts are simulated and nothing is sent to anyone.**

- Live site: https://vigil-vigil21.vercel.app
- Guided walkthrough: https://vigil-vigil21.vercel.app/demo

## Pages

| Route | What it does |
|---|---|
| / | Arm or disarm a demo property and simulate an intrusion (A/B-tested headline and button) |
| /incident/[id] | Live escalation timeline: Tier 1 at 0 s, Tier 2 at 60 s, hand-off at 120 s (demo timings) |
| /contacts, /log | Contacts by tier and incident history |
| /research | Sourced market research read from Supabase, with filters, risk map and notes |
| /product, /pricing | Segment hypotheses, 12 features marked Prototype or Planned, and a revenue calculator |
| /marketing | Template-based marketing assets, A/B results, headline scorer |
| /chat | Rule-based advisor (no AI model) with guardrails and human review flag |
| /demo, /dashboard, /docs | Guided demo and agent map, live record counts and route check, prompt library, impact check and roadmap |

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase (Postgres) and Vercel. No paid APIs and no language model at run time.

## Run locally

    pnpm install
    pnpm dev

Create a Supabase project and set these environment variables (for example in .env.local):

    NEXT_PUBLIC_SUPABASE_URL=your project url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your anon key

Then run the scripts in the sql folder in order (week1.sql to week5.sql) in the Supabase SQL Editor.

## Tests

    node --experimental-strip-types --test tests/*.test.mjs

## Honest limits

- Notifications are simulated; there is no real SMS, push or call.
- The escalation advances only while the incident page is open (the tier is derived from the trigger time on every read). A real product needs a server-side job.
- The demo tables are open to anonymous reads and writes, so no real personal data should be entered. There are no accounts.
- Prices and conversion rates are hypotheses, not measurements. A/B tests name no leader until each variant has 20 views.
- The advisor understands keywords only and is not AI.

## Sources and AI use

Research sources are linked next to every fact in /research. The code was written with an AI coding assistant from prompts I sent; the prompt library and the build log are at /docs. Ideas, decisions and testing are mine.
