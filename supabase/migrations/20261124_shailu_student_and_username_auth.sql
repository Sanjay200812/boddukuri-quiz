-- ==============================================================================
-- SPIDEYY QUIZ: SHAILU STUDENT ACCOUNT & USERNAME AUTHENTICATION MIGRATION
-- Migration Date: 2026-11-24
-- Target: Live Supabase Backend
-- ==============================================================================
-- This migration:
-- 1. Adds 'username' support to public.profiles.
-- 2. Eliminates infinite recursion in profiles RLS policies.
-- 3. Updates handle_new_user() trigger for synthetic username identities.
-- 4. Creates secure server-side username-to-auth resolver function.
-- 5. Preserves Mahi's account, Sanju's account, question bank, and all existing tables.
-- ==============================================================================

-- 1. Enable pgcrypto (for password hashing and digests)
create extension if not exists pgcrypto;

-- 2. Add username column to public.profiles if not exists
alter table public.profiles add column if not exists username text;

-- Add unique constraint on lower(username) if not exists
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_username_unique'
  ) then
    alter table public.profiles add constraint profiles_username_unique unique (username);
  end if;
exception
  when others then null;
end $$;

-- Populate known usernames for existing accounts without touching passwords or auth
update public.profiles 
set username = 'mahi'
where id = '61758bc8-51bd-4cf9-b276-a7d6a796b6da' 
  and (username is null or username = '');

update public.profiles 
set username = 'sanju'
where id = '81545df0-2a05-4257-a0f0-2c3342eb9e34'
  and (username is null or username = '');

-- 3. Fix is_admin() function to prevent 42P17 recursive policy lookups
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'email') in (
      'boddukurisanjay@gmail.com', 'sanjuboddukuri@gmail.com', 'admin@boddukuri.quiz', 'sanju@boddukuri.quiz'
    ),
    false
  ) or exists (
    select 1 from auth.users
    where id = auth.uid()
      and (
        lower(email) in ('boddukurisanjay@gmail.com', 'sanjuboddukuri@gmail.com', 'admin@boddukuri.quiz', 'sanju@boddukuri.quiz')
        or (raw_user_meta_data->>'role') = 'admin'
      )
  );
$$;

-- 4. Replace recursive RLS policies on public.profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_admin_select" on public.profiles;
create policy "profiles_admin_select"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
  on public.profiles for all
  using (public.is_admin());

-- 5. Updated handle_new_user() trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_full_name text;
  v_username text;
begin
  -- Enforce role: Only predefined admin emails can ever be admin; all others are strictly student
  if lower(new.email) in ('boddukurisanjay@gmail.com', 'sanjuboddukuri@gmail.com', 'admin@boddukuri.quiz', 'sanju@boddukuri.quiz') then
    v_role := 'admin';
  else
    v_role := 'student';
  end if;

  -- Extract display name
  v_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    case 
      when v_role = 'admin' then 'Sanju (Admin)'
      when lower(new.email) like '%shailu%' then 'Shailu'
      else 'Mahi'
    end
  );

  -- Extract username
  v_username := coalesce(
    nullif(lower(trim(new.raw_user_meta_data->>'username')), ''),
    case
      when v_role = 'admin' then 'sanju'
      when lower(new.email) like '%shailu%' then 'shailu'
      when lower(new.email) like '%mahi%' then 'mahi'
      else split_part(new.email, '@', 1)
    end
  );

  insert into public.profiles (id, email, role, full_name, username)
  values (new.id, new.email, v_role, v_full_name, v_username)
  on conflict (id) do update
  set email = excluded.email,
      role = excluded.role,
      full_name = coalesce(public.profiles.full_name, excluded.full_name),
      username = coalesce(public.profiles.username, excluded.username),
      updated_at = now();

  return new;
end;
$$;

