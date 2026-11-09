/**
 * Schedule & Time Management for Boddukuri's Quiz #Mahi
 * Learning Period: 09 November 2026 to 15 November 2026 (All 28 Indian States)
 * 16 November 2026: Semi-Final Test (40 Questions)
 * 17 November 2026: Grand Final Test (50 Questions)
 * Unlock time: Exactly 8:29 PM (20:29) IST each day.
 * 
 * Note: 8:29 PM IST (UTC+5:30) corresponds to 14:59:00 UTC.
 * All calculations use Indian Standard Time (Asia/Kolkata), independent of browser timezone!
 */

export interface DaySchedule {
  dayNumber: number;
  quizId: string; // "day-01", "semi-final", "grand-final"
  title: string;
  dateStr: string; // "09-11-2026"
  displayDate: string; // "09 November 2026"
  unlockIsoUTC: string; // ISO string in UTC corresponding to 8:29 PM IST (14:59:00Z)
  states: string[];
  newStates: string[];
  totalQuestions: number;
  isSpecialTest?: boolean;
}

export const ALL_28_STATES: string[] = [
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Telangana',
  'Kerala',
  'Assam',
  'Karnataka',
  'Tamil Nadu',
  'Rajasthan',
  'Gujarat',
  'Maharashtra',
  'Uttarakhand',
  'West Bengal',
  'Odisha',
  'Himachal Pradesh',
  'Uttar Pradesh',
  'Bihar',
  'Jharkhand',
  'Chhattisgarh',
  'Goa',
  'Haryana',
  'Punjab',
  'Sikkim',
  'Arunachal Pradesh',
  'Meghalaya',
  'Manipur',
  'Mizoram',
  'Nagaland',
  'Tripura'
];

