const PREFIX = "itl_";

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — silently no-op, app still works in-memory for the session
  }
}

// Per-day content (~1-2KB each) is disposable — the server already caches it
// in Blob, so we only need a local copy for fast repeat loads of *recent*
// days. Dropping old entries keeps localStorage well under the ~5MB browser
// quota indefinitely, since the durable data (progress/reviewPool/gapJournal)
// is tiny by comparison.
export function pruneOldContentCache(retainDays = 45) {
  try {
    const cutoff = Date.now() - retainDays * 86400000;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(`${PREFIX}content_v2_`)) continue;
      const dateStr = key.slice(`${PREFIX}content_v2_`.length);
      const [y, m, d] = dateStr.split("-").map(Number);
      if (!y || !m || !d) continue;
      if (Date.UTC(y, m - 1, d) < cutoff) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // best-effort cleanup only
  }
}
