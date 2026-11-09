-- Vigil Week 3: escenarios de la calculadora de ingresos
create table if not exists pricing_scenarios (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 3),
  inputs jsonb not null,
  results jsonb not null,
  created_at timestamptz not null default now()
);

alter table pricing_scenarios enable row level security;

create policy "demo read scenarios" on pricing_scenarios for select to anon using (true);
create policy "demo insert scenarios" on pricing_scenarios for insert to anon with check (true);
create policy "demo delete scenarios" on pricing_scenarios for delete to anon using (true);
