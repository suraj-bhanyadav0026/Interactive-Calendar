// === FILE: dateUtils.js ===
// @ts-check

/** @typedef {{name: string, type: 'national'|'festival'}} HolidayMeta */
/** @typedef {{date: Date, dayOfMonth: number, isCurrentMonth: boolean, isToday: boolean, isWeekend: boolean, isSunday: boolean, weekNumber: number, holiday: HolidayMeta | null}} CalendarDay */

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function compareDates(a, b) {
  return stripTime(a).getTime() - stripTime(b).getTime();
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function startOfWeekMonday(date) {
  const day = date.getDay();
  const mondayDistance = (day + 6) % 7;
  return addDays(stripTime(date), -mondayDistance);
}

export function endOfWeekSunday(date) {
  const start = startOfWeekMonday(date);
  return addDays(start, 6);
}

// ISO 8601 week number algorithm using Thursday anchor
export function getISOWeekNumber(date) {
  const d = stripTime(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - yearStart.getTime();
  return Math.ceil((diff / 86400000 + 1) / 7);
}

export function isInRange(date, start, end) {
  if (!start || !end) return false;
  const t = stripTime(date).getTime();
  const a = stripTime(start).getTime();
  const b = stripTime(end).getTime();
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  return t >= low && t <= high;
}

export function getRangeStats(start, end, getHoliday) {
  if (!start || !end) return null;
  const a = stripTime(start);
  const b = stripTime(end);
  const low = compareDates(a, b) <= 0 ? a : b;
  const high = compareDates(a, b) <= 0 ? b : a;
  let total = 0;
  let weekends = 0;
  let holidays = 0;
  for (let d = new Date(low); compareDates(d, high) <= 0; d = addDays(d, 1)) {
    total += 1;
    const day = d.getDay();
    if (day === 0 || day === 6) weekends += 1;
    if (getHoliday(d)) holidays += 1;
  }
  const workingDays = Math.max(0, total - weekends - holidays);
  return { total, weekends, workingDays, holidays };
}

export function countWorkingDays(start, end, getHoliday) {
  const stats = getRangeStats(start, end, getHoliday);
  return stats ? stats.workingDays : 0;
}

export function formatDateRange(start, end) {
  if (!start && !end) return "";
  if (start && !end) return `${MONTH_SHORT[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()}`;
  if (!start || !end) return "";

  const a = compareDates(start, end) <= 0 ? start : end;
  const b = compareDates(start, end) <= 0 ? end : start;
  const sameDay = isSameDay(a, b);
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  if (sameDay) return `${MONTH_SHORT[a.getMonth()]} ${a.getDate()}, ${a.getFullYear()}`;
  if (sameMonth) return `${MONTH_SHORT[a.getMonth()]} ${a.getDate()} - ${b.getDate()}, ${a.getFullYear()}`;
  return `${MONTH_SHORT[a.getMonth()]} ${a.getDate()} - ${MONTH_SHORT[b.getMonth()]} ${b.getDate()}, ${b.getFullYear()}`;
}

/**
 * @param {number} year
 * @param {number} month
 * @param {(date: Date) => HolidayMeta | null} getHoliday
 * @returns {CalendarDay[]}
 */
export function getCalendarDays(year, month, getHoliday) {
  const firstOfMonth = new Date(year, month, 1);
  const monthStart = startOfWeekMonday(firstOfMonth);
  const lastOfMonth = new Date(year, month + 1, 0);
  const monthEnd = endOfWeekSunday(lastOfMonth);
  const diffDays = Math.round((stripTime(monthEnd).getTime() - stripTime(monthStart).getTime()) / 86400000) + 1;
  const visibleDays = diffDays <= 35 ? 35 : 42;
  const today = stripTime(new Date());

  /** @type {CalendarDay[]} */
  const days = [];
  for (let i = 0; i < visibleDays; i += 1) {
    const date = addDays(monthStart, i);
    const dayIndex = date.getDay();
    days.push({
      date,
      dayOfMonth: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: isSameDay(date, today),
      isWeekend: dayIndex === 0 || dayIndex === 6,
      isSunday: dayIndex === 0,
      weekNumber: getISOWeekNumber(date),
      holiday: getHoliday(date),
    });
  }
  return days;
}
