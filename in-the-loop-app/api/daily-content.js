import { previousDateKey } from "../src/data/curriculum.js";
import { getCachedDay, setCachedDay } from "./_lib/storage.js";
import { fetchTrendCandidates } from "./_lib/trends.js";
import { generateDailyContent } from "./_lib/ai.js";
import { avoidFromContent } from "./_lib/avoid.js";

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

    const prevDay = await getCachedDay(previousDateKey(date));
    const trendContext = await fetchTrendCandidates();
    const content = await generateDailyContent({
      dayNum: day,
      dateKey: date,
      trendContext,
      avoid: avoidFromContent(prevDay),
    });
    await setCachedDay(date, content);
    res.status(200).json(content);
  } catch (err) {
    res.status(500).json({ error: "generation failed", detail: String(err?.message || err) });
  }
}
