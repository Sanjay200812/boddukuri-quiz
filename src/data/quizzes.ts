import type { DailyQuiz, QuizQuestion, StateNationalParkInfo } from '../types/quiz.ts';
import { STATE_REPOSITORIES } from './stateRepositories.ts';
import { ALL_30_STATES } from '../utils/schedule.ts';

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
 * - Day 08: Semi-Final Test -> Exactly 30 questions (1 per state across all 30 states)
 * - Day 09: Grand Test -> Exactly 60 questions (2 per state across all 30 states)
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
  // DAY 08: Semi-Final Test (Comprehensive All-State Assessment)
  {
    dayNumber: 8,
    title: 'Semi-Final Test',
    quizDate: '16-11-2026',
    displayDate: '16 November 2026',
    statusLabel: 'Scheduled',
    newStates: ALL_30_STATES,
    totalQuestions: 40
  },
  // DAY 09: Grand Test (Championship All-State Comprehensive Pool)
  {
    dayNumber: 9,
    title: 'Grand Test',
    quizDate: '17-11-2026',
    displayDate: '17 November 2026',
    statusLabel: 'Scheduled',
    newStates: ALL_30_STATES,
    totalQuestions: 50
  }
];

export const DAILY_CONFIGS: DayConfig[] = [DAILY_DAY_CONFIGS[0]];
export const ALL_SCHEDULED_CONFIGS: DayConfig[] = DAILY_DAY_CONFIGS;

function distributeQuestions(total: number, buckets: number): number[] {
  const base = Math.floor(total / buckets);
  const remainder = total % buckets;
  return Array.from({ length: buckets }, (_, index) => base + (index < remainder ? 1 : 0));
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
        const repo = STATE_REPOSITORIES[stateName];
        if (repo) {
          stateInfoList.push(repo.stateInfo);
          const stateQuestions = repo.questions;
          for (let i = 0; i < 5; i++) {
            const rawQ = stateQuestions[i % stateQuestions.length];
            questions.push({
              ...rawQ,
              id: `d1-${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-q${i + 1}`,
              section: 'new'
            });
          }
        }
      });
    } else if (dayNumber >= 2 && dayNumber <= 7) {
      // DAYS 02–07: Exactly 30 questions each
      // Part A: 20 questions from newly introduced states (4 states * 5 questions each)
      newStates.forEach(stateName => {
        const repo = STATE_REPOSITORIES[stateName];
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
          const prevRepo = STATE_REPOSITORIES[prevState];
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
      // DAY 08: Semi-Final Test — exactly the configured 40 questions.
      const counts = distributeQuestions(config.totalQuestions || 40, ALL_30_STATES.length);
      ALL_30_STATES.forEach((stateName, sIdx) => {
        const repo = STATE_REPOSITORIES[stateName];
        if (repo) {
          if (!stateInfoList.some(info => info.stateName === stateName)) {
            stateInfoList.push(repo.stateInfo);
          }
          for (let i = 0; i < counts[sIdx]; i++) {
            const rawQ = repo.questions[i % repo.questions.length];
            questions.push({ ...rawQ, id: `semi-final-${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-q${i + 1}`, section: sIdx < 15 ? 'previous' : 'new' });
          }
        }
      });
    } else if (dayNumber === 9) {
      // DAY 09: Grand Test — exactly the configured 50 questions.
      const counts = distributeQuestions(config.totalQuestions || 50, ALL_30_STATES.length);
      ALL_30_STATES.forEach((stateName, sIdx) => {
        const repo = STATE_REPOSITORIES[stateName];
        if (repo) {
          if (!stateInfoList.some(info => info.stateName === stateName)) {
            stateInfoList.push(repo.stateInfo);
          }
          for (let i = 0; i < counts[sIdx]; i++) {
            const rawQ = repo.questions[i % repo.questions.length];
            questions.push({
              ...rawQ,
              id: `grand-final-${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-q${i + 1}`,
              section: sIdx < 15 ? 'previous' : 'new'
            });
          }
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
