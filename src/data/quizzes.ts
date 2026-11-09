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
  // DAY 02: Western India (Maharashtra [6], Gujarat [4], Goa [1]) - 11 Parks
  {
    dayNumber: 2,
    title: 'Day 02',
    quizDate: '10-11-2026',
    displayDate: '10 November 2026',
    statusLabel: 'Locked',
    newStates: ['Maharashtra', 'Gujarat', 'Goa'],
    totalQuestions: 11
  },
  // DAY 03: Desert & Southern Coasts (Rajasthan [5], Tamil Nadu [5]) - 10 Parks
  {
    dayNumber: 3,
    title: 'Day 03',
    quizDate: '11-11-2026',
    displayDate: '11 November 2026',
    statusLabel: 'Locked',
    newStates: ['Rajasthan', 'Tamil Nadu'],
    totalQuestions: 10
  },
  // DAY 04: Northern Himalayas (Uttarakhand [6], Himachal [5], J&K & Ladakh [5], Haryana [2]) - 18 Parks
  {
    dayNumber: 4,
    title: 'Day 04',
    quizDate: '12-11-2026',
    displayDate: '12 November 2026',
    statusLabel: 'Locked',
    newStates: ['Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir & Ladakh', 'Haryana'],
    totalQuestions: 18
  },
  // DAY 05: Eastern Plains & Heartland (West Bengal [6], Odisha [2], Chhattisgarh [3], UP [1], Bihar [1], Jharkhand [1]) - 14 Parks
  {
    dayNumber: 5,
    title: 'Day 05',
    quizDate: '13-11-2026',
    displayDate: '13 November 2026',
    statusLabel: 'Locked',
    newStates: ['West Bengal', 'Odisha', 'Chhattisgarh', 'Uttar Pradesh', 'Bihar', 'Jharkhand'],
    totalQuestions: 14
  },
  // DAY 06: North-East & Sikkim (Arunachal [2], Meghalaya [2], Manipur [2], Mizoram [2], Nagaland [1], Tripura [2], Sikkim [1]) - 12 Parks
  {
    dayNumber: 6,
    title: 'Day 06',
    quizDate: '14-11-2026',
    displayDate: '14 November 2026',
    statusLabel: 'Locked',
    newStates: ['Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'],
    totalQuestions: 12
  },
  // DAY 07: Island Archipelago (Andaman & Nicobar Islands [9]) - 9 Parks
  {
    dayNumber: 7,
    title: 'Day 07',
    quizDate: '15-11-2026',
    displayDate: '15 November 2026',
    statusLabel: 'Locked',
    newStates: ['Andaman & Nicobar Islands'],
    totalQuestions: 9
  },
  // 16 November: Semi-Final Test (40 Questions across all states)
  {
    dayNumber: 8,
    title: 'Semi-Final Test',
    quizDate: '16-11-2026',
    displayDate: '16 November 2026',
    statusLabel: 'Locked',
    newStates: [],
    totalQuestions: 40
  },
  // 17 November: Grand Final Test (50 Questions across all states)
  {
    dayNumber: 9,
    title: 'Grand Final Test',
    quizDate: '17-11-2026',
    displayDate: '17 November 2026',
    statusLabel: 'Locked',
    newStates: [],
    totalQuestions: 50
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

    const quizId = dayNumber === 8 
      ? 'semi-final' 
      : dayNumber === 9 
      ? 'grand-final' 
      : `day-${dayNumber < 10 ? '0' + dayNumber : dayNumber}`;

    const statesCovered = dayNumber <= 7 ? (dayNumber === 1 ? config.newStates : config.newStates) : ALL_28_STATES;

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
