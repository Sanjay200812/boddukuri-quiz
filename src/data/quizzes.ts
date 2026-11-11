import type { DailyQuiz, QuizQuestion, StateNationalParkInfo } from '../types/quiz.ts';
import { STATE_REPOSITORIES } from './stateRepositories.ts';
import { ALL_28_STATES } from '../utils/schedule.ts';

export interface DayConfig {
  dayNumber: number;
  title: string;
  quizDate: string;
  displayDate: string;
  statusLabel?: string;
  newStates: string[];
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
    ]
  },
  // DAY 02: Island & Small States (Day 01 Revision + Day 02 New)
  {
    dayNumber: 2,
    title: 'Day 02',
    quizDate: '10-11-2026',
    displayDate: '10 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Andaman and Nicobar Islands', 'Goa', 'Sikkim', 'Nagaland']
  },
  // DAY 03: Western Hub & Plateau (Days 01-02 Revision + Day 03 New)
  {
    dayNumber: 3,
    title: 'Day 03',
    quizDate: '11-11-2026',
    displayDate: '11 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Maharashtra', 'Gujarat', 'Jharkhand']
  },
  // DAY 04: Eastern Plains & Delta (Days 01-03 Revision + Day 04 New)
  {
    dayNumber: 4,
    title: 'Day 04',
    quizDate: '12-11-2026',
    displayDate: '12 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['West Bengal', 'Odisha', 'Tripura', 'Bihar']
  },
  // DAY 05: Northern Highlands & Plains (Days 01-04 Revision + Day 05 New)
  {
    dayNumber: 5,
    title: 'Day 05',
    quizDate: '13-11-2026',
    displayDate: '13 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Uttarakhand', 'Haryana', 'Meghalaya', 'Uttar Pradesh', 'Ladakh']
  },
  // DAY 06: Southern Hills & Mountain Frontiers (Days 01-05 Revision + Day 06 New)
  {
    dayNumber: 6,
    title: 'Day 06',
    quizDate: '14-11-2026',
    displayDate: '14 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Tamil Nadu', 'Himachal Pradesh', 'Manipur', 'Mizoram']
  },
  // DAY 07: Crown Frontiers & Forests (Days 01-06 Revision + Day 07 New)
  {
    dayNumber: 7,
    title: 'Day 07',
    quizDate: '15-11-2026',
    displayDate: '15 November 2026',
    statusLabel: 'Scheduled',
    newStates: ['Rajasthan', 'Jammu and Kashmir', 'Chhattisgarh', 'Arunachal Pradesh']
  },
  // DAY 08: Semi-Final Test (Comprehensive All-State Cumulative Assessment)
  {
    dayNumber: 8,
    title: 'Semi-Final Test',
    quizDate: '16-11-2026',
    displayDate: '16 November 2026',
    statusLabel: 'Scheduled',
    newStates: ALL_28_STATES
  },
  // DAY 09: Grand Test (Championship All-State Comprehensive Pool)
  {
    dayNumber: 9,
    title: 'Grand Test',
    quizDate: '17-11-2026',
    displayDate: '17 November 2026',
    statusLabel: 'Scheduled',
    newStates: ALL_28_STATES
  }
];

// Fallback pool of known park names for authentic distractors
const POPULAR_PARK_NAMES = [
  'Jim Corbett National Park',
  'Kaziranga National Park',
  'Gir National Park',
  'Kanha National Park',
  'Bandhavgarh National Park',
  'Ranthambore National Park',
  'Periyar National Park',
  'Sundarbans National Park',
  'Silent Valley National Park',
  'Bandipur National Park',
  'Eravikulam National Park',
  'Tadoba National Park',
  'Hemis National Park',
  'Papikonda National Park',
  'Kasu Brahmananda Reddy National Park'
];

/**
 * Extracts and generates comprehensive, non-duplicate questions for a state
 * directly from the state master repository.
 */
