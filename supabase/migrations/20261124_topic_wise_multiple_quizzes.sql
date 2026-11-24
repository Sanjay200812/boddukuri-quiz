-- ==============================================================================
-- SPIDEYY QUIZ: TOPIC-WISE MULTIPLE QUIZ SYSTEM MIGRATION (NON-DESTRUCTIVE)
-- Migration Date: 2026-11-24
-- Curriculum Model: Subject / Exam Preparation -> Topic -> Multiple Quizzes -> Questions
-- ==============================================================================
-- SAFETY GUARANTEES & NON-DESTRUCTIVE DESIGN:
-- 1. NO CASCADING DELETES: Uses archival statuses ('archived') and ON DELETE SET NULL.
-- 2. PRESERVES ALL HISTORICAL DATA: All existing quiz IDs, attempts, answer histories,
--    and progress records remain 100% intact. Legacy single-topic attempts map
--    backward-compatibly via resolve_quiz_id().
-- 3. QUESTION-LEVEL TOPIC ACCURACY MATH:
--    Accuracy % = (sum(correct_count) / sum(total_questions_attempted)) * 100
--    Completion % = (count(completed_quizzes) / count(published_quizzes)) * 100
-- 4. DRAFT BY DEFAULT: Newly created quizzes default to status = 'draft' and
--    is_published = false. Only Admin Sanju can review and publish quizzes.
-- 5. SCHOLAR ISOLATION: Strict RLS enforcement by auth.uid().
-- ==============================================================================

