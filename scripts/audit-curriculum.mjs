import {
  TOPIC_CATEGORIES,
  getTopicsList,
  getQuizzesForTopic,
  getQuestionsForTopic,
  getQuestionsForQuiz,
  getAllTopicQuestions
} from '../src/data/topics.ts';

console.log('=== CURRICULUM AUDIT ===');
const topics = getTopicsList();
console.log('Total topics found:', topics.length);

let totalQuestions = 0;
let totalQuizzes = 0;

for (const t of topics) {
  const quizzes = getQuizzesForTopic(t.id, true);
  const questions = getQuestionsForTopic(t.id);
  totalQuestions += questions.length;
  totalQuizzes += quizzes.length;

  console.log(`\nTopic [${t.id}] "${t.title}" (Published: ${t.isPublished})`);
  console.log(`  Total Questions: ${questions.length} | Quizzes: ${quizzes.length}`);

  for (const q of quizzes) {
    const qQuestions = getQuestionsForQuiz(q.id);
    console.log(`    Quiz: [${q.id}] "${q.title}" -> ${qQuestions.length} Questions | Diff: ${q.difficulty} | Status: ${q.status}`);
    // Check first question's source and metadata
    if (qQuestions.length > 0) {
      const sample = qQuestions[0];
      console.log(`       Sample Q: "${sample.question.slice(0, 60)}..."`);
      console.log(`       Source: ${sample.source} (Page ${sample.pageNumber || 'N/A'}) | Verified: ${sample.lastVerified || 'N/A'}`);
    }
  }
}

console.log('\n========================');
console.log(`GRAND TOTAL: ${totalQuestions} Questions across ${totalQuizzes} Quizzes`);
console.log('========================');
