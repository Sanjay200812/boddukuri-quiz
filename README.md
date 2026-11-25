# Quiz by Spideyy

Topic-wise practice quizzes for Mahi and Shailu, managed by Sanju.

- **10 topics, 25 sets, 750 questions** — every set has 30 questions.
- Questions come from the study PDFs (June / September MCQ sets, PIB one-liners, SBI Clerk static GK notes), GI Registry updates up to November 2026, and the earlier topic notes.
- Each answer is explained in the review after submitting.

## Accounts

Sign-in is by 4-digit access code. Codes are checked in Supabase (`verify_access_code`), which signs the
person into their own Supabase account, so every student's results and settings are stored separately.

| Person | Role |
| --- | --- |
| Sanju | Admin |
| Mahi | Student |
| Shailu | Student |

Five wrong codes lock the device for 15 minutes.

## What each role can do

**Students**
- Sidebar with every topic; each topic lists its sets with status (start / resume / retake) and best score.
- Quiz player: question palette, mark for review, timer, keyboard shortcuts (1–4, ← →, F, Enter),
  progress saved on the device so a set can be resumed later.
- Result page with score, time, and an answer review filtered by wrong / skipped / correct.
- Submissions made while offline are kept and uploaded automatically when back online.

**Admin**
- Overview with live submissions (Supabase Realtime), per-student summary and topic comparison.
- Every submission, including the exact option each student picked.
- Per student: lock/unlock individual sets, hide topics, reset a set / topic / everything,
  rename, and leave a note that appears on that student's dashboard. Changes reach the
  student's open dashboard immediately and never affect the other student.
- Question bank browser with search, and a student-view preview.

## Data model (Supabase project `quiz-by-spideyy`)

- `quiz_attempts` — one row per submission. RLS: students insert/read their own; admin reads/deletes all.
- `student_settings` — locks, hidden topics and note per student. RLS: student reads own; only admin writes.
- `profiles`, `access_codes`, `auth_rate_limits` — accounts and sign-in.
- See `supabase/migrations/20261125_quiz_attempts_and_shailu.sql`.

Older tables from the previous version (`quiz_progress`, `inbox_notifications`, `admin_audit_logs`,
`admin_schedule_config`) are no longer used by the app.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run lint
```

`.env` needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Pushing to `main` deploys to GitHub Pages.

The question bank lives in `src/data/bank.json` (`topics` + `quizzes`, each quiz holding its 30 questions).
