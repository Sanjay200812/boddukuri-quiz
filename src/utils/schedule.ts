/**
 * Schedule & Time Management for Boddukuri's Quiz #Mahi
 * Approved 7-Day National Parks Study Plan (09 Nov – 15 Nov 2026)
 *
 * Rules:
 * 1. Day 01 is today's quiz and retains the six already-covered states:
 *    Madhya Pradesh, Andhra Pradesh, Telangana, Kerala, Assam, Karnataka.
 * 2. Days 02–07 are scheduled and locked until explicitly published by Sanju.
 * 3. Every park in India is covered in the 7-day syllabus.
 * 4. Question format: National Park name -> Which state is it located in?
 * 5. Unlock time: 8:29 PM IST (14:59:00Z UTC).
 */

export interface DaySchedule {
  dayNumber: number;
  quizId: string; // "day-01", "day-02", etc.
  title: string;
  theme?: string;
  dateStr: string; // "09-11-2026"
  displayDate: string; // "09 November 2026"
  unlockIsoUTC: string; // ISO string in UTC corresponding to 8:29 PM IST (14:59:00Z)
  states: string[];
  newStates: string[];
  totalQuestions: number;
  isPublished?: boolean;
  statusLabel?: string;
  isSpecialTest?: boolean;
}

export const ALL_28_STATES: string[] = [
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Telangana',
  'Kerala',
  'Assam',
  'Karnataka',
  'Andaman and Nicobar Islands',
  'Goa',
  'Sikkim',
  'Nagaland',
  'Maharashtra',
  'Gujarat',
  'Jharkhand',
  'West Bengal',
  'Odisha',
  'Tripura',
  'Bihar',
  'Uttarakhand',
  'Haryana',
  'Meghalaya',
  'Uttar Pradesh',
  'Ladakh',
  'Tamil Nadu',
  'Himachal Pradesh',
  'Manipur',
  'Mizoram',
  'Rajasthan',
  'Jammu and Kashmir',
  'Chhattisgarh',
  'Arunachal Pradesh'
];

