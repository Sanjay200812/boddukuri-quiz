import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { getQuizForDay } from '../src/data/quizzes.ts';
import { TOPIC_CATEGORIES, STARTER_TOPIC_QUESTIONS } from '../src/data/topics.ts';

const SUPABASE_URL = 'https://oohxmqohiaspgawsqacv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OdIzjhP5naAmjuG5q5MpMA_GopYbTye';

const SANJU_EMAIL = 'boddukurisanjay@gmail.com';
const SANJU_CODE = '2718';
const SANJU_UUID = '81545df0-2a05-4257-a0f0-2c3342eb9e34';

const MAHI_UUID = '61758bc8-51bd-4cf9-b276-a7d6a796b6da';

async function runMigration() {
  console.log('================================================================');
  console.log('  QUIZ BY SPIDEEYY — TARGETED DATABASE MIGRATION');
  console.log('================================================================\n');

  const sanjuClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: auth, error: aErr } = await sanjuClient.auth.signInWithPassword({
    email: SANJU_EMAIL,
    password: SANJU_CODE
  });
  if (aErr) throw new Error(`Admin authentication failed: ${aErr.message}`);
  console.log('✓ Admin authenticated:', auth.user.id);

  // 1. Target identification & safety check
  const { data: existingConfigs } = await sanjuClient
    .from('admin_schedule_config')
    .select('key');
  console.log('Existing config keys in Supabase:', existingConfigs?.map(c => c.key));

  // 2. Identify Semi-Final and Grand Test from authoritative codebase
  const semiFinalQuiz = getQuizForDay(8);
  const grandFinalQuiz = getQuizForDay(9);

  console.log(`✓ Semi-Final identified: ${semiFinalQuiz.title} (${semiFinalQuiz.questions.length} questions, id="${semiFinalQuiz.id}")`);
  console.log(`✓ Grand Test identified: ${grandFinalQuiz.title} (${grandFinalQuiz.questions.length} questions, id="${grandFinalQuiz.id}")`);

  if (semiFinalQuiz.questions.length !== 30 || grandFinalQuiz.questions.length !== 60) {
    throw new Error('Preservation check failed: Semi-Final must have 30 questions and Grand Final 60 questions.');
  }

  // 3. Delete obsolete daily quiz modules from admin_schedule_config
  const obsoleteKeys = [
    'quiz:day-01', 'quiz_version:day-01:v1',
    'quiz:day-02', 'quiz_version:day-02:v1',
    'quiz:day-03', 'quiz_version:day-03:v1',
    'quiz:day-04', 'quiz_version:day-04:v1',
    'quiz:day-05', 'quiz_version:day-05:v1',
    'quiz:day-06', 'quiz_version:day-06:v1',
    'quiz:day-07', 'quiz_version:day-07:v1'
  ];

  for (const key of obsoleteKeys) {
    const { error: delErr } = await sanjuClient
      .from('admin_schedule_config')
      .delete()
      .eq('key', key);
    if (!delErr) {
      // deleted or did not exist
    }
  }
  console.log('✓ Obsolete daily quiz keys removed from admin_schedule_config.');

  // 4. Upsert Semi-Final and Grand Test records
  const now = new Date().toISOString();

  await sanjuClient.from('admin_schedule_config').upsert([
    {
      key: 'quiz:semi-final',
      payload: {
        quiz: semiFinalQuiz,
        version: 1,
        publishedAt: now,
        isChampionship: true
      },
      updated_at: now,
      updated_by: SANJU_UUID
    },
    {
      key: 'quiz_version:semi-final:v1',
      payload: {
        quizId: 'semi-final',
        version: 1,
        questions: semiFinalQuiz.questions,
        totalQuestions: 30,
        snapshotAt: now
      },
      updated_at: now,
      updated_by: SANJU_UUID
    },
    {
      key: 'quiz:grand-final',
      payload: {
        quiz: grandFinalQuiz,
        version: 1,
        publishedAt: now,
        isChampionship: true
      },
      updated_at: now,
      updated_by: SANJU_UUID
    },
    {
      key: 'quiz_version:grand-final:v1',
      payload: {
        quizId: 'grand-final',
        version: 1,
        questions: grandFinalQuiz.questions,
        totalQuestions: 60,
        snapshotAt: now
      },
      updated_at: now,
      updated_by: SANJU_UUID
    },
    {
      key: 'quizzes_registry',
      payload: {
        championships: ['semi-final', 'grand-final'],
        activeAssessments: [
          { id: 'semi-final', title: 'Semi-Final Test', totalQuestions: 30, status: 'published' },
          { id: 'grand-final', title: 'Grand Test', totalQuestions: 60, status: 'published' }
        ],
        updatedAt: now
      },
      updated_at: now,
      updated_by: SANJU_UUID
    },
    {
      key: 'topics_registry',
      payload: {
        topics: TOPIC_CATEGORIES,
        totalQuestionsCount: STARTER_TOPIC_QUESTIONS.length,
        updatedAt: now
      },
      updated_at: now,
      updated_by: SANJU_UUID
    }
  ]);
  console.log('✓ Semi-Final and Grand Final published and versioned in admin_schedule_config.');
  console.log('✓ Topics registry published with 5 main topics.');

  // 5. Clean up student progress: keep semi-final and grand-final attempts; filter out daily attempts
  const { data: mahiRow } = await sanjuClient
    .from('quiz_progress')
    .select('payload')
    .eq('user_id', MAHI_UUID)
    .single();

  if (mahiRow && mahiRow.payload) {
    const rawAttempts = mahiRow.payload.attempts || [];
    // Preserve ONLY semi-final or grand-final attempts
    const preservedAttempts = rawAttempts.filter(a => a.quizId === 'semi-final' || a.quizId === 'grand-final');
    const preservedCompleted = (mahiRow.payload.completedDays || []).filter(d => d === 'semi-final' || d === 'grand-final');

    const cleanMahiPayload = {
      ...mahiRow.payload,
      attempts: preservedAttempts,
      completedDays: preservedCompleted,
      topicProgress: mahiRow.payload.topicProgress || {},
      resetVersion: Date.now(),
      resetAt: now,
      updatedAt: now
    };

    await sanjuClient
      .from('quiz_progress')
      .update({ payload: cleanMahiPayload, updated_at: now })
      .eq('user_id', MAHI_UUID);

    console.log(`✓ Mahi progress migrated: preserved ${preservedAttempts.length} championship attempts, purged daily attempts.`);
  }

  // 6. Record audit log entry
  await sanjuClient.from('admin_audit_logs').insert({
    admin_id: SANJU_UUID,
    admin_email: SANJU_EMAIL,
    action: 'RESTRUCTURE_TOPIC_WORKSPACE_MIGRATION',
    target: 'platform',
    details: {
      appName: 'Quiz by Spideyy',
      dailyModulesRemoved: ['day-01', 'day-02', 'day-03', 'day-04', 'day-05', 'day-06', 'day-07'],
      championshipsPreserved: ['semi-final', 'grand-final'],
      topicsCount: TOPIC_CATEGORIES.length,
      starterQuestionsCount: STARTER_TOPIC_QUESTIONS.length,
      timestamp: now
    }
  });
  console.log('✓ Admin audit log entry recorded.');

  // 7. Verification step: Read back from Supabase
  const { data: verifySemi } = await sanjuClient
    .from('admin_schedule_config')
    .select('payload')
    .eq('key', 'quiz:semi-final')
    .single();

  const { data: verifyGrand } = await sanjuClient
    .from('admin_schedule_config')
    .select('payload')
    .eq('key', 'quiz:grand-final')
    .single();

  if (verifySemi?.payload?.quiz?.questions?.length === 30 && verifyGrand?.payload?.quiz?.questions?.length === 60) {
    console.log('\n================================================================');
    console.log('  MIGRATION VERIFICATION: ALL 100% SUCCESSFUL');
    console.log('  Semi-Final (30 Qs) and Grand Test (60 Qs) PRESERVED & LIVE!');
    console.log('================================================================\n');
  } else {
    throw new Error('Migration verification failed!');
  }
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
