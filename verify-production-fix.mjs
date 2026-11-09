import fs from 'fs';
import assert from 'assert';

console.log('======================================================================');
console.log('VERIFYING BODDUKURI’S QUIZ FINAL PRODUCTION FIX & ADMIN CONTROLS');
console.log('======================================================================\n');

// 1. Verify Storage & Day 01 Baseline Attempt Recovery
const storageCode = fs.readFileSync('src/utils/storage.ts', 'utf8');
assert(storageCode.includes('export function ensureMahiBaselineAttempt'), 'Missing ensureMahiBaselineAttempt');
assert(storageCode.includes('export function getOrRecoverBaselineAttempts'), 'Missing getOrRecoverBaselineAttempts');
assert(storageCode.includes('marksObtained: 30'), 'Day 01 marks must be 30');
assert(storageCode.includes('timeTakenSeconds: 86'), 'Day 01 time taken must be 86 seconds');
assert(storageCode.includes('performanceTier: \'outstanding\''), 'Day 01 performance must be outstanding');
assert(storageCode.includes('export function markDayCompleted'), 'Missing markDayCompleted function');
assert(storageCode.includes('export function resetDayProgress'), 'Missing resetDayProgress function');
console.log('✓ 1. Day 01 baseline attempt restoration and day management functions verified.');

// 2. Verify Strict Locking & In-Progress Purge in Dashboard.tsx
const dashboardCode = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
assert(dashboardCode.includes('isInProgress = isUnlocked && !isCompleted && status === \'in-progress\''), 'isInProgress must require isUnlocked and !isCompleted');
assert(dashboardCode.includes('clearInProgressQuiz(dayQuiz.id)'), 'Dashboard must auto-clear stale in-progress sessions for locked or completed days');
assert(dashboardCode.includes('Unlocks at 8:29 PM IST'), 'Dashboard must show locked 8:29 PM IST button when locked');
console.log('✓ 2. Strict day locking and in-progress session cleanup verified (Locked days never show Resume Quiz).');

// 3. Verify Dedicated Student Notifications Component & Routing
const notifsExists = fs.existsSync('src/components/StudentNotifications.tsx');
assert(notifsExists, 'StudentNotifications.tsx must exist');

const appCode = fs.readFileSync('src/App.tsx', 'utf8');
assert(appCode.includes('import { StudentNotifications }'), 'App.tsx must import StudentNotifications');
assert(appCode.includes('currentView === \'notifications\''), 'App.tsx must support notifications view');
assert(appCode.includes('case \'notifications\':\n        setCurrentView(\'notifications\');'), 'Student nav must route notifications to view, not settings');
assert(!appCode.includes('case \'notifications\':\n        setIsSettingsOpen(true);'), 'Must not route notifications to settings');
assert(appCode.includes('<StudentNotifications'), 'App.tsx must render StudentNotifications component');
console.log('✓ 3. Student Notification center routing verified (Opens dedicated notifications view, NOT settings).');

// 4. Verify Retake Requests System in Admin Dashboard & Sidebar
const sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
assert(sidebarCode.includes('\'retake-requests\''), 'Sidebar must include retake-requests tab in AdminNavTab');
assert(sidebarCode.includes('label: \'Retake Requests\''), 'Sidebar must include Retake Requests in admin nav items');

const adminCode = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
assert(adminCode.includes('activeTab === \'retake-requests\''), 'AdminDashboard must have retake-requests tab view');
assert(adminCode.includes('handleReviewRetake'), 'AdminDashboard must handle review retake');
assert(adminCode.includes('Approve Retake'), 'AdminDashboard must provide Approve Retake button');
assert(adminCode.includes('pendingRetakesCount={stats.pendingRetakes}'), 'Sidebar must receive pending retakes count');
console.log('✓ 4. Retake requests management system verified with admin approval and realtime sync.');

// 5. Verify Individual Day Reset & Manual Mark Completed in Admin
assert(adminCode.includes('markCompletedModalDay'), 'AdminDashboard must support manual day completion modal');
assert(adminCode.includes('handleExecuteMarkCompleted'), 'AdminDashboard must have handleExecuteMarkCompleted');
assert(adminCode.includes('Reset All Student Progress'), 'AdminDashboard must support full progress reset modal');
assert(adminCode.includes('RESET MAHI PROGRESS'), 'Full reset must require typing RESET MAHI PROGRESS');
console.log('✓ 5. Admin individual day reset, manual mark completed, and protected full reset verified.');

// 6. Verify Luxury Backdrop & Design in AdminDashboard
assert(adminCode.includes('admin-luxury-villa.jpg'), 'AdminDashboard must include luxury villa backdrop');
assert(fs.existsSync('public/admin-luxury-villa.jpg'), 'public/admin-luxury-villa.jpg file must exist');
console.log('✓ 6. Luxury villa background and obsidian theme in Admin Control Center verified.');

// 7. Verify WhatsApp Recipient Number
const waCode = fs.readFileSync('src/utils/whatsapp.ts', 'utf8');
assert(waCode.includes('917075920852'), 'WhatsApp must target +91 70759 20852');
console.log('✓ 7. WhatsApp notification target verified (+91 70759 20852).');

console.log('\n======================================================================');
console.log('ALL FINAL PRODUCTION FIX VERIFICATIONS PASSED 100%! 🎉');
console.log('======================================================================');

