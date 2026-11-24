import type { DailyQuiz, QuizQuestion, StateNationalParkInfo, QuizValidationResult } from '../types/quiz.ts';
import { STATE_REPOSITORIES } from './stateRepositories.ts';
import { ALL_30_STATES } from './states.ts';
import { getQuizById } from './topics.ts';

/**
 * CHAMPIONSHIP_CONFIGS: The authoritative configuration for Spideyy Quiz Championship Assessments.
 * As instructed, all 7 daily quiz modules (Day 01 - Day 07) have been removed.
 * Preserves ONLY:
 * - Semi-Final Test (Day 8 / 30 questions, 1 question per State/UT across all 30 States & UTs)
 * - Grand Test (Day 9 / 60 questions, 2 questions per State/UT across all 30 States & UTs)
 */
export interface DayConfig {
  dayNumber: number;
  title: string;
  quizDate: string;
  displayDate: string;
  statusLabel?: string;
  newStates: string[];
  totalQuestions?: number;
}

export const CHAMPIONSHIP_CONFIGS: DayConfig[] = [
  // SEMI-FINAL TEST (Comprehensive All-State Assessment — 1 Question per State = 30 Qs)
  {
    dayNumber: 8,
    title: 'Semi-Final Test',
    quizDate: '16-11-2026',
    displayDate: '16 November 2026',
    statusLabel: 'Available',
    newStates: ALL_30_STATES,
    totalQuestions: 30
  },
  // GRAND TEST (Championship All-State Comprehensive Pool — 2 Questions per State = 60 Qs)
  {
    dayNumber: 9,
    title: 'Grand Test',
    quizDate: '17-11-2026',
    displayDate: '17 November 2026',
    statusLabel: 'Available',
    newStates: ALL_30_STATES,
    totalQuestions: 60
  }
];

export const DAILY_DAY_CONFIGS: DayConfig[] = CHAMPIONSHIP_CONFIGS;
export const DAILY_CONFIGS: DayConfig[] = CHAMPIONSHIP_CONFIGS;
export const ALL_SCHEDULED_CONFIGS: DayConfig[] = CHAMPIONSHIP_CONFIGS;

function getRepositoryForState(stateName: string) {
  return STATE_REPOSITORIES[stateName]
    || STATE_REPOSITORIES[stateName.replace('Andaman and Nicobar Islands', 'Andaman & Nicobar Islands')]
    || STATE_REPOSITORIES[stateName.replace('Jammu and Kashmir', 'Jammu & Kashmir')];
}

/**
 * Builds the quizzes from the state repositories matching the exact national parks available.
 */
