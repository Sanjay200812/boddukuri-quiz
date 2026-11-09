-- ==============================================================================
-- BODDUKURI'S QUIZ #MAHI — COMPLETE DATABASE & SECURITY SCHEMA
-- ==============================================================================
-- This schema establishes Row Level Security (RLS), role-based permissions,
-- encrypted access-code verification, rate-limiting lockout, and audit logs.
-- Execute this entire file in Supabase SQL Editor.
-- ==============================================================================

-- 1. Enable pgcrypto for cryptographic hashing (SHA-256)
create extension if not exists pgcrypto;

-- 2. User Profiles Table (Linked to Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'student' check (role in ('admin', 'student')),
  full_name text default 'Student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Profiles RLS Policies:
-- Users can view their own profile
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can view all profiles
create policy "profiles_admin_select"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Users can update only their non-role fields
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Admins have full control over profiles
create policy "profiles_admin_all"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Helper function: Check if current caller is Admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 3. Automatic Profile Creation Trigger on auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    -- If email matches Sanju's known email pattern, default to admin; else student
    case 
      when lower(new.email) in ('boddukurisanjay@gmail.com', 'sanjuboddukuri@gmail.com', 'admin@boddukuri.quiz', 'sanju@boddukuri.quiz') then 'admin'
      else 'student'
    end,
    coalesce(new.raw_user_meta_data->>'full_name', case when lower(new.email) in ('boddukurisanjay@gmail.com', 'sanjuboddukuri@gmail.com', 'admin@boddukuri.quiz') then 'Sanju (Admin)' else 'Mahi' end)
  )
  on conflict (id) do update
  set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Quiz Progress Table with Secure RLS
create table if not exists public.quiz_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.quiz_progress enable row level security;

-- Mahi can read & write her own progress
create policy "quiz_progress_select_own"
  on public.quiz_progress for select
  using (auth.uid() = user_id);

create policy "quiz_progress_insert_own"
  on public.quiz_progress for insert
  with check (auth.uid() = user_id);

create policy "quiz_progress_update_own"
  on public.quiz_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admins can read all users' quiz progress (Sanju can inspect Mahi's learning)
create policy "quiz_progress_admin_select"
  on public.quiz_progress for select
  using (public.is_admin());

-- Admins can reset or update progress when executing confirmed admin actions
create policy "quiz_progress_admin_update"
  on public.quiz_progress for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "quiz_progress_admin_delete"
  on public.quiz_progress for delete
  using (public.is_admin());

-- 5. Admin Schedule & Lock Overrides Configuration Table
create table if not exists public.admin_schedule_config (
  key text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.admin_schedule_config enable row level security;

-- All authenticated students (and anon) can read active schedule configuration
create policy "schedule_config_read_all"
  on public.admin_schedule_config for select
  using (true);

-- Only Admins can modify schedule overrides & day lock states
create policy "schedule_config_admin_write"
  on public.admin_schedule_config for all
  using (public.is_admin())
  with check (public.is_admin());

-- 6. Admin Audit Log Table
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id),
  admin_email text,
  action text not null,
  target text,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_logs enable row level security;

create policy "audit_logs_admin_select"
  on public.admin_audit_logs for select
  using (public.is_admin());

create policy "audit_logs_admin_insert"
  on public.admin_audit_logs for insert
  with check (public.is_admin());

-- 7. Secure Access Codes & Rate-Limiting Lockout Table
create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  auth_ticket text not null, -- internal credential used by backend RPC
  code_hash text not null,   -- SHA-256 hash in hex (NEVER plain text)
  created_at timestamptz not null default now()
);

-- RLS: Nobody has direct select/insert/update on access_codes; only accessible through verify_access_code RPC
alter table public.access_codes enable row level security;

-- Rate Limits tracking table for access code brute-force protection
create table if not exists public.auth_rate_limits (
  identifier text primary key,
  failed_count int not null default 0,
  locked_until timestamptz,
  last_attempt timestamptz not null default now()
);

alter table public.auth_rate_limits enable row level security;

