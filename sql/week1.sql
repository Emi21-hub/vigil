-- ============================================================
-- Vigil — Week 1 schema
-- Corre esto UNA VEZ en Supabase → SQL Editor → New query → Run
-- La tabla `properties` ya existe desde Week 0.
-- ============================================================

-- Contactos de emergencia, ordenados por nivel (tier)
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier int not null check (tier between 1 and 3),
  channel text not null default 'sms',
  destination text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- Un incidente = una alerta disparada
create table if not exists incidents (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  triggered_at timestamptz not null default now(),
  source text not null default 'simulated',
  status text not null default 'active'
    check (status in ('active','dispatch_pending','resolved_false_alarm','confirmed')),
  resolved_at timestamptz
);

-- Cada notificacion simulada. La restriccion unique impide
-- que un contacto reciba la misma alerta dos veces (criterio AC-4).
create table if not exists alert_log (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references incidents(id) on delete cascade,
  contact_id uuid not null references contacts(id) on delete cascade,
  tier int not null,
  sent_at timestamptz not null default now(),
  simulated boolean not null default true,
  unique (incident_id, contact_id, tier)
);

alter table contacts  enable row level security;
alter table incidents enable row level security;
alter table alert_log enable row level security;

drop policy if exists "demo all contacts"  on contacts;
drop policy if exists "demo all incidents" on incidents;
drop policy if exists "demo all alerts"    on alert_log;

create policy "demo all contacts"  on contacts  for all to anon using (true) with check (true);
create policy "demo all incidents" on incidents for all to anon using (true) with check (true);
create policy "demo all alerts"    on alert_log for all to anon using (true) with check (true);

-- Datos de prueba. Telefonos ficticios a proposito:
-- no metas numeros reales en una tabla con politicas abiertas a anon.
insert into contacts (name, tier, destination, sort_order) values
  ('Emilio (yo)',    1, '+52-55-0000-0001', 0),
  ('Ana (vecina)',   2, '+52-55-0000-0002', 0),
  ('Luis (hermano)', 2, '+52-55-0000-0003', 1);

-- Si `properties` quedo vacia, descomenta la siguiente linea:
-- insert into properties (name, kind) values ('Departamento Principal', 'home');
