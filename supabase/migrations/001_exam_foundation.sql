create extension if not exists pgcrypto;

create table if not exists public.exam_catalog (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.exam_variants (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exam_catalog(id) on delete cascade,
  paper text not null,
  class_level text,
  subject text not null,
  questions integer,
  marks integer,
  duration_minutes integer,
  created_at timestamptz not null default now(),
  unique(exam_id, paper, subject)
);

create table if not exists public.user_exam_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_variant_id uuid not null references public.exam_variants(id),
  target_exam_date date,
  daily_study_minutes integer,
  preparation_start_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.exam_catalog enable row level security;
alter table public.exam_variants enable row level security;
alter table public.user_exam_profiles enable row level security;

create policy "Anyone can read active exams" on public.exam_catalog
  for select using (active = true);

create policy "Anyone can read exam variants" on public.exam_variants
  for select using (true);

create policy "Users can read own exam profile" on public.user_exam_profiles
  for select using (auth.uid() = user_id);

create policy "Users can insert own exam profile" on public.user_exam_profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can update own exam profile" on public.user_exam_profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.exam_catalog (code, name, description)
values ('BIHAR_STET', 'Bihar STET', 'Bihar Secondary Teacher Eligibility Test')
on conflict (code) do nothing;

insert into public.exam_variants (exam_id, paper, class_level, subject, questions, marks, duration_minutes)
select e.id, 'II', 'Class 11–12', 'Computer Science', 150, 150, 150
from public.exam_catalog e
where e.code = 'BIHAR_STET'
on conflict (exam_id, paper, subject) do nothing;