export function buildCumulativeQuizzes(configs: DayConfig[] = CHAMPIONSHIP_CONFIGS): DailyQuiz[] {
  const quizzes: DailyQuiz[] = [];

  for (const config of configs) {
    const dayNumber = config.dayNumber;
    const isSpecialTest = true;
    const previousStates = ALL_30_STATES;
    const newStates = config.newStates;

    const questions: QuizQuestion[] = [];
    const stateInfoList: StateNationalParkInfo[] = [];

    if (dayNumber === 8 || config.title.toLowerCase().includes('semi')) {
      // SEMI-FINAL — Exactly 30 questions (15 from first half, 15 from second half, all 30 states represented)
      const firstHalfStates = ALL_30_STATES.slice(0, 15);
      const secondHalfStates = ALL_30_STATES.slice(15, 30);

      firstHalfStates.forEach((stateName, sIdx) => {
        const repo = getRepositoryForState(stateName);
        if (repo && repo.questions.length > 0) {
          const rawQ = repo.questions[0];
          questions.push({
            ...rawQ,
            id: `semi-final-h1-${sIdx + 1}-${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            section: 'previous',
            order: questions.length + 1
          });
          if (!stateInfoList.some(info => info.stateName === stateName)) stateInfoList.push(repo.stateInfo);
        }
      });

      secondHalfStates.forEach((stateName, sIdx) => {
        const repo = getRepositoryForState(stateName);
        if (repo && repo.questions.length > 0) {
          const rawQ = repo.questions[0];
          questions.push({
            ...rawQ,
            id: `semi-final-h2-${sIdx + 1}-${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            section: 'new',
            order: questions.length + 1
          });
          if (!stateInfoList.some(info => info.stateName === stateName)) stateInfoList.push(repo.stateInfo);
        }
      });
    } else if (dayNumber === 9 || config.title.toLowerCase().includes('grand') || config.title.toLowerCase().includes('final')) {
      // GRAND TEST — Exactly 60 questions (30 from first half, 30 from second half, all 30 states represented)
      const firstHalfStates = ALL_30_STATES.slice(0, 15);
      const secondHalfStates = ALL_30_STATES.slice(15, 30);

      firstHalfStates.forEach((stateName, sIdx) => {
        const repo = getRepositoryForState(stateName);
        if (repo && repo.questions.length > 0) {
          for (let q = 0; q < 2; q++) {
            const rawQ = repo.questions[q % repo.questions.length];
            questions.push({
              ...rawQ,
              id: `grand-final-h1-${sIdx + 1}-q${q + 1}-${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              section: 'previous',
              order: questions.length + 1
            });
          }
          if (!stateInfoList.some(info => info.stateName === stateName)) stateInfoList.push(repo.stateInfo);
        }
      });

      secondHalfStates.forEach((stateName, sIdx) => {
        const repo = getRepositoryForState(stateName);
        if (repo && repo.questions.length > 0) {
          for (let q = 0; q < 2; q++) {
            const rawQ = repo.questions[q % repo.questions.length];
            questions.push({
              ...rawQ,
              id: `grand-final-h2-${sIdx + 1}-q${q + 1}-${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              section: 'new',
              order: questions.length + 1
            });
          }
          if (!stateInfoList.some(info => info.stateName === stateName)) stateInfoList.push(repo.stateInfo);
        }
      });
    }

    const quizId =
      dayNumber === 8 || config.title.toLowerCase().includes('semi')
        ? 'semi-final'
        : 'grand-final';

    const statesCovered = isSpecialTest ? ALL_30_STATES : [...newStates, ...previousStates];

    quizzes.push({
      id: quizId,
      dayNumber,
      title: config.title,
      quizDate: config.quizDate || '09-11-2026',
      displayDate: config.displayDate || '09 November 2026',
      statusLabel: config.statusLabel || (dayNumber === 1 ? 'Available' : 'Scheduled'),
      statesCovered,
      newStatesIntroduced: newStates,
      previousStates,
      stateInfoList,
      questions,
      totalQuestions: questions.length
    });
  }

  return quizzes;
}

// Master scheduled quizzes array across all 9 curriculum days
export const ALL_SCHEDULED_QUIZZES: DailyQuiz[] = buildCumulativeQuizzes(DAILY_DAY_CONFIGS);

// Master DAILY_QUIZZES array containing all curriculum days
export const DAILY_QUIZZES: DailyQuiz[] = ALL_SCHEDULED_QUIZZES;

/**
 * Returns the complete quiz for a given day number or ID.
 */
export function getQuizForDay(identifier: number | string): DailyQuiz {
  if (typeof identifier === 'number') {
    const found = ALL_SCHEDULED_QUIZZES.find(q => q.dayNumber === identifier);
    return found || ALL_SCHEDULED_QUIZZES[0];
  }
  const idStr = String(identifier).toLowerCase();
  const found = ALL_SCHEDULED_QUIZZES.find(
    q =>
      q.id === idStr ||
      (idStr === 'day-08' && q.id === 'semi-final') ||
      (idStr === 'day-09' && q.id === 'grand-final') ||
      (idStr === 'semi-final' && q.dayNumber === 8) ||
      (idStr === 'grand-final' && q.dayNumber === 9)
  );
  if (found) return found;

  const topicQuiz = getQuizById(idStr);
  if (topicQuiz) return topicQuiz;

  return ALL_SCHEDULED_QUIZZES[0];
}

/**
 * Question Validation Engine (Phase 5)
 * Strict validation enforcing daily quotas, 20/10 split, Semi-Final (30 Qs / 30 states),
 * Grand Test (60 Qs / 30 states), options completeness, and answer key consistency.
 */
export function validateQuizForPublishing(
  quiz: DailyQuiz,
  questionsToValidate?: QuizQuestion[]
): QuizValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const questions = questionsToValidate || quiz.questions;
  const dayNumber = quiz.dayNumber;

  // 1. Check question count (Semi-Final: 30 Qs, Grand Test: 60 Qs)
  const expectedCount = (dayNumber === 8 || quiz.id === 'semi-final') ? 30 : 60;
  if (questions.length !== expectedCount) {
    errors.push(`Quiz "${quiz.title}" requires exactly ${expectedCount} questions, but has ${questions.length}.`);
  }

  // 2. New vs Revision allocation
  let newCount = 0;
  let revCount = 0;
  const statesInQuiz = new Set<string>();
  const seenIds = new Set<string>();
  const seenQuestionTexts = new Set<string>();

  questions.forEach((q, idx) => {
    const qNum = idx + 1;

    // Check duplicate ID
    if (seenIds.has(q.id)) {
      errors.push(`Question #${qNum} has duplicate ID "${q.id}".`);
    } else {
      seenIds.add(q.id);
    }

    // Check duplicate question text
    const normalizedText = (q.question || '').trim().toLowerCase();
    if (normalizedText.length > 0) {
      if (seenQuestionTexts.has(normalizedText)) {
        errors.push(`Question #${qNum} has duplicate question text: "${q.question.substring(0, 45)}...".`);
      } else {
        seenQuestionTexts.add(normalizedText);
      }
    } else {
      errors.push(`Question #${qNum} has empty question text.`);
    }

    // Check options
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`Question #${qNum} must have exactly 4 options.`);
    } else {
      const optionTexts = q.options.map(o => (o || '').trim());
      if (optionTexts.some(o => o.length === 0)) {
        errors.push(`Question #${qNum} contains empty option text.`);
      }
      const uniqueOptions = new Set(optionTexts.map(o => o.toLowerCase()));
      if (uniqueOptions.size !== 4) {
        errors.push(`Question #${qNum} has duplicate options: ${q.options.join(', ')}.`);
      }
    }

    // Check correct answer
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      errors.push(`Question #${qNum} has invalid correct answer index "${q.correctAnswer}" (must be 0, 1, 2, or 3).`);
    }

    // Check explanation
    if (!q.explanation || q.explanation.trim().length === 0) {
      errors.push(`Question #${qNum} is missing an explanation.`);
    }

    // Check state & park association
    if (!q.state || !ALL_30_STATES.includes(q.state)) {
      errors.push(`Question #${qNum} has invalid state "${q.state}". Must be one of the 30 recognized States/UTs.`);
    } else {
      statesInQuiz.add(q.state);
      const repo = getRepositoryForState(q.state);
      if (repo && q.parkName) {
        const parkExists = repo.stateInfo.parks.some(p => p.name.toLowerCase() === q.parkName.toLowerCase());
        if (!parkExists) {
          warnings.push(`Question #${qNum} park "${q.parkName}" is not listed in repository for state "${q.state}".`);
        }
      }
    }

    if (q.section === 'new') {
      newCount++;
    } else {
      revCount++;
    }
  });

  // Specific Day allocations
  if (dayNumber >= 2 && dayNumber <= 7) {
    if (newCount !== 20 || revCount !== 10) {
      errors.push(`Day 0${dayNumber} must contain exactly 20 new-state questions and 10 revision questions (found ${newCount} new, ${revCount} revision).`);
    }
  } else if (dayNumber === 8) {
    // Semi-Final: all 30 states represented
    if (statesInQuiz.size < 30) {
      errors.push(`Semi-Final Test must represent all 30 states/UTs (found ${statesInQuiz.size}/30).`);
    }
  } else if (dayNumber === 9) {
    // Grand Test: all 30 states represented
    if (statesInQuiz.size < 30) {
      errors.push(`Grand Test must represent all 30 states/UTs (found ${statesInQuiz.size}/30).`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalQuestions: questions.length,
      newQuestions: newCount,
      revisionQuestions: revCount,
      statesCoveredCount: statesInQuiz.size
    }
  };
}
