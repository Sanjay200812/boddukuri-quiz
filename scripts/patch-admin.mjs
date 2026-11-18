import fs from 'fs';

let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// 1. Replace students and mahi-profile tabs with MultiStudentHub
const startMarker = "          {/* ========================================================================= */}\n          {/* TAB: STUDENTS (STUDENT MONITORING FOR MAHI) */}";
const endMarker = "          {/* ========================================================================= */}\n          {/* TAB: ANSWER SHEETS / COMPLETE STUDENT ANSWER INSPECTION */}";

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `          {/* ========================================================================= */}
          {/* TAB: STUDENTS & SCHOLARS WORKSPACE (MAHI & SHAILU) */}
          {/* ========================================================================= */}
          {(activeTab === 'students' || activeTab === 'mahi-profile') && (
            <MultiStudentHub
              attempts={attempts}
              completedDays={completedDays}
              onResetStudent={handleResetStudent}
              onViewAnswerSheet={handleOpenCompleteAnswerSheet}
              onRefreshData={refreshAllData}
            />
          )}

`;
  code = code.slice(0, startIdx) + replacement + code.slice(endIdx);
  console.log('✓ Successfully replaced students & mahi-profile with MultiStudentHub');
} else {
  console.error('Failed to find student tab markers:', startIdx, endIdx);
}

// 2. Replace schedule / quiz-management tab with TopicsChampionshipManager & PDF Question Studio
const scheduleStart = "          {(activeTab === 'quiz-management' || activeTab === 'schedule') && (";
const attemptsTabMarker = "          {/* ========================================================================= */}\n          {/* TAB: ATTEMPTS LIST & FILTER */}";

const sIdx = code.indexOf(scheduleStart);
const aIdx = code.indexOf(attemptsTabMarker);

if (sIdx !== -1 && aIdx !== -1) {
  const replacement2 = `          {/* ========================================================================= */}
          {/* TAB: TOPICS & CHAMPIONSHIP MANAGER */}
          {/* ========================================================================= */}
          {(activeTab === 'quiz-management' || activeTab === 'schedule') && (
            <TopicsChampionshipManager
              completedDays={completedDays}
              onRefreshData={refreshAllData}
              onPreviewQuiz={onPreviewDayQuiz}
            />
          )}

          {/* ========================================================================= */}
          {/* TAB: PDF QUESTION STUDIO (EXTRACTION, DRAFTS & APPROVAL QUEUE) */}
          {/* ========================================================================= */}
          {activeTab === 'pdf-studio' && (
            <PdfQuestionStudio />
          )}

`;
  code = code.slice(0, sIdx) + replacement2 + code.slice(aIdx);
  console.log('✓ Successfully replaced schedule & added pdf-studio');
} else {
  console.error('Failed to find schedule tab markers:', sIdx, aIdx);
}

// 3. Rebrand references
code = code.replace(/Boddukuri's Quiz Portal/g, 'Quiz by Spideyy Portal');
code = code.replace(/Boddukuri's Quiz creates an inbox/g, 'Quiz by Spideyy creates an inbox');
code = code.replace(/🌿 BODDUKURI'S QUIZ/g, '⚡ QUIZ BY SPIDEEYY');
code = code.replace(/boddukuri_quiz_backup_/g, 'spideyy_quiz_backup_');
code = code.replace(/Boddukuri's Quiz System Architecture/g, 'Quiz by Spideyy System Architecture');
code = code.replace(/7 Days \+ Semi-Final \+ Grand Test/g, '5 Topics + 2 Championship Tests');
code = code.replace(/of 7 Days Completed/g, 'of Topics & Tests Completed');
code = code.replace(/1 Active/g, '2 Scholars');
code = code.replace(/Mahi \(Enrolled Scholar\)/g, 'Mahi & Shailu (Scholars)');

fs.writeFileSync('src/components/AdminDashboard.tsx', code, 'utf8');
console.log('AdminDashboard.tsx patched successfully.');
