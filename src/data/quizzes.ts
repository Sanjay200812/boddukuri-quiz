import type { DailyQuiz, QuizQuestion, StateNationalParkInfo } from '../types/quiz';
import { STATE_REPOSITORIES } from './stateRepositories.ts';

/**
 * DAILY_CONFIGS: The central configuration for daily quizzes.
 * To add a new day, simply add an entry here specifying the dayNumber and new state(s) added!
 * The system will automatically:
 * 1. Find all previously added states.
 * 2. Add the new state to the cumulative learning pool.
 * 3. Generate a balanced 30-question quiz representing every state in the pool.
 * 4. Maintain previous quiz days and preserve all progress in LocalStorage.
 */
export interface DayConfig {
  dayNumber: number;
  title: string;
  quizDate: string;
  displayDate: string;
  statusLabel?: string;
  newStates: string[];
  totalQuestions?: number; // default 30
}

/**
 * DAILY_CONFIGS: The central configuration for daily quizzes.
 * Configured: ONLY Day 01 (Fixed Date: 09 November 2026).
 * Future expansion: The cumulative engine is fully built and ready.
 * When a new state is added in the future, add Day 02 with the new state here;
 * it will automatically retain all previous states (Madhya Pradesh, Andhra Pradesh,
 * Telangana, Kerala, Assam, Karnataka) and generate a balanced cumulative quiz!
 */
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

/**
 * Distributes totalQuestions as evenly as possible across the given number of states
 * e.g. 30 questions across 6 states => [5, 5, 5, 5, 5, 5]
 * e.g. 30 questions across 7 states => [5, 5, 4, 4, 4, 4, 4]
 */
function distributeCounts(total: number, numBuckets: number): number[] {
  const base = Math.floor(total / numBuckets);
  const remainder = total % numBuckets;
  const counts: number[] = [];
  for (let i = 0; i < numBuckets; i++) {
    counts.push(base + (i < remainder ? 1 : 0));
  }
  return counts;
}

/**
 * Automatically builds the cumulative daily quizzes from the configuration and state repositories
 */
export function buildCumulativeQuizzes(): DailyQuiz[] {
  const quizzes: DailyQuiz[] = [];
  let cumulativeStates: string[] = [];

  for (const config of DAILY_CONFIGS) {
    const dayNumber = config.dayNumber;
    const targetTotal = config.totalQuestions || 30;
    const previousStates = [...cumulativeStates];
    const newStates = config.newStates;

    // Append new states to cumulative pool
    for (const s of newStates) {
      if (!cumulativeStates.includes(s)) {
        cumulativeStates.push(s);
      }
    }

    const currentCumulativePool = [...cumulativeStates];
    const numStates = currentCumulativePool.length;
    const questionsPerState = distributeCounts(targetTotal, numStates);

    const questions: QuizQuestion[] = [];
    const stateInfoList: StateNationalParkInfo[] = [];

    // Gather questions deterministically from each state in the cumulative pool
    currentCumulativePool.forEach((stateName, stateIdx) => {
      const repo = STATE_REPOSITORIES[stateName];
      if (repo) {
        if (!stateInfoList.some(info => info.stateName === stateName)) {
          stateInfoList.push(repo.stateInfo);
        }

        const countNeeded = questionsPerState[stateIdx];
        const stateQuestions = repo.questions;

        // Is this state newly introduced on this day, or revision of a previously learned state?
        const isNewStateToday = newStates.includes(stateName);
        const sectionType = isNewStateToday ? 'new' : 'previous';

        for (let i = 0; i < countNeeded; i++) {
          const rawQ = stateQuestions[i % stateQuestions.length];
          questions.push({
            ...rawQ,
            id: `d${dayNumber}-${stateName.toLowerCase().replace(/\s+/g, '-')}-q${i + 1}`,
            section: sectionType
          });
        }
      }
    });

    quizzes.push({
      id: `day-${dayNumber < 10 ? '0' + dayNumber : dayNumber}`,
      dayNumber,
      title: config.title,
      quizDate: config.quizDate || '09-11-2026',
      displayDate: config.displayDate || '09 November 2026',
      statusLabel: config.statusLabel || 'Available',
      statesCovered: currentCumulativePool,
      newStatesIntroduced: newStates,
      previousStates: previousStates,
      stateInfoList,
      questions,
      totalQuestions: questions.length
    });
  }

  return quizzes;
}

// Generate the master DAILY_QUIZZES list
export const DAILY_QUIZZES: DailyQuiz[] = buildCumulativeQuizzes();
