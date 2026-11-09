# Supabase Setup & Architecture Guide for Boddukuri's Quiz #Mahi

This guide provides the complete setup for role-based authentication, student sync, administrative oversight, access-code verification with brute-force rate limiting, and daily unlock schedules.

---

## 1. Prerequisites & Environment Configuration

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env` in the project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

> [!IMPORTANT]
> **Security Guardrails**:
> - Only the public `anon` key belongs in `.env`.
> - **Never** hardcode or store the Supabase `service_role` key in frontend code, git commits, or client-side bundles.
> - Plain access codes and passwords are **never** committed or stored in client code.

---

## 2. Database Schema & RLS Policies

Run the full schema in [`supabase/schema.sql`](./supabase/schema.sql) in your **Supabase Dashboard → SQL Editor**.

The schema automatically creates:
1. `public.profiles`: Links to `auth.users(id)` and stores user roles (`'student'` or `'admin'`).
2. `public.quiz_progress`: Stores encrypted/structured JSON snapshots of Mahi's progress, bookmarks, and attempts.
3. `public.retake_requests`: Tracks "Attempt Again" requests with status (`'pending'`, `'approved'`, `'rejected'`), requested timestamps, and reviewer notes.
4. `public.admin_schedule_config`: Admin overrides for day lock states and custom unlock schedules.
5. `public.admin_audit_logs`: Audit trail recording admin actions with timestamps.
6. `public.access_codes`: Server-side SHA-256 hashed access codes.
7. `public.auth_rate_limits`: Rate-limiting table (5 failed attempts $\to$ 15-minute temporary lockout).
8. `public.verify_access_code`: Postgres stored procedure (`security definer`) verifying access codes using SHA-256 and enforcing rate limits.
9. `public.log_admin_action`: Secure RPC function for recording administrative actions.

---

## 3. Creating User Accounts

### Step 3.1: Create Mahi's Student Account in Supabase Auth
1. Go to **Authentication → Users → Add User → Create User**.
2. Enter Mahi's email and password (e.g., `mahi@boddukuri.quiz`).
3. Set **Auto Confirm User?** to **Yes**.
4. Run this SQL snippet to set her profile role:
```sql
insert into public.profiles (id, email, full_name, role)
select id, email, 'Mahi', 'student'
from auth.users where email = 'mahi@boddukuri.quiz'
on conflict (id) do update set role = 'student';
```

### Step 3.2: Verify / Assign Sanju's Admin Account in Supabase Auth
If Sanju's admin user (`boddukurisanjay@gmail.com` or `sanju@boddukuri.quiz`) already exists in Supabase Auth, verify his role in `public.profiles`:
```sql
insert into public.profiles (id, email, full_name, role)
select id, email, 'Sanju', 'admin'
from auth.users where email in ('boddukurisanjay@gmail.com', 'sanju@boddukuri.quiz')
on conflict (id) do update set role = 'admin';
```

---

## 4. Setting Up Server-Side Access Codes

Both Mahi (Student PIN: `2002`) and Sanju (Admin PIN: `2718`) can log in directly using the "Access Code" tab on the login screen.
The application includes client-side SHA-256 cryptographic verification and rate limiting (5 attempts $\to$ 15-minute lockout). To also sync them server-side into `public.access_codes`:

```sql
-- Register access code for Mahi (PIN 2002)
insert into public.access_codes (user_id, email, auth_ticket, code_hash)
select 
  id, 
  email, 
  'mahi_auth_ticket_password', 
  '6c94e35ccc352d4e9ef0b99562cff995a5741ce8de8ad11b568892934daee366'
from auth.users 
where email = 'mahi@boddukuri.quiz';

-- Register access code for Sanju (PIN 2718)
insert into public.access_codes (user_id, email, auth_ticket, code_hash)
select 
  id, 
  email, 
  'sanju_auth_ticket_password', 
  'c47e82e01e20ad22f816159eb3c3c048308ffca5b116cfc0c9aaaf012ee5b729'
from auth.users 
where email in ('boddukurisanjay@gmail.com', 'sanju@boddukuri.quiz');
```

When entered in the login form:
- The backend function `verify_access_code(p_code, p_identifier)` computes `digest(p_code, 'sha256')`.
- If 5 incorrect attempts occur, the client is locked out for 15 minutes.
- On success, the backend returns the authenticated session ticket to sign in via Supabase Auth without disclosing hashes or secrets.
- Automatic routing redirects Mahi to the Student Learning Dashboard and Sanju to the Admin Dashboard.

---

## 5. Security & Row Level Security (RLS) Verification

| Resource | Student (`Mahi`) | Administrator (`Sanju`) |
| :--- | :--- | :--- |
| **Own Progress** | Read & Write own `quiz_progress` | Read all students' progress |
| **Retake Requests** | Insert and view own requests | Read, Approve, Reject all requests |
| **Schedule Overrides** | Read only | Create, update, toggle day locks |
| **Audit Logs** | No access | View all audit records |
| **Access Codes Table** | Direct access denied (`SECURITY DEFINER` RPC only) | Direct access denied (`SECURITY DEFINER` RPC only) |
| **Developer Mode** | Completely removed | Administrative control dashboard |

---

## 6. Daily Schedule Details

- **Dates**: 09 November 2026 to 15 November 2026 (All 28 Indian States).
- **Semi-Final Test**: 16 November 2026 (40 Questions, all 28 states).
- **Grand Final Test**: 17 November 2026 (50 Questions, all 28 states).
- **Daily Unlock Time**: Exactly **8:29 PM IST** (`14:59:00Z` UTC).
- **Timezone**: Indian Standard Time (`Asia/Kolkata`), computed using UTC offsets to prevent client clock manipulation.
