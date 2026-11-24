// ==============================================================================
// SPIDEYY QUIZ: SHAILU STUDENT ACCOUNT & USERNAME AUTH INTEGRATION TEST SUITE
// ==============================================================================
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const ANON_KEY = envVars.VITE_SUPABASE_ANON_KEY;

// Populate environment variables for Node execution
process.env.VITE_SUPABASE_URL = SUPABASE_URL;
process.env.VITE_SUPABASE_ANON_KEY = ANON_KEY;

const results = [];

function check(title, condition, detail) {
  results.push({ title, pass: Boolean(condition), detail: detail || '' });
  console.log(`${condition ? '✅ PASS' : '❌ FAIL'}: ${title}${detail ? ' (' + detail + ')' : ''}`);
}

async function runTests() {
  console.log('================================================================');
  console.log('SPIDEYY QUIZ: SHAILU & USERNAME AUTH VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  const supabase = createClient(SUPABASE_URL, ANON_KEY);

  // 1. PRESERVATION OF MAHI'S ACCOUNT & CREDENTIALS
  console.log('--- 1. MAHI PRESERVATION CHECKS ---');
  const mahiRpc = await supabase.rpc('verify_access_code', { p_code: '2002', p_identifier: 'test_verifier_mahi' });
  check(
    'Mahi Access Code 2002 Verified',
    mahiRpc.data?.success === true && mahiRpc.data?.email?.includes('boddukurimahima'),
    `Resolved Email: ${mahiRpc.data?.email}`
  );

  const { data: mahiAuth, error: mahiAuthErr } = await supabase.auth.signInWithPassword({
    email: 'boddukurimahima1234@gmail.com',
    password: '2002'
  });
  check(
    'Mahi Supabase Auth Sign-In Intact',
    !mahiAuthErr && mahiAuth?.user?.id === '61758bc8-51bd-4cf9-b276-a7d6a796b6da',
    `User ID: ${mahiAuth?.user?.id}`
  );

  // Check Mahi's progress row is intact
  const { data: mahiProgress, error: mahiProgErr } = await supabase
    .from('quiz_progress')
    .select('user_id, payload')
    .eq('user_id', '61758bc8-51bd-4cf9-b276-a7d6a796b6da')
    .maybeSingle();

  check(
    'Mahi Cloud Progress Preserved',
    !mahiProgErr && mahiProgress?.user_id === '61758bc8-51bd-4cf9-b276-a7d6a796b6da',
    `User ID: ${mahiProgress?.user_id}`
  );

  // Sign out Mahi
  await supabase.auth.signOut();

  // 2. PRESERVATION OF ADMIN SANJU'S ACCOUNT & CREDENTIALS
  console.log('\n--- 2. ADMIN SANJU PRESERVATION CHECKS ---');
  const adminRpc = await supabase.rpc('verify_access_code', { p_code: '2718', p_identifier: 'test_verifier_admin' });
  check(
    'Admin Access Code 2718 Verified',
    adminRpc.data?.success === true && adminRpc.data?.email?.includes('boddukurisanjay'),
    `Resolved Email: ${adminRpc.data?.email}`
  );

  const { data: adminAuth, error: adminAuthErr } = await supabase.auth.signInWithPassword({
    email: 'boddukurisanjay@gmail.com',
    password: '2718'
  });
  check(
    'Admin Supabase Auth Sign-In Intact',
    !adminAuthErr && adminAuth?.user?.id === '81545df0-2a05-4257-a0f0-2c3342eb9e34',
    `Admin User ID: ${adminAuth?.user?.id}`
  );

  const { data: isAdmin } = await supabase.rpc('is_admin');
  check('Admin is_admin() RPC returns true', isAdmin === true, `is_admin: ${isAdmin}`);

  // Admin can view all students' progress
  const { data: allProgress } = await supabase.from('quiz_progress').select('user_id');
  check(
    'Admin can view all students in quiz_progress',
    Array.isArray(allProgress) && allProgress.length >= 1,
    `Found ${allProgress?.length || 0} student progress records`
  );

  await supabase.auth.signOut();

  // 3. USERNAME RESOLUTION AND SYNTHETIC IDENTITIES
  console.log('\n--- 3. USERNAME RESOLVER & SYNTHETIC IDENTITY CHECKS ---');
  const { resolveUsernameToAuth } = await import('../src/utils/supabase.ts');

  const mahiResolved = await resolveUsernameToAuth('mahi');
  check('Username "mahi" resolves to actual email', mahiResolved === 'boddukurimahima1234@gmail.com', mahiResolved);

  const mahiUpperResolved = await resolveUsernameToAuth('MAHI');
  check('Username "MAHI" (case-insensitive) resolves correctly', mahiUpperResolved === 'boddukurimahima1234@gmail.com', mahiUpperResolved);

  const shailuResolved = await resolveUsernameToAuth('shailu');
  check('Username "shailu" resolves to reserved synthetic identity', shailuResolved === 'shailu@users.spideyyquiz.invalid', shailuResolved);

  const sanjuResolved = await resolveUsernameToAuth('sanju');
  check('Username "sanju" resolves to admin email', sanjuResolved === 'boddukurisanjay@gmail.com', sanjuResolved);

  const adminAliasResolved = await resolveUsernameToAuth('admin');
  check('Username "admin" alias resolves to admin email', adminAliasResolved === 'boddukurisanjay@gmail.com', adminAliasResolved);

  const emailPreserved = await resolveUsernameToAuth('student@gmail.com');
  check('Direct email preserved as-is', emailPreserved === 'student@gmail.com', emailPreserved);

  const customUserResolved = await resolveUsernameToAuth('newscholar');
  check('Arbitrary username generates standard synthetic identity', customUserResolved === 'newscholar@users.spideyyquiz.invalid', customUserResolved);

  // 4. STUDENT DATA ISOLATION & RLS ENFORCEMENT
  console.log('\n--- 4. STUDENT DATA ISOLATION & RLS CHECKS ---');
  // Log in as Mahi
  await supabase.auth.signInWithPassword({
    email: 'boddukurimahima1234@gmail.com',
    password: '2002'
  });

  const { data: mahiViewProgress } = await supabase.from('quiz_progress').select('user_id');
  const onlyMahiSeen = Array.isArray(mahiViewProgress) && mahiViewProgress.every(p => p.user_id === '61758bc8-51bd-4cf9-b276-a7d6a796b6da');
  check('Mahi can ONLY see her own progress row (RLS isolation)', onlyMahiSeen, `Rows visible to Mahi: ${mahiViewProgress?.length}`);

  // Both students have access to shared curriculum topics and questions
  const { TOPIC_CATEGORIES, STARTER_TOPIC_QUESTIONS } = await import('../src/data/topics.ts');
  check(
    'Both students share published curriculum topics and question bank',
    TOPIC_CATEGORIES.length >= 8 && STARTER_TOPIC_QUESTIONS.length >= 80,
    `${TOPIC_CATEGORIES.length} Topics, ${STARTER_TOPIC_QUESTIONS.length} Questions accessible`
  );

  // Sign out Mahi
  await supabase.auth.signOut();

  // Unauthenticated caller cannot read private quiz_progress
  const anonSupabase = createClient(SUPABASE_URL, ANON_KEY);
  const { data: anonProgress } = await anonSupabase.from('quiz_progress').select('user_id');
  check('Unauthenticated users CANNOT read student quiz_progress', !anonProgress || anonProgress.length === 0, `Anon visible rows: ${anonProgress?.length || 0}`);

  // 5. PROVISIONING VALIDATION AND SECURITY GUARDRAILS
  console.log('\n--- 5. PROVISIONING VALIDATION CHECKS ---');
  const { provisionStudentAccount } = await import('../src/utils/supabase.ts');

  // Attempt provisioning while unauthenticated
  const unauthProvision = await provisionStudentAccount({
    displayName: 'Test',
    username: 'teststudent',
    password: 'Password123',
    confirmPassword: 'Password123'
  });
  check('Unauthenticated provisioning is rejected', unauthProvision.success === false, unauthProvision.error);

  // Validate empty display name
  const emptyNameProvision = await provisionStudentAccount({
    displayName: '',
    username: 'teststudent',
    password: 'Password123'
  });
  check('Empty display name is rejected', emptyNameProvision.success === false, emptyNameProvision.error);

  // Validate short username
  const shortUserProvision = await provisionStudentAccount({
    displayName: 'Shailu',
    username: 'sh',
    password: 'Password123'
  });
  check('Short username (< 3 chars) is rejected', shortUserProvision.success === false, shortUserProvision.error);

  // Validate reserved username
  const reservedUserProvision = await provisionStudentAccount({
    displayName: 'Shailu',
    username: 'mahi',
    password: 'Password123'
  });
  check('Reserved username "mahi" is rejected', reservedUserProvision.success === false, reservedUserProvision.error);

  // Validate password mismatch
  const mismatchProvision = await provisionStudentAccount({
    displayName: 'Shailu',
    username: 'shailu',
    password: 'Password123',
    confirmPassword: 'DifferentPassword'
  });
  check('Mismatched password confirmation is rejected', mismatchProvision.success === false, mismatchProvision.error);

  // 6. CODE AUDIT & SECRET PROTECTION
  console.log('\n--- 6. SECRET & INTEGRITY CHECKS ---');
  const envText = fs.readFileSync('.env', 'utf8');
  check('No service_role key in .env', !envText.includes('service_role') && !envText.includes('SERVICE_ROLE'), 'Only public anon key present');

  const supabaseTs = fs.readFileSync('src/utils/supabase.ts', 'utf8');
  check('No service_role key in src/utils/supabase.ts', !supabaseTs.includes('service_role') && !supabaseTs.includes('SERVICE_ROLE'), 'Protected against client-side key leakage');

  const loginScreenText = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');
  check('LoginScreen supports Username tab', loginScreenText.includes("authMethod === 'username'") && loginScreenText.includes('Username or Email'), 'Username authentication UI active');
  check('LoginScreen generic error handling present', loginScreenText.includes('Invalid username or password'), 'Prevents username enumeration');

  const multiStudentText = fs.readFileSync('src/components/admin/MultiStudentHub.tsx', 'utf8');
  check('MultiStudentHub has secure provisioning form', multiStudentText.includes('handleProvisionStudentSubmit') && multiStudentText.includes('Student Display Name'), 'Provisioning form present in Admin');
  check('MultiStudentHub forces Student (Scholar) role', multiStudentText.includes('Student (Scholar)'), 'Role locked to student');

  // Summary
  console.log('\n================================================================');
  const allPassed = results.every(r => r.pass);
  console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${results.filter(r => r.pass).length} | FAILED: ${results.filter(r => !r.pass).length}`);
  console.log(`STATUS: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log('================================================================');
  process.exit(allPassed ? 0 : 1);
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
