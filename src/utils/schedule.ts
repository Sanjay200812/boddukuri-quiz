import { loadAdminScheduleOverridesCloud } from './supabase.ts';

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

export const ALL_30_STATES: string[] = [
  // Day 01: Foundational 6 States (35 parks)
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Telangana',
  'Kerala',
  'Assam',
  'Karnataka',
  // Day 02: Islands & Small States (13 parks)
  'Andaman and Nicobar Islands',
  'Arunachal Pradesh',
  'Bihar',
  'Goa',
  // Day 03: Central & Western India (13 parks)
  'Chhattisgarh',
  'Gujarat',
  'Haryana',
  'Jammu and Kashmir',
  // Day 04: Northern Highlands (12 parks)
  'Himachal Pradesh',
  'Jharkhand',
  'Ladakh',
  'Rajasthan',
  // Day 05: Western & Northeastern India (11 parks)
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Nagaland',
  // Day 06: Northeast & Southern Highlands (12 parks)
  'Mizoram',
  'Odisha',
  'Tripura',
  'Uttarakhand',
  // Day 07: Final States (13 parks)
  'Sikkim',
  'Tamil Nadu',
  'Uttar Pradesh',
  'West Bengal'
];

export const ALL_28_STATES: string[] = ALL_30_STATES;

export const DAILY_SCHEDULE: DaySchedule[] = [
  {
    dayNumber: 8,
    quizId: 'semi-final',
    title: 'Semi-Final Test',
    theme: 'Comprehensive All-State Assessment (30 States/UTs — 30 Questions)',
    dateStr: '16-11-2026',
    displayDate: '16 November 2026',
    unlockIsoUTC: '2026-11-16T14:59:00Z',
    states: ALL_30_STATES,
    newStates: ALL_30_STATES,
    totalQuestions: 30,
    isPublished: true,
    statusLabel: 'Available',
    isSpecialTest: true
  },
  {
    dayNumber: 9,
    quizId: 'grand-final',
    title: 'Grand Test',
    theme: 'Championship Grand Final Test (30 States/UTs — 60 Questions)',
    dateStr: '17-11-2026',
    displayDate: '17 November 2026',
    unlockIsoUTC: '2026-11-17T14:59:00Z',
    states: ALL_30_STATES,
    newStates: ALL_30_STATES,
    totalQuestions: 60,
    isPublished: true,
    statusLabel: 'Available',
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
let cloudOverridesLoaded = false;

export async function hydrateScheduleOverridesCloud(): Promise<void> {
  if (cloudOverridesLoaded) return;
  const cloud = await loadAdminScheduleOverridesCloud();
  if (Object.keys(cloud).length === 0) return;
  const local = getScheduleOverrides();
  for (const [quizId, value] of Object.entries(cloud)) {
    local[quizId] = {
      ...local[quizId],
      ...(value.isUnlockedOverride === true ? { forceUnlocked: true, forceLocked: false } : {}),
      ...(value.isUnlockedOverride === false ? { forceUnlocked: false, forceLocked: true } : {}),
      ...(value.customUnlockTime ? { customUnlockIsoUTC: value.customUnlockTime } : {})
    };
  }
  saveScheduleOverrides(local);
  cloudOverridesLoaded = true;
}

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
 * Evaluates whether a given topic, day or test is unlocked:
 * - Topics are self-paced learning modules and are always unlocked.
 * - If the quiz was already completed, it is ALWAYS unlocked for review.
 * - If an Admin force-unlocked the test, it is unlocked.
 * - If an Admin force-locked the test, it is locked.
 * - Championship assessments (Semi-Final & Grand Test) are available or governed by schedule/admin.
 */
export function isDayUnlocked(dayNumberOrId: number | string, completedDayIds: string[] = []): boolean {
  const quizId = typeof dayNumberOrId === 'string'
    ? dayNumberOrId
    : dayNumberOrId === 8
      ? 'semi-final'
      : dayNumberOrId === 9
        ? 'grand-final'
        : `day-${dayNumberOrId < 10 ? '0' + dayNumberOrId : dayNumberOrId}`;

  // Topic modules are always unlocked
  if (
    quizId.startsWith('top-') ||
    ['static-gk', 'current-affairs', 'banking-awareness', 'central-ministers', 'ramsar-sites'].includes(quizId)
  ) {
    return true;
  }

  // Completed days are never locked
  if (completedDayIds.includes(quizId)) {
    return true;
  }

  const schedule = DAILY_SCHEDULE.find(s => s.quizId === quizId || s.dayNumber === dayNumberOrId);
  if (!schedule) return true;

  // Global Admin Dev Unlock
  if (isDevUnlockAllEnabled()) {
    return true;
  }

  // Admin per-quiz overrides
  const overrides = getScheduleOverrides();
  const override = overrides[quizId];
  if (override?.forceUnlocked === true) return true;
  if (override?.forceLocked === true) return false;

  // Day 01 is published and always accessible
  if (schedule.dayNumber === 1 || quizId === 'day-01') {
    return true;
  }

  // Explicitly published in schedule
  if (schedule.isPublished === true) {
    return true;
  }

  // Sequential progression: A future day requires the previous day to be completed
  // unless explicitly published or overridden by Admin.
  const previousDayNumber = schedule.dayNumber - 1;
  const previousSchedule = DAILY_SCHEDULE.find(s => s.dayNumber === previousDayNumber);
  const previousCompleted = previousSchedule ? completedDayIds.includes(previousSchedule.quizId) : false;

  if (!previousCompleted) {
    return false;
  }

  // Check if current time has reached sharp 8:29 PM IST
  const targetIso = override?.customUnlockIsoUTC || schedule.unlockIsoUTC;
  if (targetIso) {
    const targetTime = new Date(targetIso).getTime();
    if (Date.now() >= targetTime) {
      return true;
    }
  }

  return false;
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
      formattedCountdown: 'Available Now',
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
