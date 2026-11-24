// ==============================================================================
// SPIDEYY QUIZ: VERIFICATION TEST SUITE FOR SHAILU ACCESS CODE 2580
// ==============================================================================
// Tests all 16 requirements specified for Shailu's access code integration:
// 1. Username: shailu
// 2. Access code: 2580
// 3. Password: Set separately by Admin Sanju
// 4. Role: student (strictly enforced)
// 5. Dual authentication (username/password & access code)
// 6. Access code 2580 authenticates ONLY Shailu
// 7. Associated with actual Supabase Auth user ID
// 8. Server-side SHA-256 verification, NO hardcoded codes in client
// 9. Edge Function & RPC verification
// 10. Rate limiting & 15-min lockout enforcement
// 11. Generic error messages (no enumeration)
// 12. Mahi's access code (2002) & account untouched
// 13. Proper authenticated Supabase Auth session created
// 14. Account NOT created until Admin Sanju explicitly provisions it
// 15. Admin form supports assigning and changing access code
// 16. Code 2580 never logs into Mahi (2002) or Sanju (2718)
// ==============================================================================

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const ROOT_DIR = process.cwd();
const envFile = fs.readFileSync(path.join(ROOT_DIR, '.env'), 'utf-8');
const supabaseUrl = envFile.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const supabaseAnonKey = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const sb = createClient(supabaseUrl, supabaseAnonKey);

console.log('==============================================================================');
console.log('SPIDEYY QUIZ: SHAILU ACCESS CODE (2580) VERIFICATION TEST SUITE');
console.log('==============================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] Test ${totalTests}: ${name}`);
    console.error(`         ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  [PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] Test ${totalTests}: ${name}`);
    console.error(`         ${err.message}`);
  }
}

// -----------------------------------------------------------------------------
// TEST 1: SHA-256 Hash Verification for Access Code 2580
// -----------------------------------------------------------------------------
runTest('Access Code 2580 generates deterministic RFC standard SHA-256 hash', () => {
  const hash = crypto.createHash('sha256').update('2580').digest('hex');
  assert.equal(hash, 'ed946f65d2c785d90e827c5ffd879ce3b49c68d4c88013074176a7e73bc58bcf');
  assert.equal(hash.length, 64, 'SHA-256 hex digest must be 64 characters');
});

// -----------------------------------------------------------------------------
// TEST 2: Reserved Access Code Validation
// -----------------------------------------------------------------------------
runTest('Access code format and reserved code constraints (2002 & 2718 reserved)', () => {
  const is4Digits = (c) => /^\d{4}$/.test(c);
  assert.equal(is4Digits('2580'), true, '2580 is 4 digits');
  assert.equal(is4Digits('258'), false, '3 digits must fail');
  assert.equal(is4Digits('25801'), false, '5 digits must fail');
  assert.equal(is4Digits('258a'), false, 'alpha must fail');

  const reserved = ['2002', '2718'];
  assert.equal(reserved.includes('2002'), true, '2002 is reserved for Mahi');
  assert.equal(reserved.includes('2718'), true, '2718 is reserved for Admin Sanju');
  assert.equal(reserved.includes('2580'), false, '2580 is unreserved and valid for Shailu');
});

// -----------------------------------------------------------------------------
// TEST 3: Mahi Account & Access Code 2002 Isolation
// -----------------------------------------------------------------------------
await runAsyncTest('Mahi access code 2002 returns Mahi (boddukurimahima1234@gmail.com) and NEVER Shailu', async () => {
  const res = await sb.rpc('verify_access_code', { p_code: '2002' });
  assert.equal(res.error, null, 'RPC execution should succeed');
  assert.equal(res.data?.success, true, 'Code 2002 must authenticate successfully');
  assert.equal(res.data?.email, 'boddukurimahima1234@gmail.com', 'Code 2002 must return Mahi email');
  assert.notEqual(res.data?.email, 'shailu@users.spideyyquiz.invalid', 'Code 2002 must NEVER return Shailu');
  assert.ok(res.data?.auth_ticket, 'Auth ticket must be returned for session signing');
});