export const DAILY_SCHEDULE: DaySchedule[] = [
  // DAY 01: Foundational 6 States (Published & Available Today: 09 November 2026)
  {
    dayNumber: 1,
    quizId: 'day-01',
    title: 'Day 01',
    theme: 'Foundational 6 States (MP, AP, TS, Kerala, Assam & Karnataka)',
    dateStr: '09-11-2026',
    displayDate: '09 November 2026',
    unlockIsoUTC: '2026-11-09T14:59:00Z', // 8:29 PM IST
    states: [
      'Madhya Pradesh',
      'Andhra Pradesh',
      'Telangana',
      'Kerala',
      'Assam',
      'Karnataka'
    ],
    newStates: [
      'Madhya Pradesh',
      'Andhra Pradesh',
      'Telangana',
      'Kerala',
      'Assam',
      'Karnataka'
    ],
    totalQuestions: 30,
    isPublished: true, // Only Day 01 is published and accessible
    statusLabel: 'Available'
  },

  // DAY 02: Andaman and Nicobar Islands, Goa, Sikkim, Nagaland (Locked)
  {
    dayNumber: 2,
    quizId: 'day-02',
    title: 'Day 02',
    theme: 'Island & Small States (Andaman & Nicobar [9], Goa [1], Sikkim [1], Nagaland [1])',
    dateStr: '10-11-2026',
    displayDate: '10 November 2026',
    unlockIsoUTC: '2026-11-10T14:59:00Z',
    states: ['Andaman and Nicobar Islands', 'Goa', 'Sikkim', 'Nagaland'],
    newStates: ['Andaman and Nicobar Islands', 'Goa', 'Sikkim', 'Nagaland'],
    totalQuestions: 12,
    isPublished: false, // Locked until Sanju unlocks/publishes
    statusLabel: 'Scheduled'
  },

  // DAY 03: Maharashtra, Gujarat, Jharkhand (Locked)
  {
    dayNumber: 3,
    quizId: 'day-03',
    title: 'Day 03',
    theme: 'Western Hub & Plateau (Maharashtra [6], Gujarat [4], Jharkhand [1])',
    dateStr: '11-11-2026',
    displayDate: '11 November 2026',
    unlockIsoUTC: '2026-11-11T14:59:00Z',
    states: ['Maharashtra', 'Gujarat', 'Jharkhand'],
    newStates: ['Maharashtra', 'Gujarat', 'Jharkhand'],
    totalQuestions: 11,
    isPublished: false,
    statusLabel: 'Scheduled'
  },

  // DAY 04: West Bengal, Odisha, Tripura, Bihar (Locked)
  {
    dayNumber: 4,
    quizId: 'day-04',
    title: 'Day 04',
    theme: 'Eastern Plains & Delta (West Bengal [6], Odisha [2], Tripura [2], Bihar [1])',
    dateStr: '12-11-2026',
    displayDate: '12 November 2026',
    unlockIsoUTC: '2026-11-12T14:59:00Z',
    states: ['West Bengal', 'Odisha', 'Tripura', 'Bihar'],
    newStates: ['West Bengal', 'Odisha', 'Tripura', 'Bihar'],
    totalQuestions: 11,
    isPublished: false,
    statusLabel: 'Scheduled'
  },

  // DAY 05: Uttarakhand, Haryana, Meghalaya, Uttar Pradesh, Ladakh (Locked)
  {
    dayNumber: 5,
    quizId: 'day-05',
    title: 'Day 05',
    theme: 'Northern Highlands & Plains (Uttarakhand [6], Haryana [2], Meghalaya [2], UP [1], Ladakh [1])',
    dateStr: '13-11-2026',
    displayDate: '13 November 2026',
    unlockIsoUTC: '2026-11-13T14:59:00Z',
    states: ['Uttarakhand', 'Haryana', 'Meghalaya', 'Uttar Pradesh', 'Ladakh'],
    newStates: ['Uttarakhand', 'Haryana', 'Meghalaya', 'Uttar Pradesh', 'Ladakh'],
    totalQuestions: 12,
    isPublished: false,
    statusLabel: 'Scheduled'
  },

  // DAY 06: Tamil Nadu, Himachal Pradesh, Manipur, Mizoram (Locked)
  {
    dayNumber: 6,
    quizId: 'day-06',
    title: 'Day 06',
    theme: 'Southern Hills & Mountain Frontiers (Tamil Nadu [5], Himachal [5], Manipur [2], Mizoram [2])',
    dateStr: '14-11-2026',
    displayDate: '14 November 2026',
    unlockIsoUTC: '2026-11-14T14:59:00Z',
    states: ['Tamil Nadu', 'Himachal Pradesh', 'Manipur', 'Mizoram'],
    newStates: ['Tamil Nadu', 'Himachal Pradesh', 'Manipur', 'Mizoram'],
    totalQuestions: 14,
    isPublished: false,
    statusLabel: 'Scheduled'
  },

  // DAY 07: Rajasthan, Jammu and Kashmir, Chhattisgarh, Arunachal Pradesh (Locked)
  {
    dayNumber: 7,
    quizId: 'day-07',
    title: 'Day 07',
    theme: 'Crown Frontiers & Forests (Rajasthan [5], Jammu and Kashmir [4], Chhattisgarh [3], Arunachal [2])',
    dateStr: '15-11-2026',
    displayDate: '15 November 2026',
    unlockIsoUTC: '2026-11-15T14:59:00Z',
    states: ['Rajasthan', 'Jammu and Kashmir', 'Chhattisgarh', 'Arunachal Pradesh'],
    newStates: ['Rajasthan', 'Jammu and Kashmir', 'Chhattisgarh', 'Arunachal Pradesh'],
    totalQuestions: 14,
    isPublished: false,
    statusLabel: 'Scheduled'
  },
  {
    dayNumber: 8,
    quizId: 'semi-final',
    title: 'Semi-Final Test',
    theme: 'Comprehensive all-state assessment',
    dateStr: '16-11-2026',
    displayDate: '16 November 2026',
    unlockIsoUTC: '2026-11-16T14:59:00Z',
    states: ALL_28_STATES,
    newStates: ALL_28_STATES,
    totalQuestions: 40,
    isPublished: false,
    statusLabel: 'Locked',
    isSpecialTest: true
  },
  {
    dayNumber: 9,
    quizId: 'grand-final',
    title: 'Grand Test',
    theme: 'Final all-state championship assessment',
    dateStr: '17-11-2026',
    displayDate: '17 November 2026',
    unlockIsoUTC: '2026-11-17T14:59:00Z',
    states: ALL_28_STATES,
    newStates: ALL_28_STATES,
    totalQuestions: 50,
    isPublished: false,
    statusLabel: 'Locked',
    isSpecialTest: true
  }
];

export interface ScheduleOverrideItem {
  forceUnlocked?: boolean;
  forceLocked?: boolean;
  customUnlockIsoUTC?: string;
  updatedAt?: string;
}

const SCHEDULE_OVERRIDES_KEY = 'mahi_admin_schedule_overrides_v1';

export function isDevUnlockAllEnabled(): boolean {
  const overrides = getScheduleOverrides();
  return Boolean(overrides['__all__']?.forceUnlocked);
}