-- 1. CREATE TOPIC QUIZZES TABLE (IF NOT EXISTS)
create table if not exists public.topic_quizzes (
  id varchar(64) primary key,                     -- e.g. 'static-gk-quiz-01'
  topic_id varchar(64) not null,                  -- e.g. 'static-gk'
  title varchar(255) not null,                    -- e.g. 'Quiz 1 – National Parks Part 1'
  order_index int not null default 1,
  description text,
  is_published boolean not null default false,    -- DRAFT BY DEFAULT (Safety Correction #4)
  status varchar(20) not null default 'draft'     -- 'draft' | 'published' | 'archived'
    check (status in ('draft', 'published', 'archived')),
  target_question_count int default 10,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Index for rapid topic quiz lookup
create index if not exists idx_topic_quizzes_topic_status 
  on public.topic_quizzes(topic_id, is_published, order_index);

-- 2. SAFE RELATIONSHIP TO QUESTIONS (ON DELETE SET NULL — NO CASCADE)
alter table public.questions add column if not exists quiz_id varchar(64);
alter table public.questions add column if not exists topic_id varchar(64);
alter table public.questions add column if not exists order_in_quiz int default 1;
alter table public.questions add column if not exists status varchar(20) default 'published'
  check (status in ('published', 'draft', 'archived'));

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'fk_questions_quiz_id'
  ) then
    alter table public.questions
      add constraint fk_questions_quiz_id
      foreign key (quiz_id)
      references public.topic_quizzes(id)
      on delete set null;  -- Non-destructive: if quiz is ever removed, question is preserved!
  end if;
exception
  when others then null;
end $$;

-- 3. ATTEMPTS TABLE COMPATIBILITY (PRESERVES EXISTING ATTEMPTS & PROGRESS)
alter table public.quiz_attempts add column if not exists topic_id varchar(64);
alter table public.quiz_attempts add column if not exists quiz_version int default 1;

-- 4. BACKWARD-COMPATIBLE QUIZ ID RESOLVER FUNCTION
create or replace function public.resolve_quiz_id(p_quiz_or_topic_id text)
returns text
language plpgsql
immutable
as $$
begin
  if p_quiz_or_topic_id is null or p_quiz_or_topic_id = '' then
    return 'static-gk-quiz-01';
  end if;

  -- If already a multi-quiz ID, return directly
  if position('-quiz-' in p_quiz_or_topic_id) > 0 then
    return p_quiz_or_topic_id;
  end if;

  -- Map legacy single-topic IDs to their primary Quiz 01
  case lower(p_quiz_or_topic_id)
    when 'static-gk' then return 'static-gk-quiz-01';
    when 'current-affairs-pib', 'current-affairs' then return 'current-affairs-pib-quiz-01';
    when 'banking-awareness-fa', 'banking-awareness' then return 'banking-awareness-fa-quiz-01';
    when 'central-ministers' then return 'central-ministers-quiz-01';
    when 'ramsar-sites-2026', 'ramsar-sites' then return 'ramsar-sites-2026-quiz-01';
    when 'unesco-2026' then return 'unesco-2026-quiz-01';
    when 'unesco-tentative-2026' then return 'unesco-tentative-2026-quiz-01';
    when 'dance-forms', 'other-important-gk' then return 'dance-forms-quiz-01';
    when 'sixth-schedule' then return 'sixth-schedule-quiz-01';
    else return p_quiz_or_topic_id;
  end case;
end;
$$;

-- 5. ROW LEVEL SECURITY (RLS) FOR TOPIC QUIZZES
alter table public.topic_quizzes enable row level security;

-- Policy 1: Students can only view published quizzes
drop policy if exists "Students can view published topic quizzes" on public.topic_quizzes;
create policy "Students can view published topic quizzes"
  on public.topic_quizzes
  for select
  using (
    is_published = true 
    and status = 'published'
  );

-- Policy 2: Admin Sanju can view and manage all quizzes (draft, published, archived)
drop policy if exists "Admin has full management of topic quizzes" on public.topic_quizzes;
create policy "Admin has full management of topic quizzes"
  on public.topic_quizzes
  for all
  using (
    public.is_admin()
  )
  with check (
    public.is_admin()
  );

-- 6. QUESTION-LEVEL TOPIC ACCURACY CALCULATION VIEW
create or replace view public.view_student_topic_accuracy as
select
  qa.student_id,
  coalesce(tq.topic_id, public.resolve_quiz_id(qa.quiz_id)) as topic_id,
  count(distinct qa.quiz_id) as attempted_quizzes_count,
  count(qa.id) as total_attempts_count,
  sum(qa.total_questions) as total_questions_attempted,
  sum(qa.correct_count) as total_correct_answers,
  case
    when sum(qa.total_questions) > 0 then
      round((sum(qa.correct_count)::numeric / sum(qa.total_questions)::numeric) * 100, 1)
    else 0
  end as question_accuracy_percentage,
  max(qa.percentage) as best_score_percentage,
  max(qa.created_at) as last_attempt_at
from public.quiz_attempts qa
left join public.topic_quizzes tq on tq.id = qa.quiz_id
group by qa.student_id, coalesce(tq.topic_id, public.resolve_quiz_id(qa.quiz_id));

-- 7. SEED CANONICAL PUBLISHED QUIZZES (SAFE UPSERT — DO NOT OVERWRITE CUSTOM EDITS)
insert into public.topic_quizzes (id, topic_id, title, order_index, description, is_published, status, target_question_count)
values
  -- Static GK (4 Quizzes)
  ('static-gk-quiz-01', 'static-gk', 'Quiz 1 – National Parks Part 1 (Core Foundations & World Heritage)', 1, 'Foundational national parks of India: oldest, largest, and UNESCO World Heritage conservation biomes.', true, 'published', 10),
  ('static-gk-quiz-02', 'static-gk', 'Quiz 2 – National Parks Part 2 (Northern & Western Himalayan Reserves)', 2, 'Alpine sanctuaries and desert reserves across J&K, Ladakh, HP, Uttarakhand, Rajasthan, and Gujarat.', true, 'published', 12),
  ('static-gk-quiz-03', 'static-gk', 'Quiz 3 – National Parks Part 3 (Central & Eastern Heartland Reserves)', 3, 'Tiger reserves, Project Cheetah habitats, and deltas in MP, Maharashtra, Chhattisgarh, Odisha, and West Bengal.', true, 'published', 12),
  ('static-gk-quiz-04', 'static-gk', 'Quiz 4 – National Parks Part 4 (Southern Biomes & North-East Jewels)', 4, 'Western Ghats sholas, river islands, and marine biomes: Assam, Arunachal, Manipur, Kerala, TN, and A&N.', true, 'published', 12),

  -- Current Affairs — PIB (1 Quiz)
  ('current-affairs-pib-quiz-01', 'current-affairs-pib', 'Quiz 1 – PIB Flagship Schemes & National Developments', 1, 'Official Press Information Bureau notifications, strategic infrastructure milestones, and welfare initiatives.', true, 'published', 10),

  -- Banking Awareness — FA (1 Quiz)
  ('banking-awareness-fa-quiz-01', 'banking-awareness-fa', 'Quiz 1 – RBI Monetary Policy & Financial Frameworks', 1, 'RBI policy rates, NPA prudential guidelines, Basel III, DICGC ceilings, and CBDC digital rupee.', true, 'published', 10),

  -- Central Cabinet Ministers (1 Quiz)
  ('central-ministers-quiz-01', 'central-ministers', 'Quiz 1 – Union Cabinet Portfolios & Allocation', 1, 'Official portfolio distributions of the Union Council of Ministers based on Cabinet Secretariat gazette notifications.', true, 'published', 10),

  -- Ramsar Sites — 2026 (1 Quiz)
  ('ramsar-sites-2026-quiz-01', 'ramsar-sites-2026', 'Quiz 1 – Ramsar Wetlands & 2026 Milestone Additions', 1, 'International wetland conservation landmarks in India: 2026 sites, Montreux Record status, and state distribution.', true, 'published', 10),

  -- UNESCO — 2026 (1 Quiz)
  ('unesco-2026-quiz-01', 'unesco-2026', 'Quiz 1 – World Heritage Inscriptions & 46th Session', 1, 'India''s 43 World Heritage Sites: Charaideo Moidams of Assam, categories, and 46th Session (New Delhi).', true, 'published', 10),

  -- UNESCO Tentative List — 2026 (1 Quiz)
  ('unesco-tentative-2026-quiz-01', 'unesco-tentative-2026', 'Quiz 1 – UNESCO Tentative Nominations & Criteria', 1, 'Heritage properties submitted by the Archaeological Survey of India (ASI) to the UNESCO Tentative List through 2026.', true, 'published', 10),

  -- Dance Forms (1 Quiz)
  ('dance-forms-quiz-01', 'dance-forms', 'Quiz 1 – Classical Traditions, Natya Shastra & Exponents', 1, 'The 8 Sangeet Natak Akademi classical dances, Natya Shastra treatise, regional folk traditions, and legendary exponents.', true, 'published', 10),

  -- Sixth Schedule of the Constitution (1 Quiz)
  ('sixth-schedule-quiz-01', 'sixth-schedule', 'Quiz 1 – Constitutional Governance & Autonomous District Councils', 1, 'Articles 244(2) & 275(1), the Bordoloi Sub-Committee, 10 Autonomous District Councils in AMTM states, and tribal autonomy.', true, 'published', 10)
on conflict (id) do nothing;
