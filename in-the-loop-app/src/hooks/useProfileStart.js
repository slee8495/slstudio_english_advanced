import { useMemo } from "react";
import { readJSON, writeJSON } from "../utils/storage";
import { todayKey } from "../data/curriculum";

// Each named profile gets its own Day 1, anchored to when that name was
// first used — not the app's original launch date. A profile that already
// has recorded progress (from before this anchor existed) falls back to its
// earliest recorded date, so past days keep the Day N they already earned.
export function useProfileStart(profileName) {
  return useMemo(() => {
    if (!profileName) return todayKey();

    const storageKey = `profile_start_${profileName}`;
    const existing = readJSON(storageKey, null);
    if (existing) return existing;

    const state = readJSON(`state_v1_${profileName}`, null);
    const recordedDates = Object.keys(state?.progress || {});
    const start = recordedDates.length > 0 ? recordedDates.sort()[0] : todayKey();

    writeJSON(storageKey, start);
    return start;
  }, [profileName]);
}
