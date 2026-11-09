import type { DailyQuiz, QuizQuestion, StateNationalParkInfo } from '../types/quiz';
import { STATE_REPOSITORIES } from './stateRepositories.ts';
import { ALL_28_STATES } from '../utils/schedule.ts';

/**
 * DAILY_CONFIGS: The central configuration for daily quizzes.
 * Configured: ONLY Day 01 (Fixed Date: 09 November 2026).
 * Preserved: 6 states, 30 questions (5 questions per state).
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

export const DAILY_CONFIGS: DayConfig[] = [
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
  }
];

export const ALL_SCHEDULED_CONFIGS: DayConfig[] = [
  DAILY_CONFIGS[0],
  // DAY 02: Andaman and Nicobar Islands, Goa, Sikkim, Nagaland (Locked)
  {
    dayNumber: 2,
    title: 'Day 02',
    quizDate: '10-11-2026',
    displayDate: '10 November 2026',
    statusLabel: 'Locked',
    newStates: ['Andaman and Nicobar Islands', 'Goa', 'Sikkim', 'Nagaland'],
    totalQuestions: 12
  },
  // DAY 03: Maharashtra, Gujarat, Jharkhand (Locked)
  {
    dayNumber: 3,
    title: 'Day 03',
    quizDate: '11-11-2026',
    displayDate: '11 November 2026',
    statusLabel: 'Locked',
    newStates: ['Maharashtra', 'Gujarat', 'Jharkhand'],
    totalQuestions: 11
  },
  // DAY 04: West Bengal, Odisha, Tripura, Bihar (Locked)
  {
    dayNumber: 4,
    title: 'Day 04',
    quizDate: '12-11-2026',
    displayDate: '12 November 2026',
    statusLabel: 'Locked',
    newStates: ['West Bengal', 'Odisha', 'Tripura', 'Bihar'],
    totalQuestions: 11
  },
  // DAY 05: Uttarakhand, Haryana, Meghalaya, Uttar Pradesh, Ladakh (Locked)
  {
    dayNumber: 5,
    title: 'Day 05',
    quizDate: '13-11-2026',
    displayDate: '13 November 2026',
    statusLabel: 'Locked',
    newStates: ['Uttarakhand', 'Haryana', 'Meghalaya', 'Uttar Pradesh', 'Ladakh'],
    totalQuestions: 12
  },
  // DAY 06: Tamil Nadu, Himachal Pradesh, Manipur, Mizoram (Locked)
  {
    dayNumber: 6,
    title: 'Day 06',
    quizDate: '14-11-2026',
    displayDate: '14 November 2026',
    statusLabel: 'Locked',
    newStates: ['Tamil Nadu', 'Himachal Pradesh', 'Manipur', 'Mizoram'],
    totalQuestions: 14
  },
  // DAY 07: Rajasthan, Jammu and Kashmir, Chhattisgarh, Arunachal Pradesh (Locked)
  {
    dayNumber: 7,
    title: 'Day 07',
    quizDate: '15-11-2026',
    displayDate: '15 November 2026',
    statusLabel: 'Locked',
    newStates: ['Rajasthan', 'Jammu and Kashmir', 'Chhattisgarh', 'Arunachal Pradesh'],
    totalQuestions: 14
  }
];

/**
 * Distributes totalQuestions as evenly as possible across the given number of buckets
 */
function distributeCounts(total: number, numBuckets: number): number[] {
  if (numBuckets <= 0) return [];
  const base = Math.floor(total / numBuckets);
  const remainder = total % numBuckets;
  const counts: number[] = [];
  for (let i = 0; i < numBuckets; i++) {
    counts.push(base + (i < remainder ? 1 : 0));
  }
  return counts;
}

/**
 * Builds the daily quizzes from the configuration and state repositories.
 * - Day 01: Retains 6 foundational states with 30 questions (5 per state).
 * - Days 02–07: Follows the approved 7-day National Parks study plan where every park
 *   in the scheduled states is covered once with direct "National Park name -> State" questions.
 * - Days 08 & 09: Comprehensive Semi-Final (40 Qs) and Grand Final (50 Qs) tests covering all 28 states & UTs.
 */
export function buildCumulativeQuizzes(configs: DayConfig[] = DAILY_CONFIGS): DailyQuiz[] {
  const quizzes: DailyQuiz[] = [];
  let cumulativeStates: string[] = [];

  for (const config of configs) {
    const dayNumber = config.dayNumber;
    const previousStates = [...cumulativeStates];
    const newStates = config.newStates;

    const questions: QuizQuestion[] = [];
    const stateInfoList: StateNationalParkInfo[] = [];

    if (dayNumber === 1) {
      // DAY 01: Exactly 30 questions across 6 states (5 questions per state)
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
      // DAYS 02–07: Focus strictly on that day's state grouping.
      // Every park in the scheduled states is covered exactly once!
      newStates.forEach(stateName => {
        if (!cumulativeStates.includes(stateName)) cumulativeStates.push(stateName);
        const repo = STATE_REPOSITORIES[stateName];
        if (repo) {
          if (!stateInfoList.some(info => info.stateName === stateName)) {
            stateInfoList.push(repo.stateInfo);
          }
          const parkCount = repo.stateInfo.parks.length;
          for (let i = 0; i < parkCount; i++) {
            const rawQ = repo.questions[i];
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
    } else {
      // SPECIAL TESTS: Semi-Final (Day 8: 40 Qs) & Grand Final (Day 9: 50 Qs)
      const targetTotal = config.totalQuestions || 40;
      const allStates = ALL_28_STATES;
      const counts = distributeCounts(targetTotal, allStates.length);

      allStates.forEach((stateName, sIdx) => {
        const repo = STATE_REPOSITORIES[stateName];
        if (repo) {
          if (!stateInfoList.some(info => info.stateName === stateName)) {
            stateInfoList.push(repo.stateInfo);
          }
          const countNeeded = counts[sIdx];
          for (let i = 0; i < countNeeded; i++) {
            const rawQ = repo.questions[i % repo.questions.length];
            questions.push({
              ...rawQ,
              id: `d${dayNumber}-${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-q${i + 1}`,
              section: 'previous'
            });
          }
        }
      });
    }

    const quizId = `day-${dayNumber < 10 ? '0' + dayNumber : dayNumber}`;
    const statesCovered = config.newStates;

    quizzes.push({
      id: quizId,
      dayNumber,
      title: config.title,
      quizDate: config.quizDate || '09-11-2026',
      displayDate: config.displayDate || '09 November 2026',
      statusLabel: config.statusLabel || 'Scheduled',
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

// Master DAILY_QUIZZES list (contains ONLY Day 01 for test verification)
export const DAILY_QUIZZES: DailyQuiz[] = buildCumulativeQuizzes(DAILY_CONFIGS);

// All scheduled quizzes for the 09 Nov to 17 Nov schedule
export const ALL_SCHEDULED_QUIZZES: DailyQuiz[] = buildCumulativeQuizzes(ALL_SCHEDULED_CONFIGS);

/**
 * Returns the quiz for a given day number or ID (Days 01-07, Semi-Final, Grand Final)
 */
export function getQuizForDay(identifier: number | string): DailyQuiz {
  if (typeof identifier === 'number') {
    const found = ALL_SCHEDULED_QUIZZES.find(q => q.dayNumber === identifier);
    return found || DAILY_QUIZZES[0];
  }
  const found = ALL_SCHEDULED_QUIZZES.find(q => q.id === identifier);
  return found || DAILY_QUIZZES[0];
}
