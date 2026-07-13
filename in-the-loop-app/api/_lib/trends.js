// Best-effort real trend signals pulled from public RSS feeds — no API key
// needed. If a fetch fails (network blip, feed down), we return an empty
// list and the AI prompt is instructed to avoid inventing fake specifics.
const FEEDS = {
  news: "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
  popculture:
    "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-US&gl=US&ceid=US:en",
};

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function fetchRssTitles(url, limit) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; InTheLoopApp/1.0)" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const titles = [...xml.matchAll(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/g)]
      .map((m) => decodeEntities(m[1]).trim())
      .filter(Boolean);
    // the first <title> in an RSS doc is the feed/channel title itself, not an item
    return titles.slice(1, 1 + limit);
  } catch {
    return [];
  }
}

export async function fetchTrendCandidates() {
  const [news, popculture] = await Promise.all([
    fetchRssTitles(FEEDS.news, 8),
    fetchRssTitles(FEEDS.popculture, 8),
  ]);
  return { news, popculture };
}
