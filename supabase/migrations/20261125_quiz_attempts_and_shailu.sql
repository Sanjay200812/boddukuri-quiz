-- Applied 2026-11-25 to project quiz-by-spideyy.
-- 1. quiz_attempts: one row per submission (replaces the attempts array inside quiz_progress.payload,
--    which was being overwritten by client-side snapshot sync, so the admin never saw submissions).
-- 2. Shailu student account with access code 2580 (auth user + profile + access_codes row; the
--    auth ticket is generated server-side with gen_random_bytes and never stored in the repo).
-- 3. verify_access_code now returns user_id, role and full_name.
-- 4. profiles admin policies use is_admin() instead of a self-referencing subquery.
-- See the Supabase migration history for the exact statements.

create table if not exists public.quiz_attempts (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  student_name text not null,
  quiz_id text not null,
  topic_id text not null,
  quiz_title text not null,
  score int not null,
  total int not null,
  percentage int not null,
  time_taken_seconds int not null default 0,
  answers jsonb not null default '[]'::jsonb,
  submitted_at timestamptz not null default now()
);
alter table public.quiz_attempts enable row level security;
create policy quiz_attempts_insert_own on public.quiz_attempts for insert to authenticated with check (auth.uid() = user_id);
create policy quiz_attempts_select_own_or_admin on public.quiz_attempts for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy quiz_attempts_admin_delete on public.quiz_attempts for delete to authenticated using (public.is_admin());
alter publication supabase_realtime add table public.quiz_attempts;

-- 5. Per-student admin controls (locks, hidden topics, note). Students can read their own row;
--    only the admin can write. Published to realtime so student dashboards update live.
create table if not exists public.student_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  locked_quiz_ids text[] not null default '{}',
  hidden_topic_ids text[] not null default '{}',
  note text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.student_settings enable row level security;
create policy student_settings_select_own_or_admin on public.student_settings for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy student_settings_admin_insert on public.student_settings for insert to authenticated with check (public.is_admin());
create policy student_settings_admin_update on public.student_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy student_settings_admin_delete on public.student_settings for delete to authenticated using (public.is_admin());
alter publication supabase_realtime add table public.student_settings, public.profiles;
