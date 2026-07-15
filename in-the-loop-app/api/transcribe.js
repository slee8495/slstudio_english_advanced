import { transcribeAudio } from "./_lib/ai.js";

// Speech-to-text for the chat widget's mic input, routed through AI Gateway
// (openai/whisper-1). The client sends the recorded clip as a base64 string
// in a JSON body (not multipart) to match this project's plain-JSON API
// convention (see chat.js) instead of parsing multipart form data.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { audio } = req.body || {};
  if (!audio) {
    res.status(400).json({ error: "audio is required" });
    return;
  }

  try {
    const bytes = new Uint8Array(Buffer.from(audio, "base64"));
    const text = await transcribeAudio(bytes);
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: "transcription failed", detail: String(err?.message || err) });
  }
}
