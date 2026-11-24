-- ==============================================================================
-- SPIDEYY QUIZ: STUDENT LEARNING FEATURES & ADMIN CONTROL MIGRATION
-- Migration Date: 2026-11-24
-- Features: Mistake Notebook, Smart Revision, Bookmarks & Notes, Study Planner,
--           Mock Exam Results, Question Versions & Audit, Platform Settings
-- ==============================================================================

-- 1. STUDENT MISTAKE NOTEBOOK TABLE
create table if not exists public.student_mistakes (
  id text primary key,                                 -- e.g. "mistake-{studentId}-{questionId}"
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  topic_id text not null,
  quiz_id text not null,
  selected_answer int,                                 -- -1 or null if skipped, 0-3 if answered
  correct_answer int not null,
  explanation text,
  question_snapshot jsonb not null,                    -- Immutable snapshot of the question
  status text not null default 'active' check (status in ('active', 'understood', 'mastered')),
  retried_count int not null default 0,
  last_retried_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_student_mistakes_user_topic
  on public.student_mistakes(user_id, topic_id, status);

-- 2. SMART REVISION SCHEDULER (SPACED REPETITION) TABLE
create table if not exists public.student_revisions (
  id text primary key,                                 -- e.g. "rev-{studentId}-{questionId}"
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  topic_id text not null,
  quiz_id text not null,
  question_snapshot jsonb not null,
  difficulty_rating text default 'medium' check (difficulty_rating in ('easy', 'medium', 'hard')),
  repetition_level int not null default 0,             -- 0=1d, 1=3d, 2=7d, 3=14d, 4=30d, 5=mastered
  interval_days int not null default 1,
  next_due_date date not null default current_date,
  review_count int not null default 0,
  success_streak int not null default 0,
  status text not null default 'pending' check (status in ('pending', 'due', 'reviewed', 'mastered')),
  updated_at timestamptz not null default now()
);

create index if not exists idx_student_revisions_due
  on public.student_revisions(user_id, next_due_date, status);

-- 3. STUDENT BOOKMARKS & PERSONAL NOTES TABLE
create table if not exists public.student_bookmarks (
  id text primary key,                                 -- e.g. "bm-{studentId}-{questionId}"
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  topic_id text not null,
  quiz_id text not null,
  question_snapshot jsonb not null,
  note text,
  tags jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_student_bookmarks_user
  on public.student_bookmarks(user_id, topic_id);

-- 4. STUDENT STUDY PLANNER & DAILY TARGETS TABLE
create table if not exists public.student_study_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_question_target int not null default 15,
  weekly_quiz_target int not null default 5,
  preferred_study_time text,
  daily_logs jsonb not null default '{}'::jsonb,        -- "YYYY-MM-DD" -> { questionsSolved, quizzesCompleted, minutesSpent, goalMet }
  updated_at timestamptz not null default now()
);

-- 5. MOCK EXAMINATION SUBMISSION RESULTS TABLE
create table if not exists public.mock_exam_results (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  mode text not null check (mode in ('full-length', 'sectional', 'custom')),
  topic_id text,
  total_questions int not null,
  attempted_count int not null,
  correct_count int not null,
  incorrect_count int not null,
  unanswered_count int not null,
  marked_for_review_count int not null default 0,
  score numeric(5,2) not null,
  max_score numeric(5,2) not null,
  percentage numeric(5,2) not null,
  passed boolean not null,
  time_taken_seconds int not null,
  answers jsonb not null default '{}'::jsonb,
  topic_breakdown jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_mock_exam_user
  on public.mock_exam_results(user_id, created_at desc);

-- 6. QUESTION VERSION HISTORY & AUDIT TRAIL
create table if not exists public.question_version_history (
  id text primary key,
  question_id text not null,
  version_number int not null default 1,
  previous_snapshot jsonb not null,
  new_snapshot jsonb not null,
  changed_fields jsonb not null default '[]'::jsonb,
  admin_user_id uuid not null references auth.users(id),
  admin_name text not null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists idx_question_versions_qid
  on public.question_version_history(question_id, version_number desc);

-- 7. STUDENT QUESTION FEEDBACK & ERROR REPORTS
create table if not exists public.student_question_reports (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  student_name text not null,
  question_id text not null,
  quiz_id text not null,
  topic_id text not null,
  issue_type text not null check (issue_type in ('incorrect-answer', 'typo', 'broken-source', 'outdated-info', 'other')),
  comment text not null,
  status text not null default 'open' check (status in ('open', 'investigating', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists idx_reports_status
  on public.student_question_reports(status, created_at desc);

-- 8. PLATFORM SETTINGS TABLE (ADMIN CONTROLLED)
create table if not exists public.platform_settings (
  id text primary key default 'global',
  settings jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.student_mistakes enable row level security;
alter table public.student_revisions enable row level security;
alter table public.student_bookmarks enable row level security;
alter table public.student_study_plans enable row level security;
alter table public.mock_exam_results enable row level security;
alter table public.question_version_history enable row level security;
alter table public.student_question_reports enable row level security;
alter table public.platform_settings enable row level security;

-- Student Mistakes: Isolated to authenticated student, Admin Sanju can view all
create policy "Students view own mistakes" on public.student_mistakes
  for select using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Students insert own mistakes" on public.student_mistakes
  for insert with check (auth.uid() = user_id);

create policy "Students update own mistakes" on public.student_mistakes
  for update using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Students delete own mistakes" on public.student_mistakes
  for delete using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Smart Revision: Isolated to student, Admin can view
create policy "Students view own revisions" on public.student_revisions
  for select using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Students manage own revisions" on public.student_revisions
  for all using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Bookmarks: Isolated to student, Admin can view
create policy "Students view own bookmarks" on public.student_bookmarks
  for select using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Students manage own bookmarks" on public.student_bookmarks
  for all using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Study Plans: Isolated to student, Admin can view
create policy "Students view own study plan" on public.student_study_plans
  for select using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Students manage own study plan" on public.student_study_plans
  for all using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Mock Exams: Isolated to student, Admin can view
create policy "Students view own mock exams" on public.mock_exam_results
  for select using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Students insert own mock exams" on public.mock_exam_results
  for insert with check (auth.uid() = user_id);

-- Version History: Readable by all authenticated, Admin writable
create policy "Anyone can view version history" on public.question_version_history
  for select using (auth.role() = 'authenticated');

create policy "Admin manages version history" on public.question_version_history
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Student Reports: Students can submit & view own, Admin can view/update all
create policy "Students submit reports" on public.student_question_reports
  for insert with check (auth.uid() = user_id);

create policy "View reports" on public.student_question_reports
  for select using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admin updates reports" on public.student_question_reports
  for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Platform Settings: Readable by all authenticated users, writable exclusively by Admin
create policy "Anyone view platform settings" on public.platform_settings
  for select using (auth.role() = 'authenticated');

create policy "Admin manages platform settings" on public.platform_settings
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
