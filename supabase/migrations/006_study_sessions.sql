-- PrepPath: study session tracking
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_variant_id uuid not null references public.exam_variants(id) on delete cascade,
  topic_id uuid references public.exam_syllabus_topics(id) on delete set null,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  duration_seconds integer not null check (duration_seconds > 0 and duration_seconds <= 86400),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists study_sessions_user_date_idx on public.study_sessions(user_id, started_at desc);
create index if not exists study_sessions_topic_idx on public.study_sessions(topic_id);

alter table public.study_sessions enable row level security;

create policy "Users can read own study sessions"
on public.study_sessions for select
using (auth.uid() = user_id);

create policy "Users can insert own study sessions"
on public.study_sessions for insert
with check (auth.uid() = user_id);

create policy "Users can update own study sessions"
on public.study_sessions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own study sessions"
on public.study_sessions for delete
using (auth.uid() = user_id);
