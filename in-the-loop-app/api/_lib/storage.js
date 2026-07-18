import { put, head } from "@vercel/blob";
import { previousDateKey } from "../../src/data/curriculum.js";

// Cache is optional — without BLOB_READ_WRITE_TOKEN configured, every request
// just regenerates (fine for low personal traffic; caching becomes worthwhile
// once the token is added via `vercel blob` / Vercel Storage dashboard).
const hasBlobToken = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function pathFor(dateKey) {
  return `in-the-loop/daily/v2/${dateKey}.json`;
}

export async function getCachedDay(dateKey) {
  if (!hasBlobToken()) return null;
  try {
    const info = await head(pathFor(dateKey));
    const res = await fetch(info.url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function setCachedDay(dateKey, data) {
  if (!hasBlobToken()) return;
  try {
    await put(pathFor(dateKey), JSON.stringify(data), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch {
    // best-effort cache only — a failure here should never break the request
  }
}

// Looks back `days` calendar days from (but not including) dateKey and
// returns whichever of those were actually generated/cached, most-recent
// first. Used to build a multi-day "don't repeat this" window instead of
// only ever checking yesterday, which let picks like a single slang term
// cycle back in after just one day.
export async function getRecentCachedDays(dateKey, days) {
  const keys = [];
  let cursor = dateKey;
  for (let i = 0; i < days; i++) {
    cursor = previousDateKey(cursor);
    keys.push(cursor);
  }
  const results = await Promise.all(keys.map((k) => getCachedDay(k)));
  return results.filter(Boolean);
}

function audioPathFor(key) {
  return `in-the-loop/audio/${key}.mp3`;
}

export async function getCachedAudio(key) {
  if (!hasBlobToken()) return null;
  try {
    const info = await head(audioPathFor(key));
    const res = await fetch(info.url, { cache: "no-store" });
    if (!res.ok) return null;
    return new Uint8Array(await res.arrayBuffer());
  } catch {
    return null;
  }
}

export async function setCachedAudio(key, bytes) {
  if (!hasBlobToken()) return;
  try {
    await put(audioPathFor(key), bytes, {
      access: "public",
      contentType: "audio/mpeg",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch {
    // best-effort cache only
  }
}
