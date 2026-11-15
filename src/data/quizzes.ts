import type { DailyQuiz, QuizQuestion, StateNationalParkInfo, QuizValidationResult } from '../types/quiz.ts';
import { STATE_REPOSITORIES } from './stateRepositories.ts';
import { ALL_30_STATES } from './states.ts';
import { DAY_01_AUTHENTIC_QUESTIONS } from './day01Questions.ts';

/**
 * DAILY_CONFIGS: The central configuration for daily quizzes.
 * Preserves the exact 7-day National Parks curriculum:
 * - Day 01: 6 States, 35 Parks -> Exactly 30 questions (5 per state)
 * - Day 02: 4 States, 13 Parks -> Exactly 30 questions (20 new + 10 cumulative revision)
 * - Day 03: 4 States, 13 Parks -> Exactly 30 questions (20 new + 10 cumulative revision)
 * - Day 04: 4 States, 12 Parks -> Exactly 30 questions (20 new + 10 cumulative revision)
 * - Day 05: 4 States, 11 Parks -> Exactly 30 questions (20 new + 10 cumulative revision)
 * - Day 06: 4 States, 12 Parks -> Exactly 30 questions (20 new + 10 cumulative revision)
 * - Day 07: 4 States, 13 Parks -> Exactly 30 questions (20 new + 10 cumulative revision)
 * - Day 08: Semi-Final Test -> first half of the ZIP-derived park pool
 * - Day 09: Grand Test -> remaining half of the ZIP-derived park pool
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

export const DAILY_DAY_CONFIGS: DayConfig[] = [
  // DAY 01: Foundational 6 States (Published & Available) - 35 Parks
  {
    dayNumber: 1,
    title: 'Day 01',
    quizDate: '09-11-2026',
    displayDate: '09 November 2026',
    statusLabel: 'Available',
    newStates: [
      'Madhya Pradesh',
      'Andhra Pradesh',
      'Telangana',
      'Kerala',
      'Assam',
      'Karnataka'
    ],
    totalQuestions: 30
  },
  // DAY 02: Islands & Small States (13 Parks)
  {
    dayNumber: 2,
    title: 'Day 02',
    quizDate: '10-11-2026',
    displayDate: '10 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Andaman and Nicobar Islands', 'Arunachal Pradesh', 'Bihar', 'Goa'],
    totalQuestions: 30
  },
  // DAY 03: Central & Western India (13 Parks)
  {
    dayNumber: 3,
    title: 'Day 03',
    quizDate: '11-11-2026',
    displayDate: '11 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Chhattisgarh', 'Gujarat', 'Haryana', 'Jammu and Kashmir'],
    totalQuestions: 30
  },
  // DAY 04: Northern Highlands (12 Parks)
  {
    dayNumber: 4,
    title: 'Day 04',
    quizDate: '12-11-2026',
    displayDate: '12 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Himachal Pradesh', 'Jharkhand', 'Ladakh', 'Rajasthan'],
    totalQuestions: 30
  },
  // DAY 05: Western & Northeastern India (11 Parks)
  {
    dayNumber: 5,
    title: 'Day 05',
    quizDate: '13-11-2026',
    displayDate: '13 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Maharashtra', 'Manipur', 'Meghalaya', 'Nagaland'],
    totalQuestions: 30
  },
  // DAY 06: Northeast & Southern Highlands (12 Parks)
  {
    dayNumber: 6,
    title: 'Day 06',
    quizDate: '14-11-2026',
    displayDate: '14 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Mizoram', 'Odisha', 'Tripura', 'Uttarakhand'],
    totalQuestions: 30
  },
  // DAY 07: Final States (13 Parks)
  {
    dayNumber: 7,
    title: 'Day 07',
    quizDate: '15-11-2026',
    displayDate: '15 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Sikkim', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'],
    totalQuestions: 30
  },
  // DAY 08: Semi-Final Test (Comprehensive All-State Assessment — 1 Question per State)
  {
    dayNumber: 8,
    title: 'Semi-Final Test',
    quizDate: '16-11-2026',
    displayDate: '16 November 2026',
    statusLabel: 'Scheduled',
    newStates: ALL_30_STATES,
    totalQuestions: 30
  },
  // DAY 09: Grand Test (Championship All-State Comprehensive Pool — 2 Questions per State)
  {
    dayNumber: 9,
    title: 'Grand Test',
    quizDate: '17-11-2026',
    displayDate: '17 November 2026',
    statusLabel: 'Scheduled',
    newStates: ALL_30_STATES,
    totalQuestions: 60
  }
];

export const DAILY_CONFIGS: DayConfig[] = [DAILY_DAY_CONFIGS[0]];
export const ALL_SCHEDULED_CONFIGS: DayConfig[] = DAILY_DAY_CONFIGS;

function getRepositoryForState(stateName: string) {
  return STATE_REPOSITORIES[stateName]
    || STATE_REPOSITORIES[stateName.replace('Andaman and Nicobar Islands', 'Andaman & Nicobar Islands')]
    || STATE_REPOSITORIES[stateName.replace('Jammu and Kashmir', 'Jammu & Kashmir')];
}

/**
 * Builds the quizzes from the state repositories matching the exact national parks available.
 */
