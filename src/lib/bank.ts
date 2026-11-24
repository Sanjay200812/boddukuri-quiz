import bankData from '../data/bank.json';

export interface Question {
  id: string;
  q: string;
  options: string[];
  answer: number;
  explanation?: string;
  source?: string;
}

export interface Quiz {
  id: string;
  topicId: string;
  number: number;
  title: string;
  subtitle: string;
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  quizCount: number;
}

const data = bankData as { topics: Topic[]; quizzes: Quiz[] };

export const TOPICS: Topic[] = data.topics;
export const QUIZZES: Quiz[] = data.quizzes;

const quizById = new Map(QUIZZES.map(q => [q.id, q]));
const topicById = new Map(TOPICS.map(t => [t.id, t]));
const questionById = new Map(QUIZZES.flatMap(q => q.questions.map(x => [x.id, x] as const)));

export const getQuiz = (id: string) => quizById.get(id);
export const getTopic = (id: string) => topicById.get(id);
export const getQuestion = (id: string) => questionById.get(id);
export const quizzesForTopic = (topicId: string) => QUIZZES.filter(q => q.topicId === topicId);
export const TOTAL_QUESTIONS = QUIZZES.reduce((n, q) => n + q.questions.length, 0);

export function quizLabel(quiz: Quiz): string {
  const topic = getTopic(quiz.topicId);
  return `${topic?.title ?? 'Quiz'} · ${quiz.title}`;
}
