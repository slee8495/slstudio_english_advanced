import { getCachedDay, setCachedDay, getRecentCachedDays } from "./_lib/storage.js";
import { fetchTrendCandidates } from "./_lib/trends.js";
import { generateDailyContent } from "./_lib/ai.js";
import { buildAvoidContext } from "./_lib/avoid.js";

// How many days back to check for repeated slang terms / popculture categories.
const AVOID_LOOKBACK_DAYS = 10;

export default async function handler(req, res) {
  const day = Number(req.query?.day);
  const date = String(req.query?.date || "");
  if (!day || !date) {
    res.status(400).json({ error: "day and date query params required" });
    return;
  }

  try {
    const cached = await getCachedDay(date);
    if (cached) {
      res.status(200).json(cached);
      return;
    }

    const recentDays = await getRecentCachedDays(date, AVOID_LOOKBACK_DAYS);
    const trendContext = await fetchTrendCandidates();
    const content = await generateDailyContent({
      dayNum: day,
      dateKey: date,
      trendContext,
      avoid: buildAvoidContext(recentDays),
    });
    await setCachedDay(date, content);
    res.status(200).json(content);
  } catch (err) {
    res.status(500).json({ error: "generation failed", detail: String(err?.message || err) });
  }
}
