import { todayDayNumber, todayKey } from "../../src/data/curriculum.js";
import { getCachedDay, setCachedDay } from "../_lib/storage.js";
import { fetchTrendCandidates } from "../_lib/trends.js";
import { generateDailyContent } from "../_lib/ai.js";

// Triggered by Vercel Cron at day-rollover (see vercel.json) so the day's
// content is pre-generated and cached before the user ever opens the app.
export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers?.authorization;
    if (auth !== `Bearer ${secret}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  }

  const dateKey = todayKey();
  const dayNum = todayDayNumber();

  try {
    const already = await getCachedDay(dateKey);
    if (already) {
      res.status(200).json({ status: "already cached", dateKey });
      return;
    }

    const trendContext = await fetchTrendCandidates();
    const content = await generateDailyContent({ dayNum, dateKey, trendContext });
    await setCachedDay(dateKey, content);
    res.status(200).json({ status: "generated", dateKey, dayNum });
  } catch (err) {
    res.status(500).json({ error: "generation failed", detail: String(err?.message || err) });
  }
}