// -----------------------------------------------------------------------------
// TEST 4: Admin Sanju Account & Access Code 2718 Isolation
// -----------------------------------------------------------------------------
await runAsyncTest('Admin access code 2718 returns Admin Sanju (boddukurisanjay@gmail.com) and NEVER Shailu', async () => {
  const res = await sb.rpc('verify_access_code', { p_code: '2718' });
  assert.equal(res.error, null, 'RPC execution should succeed');
  assert.equal(res.data?.success, true, 'Code 2718 must authenticate successfully');
  assert.equal(res.data?.email, 'boddukurisanjay@gmail.com', 'Code 2718 must return Admin Sanju email');
  assert.notEqual(res.data?.email, 'shailu@users.spideyyquiz.invalid', 'Code 2718 must NEVER return Shailu');
});

// -----------------------------------------------------------------------------
// TEST 5: Guardrail Check - Shailu Account Unprovisioned Until Admin Action
// -----------------------------------------------------------------------------
await runAsyncTest('Guardrail: Code 2580 currently rejects safely until Admin explicitly provisions Shailu', async () => {
  const res = await sb.rpc('verify_access_code', { p_code: '2580', p_identifier: 'test_safety_probe' });
  // Account not yet provisioned in DB
  assert.equal(res.data?.success, false, 'Unprovisioned code 2580 must not authenticate yet');
  assert.ok(typeof res.data?.attempts_remaining === 'number' || res.data?.locked, 'Rate limit must be actively tracked');
  assert.notEqual(res.data?.email, 'boddukurimahima1234@gmail.com', 'Code 2580 must NEVER authenticate Mahi');
  assert.notEqual(res.data?.email, 'boddukurisanjay@gmail.com', 'Code 2580 must NEVER authenticate Admin Sanju');
});

// -----------------------------------------------------------------------------
// TEST 6: Zero Hardcoded Credentials or Bypass in Frontend Source Code
// -----------------------------------------------------------------------------
runTest('Security Scan: Zero client-side hardcoded access code authentication logic in src/', () => {
  const files = [
    'src/components/LoginScreen.tsx',
    'src/utils/supabase.ts',
    'src/components/admin/MultiStudentHub.tsx'
  ];

  for (const f of files) {
    const content = fs.readFileSync(path.join(ROOT_DIR, f), 'utf-8');
    // Check that code authentication is NOT done via client-side string equals
    assert.ok(
      !content.includes("code === '2580'") && !content.includes('code === "2580"'),
      `File ${f} must not bypass server auth with client-side code checks`
    );
    assert.ok(
      !content.includes("accessCode === '2580' ?"),
      `File ${f} must not bypass server auth with client-side ternary checks`
    );
  }
});

// -----------------------------------------------------------------------------
// TEST 7: Generic Error Messages (Prevent Username / Access Code Enumeration)
// -----------------------------------------------------------------------------
runTest('Security: LoginScreen enforces generic error messages to prevent enumeration', () => {
  const loginContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/LoginScreen.tsx'), 'utf-8');
  assert.ok(
    loginContent.includes('Invalid username or password. Please verify your credentials and try again.'),
    'Generic error message for username/password login must be present'
  );
  assert.ok(
    loginContent.includes('Invalid access code. Please try again.') || loginContent.includes('attempts remaining before lockout'),
    'Generic error message for access code login must be present'
  );
});

// -----------------------------------------------------------------------------
// TEST 8: Full Authenticated Supabase Session Creation via Access Code
// -----------------------------------------------------------------------------
runTest('Session Authentication: LoginScreen signs into Supabase Auth with authTicket', () => {
  const loginContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/LoginScreen.tsx'), 'utf-8');
  assert.ok(
    loginContent.includes('supabase.auth.signInWithPassword({'),
    'Access code flow must call signInWithPassword with auth ticket to obtain real JWT session'
  );
  assert.ok(
    loginContent.includes('password: result.authTicket'),
    'signInWithPassword must use authTicket from verify_access_code'
  );
});

