/**
 * Live Date & Days Together calculation utilities
 * Ensures accurate calculation inclusive of today, formatted anniversary breakdown,
 * and countdown to midnight rollover.
 */

export interface DaysTogetherLiveResult {
  days: number;
  years: number;
  months: number;
  remainingDays: number;
  formattedDate: string;
  nextDayCountdown: string;
  todayFormatted: string;
}

export function calculateDaysTogetherLive(startDateStr: string): DaysTogetherLiveResult {
  const now = new Date();
  const todayFormatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (!startDateStr || !/^\d{4}-\d{2}-\d{2}$/.test(startDateStr)) {
    return {
      days: 2985,
      years: 8,
      months: 2,
      remainingDays: 5,
      formattedDate: 'January 1, 2018',
      nextDayCountdown: '00:00:00',
      todayFormatted,
    };
  }

  const [y, m, d] = startDateStr.split('-').map(Number);
  const startDate = new Date(y, m - 1, d, 0, 0, 0, 0);

  // Normalize today at midnight local time
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  // Difference in milliseconds
  const diffMs = todayMidnight.getTime() - startDate.getTime();
  // +1 so that the start date itself is day 1, and today is included!
  const calculatedDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  const days = Math.max(1, calculatedDays);

  // Breakdown in years, months, days
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let remainingDays = now.getDate() - startDate.getDate();

  if (remainingDays < 0) {
    months -= 1;
    // Days in previous month
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    remainingDays += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const formattedDate = startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate time remaining until midnight
  const tomorrowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  const msToMidnight = Math.max(0, tomorrowMidnight.getTime() - now.getTime());
  const hours = Math.floor(msToMidnight / (1000 * 60 * 60));
  const mins = Math.floor((msToMidnight % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((msToMidnight % (1000 * 60)) / 1000);

  const nextDayCountdown = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return {
    days,
    years: Math.max(0, years),
    months: Math.max(0, months),
    remainingDays: Math.max(0, remainingDays),
    formattedDate,
    nextDayCountdown,
    todayFormatted,
  };
}
