import { explainGapPhrase } from "./_lib/ai.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const phrase = String(req.body?.phrase || "").trim().slice(0, 300);
  if (!phrase) {
    res.status(400).json({ error: "phrase is required" });
    return;
  }

  try {
    const explanation = await explainGapPhrase(phrase);
    res.status(200).json({ explanation });
  } catch (err) {
    res.status(500).json({ error: "explain failed", detail: String(err?.message || err) });
  }
}