-- 6. Server-Side Username-to-Auth Identifier Resolver
-- Security definer: Safely maps student/admin username to its internal auth identity.
-- Used during login to authenticate against Supabase Auth.
create or replace function public.resolve_username_to_auth(p_username text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_norm text;
  v_email text;
begin
  v_norm := lower(trim(p_username));
  if v_norm = '' or v_norm is null then
    return jsonb_build_object('success', false, 'error', 'Username cannot be empty.');
  end if;

  -- Known canonical aliases
  if v_norm = 'mahi' then
    v_email := 'boddukurimahima1234@gmail.com';
  elsif v_norm in ('sanju', 'admin') then
    v_email := 'boddukurisanjay@gmail.com';
  elsif v_norm = 'shailu' then
    v_email := 'shailu@users.spideyyquiz.invalid';
  elsif v_norm like '%@%' then
    v_email := v_norm;
  else
    -- Look up in profiles table for customized usernames
    select email into v_email from public.profiles where lower(username) = v_norm limit 1;
    if v_email is null then
      -- Default to internal reserved synthetic identity
      v_email := v_norm || '@users.spideyyquiz.invalid';
    end if;
  end if;

  return jsonb_build_object(
    'success', true,
    'email', v_email,
    'username', v_norm
  );
end;
$$;

grant execute on function public.resolve_username_to_auth(text) to anon, authenticated;

-- 7. Secure Admin Provisioning RPC Function
-- Enables Admin to provision Shailu with full validation
create or replace function public.admin_provision_student(
  p_display_name text,
  p_username text,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_norm_username text;
  v_synthetic_email text;
begin
  -- 1. Authorization: Only verified Admin can provision students
  if not public.is_admin() then
    return jsonb_build_object('success', false, 'error', 'Unauthorized: Only Admin Sanju can provision students.');
  end if;

  -- 2. Validate display name
  p_display_name := trim(p_display_name);
  if p_display_name = '' or p_display_name is null then
    return jsonb_build_object('success', false, 'error', 'Student display name is required.');
  end if;

  -- 3. Validate username
  v_norm_username := lower(trim(p_username));
  if length(v_norm_username) < 3 then
    return jsonb_build_object('success', false, 'error', 'Username must be at least 3 characters.');
  end if;

  if v_norm_username in ('mahi', 'sanju', 'admin', 'administrator') then
    return jsonb_build_object('success', false, 'error', 'Username is reserved.');
  end if;

  -- 4. Validate password
  if length(p_password) < 4 then
    return jsonb_build_object('success', false, 'error', 'Password must be at least 4 characters.');
  end if;

  v_synthetic_email := v_norm_username || '@users.spideyyquiz.invalid';

  -- 5. Prevent Duplicate Accounts
  if exists (
    select 1 from public.profiles 
    where lower(username) = v_norm_username or lower(email) = v_synthetic_email
  ) then
    return jsonb_build_object(
      'success', false,
      'already_exists', true,
      'error', 'Student account already exists. Duplicate creation or automatic password reset is prohibited.'
    );
  end if;

  return jsonb_build_object(
    'success', true,
    'username', v_norm_username,
    'email', v_synthetic_email,
    'display_name', p_display_name,
    'role', 'student'
  );
end;
$$;

grant execute on function public.admin_provision_student(text, text, text) to authenticated;

-- ==============================================================================
-- 8. MANUAL PROVISIONING SQL SNIPPET FOR ADMIN SANJU
-- (Execute in Supabase SQL Editor if provisioning Shailu directly via SQL)
-- ==============================================================================
-- To provision Shailu directly in Supabase SQL Editor, Admin Sanju can run:
--
-- DO $$
-- DECLARE
--   v_shailu_id uuid := gen_random_uuid();
--   v_password text := 'YOUR_PASSWORD_HERE'; -- Set by Admin Sanju
--   v_synthetic_email text := 'shailu@users.spideyyquiz.invalid';
-- BEGIN
--   -- Insert into auth.users (if not already existing)
--   IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_synthetic_email) THEN
--     INSERT INTO auth.users (
--       id, instance_id, email, encrypted_password, email_confirmed_at,
--       raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
--     ) VALUES (
--       v_shailu_id,
--       '00000000-0000-0000-0000-000000000000',
--       v_synthetic_email,
--       crypt(v_password, gen_salt('bf')),
--       now(),
--       '{"provider":"email","providers":["email"]}',
--       '{"full_name":"Shailu","username":"shailu","role":"student"}',
--       now(),
--       now(),
--       'authenticated',
--       'authenticated'
--     );
--
--     -- Insert into profiles
--     INSERT INTO public.profiles (id, email, full_name, username, role)
--     VALUES (v_shailu_id, v_synthetic_email, 'Shailu', 'shailu', 'student')
--     ON CONFLICT (id) DO UPDATE SET username = 'shailu', full_name = 'Shailu';
--
--     -- Initialize clean zero-progress in quiz_progress
--     INSERT INTO public.quiz_progress (user_id, payload, updated_at)
--     VALUES (
--       v_shailu_id,
--       jsonb_build_object(
--         'version', 1,
--         'updatedAt', now(),
--         'settings', jsonb_build_object('studentName', 'Shailu', 'sanjuWhatsAppNumber', '917075920852'),
--         'attempts', '[]'::jsonb,
--         'completedDays', '[]'::jsonb,
--         'inProgress', '{}'::jsonb,
--         'retakeRequests', '[]'::jsonb,
--         'bookmarks', '[]'::jsonb
--       ),
--       now()
--     ) ON CONFLICT (user_id) DO NOTHING;
--
--     RAISE NOTICE 'Shailu account provisioned successfully with ID %', v_shailu_id;
--   ELSE
--     RAISE NOTICE 'Shailu account already exists. No action taken.';
--   END IF;
-- END $$;
