// Simple Leitner-style spaced repetition — no external SRS library needed.
// box index -> days until next review. Forgetting resets to box 0.
export const LEITNER_INTERVALS_DAYS = [1, 3, 7, 14, 30];
export const GRADUATED_BOX = LEITNER_INTERVALS_DAYS.length;

export function nextBoxAfterResult(currentBox, remembered) {
  if (!remembered) return 0;
  return Math.min(currentBox + 1, GRADUATED_BOX);
}

export function nextReviewDateKey(fromDateKey, box) {
  if (box >= GRADUATED_BOX) return null; // graduated, no more reviews
  const days = LEITNER_INTERVALS_DAYS[box];
  const [y, m, d] = fromDateKey.split("-").map(Number);
  const ms = Date.UTC(y, m - 1, d) + days * 86400000;
  const dt = new Date(ms);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}
