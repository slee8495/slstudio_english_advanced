import { put, head } from "@vercel/blob";

// Cache is optional — without BLOB_READ_WRITE_TOKEN configured, every request
// just regenerates (fine for low personal traffic; caching becomes worthwhile
// once the token is added via `vercel blob` / Vercel Storage dashboard).
const hasBlobToken = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function pathFor(dateKey) {
  return `in-the-loop/daily/${dateKey}.json`;
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
