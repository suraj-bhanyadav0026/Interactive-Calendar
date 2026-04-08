// === FILE: holidays.js ===
// @ts-check

const HOLIDAYS_BY_YEAR = {
  2026: [
    { month: 0, day: 1, name: "New Year's Day", type: "national" },
    { month: 0, day: 26, name: "Republic Day (India)", type: "national" },
    { month: 2, day: 4, name: "Holi", type: "festival" },
    { month: 7, day: 15, name: "Independence Day (India)", type: "national" },
    { month: 9, day: 2, name: "Gandhi Jayanti", type: "national" },
    { month: 9, day: 20, name: "Diwali", type: "festival" },
    { month: 11, day: 25, name: "Christmas", type: "festival" },
    { month: 11, day: 31, name: "New Year's Eve", type: "national" },
  ],
};

function getFallbackHolidays(year) {
  return [
    { month: 0, day: 1, name: "New Year's Day", type: "national" },
    { month: 0, day: 26, name: "Republic Day (India)", type: "national" },
    { month: 2, day: 14, name: "Holi (Approx)", type: "festival" },
    { month: 7, day: 15, name: "Independence Day (India)", type: "national" },
    { month: 9, day: 2, name: "Gandhi Jayanti", type: "national" },
    { month: 10, day: 12, name: "Diwali (Approx)", type: "festival" },
    { month: 11, day: 25, name: "Christmas", type: "festival" },
    { month: 11, day: 31, name: "New Year's Eve", type: "national" },
  ];
}

function keyFromDate(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function getHolidayMap(year) {
  const src = HOLIDAYS_BY_YEAR[year] || getFallbackHolidays(year);
  const map = new Map();
  src.forEach((h) => {
    map.set(`${year}-${h.month}-${h.day}`, { name: h.name, type: h.type });
  });
  return map;
}

export function getHoliday(date) {
  const map = getHolidayMap(date.getFullYear());
  return map.get(keyFromDate(date)) || null;
}
