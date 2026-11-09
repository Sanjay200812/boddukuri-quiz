/**
 * Schedule & Time Management for Boddukuri's Quiz #Mahi
 * Learning Period: 09 November 2026 to 15 November 2026
 * Unlock time: Exactly 8:30 PM (20:30) IST each day.
 * 
 * Note: 8:30 PM IST (UTC+5:30) corresponds exactly to 15:00:00 UTC.
 * All calculations use Indian Standard Time (Asia/Kolkata), independent of browser timezone!
 */

export interface DaySchedule {
  dayNumber: number;
  dateStr: string; // "09-11-2026"
  displayDate: string; // "09 November 2026"
  unlockIsoUTC: string; // ISO string in UTC corresponding to 8:30 PM IST
  states: string[];
  newStates: string[];
  isVerified: boolean;
}

export const DAILY_SCHEDULE: DaySchedule[] = [
  {
    dayNumber: 1,
    dateStr: '09-11-2026',
    displayDate: '09 November 2026',
    unlockIsoUTC: '2026-11-09T15:00:00Z', // 8:30 PM IST on 09 Nov 2026
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
    isVerified: true
  },
  {
    dayNumber: 2,
    dateStr: '10-11-2026',
    displayDate: '10 November 2026',
    unlockIsoUTC: '2026-11-10T15:00:00Z', // 8:30 PM IST on 10 Nov 2026
    states: [
      'Madhya Pradesh',
      'Andhra Pradesh',
      'Telangana',
      'Kerala',
      'Assam',
      'Karnataka',
      'Tamil Nadu'
    ],
    newStates: ['Tamil Nadu'],
    isVerified: true
  },
  {
    dayNumber: 3,
    dateStr: '11-11-2026',
    displayDate: '11 November 2026',
    unlockIsoUTC: '2026-11-11T15:00:00Z', // 8:30 PM IST on 11 Nov 2026
    states: [
      'Madhya Pradesh',
      'Andhra Pradesh',
      'Telangana',
      'Kerala',
      'Assam',
      'Karnataka',
      'Tamil Nadu',
      'Rajasthan'
    ],
    newStates: ['Rajasthan'],
    isVerified: true
  },
  {
    dayNumber: 4,
    dateStr: '12-11-2026',
    displayDate: '12 November 2026',
    unlockIsoUTC: '2026-11-12T15:00:00Z', // 8:30 PM IST on 12 Nov 2026
    states: [
      'Madhya Pradesh',
      'Andhra Pradesh',
      'Telangana',
      'Kerala',
      'Assam',
      'Karnataka',
      'Tamil Nadu',
      'Rajasthan',
      'Gujarat'
    ],
    newStates: ['Gujarat'],
    isVerified: true
  },
  {
    dayNumber: 5,
    dateStr: '13-11-2026',
    displayDate: '13 November 2026',
    unlockIsoUTC: '2026-11-13T15:00:00Z', // 8:30 PM IST on 13 Nov 2026
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
      'Uttarakhand'
    ],
    newStates: ['Uttarakhand'],
    isVerified: true
  },
  {
    dayNumber: 6,
    dateStr: '14-11-2026',
    displayDate: '14 November 2026',
    unlockIsoUTC: '2026-11-14T15:00:00Z', // 8:30 PM IST on 14 Nov 2026
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
      'Uttarakhand',
      'West Bengal'
    ],
    newStates: ['West Bengal'],
    isVerified: true
  },
  {
    dayNumber: 7,
    dateStr: '15-11-2026',
    displayDate: '15 November 2026',
    unlockIsoUTC: '2026-11-15T15:00:00Z', // 8:30 PM IST on 15 Nov 2026
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
      'Uttarakhand',
      'West Bengal',
      'Odisha'
    ],
    newStates: ['Odisha'],
    isVerified: true
  }
];

/**
 * Returns the current time formatted in IST (Asia/Kolkata)
 */
export function getCurrentISTTimeString(): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium'
  }).format(new Date());
}

/**
 * Checks whether dev testing unlock override is enabled
 */
export function isDevUnlockAllEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('mahi_dev_unlock_all') === 'true';
}

export function setDevUnlockAll(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  if (enabled) {
    localStorage.setItem('mahi_dev_unlock_all', 'true');
  } else {
    localStorage.removeItem('mahi_dev_unlock_all');
  }
}

/**
 * Evaluates whether a given day is unlocked:
 * - If the day was already completed by Mahi, it is ALWAYS unlocked and accessible for review/reattempt.
 * - If dev bypass is active, it is unlocked.
 * - Otherwise, unlocked if current time >= 8:30 PM IST on that day.
 */
export function isDayUnlocked(dayNumber: number, completedDayIds: string[] = []): boolean {
  const quizId = `day-${dayNumber < 10 ? '0' + dayNumber : dayNumber}`;
  if (completedDayIds.includes(quizId)) {
    return true;
  }

  if (isDevUnlockAllEnabled()) {
    return true;
  }

  const schedule = DAILY_SCHEDULE.find(s => s.dayNumber === dayNumber);
  if (!schedule) return false;

  const unlockTime = new Date(schedule.unlockIsoUTC).getTime();
  const now = Date.now();
  return now >= unlockTime;
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
 * Calculates countdown until unlock time for a specific day
 */
export function getDayCountdown(dayNumber: number, completedDayIds: string[] = []): CountdownInfo {
  const schedule = DAILY_SCHEDULE.find(s => s.dayNumber === dayNumber);
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

  if (isDayUnlocked(dayNumber, completedDayIds)) {
    return {
      isUnlocked: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      formattedCountdown: 'Unlocked Now',
      unlockTimeFormatted: '8:30 PM IST'
    };
  }

  const unlockTime = new Date(schedule.unlockIsoUTC).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, unlockTime - now);
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
    unlockTimeFormatted: `Unlocks at 8:30 PM IST on ${schedule.displayDate}`
  };
}

/**
 * Automatically chooses the target day for Mahi:
 * - Scans unlocked days from Day 1 to Day 7.
 * - Picks the lowest day number that is unlocked and NOT completed yet.
 * - If all unlocked days are completed, targets the next scheduled day (showing locked countdown).
 * - Defaults to Day 1.
 */
export function getRecommendedTargetDay(completedDayIds: string[]): number {
  for (const item of DAILY_SCHEDULE) {
    const isCompleted = completedDayIds.includes(`day-${item.dayNumber < 10 ? '0' + item.dayNumber : item.dayNumber}`);
    const unlocked = isDayUnlocked(item.dayNumber, completedDayIds);
    if (unlocked && !isCompleted) {
      return item.dayNumber;
    }
  }

  // If all unlocked days are completed, find the first uncompleted day (which will be locked)
  for (const item of DAILY_SCHEDULE) {
    const isCompleted = completedDayIds.includes(`day-${item.dayNumber < 10 ? '0' + item.dayNumber : item.dayNumber}`);
    if (!isCompleted) {
      return item.dayNumber;
    }
  }

  return 1;
}
