import crypto from "node:crypto";
import { synthesizeSpeech } from "./_lib/ai.js";
import { getCachedAudio, setCachedAudio } from "./_lib/storage.js";

// Neural TTS (OpenAI tts-1-hd via AI Gateway) instead of the robotic browser
// Web Speech API. Cached in Blob by content hash so repeat plays of the same
// phrase never re-generate (and cost nothing after the first time).
export default async function handler(req, res) {
  const text = String(req.query?.text || "").trim().slice(0, 500);
  if (!text) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  const key = crypto.createHash("sha256").update(text).digest("hex");

  try {
    let bytes = await getCachedAudio(key);
    let mediaType = "audio/mpeg";

    if (!bytes) {
      const result = await synthesizeSpeech(text);
      bytes = result.bytes;
      mediaType = result.mediaType;
      await setCachedAudio(key, bytes);
    }

    res.setHeader("Content-Type", mediaType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.status(200).send(Buffer.from(bytes));
  } catch (err) {
    res.status(500).json({ error: "tts failed", detail: String(err?.message || err) });
  }
}
