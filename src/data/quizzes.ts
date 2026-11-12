import type { DailyQuiz, QuizQuestion, StateNationalParkInfo } from '../types/quiz.ts';
import { STATE_REPOSITORIES } from './stateRepositories.ts';
import { ALL_28_STATES } from '../utils/schedule.ts';

/**
 * DAILY_CONFIGS: The central configuration for daily quizzes.
 * Preserves the exact 7-day National Parks curriculum:
 * - Day 01: 6 States, 35 Parks -> 30 questions (5 per state)
 * - Day 02: 4 States, 12 Parks -> 12 questions (1 per park)
 * - Day 03: 3 States, 11 Parks -> 11 questions (1 per park)
 * - Day 04: 4 States, 11 Parks -> 11 questions (1 per park)
 * - Day 05: 5 States, 12 Parks -> 12 questions (1 per park)
 * - Day 06: 4 States, 14 Parks -> 14 questions (1 per park)
 * - Day 07: 4 States, 14 Parks -> 14 questions (1 per park)
 * - Day 08: Semi-Final Test (40 questions covering all 109 parks)
 * - Day 09: Grand Test (50 questions covering all 109 parks)
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
  // DAY 01: Foundational 6 States (Published & Available)
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
  // DAY 02: Island & Small States (12 National Parks)
  {
    dayNumber: 2,
    title: 'Day 02',
    quizDate: '12-11-2026',
    displayDate: '12 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Andaman and Nicobar Islands', 'Goa', 'Sikkim', 'Nagaland'],
    totalQuestions: 12
  },
  // DAY 03: Western Hub & Plateau (11 National Parks)
  {
    dayNumber: 3,
    title: 'Day 03',
    quizDate: '13-11-2026',
    displayDate: '13 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Maharashtra', 'Gujarat', 'Jharkhand'],
    totalQuestions: 11
  },
  // DAY 04: Eastern Plains & Delta (11 National Parks)
  {
    dayNumber: 4,
    title: 'Day 04',
    quizDate: '14-11-2026',
    displayDate: '14 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['West Bengal', 'Odisha', 'Tripura', 'Bihar'],
    totalQuestions: 11
  },
  // DAY 05: Northern Highlands & Plains (12 National Parks)
  {
    dayNumber: 5,
    title: 'Day 05',
    quizDate: '15-11-2026',
    displayDate: '15 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Uttarakhand', 'Haryana', 'Meghalaya', 'Uttar Pradesh', 'Ladakh'],
    totalQuestions: 12
  },
  // DAY 06: Southern Hills & Mountain Frontiers (14 National Parks)
  {
    dayNumber: 6,
    title: 'Day 06',
    quizDate: '16-11-2026',
    displayDate: '16 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Tamil Nadu', 'Himachal Pradesh', 'Manipur', 'Mizoram'],
    totalQuestions: 14
  },
  // DAY 07: Crown Frontiers & Forests (14 National Parks)
  {
    dayNumber: 7,
    title: 'Day 07',
    quizDate: '17-11-2026',
    displayDate: '17 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Rajasthan', 'Jammu and Kashmir', 'Chhattisgarh', 'Arunachal Pradesh'],
    totalQuestions: 14
  },
  // DAY 08: Semi-Final Test (Comprehensive All-State Assessment)
  {
    dayNumber: 8,
    title: 'Semi-Final Test',
    quizDate: '18-11-2026',
    displayDate: '18 November 2026',
    statusLabel: 'Scheduled',
    newStates: ALL_28_STATES,
    totalQuestions: 40
  },
  // DAY 09: Grand Test (Championship All-State Comprehensive Pool)
  {
    dayNumber: 9,
    title: 'Grand Test',
    quizDate: '19-11-2026',
    displayDate: '19 November 2026',
    statusLabel: 'Scheduled',
    newStates: ALL_28_STATES,
    totalQuestions: 50
  }
];

export const DAILY_CONFIGS: DayConfig[] = [DAILY_DAY_CONFIGS[0]];
export const ALL_SCHEDULED_CONFIGS: DayConfig[] = DAILY_DAY_CONFIGS;

/**
 * Distributes questions evenly across states for special tests
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
 * Builds the quizzes from the state repositories matching the exact national parks available.
 */
export function buildCumulativeQuizzes(configs: DayConfig[] = DAILY_DAY_CONFIGS): DailyQuiz[] {
  const quizzes: DailyQuiz[] = [];
  let cumulativeStates: string[] = [];

  for (const config of configs) {
    const dayNumber = config.dayNumber;
    const isSpecialTest = dayNumber >= 8;
    const previousStates = isSpecialTest ? ALL_28_STATES : [...cumulativeStates];
    const newStates = config.newStates;

    const questions: QuizQuestion[] = [];
    const stateInfoList: StateNationalParkInfo[] = [];

    if (dayNumber === 1) {
      // DAY 01: Exactly 30 questions across 6 foundational states (5 questions per state)
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
      // DAYS 02–07: Questions strictly match the national parks available in that day's states!
      // Exactly 1 question per park in each state
      newStates.forEach(stateName => {
        if (!cumulativeStates.includes(stateName)) cumulativeStates.push(stateName);
        const repo = STATE_REPOSITORIES[stateName];
        if (repo) {
          if (!stateInfoList.some(info => info.stateName === stateName)) {
            stateInfoList.push(repo.stateInfo);
          }
          const parkCount = repo.stateInfo.parks.length;
          for (let i = 0; i < parkCount; i++) {
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
    } else {
      // SPECIAL TESTS: Semi-Final (Day 8: 40 Qs) & Grand Final (Day 9: 50 Qs)
      const targetTotal = config.totalQuestions || (dayNumber === 8 ? 40 : 50);
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

    const quizId =
      dayNumber === 8
        ? 'semi-final'
        : dayNumber === 9
        ? 'grand-final'
        : `day-${dayNumber < 10 ? '0' + dayNumber : dayNumber}`;

    const statesCovered = isSpecialTest ? ALL_28_STATES : config.newStates;

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
