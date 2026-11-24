-- ==============================================================================
-- SPIDEYY QUIZ: SHAILU ACCESS CODE (2580) & CREDENTIAL PROVISIONING MIGRATION
-- Migration Date: 2026-11-24
-- Target: Live Supabase Backend
-- ==============================================================================
-- This migration:
-- 1. Adds unique constraints on access_codes(user_id) and access_codes(code_hash)
--    to guarantee no account can ever collide or share an access code.
-- 2. Updates admin_provision_student RPC to accept p_access_code (default '2580').
-- 3. Creates admin_set_student_access_code RPC allowing Admin Sanju to assign
--    and securely change Shailu's access code or password.
-- 4. Preserves Mahi's account (2002), Sanju's account (2718), and all attempts.
-- 5. Does NOT create Shailu's account automatically (per explicit requirement:
--    account must be created only when Admin Sanju explicitly provisions it).
-- ==============================================================================

-- 1. Ensure pgcrypto extension is enabled for SHA-256 digests
create extension if not exists pgcrypto;

-- 2. Ensure access_codes table and unique indexes
create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  auth_ticket text not null, -- internal credential used by backend RPC
  code_hash text not null,   -- SHA-256 hash in hex (NEVER plain text)
  created_at timestamptz not null default now()
);

-- Unique index on user_id ensures one access code record per student
create unique index if not exists access_codes_user_id_idx on public.access_codes(user_id);

-- Unique index on code_hash ensures every access code is unique across all scholars
create unique index if not exists access_codes_code_hash_idx on public.access_codes(code_hash);

-- Enable RLS: direct table access blocked, access exclusively via secure RPCs
alter table public.access_codes enable row level security;