export function getStateQuestions(stateName: string): Omit<QuizQuestion, 'section'>[] {
  const repo = STATE_REPOSITORIES[stateName];
  if (!repo) return [];

  const questions: Omit<QuizQuestion, 'section'>[] = [];
  const seenQuestionTexts = new Set<string>();

  // 1. Existing curated questions from repository (de-duplicated)
  repo.questions.forEach((q, idx) => {
    const normText = q.question.trim().toLowerCase();
    if (!seenQuestionTexts.has(normText)) {
      seenQuestionTexts.add(normText);
      questions.push({
        ...q,
        id: q.id || `${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-curated-${idx + 1}`,
        state: stateName
      });
    }
  });

  // 2. High-yield feature, wildlife & district questions for every national park
  repo.stateInfo.parks.forEach(park => {
    // A) Key Feature & Wildlife Question
    if (park.keyFeature) {
      const featQuestion = `Which National Park in ${stateName} is known for: ${park.keyFeature}?`;
      const normFeat = featQuestion.trim().toLowerCase();
      if (!seenQuestionTexts.has(normFeat)) {
        seenQuestionTexts.add(normFeat);

        // Options: The target park + 3 other distinct parks
        const sameStateParks = repo.stateInfo.parks.filter(p => p.name !== park.name).map(p => p.name);
        const distractors: string[] = [...sameStateParks];

        if (distractors.length < 3) {
          for (const fallback of POPULAR_PARK_NAMES) {
            if (fallback !== park.name && !distractors.includes(fallback)) {
              distractors.push(fallback);
              if (distractors.length >= 3) break;
            }
          }
        }

        const options: [string, string, string, string] = [
          park.name,
          distractors[0] || 'Periyar National Park',
          distractors[1] || 'Kanha National Park',
          distractors[2] || 'Kaziranga National Park'
        ];
        // Deterministic shuffle using park name length
        const targetIdx = park.name.length % 4;
        const temp = options[0];
        options[0] = options[targetIdx];
        options[targetIdx] = temp;

        questions.push({
          id: `${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${park.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-feat`,
          state: stateName,
          parkName: park.name,
          question: featQuestion,
          options,
          correctAnswer: targetIdx,
          difficulty: 'medium',
          explanation: `${park.name} in ${stateName} is renowned for: ${park.keyFeature}`,
          establishedYear: park.year,
          district: park.district,
          keyFeature: park.keyFeature
        });
      }
    }

    // B) District / Geography Question
    if (
      park.district &&
      !park.district.toLowerCase().includes('entire') &&
      !park.district.toLowerCase().includes('various')
    ) {
      const distQuestion = `In which district or region of ${stateName} is ${park.name} situated?`;
      const normDist = distQuestion.trim().toLowerCase();
      if (!seenQuestionTexts.has(normDist)) {
        seenQuestionTexts.add(normDist);

        const otherDists = repo.stateInfo.parks
          .filter(p => p.district && p.district !== park.district)
          .map(p => p.district);
        const distractors = Array.from(new Set(otherDists));
        const genericRegions = [
          'Central Plateau',
          'Northern Foothills',
          'Southern Highlands',
          'Western Valley',
          'Eastern Sector'
        ];
        let gIdx = 0;
        while (distractors.length < 3) {
          distractors.push(genericRegions[gIdx++] || 'Coastal District');
        }

        const options: [string, string, string, string] = [
          park.district,
          distractors[0] || 'Central District',
          distractors[1] || 'Northern District',
          distractors[2] || 'Southern District'
        ];
        const targetIdx = park.district.length % 4;
        const temp = options[0];
        options[0] = options[targetIdx];
        options[targetIdx] = temp;

        questions.push({
          id: `${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${park.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-dist`,
          state: stateName,
          parkName: park.name,
          question: distQuestion,
          options,
          correctAnswer: targetIdx,
          difficulty: 'medium',
          explanation: `${park.name} is located in the ${park.district} region of ${stateName}.`,
          establishedYear: park.year,
          district: park.district,
          keyFeature: park.keyFeature
        });
      }
    }
  });

  return questions;
}

/**
 * Builds the complete cumulative quizzes dynamically across all 9 days.
 * Structure:
 * - Day 01: All Day 01 states & parks
 * - Day 02: Day 01 revision + Day 02 states & parks
 * - Day 03: Days 01 & 02 revision + Day 03 states & parks
 * - Day 04: Days 01–03 revision + Day 04 states & parks
 * - Day 05: Days 01–04 revision + Day 05 states & parks
 * - Day 06: Days 01–05 revision + Day 06 states & parks
 * - Day 07: Days 01–06 revision + Day 07 states & parks
 * - Day 08: Semi-Final Test (Comprehensive all-state pool)
 * - Day 09: Grand Test (Championship all-state pool)
 */