export function buildCumulativeQuizzes(configs: DayConfig[] = DAILY_DAY_CONFIGS): DailyQuiz[] {
  const quizzes: DailyQuiz[] = [];
  let cumulativeStates: string[] = [];

  for (const config of configs) {
    const dayNumber = config.dayNumber;
    const isSpecialTest = dayNumber >= 8;
    const previousStates = isSpecialTest ? ALL_30_STATES : [...cumulativeStates];
    const newStates = config.newStates;

    const questions: QuizQuestion[] = [];
    const stateInfoList: StateNationalParkInfo[] = [];

    if (dayNumber === 1) {
      // DAY 01: Exactly 30 questions across 6 foundational states (5 questions per state)
      // Preserving original question IDs and keys for authentic 100% historical accuracy
      const states = [
        'Madhya Pradesh',
        'Andhra Pradesh',
        'Telangana',
        'Kerala',
        'Assam',
        'Karnataka'
      ];
      states.forEach(stateName => {
        if (!cumulativeStates.includes(stateName)) cumulativeStates.push(stateName);
        const repo = getRepositoryForState(stateName);
        if (repo) {
          stateInfoList.push(repo.stateInfo);
        }
      });
      questions.push(...DAY_01_AUTHENTIC_QUESTIONS);
    } else if (dayNumber >= 2 && dayNumber <= 7) {
      // DAYS 02–07: Exactly 30 questions each
      // Part A: 20 questions from newly introduced states (4 states * 5 questions each)
      newStates.forEach(stateName => {
        const repo = getRepositoryForState(stateName);
        if (repo) {
          if (!stateInfoList.some(info => info.stateName === stateName)) {
            stateInfoList.push(repo.stateInfo);
          }
          for (let i = 0; i < 5; i++) {
            const rawQ = repo.questions[i % repo.questions.length];
            if (rawQ) {
              questions.push({
                ...rawQ,
                id: `d${dayNumber}-${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-q${i + 1}`,
                section: 'new'
              });
            }
          }
        }
      });

      // Part B: 10 cumulative revision questions from all previously completed states
      if (previousStates.length > 0) {
        for (let r = 0; r < 10; r++) {
          const prevState = previousStates[r % previousStates.length];
          const prevRepo = getRepositoryForState(prevState);
          if (prevRepo && prevRepo.questions.length > 0) {
            if (!stateInfoList.some(info => info.stateName === prevState)) {
              stateInfoList.push(prevRepo.stateInfo);
            }
            const qIdx = (Math.floor(r / previousStates.length) + dayNumber) % prevRepo.questions.length;
            const rawQ = prevRepo.questions[qIdx];
            questions.push({
              ...rawQ,
              id: `d${dayNumber}-rev-${prevState.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-q${r + 1}`,
              section: 'previous'
            });
          }
        }
      }

      // Record newly introduced states for subsequent revision pools
      newStates.forEach(s => {
        if (!cumulativeStates.includes(s)) cumulativeStates.push(s);
      });
    } else if (dayNumber === 8) {
      // DAY 08: SEMI-FINAL — Exactly 30 questions (15 from first half, 15 from second half, all 30 states represented)
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
    } else if (dayNumber === 9) {
      // DAY 09: GRAND TEST — Exactly 60 questions (30 from first half, 30 from second half, all 30 states represented)
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
      dayNumber === 8
        ? 'semi-final'
        : dayNumber === 9
        ? 'grand-final'
        : `day-${dayNumber < 10 ? '0' + dayNumber : dayNumber}`;

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
  return found || ALL_SCHEDULED_QUIZZES[0];
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

  // 1. Check question count
  const expectedCount = dayNumber <= 7 ? 30 : dayNumber === 8 ? 30 : 60;
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
        if (dayNumber > 1) {
          errors.push(`Question #${qNum} has duplicate question text: "${q.question.substring(0, 45)}...".`);
        } else {
          warnings.push(`Day 01 historical question #${qNum} has duplicate question text: "${q.question.substring(0, 45)}...".`);
        }
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
