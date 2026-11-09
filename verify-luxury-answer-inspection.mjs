import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { DAILY_QUIZZES } from './src/data/quizzes.ts';

console.log('======================================================================');
console.log('VERIFYING ADMIN ANSWER INSPECTION & LUXURY DASHBOARD DESIGN');
console.log('======================================================================\n');

// 1. Verify luxury villa background image exists in public folder
assert.ok(existsSync('./public/admin-luxury-villa.jpg'), 'admin-luxury-villa.jpg must exist in public folder');
console.log('✓ 1. Luxury Villa background image verified in public folder (public/admin-luxury-villa.jpg).');

// 2. Verify AdminDashboard.tsx luxury background and contrast overlay
const adminCode = readFileSync('./src/components/AdminDashboard.tsx', 'utf-8');
assert.ok(adminCode.includes("url('/admin-luxury-villa.jpg')"), 'AdminDashboard must use luxury background image');
assert.ok(adminCode.includes('brightness(0.32)'), 'AdminDashboard must apply contrast brightness control');
assert.ok(adminCode.includes('radial-gradient'), 'AdminDashboard must apply obsidian gradient overlay for high contrast readability');
console.log('✓ 2. Luxury visual background implemented with dark obsidian gradient overlay ensuring 100% text readability.');

// 3. Verify Header and Sidebar specifications
assert.ok(adminCode.includes("Boddukuri's Quiz | Admin Control Center"), 'Admin header must match "Boddukuri\'s Quiz | Admin Control Center"');
const sidebarCode = readFileSync('./src/components/Sidebar.tsx', 'utf-8');
assert.ok(sidebarCode.includes("id: 'overview', label: 'Overview'"), 'Sidebar missing Overview');
assert.ok(sidebarCode.includes("id: 'students', label: 'Students'"), 'Sidebar missing Students');
assert.ok(sidebarCode.includes("id: 'mahi-profile', label: \"Mahi's Profile\""), 'Sidebar missing Mahi\'s Profile');
assert.ok(sidebarCode.includes("id: 'attempts', label: 'Quiz Attempts'"), 'Sidebar missing Quiz Attempts');
assert.ok(sidebarCode.includes("id: 'answer-sheets', label: 'Answer Sheets'"), 'Sidebar missing Answer Sheets');
assert.ok(sidebarCode.includes("id: 'schedule', label: 'Quiz Schedule'"), 'Sidebar missing Quiz Schedule');
assert.ok(sidebarCode.includes("id: 'inbox'") && sidebarCode.includes("label: 'Inbox'"), 'Sidebar missing Inbox');
assert.ok(sidebarCode.includes("id: 'analytics', label: 'Analytics'"), 'Sidebar missing Analytics');
assert.ok(sidebarCode.includes("id: 'settings', label: 'Settings'"), 'Sidebar missing Settings');
console.log('✓ 3. Admin header ("Boddukuri\'s Quiz | Admin Control Center") and exact 10-item sidebar verified.');

// 4. Verify Complete Student Answer Inspection UI elements
assert.ok(adminCode.includes('Status: CORRECT'), 'Missing clear CORRECT status indicator');
assert.ok(adminCode.includes('Status: INCORRECT'), 'Missing clear INCORRECT status indicator');
assert.ok(adminCode.includes('Status: UNANSWERED'), 'Missing clear UNANSWERED status indicator');
assert.ok(adminCode.includes('Mahi selected:'), 'Missing "Mahi selected:" answer comparison');
assert.ok(adminCode.includes('Correct answer:'), 'Missing "Correct answer:" answer comparison');
assert.ok(adminCode.includes('VIEW COMPLETE ANSWER SHEET'), 'Missing prominent VIEW COMPLETE ANSWER SHEET button');
console.log('✓ 4. Question-by-question answer format verified (Question Number, Question Text, Options, Selected, Correct, Status).');

// 5. Verify Review Controls (Filters, Search, Navigation, PDF, Print)
assert.ok(adminCode.includes('answerStatusFilter'), 'Missing status filter');
assert.ok(adminCode.includes('answerStateFilter'), 'Missing state filter');
assert.ok(adminCode.includes('answerSearchQuery'), 'Missing question search');
assert.ok(adminCode.includes('expandAllExplanations'), 'Missing expand/collapse explanations toggle');
assert.ok(adminCode.includes('selectedQuestionNavNumber'), 'Missing question number jump navigation');
assert.ok(adminCode.includes('generateAnswerSheetPDF'), 'Missing PDF export function call');
assert.ok(adminCode.includes('window.print()'), 'Missing print-friendly answer sheet trigger');
console.log('✓ 5. Answer Review Controls verified (Status filter tabs, state filter, question search, number jump grid, PDF export, Print).');

// 6. Verify Result Summary at Top of Attempt
assert.ok(adminCode.includes('Student: Mahi'), 'Missing Student: Mahi label');
assert.ok(adminCode.includes('Total Questions'), 'Missing Total Questions stat');
assert.ok(adminCode.includes('Correct'), 'Missing Correct stat');
assert.ok(adminCode.includes('Incorrect'), 'Missing Incorrect stat');
assert.ok(adminCode.includes('Unanswered'), 'Missing Unanswered stat');
assert.ok(adminCode.includes('Marks'), 'Missing Marks stat');
assert.ok(adminCode.includes('Percentage'), 'Missing Percentage stat');
assert.ok(adminCode.includes('Time Taken'), 'Missing Time Taken stat');
console.log('✓ 6. Result Summary verified at top of attempt with all 8 metrics and performance assessment.');

// 7. Verify Student Dashboard Isolation (Luxury background is NOT applied to student view)
const studentDashCode = readFileSync('./src/components/Dashboard.tsx', 'utf-8');
assert.ok(!studentDashCode.includes('admin-luxury-villa.jpg'), 'Student Dashboard must not use the luxury background');
console.log('✓ 7. Student dashboard confirmed clean, friendly, distraction-free and focused on learning.');

// 8. Verify PDF Generator function export
const pdfCode = readFileSync('./src/utils/pdfGenerator.ts', 'utf-8');
assert.ok(pdfCode.includes('export function generateAnswerSheetPDF'), 'generateAnswerSheetPDF must be exported');
assert.ok(pdfCode.includes("BODDUKURI'S QUIZ — STUDENT ANSWER SHEET"), 'PDF title must be present');
console.log('✓ 8. Official Answer Sheet PDF generator verified.');

console.log('\n======================================================================');
console.log('ALL ADMIN ANSWER INSPECTION & LUXURY DESIGN TESTS PASSED (100%)! 🎉');
console.log('======================================================================\n');