export function buildCumulativeQuizzes(configs: DayConfig[] = DAILY_DAY_CONFIGS): DailyQuiz[] {
  const quizzes: DailyQuiz[] = [];
  let cumulativeStateList: string[] = [];

  for (const config of configs) {
    const dayNumber = config.dayNumber;
    const isSpecialTest = dayNumber >= 8;
    const previousStates = isSpecialTest ? ALL_28_STATES : [...cumulativeStateList];
    const newStates = isSpecialTest ? ALL_28_STATES : config.newStates;

    // Update cumulative state list
    if (!isSpecialTest) {
      newStates.forEach(st => {
        if (!cumulativeStateList.includes(st)) {
          cumulativeStateList.push(st);
        }
      });
    }

    const currentCumulativeStates = isSpecialTest ? ALL_28_STATES : [...cumulativeStateList];

    // Collect stateInfo objects for all covered states
    const stateInfoList: StateNationalParkInfo[] = [];
    currentCumulativeStates.forEach(st => {
      const repo = STATE_REPOSITORIES[st];
      if (repo && !stateInfoList.some(info => info.stateName === st)) {
        stateInfoList.push(repo.stateInfo);
      }
    });

    const questions: QuizQuestion[] = [];
    const seenTextsInQuiz = new Set<string>();

    if (dayNumber === 1) {
      // DAY 01: Foundational states (All questions from Day 01 pool)
      newStates.forEach(st => {
        const stateQs = getStateQuestions(st);
        stateQs.forEach(rawQ => {
          const norm = rawQ.question.trim().toLowerCase();
          if (!seenTextsInQuiz.has(norm)) {
            seenTextsInQuiz.add(norm);
            questions.push({
              ...rawQ,
              id: `d1-${rawQ.id}`,
              section: 'new'
            });
          }
        });
      });
    } else if (dayNumber >= 2 && dayNumber <= 7) {
      // DAYS 02–07: REVISION from previous days + NEW states for today

      // 1. Revision questions from all previous states
      previousStates.forEach(st => {
        const stateQs = getStateQuestions(st);
        stateQs.forEach(rawQ => {
          const norm = rawQ.question.trim().toLowerCase();
          if (!seenTextsInQuiz.has(norm)) {
            seenTextsInQuiz.add(norm);
            questions.push({
              ...rawQ,
              id: `d${dayNumber}-rev-${rawQ.id}`,
              section: 'previous'
            });
          }
        });
      });

      // 2. Newly introduced state questions for this day
      newStates.forEach(st => {
        const stateQs = getStateQuestions(st);
        stateQs.forEach(rawQ => {
          const norm = rawQ.question.trim().toLowerCase();
          if (!seenTextsInQuiz.has(norm)) {
            seenTextsInQuiz.add(norm);
            questions.push({
              ...rawQ,
              id: `d${dayNumber}-new-${rawQ.id}`,
              section: 'new'
            });
          }
        });
      });
    } else {
      // SPECIAL TESTS (Day 8: Semi-Final Test & Day 9: Grand Test)
      // Full comprehensive question pool across ALL 30 states / UTs
      ALL_28_STATES.forEach(st => {
        const stateQs = getStateQuestions(st);
        stateQs.forEach(rawQ => {
          const norm = rawQ.question.trim().toLowerCase();
          if (!seenTextsInQuiz.has(norm)) {
            seenTextsInQuiz.add(norm);
            questions.push({
              ...rawQ,
              id: `d${dayNumber}-all-${rawQ.id}`,
              section: 'previous'
            });
          }
        });
      });
    }

    const quizId =
      dayNumber === 8
        ? 'semi-final'
        : dayNumber === 9
        ? 'grand-final'
        : `day-${dayNumber < 10 ? '0' + dayNumber : dayNumber}`;

    quizzes.push({
      id: quizId,
      dayNumber,
      title: config.title,
      quizDate: config.quizDate,
      displayDate: config.displayDate,
      statusLabel: config.statusLabel || (dayNumber === 1 ? 'Available' : 'Scheduled'),
      statesCovered: currentCumulativeStates,
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