export const DAILY_SCHEDULE: DaySchedule[] = [
  {
    dayNumber: 1,
    quizId: 'day-01',
    title: 'Day 01',
    dateStr: '09-11-2026',
    displayDate: '09 November 2026',
    unlockIsoUTC: '2026-11-09T14:59:00Z', // 8:29 PM IST on 09 Nov 2026
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
    totalQuestions: 30
  },
  {
    dayNumber: 2,
    quizId: 'day-02',
    title: 'Day 02',
    dateStr: '10-11-2026',
    displayDate: '10 November 2026',
    unlockIsoUTC: '2026-11-10T14:59:00Z', // 8:29 PM IST on 10 Nov 2026
    states: [
      'Madhya Pradesh',
      'Andhra Pradesh',
      'Telangana',
      'Kerala',
      'Assam',
      'Karnataka',
      'Tamil Nadu',
      'Rajasthan',
      'Gujarat',
      'Maharashtra'
    ],
    newStates: ['Tamil Nadu', 'Rajasthan', 'Gujarat', 'Maharashtra'],
    totalQuestions: 30
  },
  {
    dayNumber: 3,
    quizId: 'day-03',
    title: 'Day 03',
    dateStr: '11-11-2026',
    displayDate: '11 November 2026',
    unlockIsoUTC: '2026-11-11T14:59:00Z', // 8:29 PM IST on 11 Nov 2026
    states: [
      'Madhya Pradesh',
      'Andhra Pradesh',
      'Telangana',
      'Kerala',
      'Assam',
      'Karnataka',
      'Tamil Nadu',
      'Rajasthan',
      'Gujarat',
      'Maharashtra',
      'Uttarakhand',
      'West Bengal',
      'Odisha',
      'Himachal Pradesh'
    ],
    newStates: ['Uttarakhand', 'West Bengal', 'Odisha', 'Himachal Pradesh'],
    totalQuestions: 30
  },
  {
    dayNumber: 4,
    quizId: 'day-04',
    title: 'Day 04',
    dateStr: '12-11-2026',
    displayDate: '12 November 2026',
    unlockIsoUTC: '2026-11-12T14:59:00Z', // 8:29 PM IST on 12 Nov 2026
    states: [
      'Madhya Pradesh',
      'Andhra Pradesh',
      'Telangana',
      'Kerala',
      'Assam',
      'Karnataka',
      'Tamil Nadu',
      'Rajasthan',
      'Gujarat',
      'Maharashtra',
      'Uttarakhand',
      'West Bengal',
      'Odisha',
      'Himachal Pradesh',
      'Uttar Pradesh',
      'Bihar',
      'Jharkhand',
      'Chhattisgarh'
    ],
    newStates: ['Uttar Pradesh', 'Bihar', 'Jharkhand', 'Chhattisgarh'],
    totalQuestions: 30
  },
  {
    dayNumber: 5,
    quizId: 'day-05',
    title: 'Day 05',
    dateStr: '13-11-2026',
    displayDate: '13 November 2026',
    unlockIsoUTC: '2026-11-13T14:59:00Z', // 8:29 PM IST on 13 Nov 2026
    states: [
      'Madhya Pradesh',
      'Andhra Pradesh',
      'Telangana',
      'Kerala',
      'Assam',
      'Karnataka',
      'Tamil Nadu',
      'Rajasthan',
      'Gujarat',
      'Maharashtra',
      'Uttarakhand',
      'West Bengal',
      'Odisha',
      'Himachal Pradesh',
      'Uttar Pradesh',
      'Bihar',
      'Jharkhand',
      'Chhattisgarh',
      'Goa',
      'Haryana',
      'Punjab',
      'Sikkim'
    ],
    newStates: ['Goa', 'Haryana', 'Punjab', 'Sikkim'],
    totalQuestions: 30
  },
  {
    dayNumber: 6,
    quizId: 'day-06',
    title: 'Day 06',
    dateStr: '14-11-2026',
    displayDate: '14 November 2026',
    unlockIsoUTC: '2026-11-14T14:59:00Z', // 8:29 PM IST on 14 Nov 2026
    states: [
      'Madhya Pradesh',
      'Andhra Pradesh',
      'Telangana',
      'Kerala',
      'Assam',
      'Karnataka',
      'Tamil Nadu',
      'Rajasthan',
      'Gujarat',
      'Maharashtra',
      'Uttarakhand',
      'West Bengal',
      'Odisha',
      'Himachal Pradesh',
      'Uttar Pradesh',
      'Bihar',
      'Jharkhand',
      'Chhattisgarh',
      'Goa',
      'Haryana',
      'Punjab',
      'Sikkim',
      'Arunachal Pradesh',
      'Meghalaya',
      'Manipur'
    ],
    newStates: ['Arunachal Pradesh', 'Meghalaya', 'Manipur'],
    totalQuestions: 30
  },
  {
    dayNumber: 7,
    quizId: 'day-07',
    title: 'Day 07',
    dateStr: '15-11-2026',
    displayDate: '15 November 2026',
    unlockIsoUTC: '2026-11-15T14:59:00Z', // 8:29 PM IST on 15 Nov 2026
    states: ALL_28_STATES,
    newStates: ['Mizoram', 'Nagaland', 'Tripura'],
    totalQuestions: 30
  },
  // 16 November: Semi-Final Test (40 Questions)
  {
    dayNumber: 8,
    quizId: 'semi-final',
    title: 'Semi-Final Test',
    dateStr: '16-11-2026',
    displayDate: '16 November 2026',
    unlockIsoUTC: '2026-11-16T14:59:00Z', // 8:29 PM IST on 16 Nov 2026
    states: ALL_28_STATES,
    newStates: [],
    totalQuestions: 40,
    isSpecialTest: true
  },
  // 17 November: Grand Final Test (50 Questions)
  {
    dayNumber: 9,
    quizId: 'grand-final',
    title: 'Grand Final Test',
    dateStr: '17-11-2026',
    displayDate: '17 November 2026',
    unlockIsoUTC: '2026-11-17T14:59:00Z', // 8:29 PM IST on 17 Nov 2026
    states: ALL_28_STATES,
    newStates: [],
    totalQuestions: 50,
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
 * - Otherwise, unlocked if current time >= unlock time (8:29 PM IST).
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
 * Calculates countdown until unlock time for a specific day or test
 */
export function getDayCountdown(dayNumberOrId: number | string, completedDayIds: string[] = []): CountdownInfo {
  const quizId = typeof dayNumberOrId === 'string'
    ? dayNumberOrId
    : dayNumberOrId === 8
    ? 'semi-final'
    : dayNumberOrId === 9
    ? 'grand-final'
    : `day-${dayNumberOrId < 10 ? '0' + dayNumberOrId : dayNumberOrId}`;

  const schedule = DAILY_SCHEDULE.find(s => s.quizId === quizId || s.dayNumber === dayNumberOrId);
  if (!schedule) {
    return {
      isUnlocked: false,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      formattedCountdown: 'Unavailable',
      unlockTimeFormatted: ''
    };
  }

  if (isDayUnlocked(dayNumberOrId, completedDayIds)) {
    return {
      isUnlocked: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      formattedCountdown: 'Unlocked Now',
      unlockTimeFormatted: '8:29 PM IST'
    };
  }

  const overrides = getScheduleOverrides();
  const override = overrides[quizId];
  const unlockTime = override?.customUnlockIsoUTC 
    ? new Date(override.customUnlockIsoUTC).getTime()
    : new Date(schedule.unlockIsoUTC).getTime();

  const diffMs = Math.max(0, unlockTime - Date.now());
  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedCountdown = `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;

  return {
    isUnlocked: false,
    hours,
    minutes,
    seconds,
    totalSeconds,
    formattedCountdown,
    unlockTimeFormatted: `Unlocks at 8:29 PM IST on ${schedule.displayDate}`
  };
}

/**
 * Automatically chooses the target day for Mahi:
 * - Scans unlocked days from Day 1 to Day 7 (and tests).
 * - Picks the lowest day number that is unlocked and NOT completed yet.
 * - If all unlocked days are completed, targets the next scheduled day (showing locked countdown).
 */
export function getRecommendedTargetDay(completedDayIds: string[]): number {
  for (const item of DAILY_SCHEDULE) {
    const isCompleted = completedDayIds.includes(item.quizId);
    const unlocked = isDayUnlocked(item.quizId, completedDayIds);
    if (unlocked && !isCompleted) {
      return item.dayNumber;
    }
  }

  for (const item of DAILY_SCHEDULE) {
    const isCompleted = completedDayIds.includes(item.quizId);
    if (!isCompleted) {
      return item.dayNumber;
    }
  }

  return 1;
}
