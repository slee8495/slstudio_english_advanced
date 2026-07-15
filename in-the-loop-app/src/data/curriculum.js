// Fixed start date + canonical timezone, same pattern as the learn_japanese app:
// "today" is always resolved in one timezone so day numbers never drift by device.
export const START = { y: 2026, m: 7, d: 13 };
export const REFERENCE_TIMEZONE = "America/Los_Angeles";

export const CARD_TYPES = ["language", "news", "popculture", "slang"];

export const CARD_META = {
  language: { label: "언어 표현", emoji: "🗣️", reviewable: true },
  news: { label: "오늘의 이슈", emoji: "📰", reviewable: false },
  popculture: { label: "팝컬처 · 밈", emoji: "🎬", reviewable: false },
  slang: { label: "슬랭 · 유스컬처", emoji: "💬", reviewable: true },
};

export function getReferenceToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: REFERENCE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = Number(parts.find((p) => p.type === "year").value);
  const m = Number(parts.find((p) => p.type === "month").value);
  const d = Number(parts.find((p) => p.type === "day").value);
  return { y, m, d };
}

function toUTCms({ y, m, d }) {
  return Date.UTC(y, m - 1, d);
}

export function keyToYMD(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return { y, m, d };
}

// startYMD anchors the day count — pass a profile's own start date so its
// "Day 1" is when that name first appeared, not the app's original launch
// date. Defaults to the app-wide START only for callers that genuinely have
// no profile context (e.g. the cron job's cosmetic day label).
export function dayNumberFor(dateYMD, startYMD = START) {
  const diffDays = Math.floor((toUTCms(dateYMD) - toUTCms(startYMD)) / 86400000);
  return diffDays + 1;
}

export function todayDayNumber(startYMD = START) {
  return dayNumberFor(getReferenceToday(), startYMD);
}

export function ymdToKey({ y, m, d }) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function dateKeyForDayNumber(dayNum, startYMD = START) {
  const ms = toUTCms(startYMD) + (dayNum - 1) * 86400000;
  const dt = new Date(ms);
  return ymdToKey({
    y: dt.getUTCFullYear(),
    m: dt.getUTCMonth() + 1,
    d: dt.getUTCDate(),
  });
}

export function todayKey() {
  return ymdToKey(getReferenceToday());
}

// Real calendar date minus one day — used server-side to look up "yesterday's"
// generated content regardless of any profile's day numbering, since content
// itself is keyed by real date and shared across all profiles.
export function previousDateKey(dateKey) {
  const { y, m, d } = keyToYMD(dateKey);
  const dt = new Date(toUTCms({ y, m, d }) - 86400000);
  return ymdToKey({ y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() });
}
