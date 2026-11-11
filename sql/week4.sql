-- Vigil Week 4: contenido guardado y eventos de las pruebas A/B
create table if not exists marketing_assets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  asset_type text not null check (asset_type in ('brand','persona','landing','post','script','calendar')),
  title text not null check (char_length(title) between 3 and 200),
  content text not null check (char_length(content) between 1 and 8000)
);

create table if not exists ab_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  test_id text not null check (test_id in ('headline','button')),
  variant text not null check (variant in ('A','B')),
  event text not null check (event in ('view','click')),
  visitor_id text not null check (char_length(visitor_id) between 8 and 64),
  is_test boolean not null default false
);

alter table marketing_assets enable row level security;
alter table ab_events enable row level security;

create policy "demo read assets" on marketing_assets for select to anon using (true);
create policy "demo insert assets" on marketing_assets for insert to anon with check (true);
create policy "demo delete assets" on marketing_assets for delete to anon using (true);

create policy "demo read events" on ab_events for select to anon using (true);
create policy "demo insert events" on ab_events for insert to anon with check (true);
