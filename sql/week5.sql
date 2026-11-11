-- Vigil Week 5: asesor /chat. Las tablas son de solo escritura para el publico;
-- la pagina solo puede leer la vista agregada chat_stats.
create table if not exists chat_sessions (
  id uuid primary key,
  created_at timestamptz not null default now(),
  tester text not null default '' check (char_length(tester) <= 20),
  place text not null check (place in ('casa','familiar','vehiculo','otro')),
  contacts text not null check (contacts in ('ninguno','uno_dos','tres_mas')),
  concern text not null check (concern in ('nadie_contesta','falsas','privacidad','no_se_a_quien')),
  guardrails text[] not null default '{}',
  needs_human boolean not null default false,
  human_reason text check (human_reason is null or char_length(human_reason) <= 80)
);

create table if not exists chat_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  thumbs text check (thumbs in ('up','down')),
  rating int check (rating between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 280),
  wants_human boolean not null default false
);

alter table chat_sessions enable row level security;
alter table chat_feedback enable row level security;

create policy "insert chats" on chat_sessions for insert to anon with check (true);
create policy "insert feedback" on chat_feedback for insert to anon with check (true);

create or replace view chat_stats as
select
  (select count(*) from chat_sessions)::int as total_chats,
  (select count(*) from chat_sessions where tester <> 'selftest')::int as external_chats,
  (select count(*) from chat_sessions where needs_human)::int as flagged_chats,
  (select count(*) from chat_sessions where cardinality(guardrails) > 0)::int as guardrail_chats,
  (select count(*) from chat_feedback where wants_human)::int as human_requests,
  (select count(*) from chat_feedback f join chat_sessions s on s.id = f.session_id
     where f.rating is not null and s.tester <> 'selftest')::int as external_ratings,
  (select round(avg(f.rating)::numeric, 1) from chat_feedback f join chat_sessions s on s.id = f.session_id
     where f.rating is not null and s.tester <> 'selftest') as avg_rating_external;

grant select on chat_stats to anon;