export function setDevUnlockAll(enabled: boolean): void {
  const overrides = getScheduleOverrides();
  overrides['__all__'] = {
    forceUnlocked: enabled,
    forceLocked: !enabled,
    updatedAt: new Date().toISOString()
  };
  saveScheduleOverrides(overrides);
}

/**
 * Returns administrative schedule overrides (managed exclusively by Sanju)
 */
export function getScheduleOverrides(): Record<string, ScheduleOverrideItem> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SCHEDULE_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveScheduleOverrides(overrides: Record<string, ScheduleOverrideItem>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SCHEDULE_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch {
    // ignore
  }
}

export function setDayAdminOverride(quizId: string, override: ScheduleOverrideItem): void {
  const all = getScheduleOverrides();
  all[quizId] = {
    ...all[quizId],
    ...override,
    updatedAt: new Date().toISOString()
  };
  saveScheduleOverrides(all);
}

/**
 * Evaluates whether a given day or test is unlocked:
 * - If the day was already completed by Mahi, it is ALWAYS unlocked for review.
 * - If an Admin force-unlocked the day, it is unlocked.
 * - If an Admin force-locked the day, it is locked.
 * - Day 01 is published and always available.
 * - Days 02–07 remain scheduled/locked until explicitly published or unlocked by Admin.
 */
export function isDayUnlocked(dayNumberOrId: number | string, completedDayIds: string[] = []): boolean {
  const quizId = typeof dayNumberOrId === 'string'
    ? dayNumberOrId
    : dayNumberOrId === 8
    ? 'semi-final'
    : dayNumberOrId === 9
    ? 'grand-final'
    : `day-${dayNumberOrId < 10 ? '0' + dayNumberOrId : dayNumberOrId}`;

  // Completed days are never locked
  if (completedDayIds.includes(quizId)) {
    return true;
  }

  // Check Admin Overrides
  const overrides = getScheduleOverrides();
  const override = overrides[quizId];
  if (override) {
    if (override.forceUnlocked === true) return true;
    if (override.forceLocked === true) return false;
  }

  const schedule = DAILY_SCHEDULE.find(s => s.quizId === quizId || s.dayNumber === dayNumberOrId);
  if (!schedule) return false;

  // Day 01 is published. Days 02–07 remain scheduled/locked until explicitly published or unlocked by Admin.
  if (!schedule.isPublished) {
    return false;
  }

  // Day 01 unlocks at sharp 8:29 PM IST (14:59:00Z UTC)
  const unlockTime = override?.customUnlockIsoUTC
    ? new Date(override.customUnlockIsoUTC).getTime()
    : new Date(schedule.unlockIsoUTC).getTime();

  return Date.now() >= unlockTime;
}

export interface CountdownInfo {
  isUnlocked: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formattedCountdown: string;
  unlockTimeFormatted: string;
}

/**
 * Calculates remaining hours, minutes, and seconds until unlock time for a given day
 */
export function getDayCountdown(dayNumberOrId: number | string, completedDayIds: string[] = []): CountdownInfo {
  const quizId = typeof dayNumberOrId === 'string'
    ? dayNumberOrId
    : dayNumberOrId === 8
    ? 'semi-final'
    : dayNumberOrId === 9
    ? 'grand-final'
    : `day-${dayNumberOrId < 10 ? '0' + dayNumberOrId : dayNumberOrId}`;

  const unlocked = isDayUnlocked(quizId, completedDayIds);
  const schedule = DAILY_SCHEDULE.find(s => s.quizId === quizId || s.dayNumber === dayNumberOrId);

  if (unlocked || !schedule) {
    return {
      isUnlocked: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      formattedCountdown: 'Available Now',
      unlockTimeFormatted: '8:30 PM IST'
    };
  }

  const overrides = getScheduleOverrides();
  const override = overrides[quizId];
  const targetIso = override?.customUnlockIsoUTC || schedule.unlockIsoUTC;
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();
  const diffMs = targetTime - now;

  if (diffMs <= 0) {
    return {
      isUnlocked: false,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      formattedCountdown: 'Scheduled (Locked by Admin)',
      unlockTimeFormatted: '8:30 PM IST'
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hStr = hours < 10 ? `0${hours}` : `${hours}`;
  const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return {
    isUnlocked: false,
    hours,
    minutes,
    seconds,
    totalSeconds,
    formattedCountdown: `${hStr}h ${mStr}m ${sStr}s`,
    unlockTimeFormatted: '8:30 PM IST'
  };
}

/**
 * Automatically determines the recommended day to study
 */
export function getRecommendedTargetDay(completedDayIds: string[] = []): number {
  for (const s of DAILY_SCHEDULE) {
    if (!completedDayIds.includes(s.quizId)) {
      return s.dayNumber;
    }
  }
  return 1;
}
