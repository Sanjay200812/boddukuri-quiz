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
  'Maharashtra',
  'Gujarat',
  'Goa',
  'Rajasthan',
  'Tamil Nadu',
  'Uttarakhand',
  'Himachal Pradesh',
  'Jammu & Kashmir & Ladakh',
  'Haryana',
  'West Bengal',
  'Odisha',
  'Chhattisgarh',
  'Uttar Pradesh',
  'Bihar',
  'Jharkhand',
  'Arunachal Pradesh',
  'Meghalaya',
  'Manipur',
  'Mizoram',
  'Nagaland',
  'Tripura',
  'Sikkim',
  'Andaman & Nicobar Islands'
];

export const DAILY_SCHEDULE: DaySchedule[] = [
  // DAY 01: Foundational 6 States (Published & Available Today)
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
    isPublished: true, // Published today
    statusLabel: 'Available'
  },

  // DAY 02: Western India (Maharashtra, Gujarat & Goa) - 11 Parks
  {
    dayNumber: 2,
    quizId: 'day-02',
    title: 'Day 02',
    theme: 'Western India (Maharashtra [6], Gujarat [4], Goa [1])',
    dateStr: '10-11-2026',
    displayDate: '10 November 2026',
    unlockIsoUTC: '2026-11-10T14:59:00Z',
    states: ['Maharashtra', 'Gujarat', 'Goa'],
    newStates: ['Maharashtra', 'Gujarat', 'Goa'],
    totalQuestions: 11,
    isPublished: false, // Locked until explicitly published
    statusLabel: 'Scheduled'
  },

  // DAY 03: Desert & Southern Coasts (Rajasthan & Tamil Nadu) - 10 Parks
  {
    dayNumber: 3,
    quizId: 'day-03',
    title: 'Day 03',
    theme: 'Desert & Southern Coasts (Rajasthan [5], Tamil Nadu [5])',
    dateStr: '11-11-2026',
    displayDate: '11 November 2026',
    unlockIsoUTC: '2026-11-11T14:59:00Z',
    states: ['Rajasthan', 'Tamil Nadu'],
    newStates: ['Rajasthan', 'Tamil Nadu'],
    totalQuestions: 10,
    isPublished: false,
    statusLabel: 'Scheduled'
  },

  // DAY 04: Northern Himalayas & Crown (Uttarakhand, Himachal, J&K, Ladakh & Haryana) - 18 Parks
  {
    dayNumber: 4,
    quizId: 'day-04',
    title: 'Day 04',
    theme: 'Northern Himalayas (Uttarakhand [6], Himachal [5], J&K & Ladakh [5], Haryana [2])',
    dateStr: '12-11-2026',
    displayDate: '12 November 2026',
    unlockIsoUTC: '2026-11-12T14:59:00Z',
    states: ['Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir & Ladakh', 'Haryana'],
    newStates: ['Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir & Ladakh', 'Haryana'],
    totalQuestions: 18,
    isPublished: false,
    statusLabel: 'Scheduled'
  },

  // DAY 05: Eastern Plains & Central Heartland (West Bengal, Odisha, Chhattisgarh, UP, Bihar, Jharkhand) - 14 Parks
  {
    dayNumber: 5,
    quizId: 'day-05',
    title: 'Day 05',
    theme: 'Eastern Plains & Heartland (WB [6], Odisha [2], Chhattisgarh [3], UP [1], Bihar [1], Jharkhand [1])',
    dateStr: '13-11-2026',
    displayDate: '13 November 2026',
    unlockIsoUTC: '2026-11-13T14:59:00Z',
    states: ['West Bengal', 'Odisha', 'Chhattisgarh', 'Uttar Pradesh', 'Bihar', 'Jharkhand'],
    newStates: ['West Bengal', 'Odisha', 'Chhattisgarh', 'Uttar Pradesh', 'Bihar', 'Jharkhand'],
    totalQuestions: 14,
    isPublished: false,
    statusLabel: 'Scheduled'
  },

  // DAY 06: North-Eastern Seven Sisters & Sikkim - 12 Parks
  {
    dayNumber: 6,
    quizId: 'day-06',
    title: 'Day 06',
    theme: 'North-East & Sikkim (Arunachal [2], Meghalaya [2], Manipur [2], Mizoram [2], Nagaland [1], Tripura [2], Sikkim [1])',
    dateStr: '14-11-2026',
    displayDate: '14 November 2026',
    unlockIsoUTC: '2026-11-14T14:59:00Z',
    states: ['Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'],
    newStates: ['Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'],
    totalQuestions: 12,
    isPublished: false,
    statusLabel: 'Scheduled'
  },

  // DAY 07: Island Archipelago (Andaman & Nicobar Islands) - 9 Parks
  {
    dayNumber: 7,
    quizId: 'day-07',
    title: 'Day 07',
    theme: 'Island Archipelago (Andaman & Nicobar Islands [9])',
    dateStr: '15-11-2026',
    displayDate: '15 November 2026',
    unlockIsoUTC: '2026-11-15T14:59:00Z',
    states: ['Andaman & Nicobar Islands'],
    newStates: ['Andaman & Nicobar Islands'],
    totalQuestions: 9,
    isPublished: false,
    statusLabel: 'Scheduled'
  },

  // 16 November: Semi-Final Test (40 Questions)
  {
    dayNumber: 8,
    quizId: 'semi-final',
    title: 'Semi-Final Test',
    theme: 'Grand Semi-Final Revision (All States & UTs)',
    dateStr: '16-11-2026',
    displayDate: '16 November 2026',
    unlockIsoUTC: '2026-11-16T14:59:00Z',
    states: ALL_28_STATES,
    newStates: [],
    totalQuestions: 40,
    isPublished: false,
    statusLabel: 'Scheduled',
    isSpecialTest: true
  },

  // 17 November: Grand Final Test (50 Questions)
  {
    dayNumber: 9,
    quizId: 'grand-final',
    title: 'Grand Final Test',
    theme: 'Championship Grand Final (All States & UTs)',
    dateStr: '17-11-2026',
    displayDate: '17 November 2026',
    unlockIsoUTC: '2026-11-17T14:59:00Z',
    states: ALL_28_STATES,
    newStates: [],
    totalQuestions: 50,
    isPublished: false,
    statusLabel: 'Scheduled',
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

  // Day 01 is published and always available
  if (quizId === 'day-01' || dayNumberOrId === 1) {
    return true;
  }

  const schedule = DAILY_SCHEDULE.find(s => s.quizId === quizId || s.dayNumber === dayNumberOrId);
  if (!schedule) return false;

  // Rule 2: Keep Day 01 published and Days 02–07 scheduled/locked until explicitly published
  if (!schedule.isPublished) {
    return false;
  }

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
      unlockTimeFormatted: '8:29 PM IST'
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
      isUnlocked: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      formattedCountdown: 'Scheduled (Awaiting Publish)',
      unlockTimeFormatted: '8:29 PM IST'
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
    unlockTimeFormatted: '8:29 PM IST'
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
