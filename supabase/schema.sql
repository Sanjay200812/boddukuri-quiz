-- Run this in Supabase SQL Editor. The browser only uses the publishable anon key.
create table if not exists public.quiz_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.quiz_progress enable row level security;

create policy "Users can read their own quiz progress"
  on public.quiz_progress for select using (auth.uid() = user_id);
create policy "Users can insert their own quiz progress"
  on public.quiz_progress for insert with check (auth.uid() = user_id);
create policy "Users can update their own quiz progress"
  on public.quiz_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