-- 3. Update admin_provision_student RPC
create or replace function public.admin_provision_student(
  p_display_name text,
  p_username text,
  p_password text,
  p_access_code text default '2580'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_norm_username text;
  v_norm_code text;
  v_synthetic_email text;
  v_code_hash text;
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

  -- 5. Validate access code
  v_norm_code := trim(p_access_code);
  if not (v_norm_code ~ '^[0-9]{4}$') then
    return jsonb_build_object('success', false, 'error', 'Access code must be exactly 4 numeric digits.');
  end if;

  if v_norm_code in ('2002', '2718') then
    return jsonb_build_object('success', false, 'error', 'Access code is reserved by existing scholar/admin.');
  end if;

  v_code_hash := encode(digest(v_norm_code, 'sha256'), 'hex');

  -- Ensure code hash is not already used
  if exists (select 1 from public.access_codes where code_hash = v_code_hash) then
    return jsonb_build_object('success', false, 'error', 'Access code is already assigned to another account.');
  end if;

  v_synthetic_email := v_norm_username || '@users.spideyyquiz.invalid';

  -- 6. Prevent Duplicate Accounts
  if exists (
    select 1 from public.profiles 
    where lower(username) = v_norm_username or lower(email) = v_synthetic_email
  ) then
    return jsonb_build_object(
      'success', false,
      'already_exists', true,
      'error', 'Student account already exists. Duplicate creation is prohibited.'
    );
  end if;

  return jsonb_build_object(
    'success', true,
    'username', v_norm_username,
    'email', v_synthetic_email,
    'display_name', p_display_name,
    'access_code', v_norm_code,
    'role', 'student'
  );
end;
$$;

grant execute on function public.admin_provision_student(text, text, text, text) to authenticated;

-- 4. Admin RPC to Assign / Change Student Access Code or Password
create or replace function public.admin_set_student_access_code(
  p_username_or_id text,
  p_access_code text default null,
  p_password text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_user_email text;
  v_norm_code text;
  v_code_hash text;
  v_caller_email text;
begin
  -- 1. Authorization: Only verified Admin can manage credentials
  if not public.is_admin() then
    return jsonb_build_object('success', false, 'error', 'Unauthorized: Only Admin Sanju can update student credentials.');
  end if;

  p_username_or_id := lower(trim(p_username_or_id));

  -- 2. Locate user
  select id, email into v_user_id, v_user_email
  from public.profiles
  where id::text = p_username_or_id
     or lower(username) = p_username_or_id
     or lower(email) = p_username_or_id
     or lower(email) = p_username_or_id || '@users.spideyyquiz.invalid'
  limit 1;

  if v_user_id is null then
    -- Also try matching in access_codes
    select user_id, email into v_user_id, v_user_email
    from public.access_codes
    where user_id::text = p_username_or_id
       or lower(email) = p_username_or_id
       or lower(email) = p_username_or_id || '@users.spideyyquiz.invalid'
    limit 1;
  end if;

  if v_user_id is null then
    return jsonb_build_object('success', false, 'error', 'Student account not found.');
  end if;

  -- 3. Update Access Code if provided
  if p_access_code is not null and trim(p_access_code) <> '' then
    v_norm_code := trim(p_access_code);
    if not (v_norm_code ~ '^[0-9]{4}$') then
      return jsonb_build_object('success', false, 'error', 'Access code must be exactly 4 numeric digits.');
    end if;

    if v_norm_code in ('2002', '2718') and v_user_email not like '%mahi%' and v_user_email not like '%sanju%' then
      return jsonb_build_object('success', false, 'error', 'Access code is reserved.');
    end if;

    v_code_hash := encode(digest(v_norm_code, 'sha256'), 'hex');

    -- Check collision with other accounts
    if exists (select 1 from public.access_codes where code_hash = v_code_hash and user_id <> v_user_id) then
      return jsonb_build_object('success', false, 'error', 'Access code is already assigned to another scholar.');
    end if;

    -- Upsert into access_codes
    insert into public.access_codes (user_id, email, auth_ticket, code_hash)
    values (v_user_id, v_user_email, coalesce(p_password, 'preserved'), v_code_hash)
    on conflict (user_id) do update
    set code_hash = excluded.code_hash,
        auth_ticket = case when p_password is not null and p_password <> '' then p_password else public.access_codes.auth_ticket end;
  elsif p_password is not null and p_password <> '' then
    -- Update password auth_ticket only
    update public.access_codes
    set auth_ticket = p_password
    where user_id = v_user_id;
  end if;

  -- 4. Audit Log
  select email into v_caller_email from public.profiles where id = auth.uid();
  insert into public.admin_audit_logs (admin_id, admin_email, action, target, details)
  values (
    auth.uid(),
    v_caller_email,
    'update_student_access_code',
    v_user_email,
    jsonb_build_object(
      'user_id', v_user_id,
      'code_updated', p_access_code is not null,
      'password_updated', p_password is not null
    )
  );

  return jsonb_build_object(
    'success', true,
    'message', 'Student credentials updated successfully.',
    'user_id', v_user_id,
    'email', v_user_email
  );
end;
$$;

grant execute on function public.admin_set_student_access_code(text, text, text) to authenticated;

-- ==============================================================================
-- 5. EXPLICIT SQL PROVISIONING SNIPPET FOR ADMIN SANJU
-- (Execute in Supabase SQL Editor if Admin Sanju wants to provision Shailu via SQL)
-- ==============================================================================
-- When Admin Sanju decides to provision Shailu:
--
-- DO $$
-- DECLARE
--   v_shailu_id uuid := gen_random_uuid();
--   v_password text := 'YOUR_CHOSEN_PASSWORD_HERE'; -- Set by Admin Sanju
--   v_access_code text := '2580';                  -- Shailu's 4-digit code
--   v_code_hash text := encode(digest(v_access_code, 'sha256'), 'hex');
--   v_synthetic_email text := 'shailu@users.spideyyquiz.invalid';
-- BEGIN
--   -- 1. Create Auth User if not existing
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
--     -- 2. Insert Profile
--     INSERT INTO public.profiles (id, email, full_name, username, role)
--     VALUES (v_shailu_id, v_synthetic_email, 'Shailu', 'shailu', 'student')
--     ON CONFLICT (id) DO UPDATE SET username = 'shailu', full_name = 'Shailu', role = 'student';
--
--     -- 3. Initialize Zero Progress
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
--     -- 4. Associate Access Code 2580
--     INSERT INTO public.access_codes (user_id, email, auth_ticket, code_hash)
--     VALUES (v_shailu_id, v_synthetic_email, v_password, v_code_hash)
--     ON CONFLICT (user_id) DO UPDATE
--     SET code_hash = excluded.code_hash,
--         auth_ticket = excluded.auth_ticket;
--
--     RAISE NOTICE 'Shailu account provisioned successfully with ID % and access code %', v_shailu_id, v_access_code;
--   ELSE
--     -- If user already existed, ensure access code 2580 is associated
--     SELECT id INTO v_shailu_id FROM auth.users WHERE email = v_synthetic_email;
--     INSERT INTO public.access_codes (user_id, email, auth_ticket, code_hash)
--     VALUES (v_shailu_id, v_synthetic_email, v_password, v_code_hash)
--     ON CONFLICT (user_id) DO UPDATE
--     SET code_hash = excluded.code_hash;
--     RAISE NOTICE 'Updated existing Shailu account (%) with access code %', v_shailu_id, v_access_code;
--   END IF;
-- END $$;
