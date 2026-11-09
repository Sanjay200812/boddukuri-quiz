# Supabase setup for Mahi's Quiz

## One-time setup

1. Create a Supabase project.
2. Open **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql).
3. Open **Authentication → Users → Add user** and create Mahi's email/password account.
4. Copy `.env.example` to `.env` and fill in the values from **Project Settings → API**:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

5. Start the app with `npm run dev`.
6. Sign in as Mahi. Existing LocalStorage progress will merge into the cloud automatically.

Only the publishable/anon key belongs in `.env`. Never use the Supabase service-role key in this app or commit it.