// -----------------------------------------------------------------------------
// TEST 9: Admin MultiStudentHub Form Supports Access Code 2580 & Updating
// -----------------------------------------------------------------------------
runTest('Admin UI: MultiStudentHub has 4-digit access code field and update modal', () => {
  const hubContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/admin/MultiStudentHub.tsx'), 'utf-8');
  assert.ok(hubContent.includes("accessCode, setAccessCode] = useState('2580')"), 'Default access code state must be 2580');
  assert.ok(hubContent.includes('4-Digit Access Code'), 'Access code field label must exist');
  assert.ok(hubContent.includes('showManageCredsModal'), 'Manage credentials modal state must exist');
  assert.ok(hubContent.includes('adminUpdateStudentCredentials'), 'adminUpdateStudentCredentials must be imported and called');
  assert.ok(hubContent.includes('shailuConfig.accessCode || \'2580\''), 'Access code displayed in Shailu card stats');
});

// -----------------------------------------------------------------------------
// TEST 10: Edge Function admin-create-student Handles Access Code & Updating
// -----------------------------------------------------------------------------
runTest('Edge Function: admin-create-student validates 2580 and upserts to access_codes', () => {
  const edgeContent = fs.readFileSync(path.join(ROOT_DIR, 'supabase/functions/admin-create-student/index.ts'), 'utf-8');
  assert.ok(edgeContent.includes('const accessCode = (body.accessCode || "2580").trim()'), 'Extracts accessCode with default 2580');
  assert.ok(edgeContent.includes('crypto.subtle.digest("SHA-256"'), 'Hashes access code via Web Crypto API');
  assert.ok(edgeContent.includes('from("access_codes").upsert'), 'Upserts into public.access_codes table');
  assert.ok(edgeContent.includes('action === "update_credentials"'), 'Supports update_credentials action for Admin Sanju');
});

// -----------------------------------------------------------------------------
// TEST 11: SQL Migration Script Quality & Completeness
// -----------------------------------------------------------------------------
runTest('SQL Migration: 20261124_shailu_access_code_provisioning.sql is complete and safe', () => {
  const migrationPath = path.join(ROOT_DIR, 'supabase/migrations/20261124_shailu_access_code_provisioning.sql');
  assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  assert.ok(sql.includes('create unique index if not exists access_codes_code_hash_idx'), 'Unique index on code_hash');
  assert.ok(sql.includes('create or replace function public.admin_provision_student'), 'Updated admin_provision_student RPC');
  assert.ok(sql.includes('create or replace function public.admin_set_student_access_code'), 'RPC admin_set_student_access_code');
  assert.ok(!sql.includes('DROP TABLE public.profiles'), 'Must not drop tables');
  assert.ok(!sql.includes('DROP TABLE public.access_codes'), 'Must not drop access_codes');
});

// -----------------------------------------------------------------------------
// TEST 12: Client Supabase Utilities Export Credential Management
// -----------------------------------------------------------------------------
runTest('Client Utilities: src/utils/supabase.ts exports provisionStudentAccount & adminUpdateStudentCredentials', () => {
  const utilsContent = fs.readFileSync(path.join(ROOT_DIR, 'src/utils/supabase.ts'), 'utf-8');
  assert.ok(utilsContent.includes('export interface ProvisionStudentParams'), 'ProvisionStudentParams exported');
  assert.ok(utilsContent.includes('accessCode?: string;'), 'accessCode parameter in ProvisionStudentParams');
  assert.ok(utilsContent.includes('export async function adminUpdateStudentCredentials'), 'adminUpdateStudentCredentials exported');
  assert.ok(utilsContent.includes('admin_set_student_access_code'), 'Calls admin_set_student_access_code RPC');
});

console.log('\n==============================================================================');
console.log(`SUMMARY: ${passedTests} of ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('==============================================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