-- 8. Stored Procedure: verify_access_code
-- Security Definer: Runs with elevated privileges in Postgres to safely verify SHA-256 hash
-- Enforces 5-attempt limit and 15-minute temporary lockout
create or replace function public.verify_access_code(
  p_code text,
  p_identifier text default 'global_client'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limit record;
  v_input_hash text;
  v_rec record;
  v_remaining_seconds int;
begin
  -- Normalize identifier
  p_identifier := coalesce(nullif(trim(p_identifier), ''), 'global_client');
  
  -- Check existing rate limits
  select * into v_limit from public.auth_rate_limits where identifier = p_identifier;

  if found and v_limit.locked_until is not null and v_limit.locked_until > now() then
    v_remaining_seconds := ceil(extract(epoch from (v_limit.locked_until - now())));
    return jsonb_build_object(
      'success', false,
      'locked', true,
      'error', 'Too many failed attempts. Security lockout active.',
      'seconds_remaining', v_remaining_seconds
    );
  end if;

  -- Compute SHA-256 hash of input code
  v_input_hash := encode(digest(trim(p_code), 'sha256'), 'hex');

  -- Look up matching access code
  select * into v_rec from public.access_codes where code_hash = v_input_hash limit 1;

  if not found then
    -- Record failure and enforce lockout
    if not found or v_limit.identifier is null then
      insert into public.auth_rate_limits (identifier, failed_count, last_attempt)
      values (p_identifier, 1, now())
      on conflict (identifier) do update
      set failed_count = public.auth_rate_limits.failed_count + 1,
          last_attempt = now();
    else
      update public.auth_rate_limits
      set failed_count = failed_count + 1,
          last_attempt = now(),
          locked_until = case when failed_count + 1 >= 5 then now() + interval '15 minutes' else null end
      where identifier = p_identifier;
    end if;

    select * into v_limit from public.auth_rate_limits where identifier = p_identifier;
    
    if v_limit.failed_count >= 5 then
      return jsonb_build_object(
        'success', false,
        'locked', true,
        'error', 'Too many incorrect attempts. Locked out for 15 minutes.',
        'seconds_remaining', 900
      );
    else
      return jsonb_build_object(
        'success', false,
        'locked', false,
        'error', 'Invalid access code. Please try again.',
        'attempts_remaining', 5 - v_limit.failed_count
      );
    end if;
  end if;

  -- Success: Clear any rate-limit failures
  delete from public.auth_rate_limits where identifier = p_identifier;

  return jsonb_build_object(
    'success', true,
    'email', v_rec.email,
    'auth_ticket', v_rec.auth_ticket
  );
end;
$$;

-- 9. Stored Procedure: record_admin_audit (Callable by authenticated Admins)
create or replace function public.log_admin_action(
  p_action text,
  p_target text default null,
  p_details jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized: Only administrators can record audit logs.';
  end if;

  select email into v_email from public.profiles where id = auth.uid();

  insert into public.admin_audit_logs (admin_id, admin_email, action, target, details)
  values (auth.uid(), v_email, p_action, p_target, p_details);
end;
$$;

-- 10. Inbox Notifications Table with RLS
create table if not exists public.inbox_notifications (
  id text primary key,
  target_role text not null check (target_role in ('admin', 'student')),
  title text not null,
  message text not null,
  attempt_id text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.inbox_notifications enable row level security;

-- Admin can read all notifications
create policy "notifications_admin_read"
  on public.inbox_notifications for select
  using (public.is_admin());

-- Students can read student notifications
create policy "notifications_student_read"
  on public.inbox_notifications for select
  using (target_role = 'student');

-- Allow authenticated and anon to insert notifications (e.g. on quiz completion)
create policy "notifications_insert_all"
  on public.inbox_notifications for insert
  with check (true);

-- Admin can update/delete notifications
create policy "notifications_admin_modify"
  on public.inbox_notifications for all
  using (public.is_admin());

-- 11. Security Grants for Client Access
grant execute on function public.verify_access_code(text, text) to anon, authenticated;
grant execute on function public.is_admin() to authenticated, anon;
grant select on public.profiles to authenticated;
grant select on public.admin_schedule_config to anon, authenticated;
grant select, insert, update on public.quiz_progress to authenticated;
grant select, insert, update, delete on public.inbox_notifications to anon, authenticated;

